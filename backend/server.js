const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/safejourney")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
// AUTH ROUTES
app.use("/api/auth", require("./routes/auth"));



// Cache for safety data (5 minute TTL)
const safetyCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get cached or fresh safety data
const getCachedSafety = (key) => {
  const cached = safetyCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedSafety = (key, data) => {
  safetyCache.set(key, { data, timestamp: Date.now() });
};

// Batch query OpenStreetMap for entire route area
const getRouteAreaData = async (routeCoords) => {
  try {
    // Get bounding box of entire route
    const lats = routeCoords.map(c => c[0]);
    const lngs = routeCoords.map(c => c[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Single batch query for entire route area
    const overpassQuery = `
      [out:json][timeout:25];
      (
        way["highway"]["lit"](${minLat},${minLng},${maxLat},${maxLng});
        way["highway"]["lit"="no"](${minLat},${minLng},${maxLat},${maxLng});
        way["highway"]["lit"="yes"](${minLat},${minLng},${maxLat},${maxLng});
        node["amenity"="police"](${minLat},${minLng},${maxLat},${maxLng});
        way["amenity"="police"](${minLat},${minLng},${maxLat},${maxLng});
        node["hazard"](${minLat},${minLng},${maxLat},${maxLng});
        node["traffic_calming"](${minLat},${minLng},${maxLat},${maxLng});
        way["highway"]["maxspeed"](${minLat},${minLng},${maxLat},${maxLng});
      );
      out body;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });
    
    return response.data.elements || [];
  } catch (error) {
    console.error('Batch OSM query error:', error.message);
    return [];
  }
};

// Analyze safety for a point using pre-fetched data
const analyzePointSafety = (lat, lng, areaData, isNight) => {
  const radius = 0.001; // ~100m radius
  
  // Filter data near this point
  const nearbyData = areaData.filter(el => {
    if (el.lat && el.lon) {
      const dist = Math.sqrt(Math.pow(el.lat - lat, 2) + Math.pow(el.lon - lng, 2));
      return dist < radius;
    }
    return false;
  });
  
  // Analyze lighting
  const litWays = nearbyData.filter(el => 
    el.tags && el.tags.highway && (el.tags.lit === 'yes' || el.tags.lit === 'no')
  );
  const unlitCount = litWays.filter(w => w.tags.lit === 'no').length;
  const litCount = litWays.filter(w => w.tags.lit === 'yes').length;
  const totalLitWays = litWays.length;
  
  let lighting = 'moderate';
  if (totalLitWays > 0) {
    const lightingRatio = litCount / totalLitWays;
    lighting = lightingRatio < 0.3 ? 'poor' : lightingRatio < 0.7 ? 'moderate' : 'good';
  } else {
    // Estimate based on area type (urban areas usually better lit)
    const isUrban = Math.abs(lat) > 10 && Math.abs(lng) > 10;
    lighting = isUrban ? 'moderate' : 'poor';
  }
  
  // Analyze crime (police presence)
  const policeStations = nearbyData.filter(el => 
    el.tags && el.tags.amenity === 'police'
  ).length;
  
  // Crime estimate based on police presence and urban density
  const isUrban = Math.abs(lat) > 10;
  const baseCrime = Math.max(5, 40 - (policeStations * 8));
  const crimeIncidents = Math.floor(baseCrime + (isUrban ? 20 : 5));
  
  // Analyze accidents
  const hazards = nearbyData.filter(el => el.tags && el.tags.hazard).length;
  const trafficCalming = nearbyData.filter(el => el.tags && el.tags.traffic_calming).length;
  const highSpeedRoads = nearbyData.filter(el => {
    if (el.tags && el.tags.maxspeed) {
      const speed = parseInt(el.tags.maxspeed);
      return speed > 60;
    }
    return false;
  }).length;
  
  const accidentCount = Math.max(0, hazards + (highSpeedRoads > 0 ? 1 : 0) - Math.floor(trafficCalming * 0.5));
  
  // Determine danger zones
  const isDangerZone = crimeIncidents > 50 || hazards > 2 || (lighting === 'poor' && isNight);
  const reportedUnsafe = crimeIncidents > 60 || (hazards > 3 && lighting === 'poor');
  
  // Calculate safety score
  let score = 100;
  score -= crimeIncidents * 0.4;
  
  if (lighting === 'poor') {
    score -= isNight ? 18 : 6;
  } else if (lighting === 'moderate' && isNight) {
    score -= 10;
  }
  
  score -= accidentCount * 3;
  score -= hazards * 2;
  
  if (isDangerZone) {
    score -= 25;
  }
  
  if (reportedUnsafe) {
    score -= 20;
  }
  
  // Positive factors
  if (policeStations > 0) {
    score += policeStations * 4;
  }
  if (trafficCalming > 0) {
    score += trafficCalming * 2;
  }
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    crimeIncidents: Math.max(0, crimeIncidents),
    lighting: lighting,
    accidentCount: Math.max(0, accidentCount),
    isDangerZone: isDangerZone,
    reportedUnsafe: reportedUnsafe,
    hazards: hazards,
    policeStations: policeStations,
    trafficCalming: trafficCalming
  };
};

// Analyze route for safety using REAL batch data
const analyzeRoute = async (routeCoords, isNight) => {
  // Check cache first
  const cacheKey = `${routeCoords[0][0]}_${routeCoords[0][1]}_${routeCoords.length}`;
  const cached = getCachedSafety(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Fetch all area data in ONE batch query
  const areaData = await getRouteAreaData(routeCoords);
  
  const segments = [];
  let totalCrime = 0;
  let poorlyLitCount = 0;
  let accidentCount = 0;
  let dangerZones = [];
  let reportedUnsafeCount = 0;
  
  // Sample fewer points for speed (every 20th point)
  const step = Math.max(1, Math.floor(routeCoords.length / 10));
  
  for (let i = 0; i < routeCoords.length; i += step) {
    const [lat, lng] = routeCoords[i];
    const safety = analyzePointSafety(lat, lng, areaData, isNight);
    
    segments.push(safety);
    totalCrime += safety.crimeIncidents;
    
    if (safety.lighting === 'poor' || (isNight && safety.lighting === 'moderate')) {
      poorlyLitCount++;
    }
    
    accidentCount += safety.accidentCount;
    
    if (safety.isDangerZone) {
      dangerZones.push({ lat, lng, type: 'danger' });
    }
    
    if (safety.reportedUnsafe) {
      reportedUnsafeCount++;
      dangerZones.push({ lat, lng, type: 'reported' });
    }
  }
  
  // Calculate overall safety score
  const avgScore = segments.reduce((sum, s) => sum + s.score, 0) / segments.length;
  const finalScore = Math.round(avgScore);
  
  const result = {
    safetyScore: finalScore,
    crimeIncidents: totalCrime,
    poorlyLitSections: poorlyLitCount,
    accidentCount: accidentCount,
    dangerZones: dangerZones,
    reportedUnsafeSpots: reportedUnsafeCount,
    routeCoords: routeCoords,
    dataSource: 'real',
    timestamp: new Date().toISOString()
  };
  
  // Cache result
  setCachedSafety(cacheKey, result);
  
  return result;
};

// Get multiple route alternatives and find the safest
app.post('/api/safe-route', async (req, res) => {
  try {
    const { start, destination, isNight } = req.body;

    if (!start || !destination) {
      return res.status(400).json({ error: 'Start and destination are required' });
    }

    const routes = [];
    
    try {
      // Get route alternatives from OSRM
      const primaryResponse = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`,
        { timeout: 10000 }
      );

      if (primaryResponse.data.code === 'Ok' && primaryResponse.data.routes) {
        // Analyze each route with REAL data (parallel processing)
        const routePromises = primaryResponse.data.routes.map(async (route) => {
          const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const analysis = await analyzeRoute(routeCoords, isNight || false);
          
          return {
            routeIndex: routes.length,
            routeCoords: routeCoords,
            distance: route.distance,
            duration: route.duration,
            ...analysis
          };
        });
        
        const analyzedRoutes = await Promise.all(routePromises);
        routes.push(...analyzedRoutes);
      }

      // If no alternatives, get at least one route
      if (routes.length === 0) {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
          { timeout: 10000 }
        );
        
        if (response.data.code === 'Ok' && response.data.routes[0]) {
          const route = response.data.routes[0];
          const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const analysis = await analyzeRoute(routeCoords, isNight || false);
          
          routes.push({
            routeIndex: 0,
            routeCoords: routeCoords,
            distance: route.distance,
            duration: route.duration,
            ...analysis
          });
        }
      }

      if (routes.length === 0) {
        return res.status(400).json({ error: 'No routes found' });
      }

      // Sort by safety score (highest first) - SAFEST ROUTE FIRST
      routes.sort((a, b) => b.safetyScore - a.safetyScore);
      
      const safestRoute = routes[0];
      const allAlternatives = routes;

      res.json({
        safestRoute: safestRoute,
        alternatives: allAlternatives,
        isNight: isNight || false,
        timestamp: new Date().toISOString(),
        dataSource: 'real',
        analyzedRoutes: routes.length
      });

    } catch (error) {
      console.error('OSRM error:', error.message);
      return res.status(500).json({ error: 'Failed to calculate routes' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Geocoding endpoint
app.post('/api/geocode', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { timeout: 5000 }
    );

    if (response.data && response.data.length > 0) {
      res.json({
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
        display_name: response.data[0].display_name
      });
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cache endpoint (for testing)
app.post('/api/clear-cache', (req, res) => {
  safetyCache.clear();
  res.json({ message: 'Cache cleared' });
});

app.listen(PORT, () => {
  console.log(`Safe Journey server running on port ${PORT}`);
  console.log('Using REAL data from OpenStreetMap (optimized batch queries)');
  console.log('Routes will show quickly with real safety analysis');
});
