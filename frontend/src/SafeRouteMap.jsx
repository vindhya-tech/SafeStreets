// // import React, { useState, useEffect } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import './App.css';

// // // Fix for default marker icons
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// // });

// // // Custom danger zone icon
// // const createDangerIcon = (type) => {
// //   return L.divIcon({
// //     className: 'danger-marker',
// //     html: `<div class="danger-icon ${type}">${type === 'danger' ? '⚠️' : '🚨'}</div>`,
// //     iconSize: [30, 30],
// //     iconAnchor: [15, 15]
// //   });
// // };

// // // Component to handle routing and update map view
// // function MapUpdater({ start, destination, route }) {
// //   const map = useMap();

// //   useEffect(() => {
// //     if (start && destination && route) {
// //       const allPoints = [
// //         [start.lat, start.lng],
// //         [destination.lat, destination.lng],
// //         ...route.routeCoords
// //       ];
// //       const bounds = L.latLngBounds(allPoints);
// //       map.fitBounds(bounds, { padding: [50, 50] });
// //     } else if (start && destination) {
// //       const bounds = L.latLngBounds([
// //         [start.lat, start.lng],
// //         [destination.lat, destination.lng]
// //       ]);
// //       map.fitBounds(bounds, { padding: [50, 50] });
// //     }
// //   }, [map, start, destination, route]);

// //   return null;
// // }

// // function SafeRouteMap() {
// //   const [startAddress, setStartAddress] = useState('');
// //   const [destinationAddress, setDestinationAddress] = useState('');
// //   const [startCoords, setStartCoords] = useState(null);
// //   const [destinationCoords, setDestinationCoords] = useState(null);
// //   const [routeData, setRouteData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [isNight, setIsNight] = useState(false);
// //   const [nightMode, setNightMode] = useState(false);

// //   // Check if it's night time
// //   useEffect(() => {
// //     const checkNightTime = () => {
// //       const hour = new Date().getHours();
// //       const isNightTime = hour >= 18 || hour < 6;
// //       setIsNight(isNightTime);
// //       setNightMode(isNightTime);
// //     };
    
// //     checkNightTime();
// //     const interval = setInterval(checkNightTime, 60000); // Check every minute
    
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Geocoding function - direct API call (no backend needed)
// //   const geocode = async (address) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
// //       );
// //       const data = await response.json();
// //       if (data && data.length > 0) {
// //         return {
// //           lat: parseFloat(data[0].lat),
// //           lng: parseFloat(data[0].lon),
// //           display_name: data[0].display_name
// //         };
// //       }
// //       return null;
// //     } catch (err) {
// //       console.error('Geocoding error:', err);
// //       return null;
// //     }
// //   };

// //   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

// //   const handleGetRoute = async () => {
// //     if (!startAddress || !destinationAddress) {
// //       setError('Please enter both start and destination');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const start = await geocode(startAddress);
// //       const destination = await geocode(destinationAddress);

// //       if (!start) {
// //         setError('Could not find start location');
// //         setLoading(false);
// //         return;
// //       }

// //       if (!destination) {
// //         setError('Could not find destination');
// //         setLoading(false);
// //         return;
// //       }

// //       setStartCoords(start);
// //       setDestinationCoords(destination);

// //       // Get safest route from backend with REAL data
// //       const response = await fetch(`${BACKEND_URL}/api/safe-route`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           start: { lat: start.lat, lng: start.lng },
// //           destination: { lat: destination.lat, lng: destination.lng },
// //           isNight: nightMode
// //         })
// //       });

// //       const data = await response.json();
      
// //       if (data.safestRoute) {
// //         setRouteData(data);
// //       } else {
// //         setError(data.error || 'Failed to get route');
// //       }
// //     } catch (err) {
// //       console.error('Error:', err);
// //       setError('Failed to get route');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getSafetyColor = (score) => {
// //     if (score >= 70) return '#28a745';
// //     if (score >= 50) return '#ffc107';
// //     return '#dc3545';
// //   };

// //   const getSafetyText = (score) => {
// //     if (score >= 70) return 'Safe';
// //     if (score >= 50) return 'Use Caution';
// //     return 'High Risk';
// //   };

// //   return (
// //     <div className={`App ${nightMode ? 'night-mode' : ''}`}>
// //       <div className="search-panel">
// //         <div className="header-section">
// //           <h1>SafeJourney - Find Safe Route</h1>
// //           <p className="subtitle">Enter your start and destination to find the safest route</p>
          
// //           <div className="night-mode-toggle">
// //             <label className="toggle-switch">
// //               <input
// //                 type="checkbox"
// //                 checked={nightMode}
// //                 onChange={(e) => setNightMode(e.target.checked)}
// //               />
// //               <span className="toggle-slider"></span>
// //             </label>
// //             <span className="toggle-label">🌙 Night Mode</span>
// //             {isNight && <span className="auto-night">(Auto-enabled)</span>}
// //           </div>
// //         </div>
        
// //         <div className="input-group">
// //           <div className="input-wrapper">
// //             <span className="location-icon">📍</span>
// //             <input
// //               type="text"
// //               placeholder="Start location"
// //               value={startAddress}
// //               onChange={(e) => setStartAddress(e.target.value)}
// //               className="input-field"
// //               onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
// //             />
// //           </div>
// //           <div className="input-wrapper">
// //             <span className="location-icon">📍</span>
// //             <input
// //               type="text"
// //               placeholder="Destination"
// //               value={destinationAddress}
// //               onChange={(e) => setDestinationAddress(e.target.value)}
// //               className="input-field"
// //               onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
// //             />
// //           </div>
// //           <button 
// //             onClick={handleGetRoute} 
// //             disabled={loading}
// //             className="route-button"
// //           >
// //             {loading ? 'Finding Safest Route...' : 'Find Safe Route'}
// //           </button>
// //         </div>

// //         {error && <div className="error-message">{error}</div>}
        
// //         {routeData && routeData.safestRoute && (
// //           <div className="route-info">
// //             <div className="safety-score" style={{ borderColor: getSafetyColor(routeData.safestRoute.safetyScore) }}>
// //               <span className="score-label">Safety Score:</span>
// //               <span 
// //                 className="score-value" 
// //                 style={{ color: getSafetyColor(routeData.safestRoute.safetyScore) }}
// //               >
// //                 {routeData.safestRoute.safetyScore}/100
// //               </span>
// //               <span className="warning-icon">⚠️</span>
// //               <span className="warning-text">{getSafetyText(routeData.safestRoute.safetyScore)}</span>
// //             </div>
            
// //             <div className="route-analysis">
// //               <h3>Route Analysis</h3>
// //               <div className="analysis-item crime">
// //                 <span className="icon">🚨</span>
// //                 <span>Crime incidents on route: <strong>{routeData.safestRoute.crimeIncidents}</strong></span>
// //               </div>
// //               <div className="analysis-item lighting">
// //                 <span className="icon">💡</span>
// //                 <span>Poorly lit sections: <strong>{routeData.safestRoute.poorlyLitSections}</strong></span>
// //                 {nightMode && <span className="night-badge">Night Penalty Applied</span>}
// //               </div>
// //               <div className="analysis-item accident">
// //                 <span className="icon">⚠️</span>
// //                 <span>Accident-prone zones: <strong>{routeData.safestRoute.accidentCount}</strong></span>
// //               </div>
// //               <div className="analysis-item danger">
// //                 <span className="icon">🚫</span>
// //                 <span>Danger zones: <strong>{routeData.safestRoute.dangerZones.filter(z => z.type === 'danger').length}</strong></span>
// //               </div>
// //               <div className="analysis-item reported">
// //                 <span className="icon">📢</span>
// //                 <span>Reported unsafe spots: <strong>{routeData.safestRoute.reportedUnsafeSpots}</strong></span>
// //               </div>
// //               <div className="analysis-item info">
// //                 <span className="icon">✅</span>
// //                 <span>This is the safest available route considering crime data, lighting conditions, and danger zones.</span>
// //               </div>
              
// //               {routeData.alternatives && routeData.alternatives.length > 1 && (
// //                 <div className="alternatives-info">
// //                   <p>Analyzed {routeData.alternatives.length} route alternatives</p>
// //                   <p>Selected safest option</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <div className="map-container">
// //         <MapContainer
// //           center={[17.3850, 78.4867]}
// //           zoom={13}
// //           style={{ height: '100vh', width: '100%' }}
// //         >
// //           <TileLayer
// //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //             url={nightMode 
// //               ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
// //               : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //             }
// //           />
          
// //           {startCoords && (
// //             <Marker position={[startCoords.lat, startCoords.lng]}>
// //               <Popup>
// //                 <strong>Start:</strong> {startCoords.display_name || startAddress}
// //               </Popup>
// //             </Marker>
// //           )}
          
// //           {destinationCoords && (
// //             <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
// //               <Popup>
// //                 <strong>Destination:</strong> {destinationCoords.display_name || destinationAddress}
// //               </Popup>
// //             </Marker>
// //           )}

// //           {routeData && routeData.safestRoute && (
// //             <>
// //               <Polyline
// //                 positions={routeData.safestRoute.routeCoords}
// //                 pathOptions={{ 
// //                   color: getSafetyColor(routeData.safestRoute.safetyScore), 
// //                   weight: 6,
// //                   opacity: 0.8
// //                 }}
// //               />
              
// //               {/* Danger zone markers */}
// //               {routeData.safestRoute.dangerZones.map((zone, index) => (
// //                 <Marker
// //                   key={index}
// //                   position={[zone.lat, zone.lng]}
// //                   icon={createDangerIcon(zone.type)}
// //                 >
// //                   <Popup>
// //                     <strong>{zone.type === 'danger' ? '⚠️ Danger Zone' : '🚨 Reported Unsafe'}</strong>
// //                     <br />
// //                     {zone.type === 'danger' 
// //                       ? 'High crime or accident risk area'
// //                       : 'Previously reported as unsafe location'
// //                     }
// //                   </Popup>
// //                 </Marker>
// //               ))}
// //             </>
// //           )}

// //           <MapUpdater 
// //             start={startCoords} 
// //             destination={destinationCoords} 
// //             route={routeData?.safestRoute} 
// //           />
// //         </MapContainer>
// //       </div>
// //     </div>
// //   );
// // }

// // export default SafeRouteMap;

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import './App.css';
// import { useNavigate } from "react-router-dom"; // ⭐ ADDED

// // Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// });

// // Custom danger zone icon
// const createDangerIcon = (type) => {
//   return L.divIcon({
//     className: 'danger-marker',
//     html: `<div class="danger-icon ${type}">${type === 'danger' ? '⚠️' : '🚨'}</div>`,
//     iconSize: [30, 30],
//     iconAnchor: [15, 15]
//   });
// };

// // Component to handle routing and update map view
// function MapUpdater({ start, destination, route }) {
//   const map = useMap();

//   useEffect(() => {
//     if (start && destination && route) {
//       const allPoints = [
//         [start.lat, start.lng],
//         [destination.lat, destination.lng],
//         ...route.routeCoords
//       ];
//       const bounds = L.latLngBounds(allPoints);
//       map.fitBounds(bounds, { padding: [50, 50] });
//     } else if (start && destination) {
//       const bounds = L.latLngBounds([
//         [start.lat, start.lng],
//         [destination.lat, destination.lng]
//       ]);
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [map, start, destination, route]);

//   return null;
// }

// function SafeRouteMap() {

//   const navigate = useNavigate(); // ⭐ ADDED
//   const handleSOS = () => navigate("/sos"); // ⭐ ADDED

//   const [startAddress, setStartAddress] = useState('');
//   const [destinationAddress, setDestinationAddress] = useState('');
//   const [startCoords, setStartCoords] = useState(null);
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [routeData, setRouteData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isNight, setIsNight] = useState(false);
//   const [nightMode, setNightMode] = useState(false);

//   // Check if it's night time
//   useEffect(() => {
//     const checkNightTime = () => {
//       const hour = new Date().getHours();
//       const isNightTime = hour >= 18 || hour < 6;
//       setIsNight(isNightTime);
//       setNightMode(isNightTime);
//     };
    
//     checkNightTime();
//     const interval = setInterval(checkNightTime, 60000); // Check every minute
    
//     return () => clearInterval(interval);
//   }, []);

//   // Geocoding function
//   const geocode = async (address) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
//       );
//       const data = await response.json();
//       if (data.length > 0) {
//         return {
//           lat: parseFloat(data[0].lat),
//           lng: parseFloat(data[0].lon),
//           display_name: data[0].display_name
//         };
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

//   const handleGetRoute = async () => {
//     if (!startAddress || !destinationAddress) {
//       setError('Please enter both start and destination');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const start = await geocode(startAddress);
//       const destination = await geocode(destinationAddress);

//       if (!start || !destination) {
//         setError("Could not find location");
//         setLoading(false);
//         return;
//       }

//       setStartCoords(start);
//       setDestinationCoords(destination);

//       const response = await fetch(`${BACKEND_URL}/api/safe-route`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           start: { lat: start.lat, lng: start.lng },
//           destination: { lat: destination.lat, lng: destination.lng },
//           isNight: nightMode
//         })
//       });

//       const data = await response.json();
//       setRouteData(data);
//     } catch {
//       setError("Failed to get route");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSafetyColor = (score) => {
//     if (score >= 70) return '#28a745';
//     if (score >= 50) return '#ffc107';
//     return '#dc3545';
//   };

//   const getSafetyText = (score) => {
//     if (score >= 70) return 'Safe';
//     if (score >= 50) return 'Use Caution';
//     return 'High Risk';
//   };

//   return (
//     <div className={`App ${nightMode ? 'night-mode' : ''}`}>
//       <div className="search-panel">
//         <div className="header-section">
//           <h1>SafeJourney - Find Safe Route</h1>
//           <p className="subtitle">Enter your start and destination to find the safest route</p>
          
//           <div className="night-mode-toggle">
//             <label className="toggle-switch">
//               <input
//                 type="checkbox"
//                 checked={nightMode}
//                 onChange={(e) => setNightMode(e.target.checked)}
//               />
//               <span className="toggle-slider"></span>
//             </label>
//             <span className="toggle-label">🌙 Night Mode</span>
//             {isNight && <span className="auto-night">(Auto-enabled)</span>}
//           </div>
//         </div>
        
//         <div className="input-group">
//           <div className="input-wrapper">
//             <span className="location-icon">📍</span>
//             <input
//               type="text"
//               placeholder="Start location"
//               value={startAddress}
//               onChange={(e) => setStartAddress(e.target.value)}
//               className="input-field"
//               onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
//             />
//           </div>
//           <div className="input-wrapper">
//             <span className="location-icon">📍</span>
//             <input
//               type="text"
//               placeholder="Destination"
//               value={destinationAddress}
//               onChange={(e) => setDestinationAddress(e.target.value)}
//               className="input-field"
//               onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
//             />
//           </div>
//           <button onClick={handleGetRoute} disabled={loading} className="route-button">
//             {loading ? 'Finding Safest Route...' : 'Find Safe Route'}
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}
        
//         {routeData && routeData.safestRoute && (
//           <div className="route-info">
//             <div className="safety-score" style={{ borderColor: getSafetyColor(routeData.safestRoute.safetyScore) }}>
//               <span className="score-label">Safety Score:</span>
//               <span className="score-value" style={{ color: getSafetyColor(routeData.safestRoute.safetyScore) }}>
//                 {routeData.safestRoute.safetyScore}/100
//               </span>
//               <span className="warning-icon">⚠️</span>
//               <span className="warning-text">{getSafetyText(routeData.safestRoute.safetyScore)}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="map-container" style={{ position: "relative" }}>
//         <MapContainer center={[17.3850, 78.4867]} zoom={13} style={{ height: '100vh', width: '100%' }}>
//           <TileLayer
//             attribution='&copy; OpenStreetMap contributors'
//             url={nightMode 
//               ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//               : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             }
//           />
          
//           {startCoords && (
//             <Marker position={[startCoords.lat, startCoords.lng]}>
//               <Popup><strong>Start:</strong> {startCoords.display_name || startAddress}</Popup>
//             </Marker>
//           )}

//           {destinationCoords && (
//             <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
//               <Popup><strong>Destination:</strong> {destinationCoords.display_name || destinationAddress}</Popup>
//             </Marker>
//           )}

//           {routeData?.safestRoute && (
//             <>
//               <Polyline
//                 positions={routeData.safestRoute.routeCoords}
//                 pathOptions={{ 
//                   color: getSafetyColor(routeData.safestRoute.safetyScore), 
//                   weight: 6,
//                   opacity: 0.8
//                 }}
//               />

//               {routeData.safestRoute.dangerZones.map((zone, index) => (
//                 <Marker key={index} position={[zone.lat, zone.lng]} icon={createDangerIcon(zone.type)}>
//                   <Popup>
//                     <strong>{zone.type === 'danger' ? '⚠️ Danger Zone' : '🚨 Reported Unsafe'}</strong>
//                   </Popup>
//                 </Marker>
//               ))}
//             </>
//           )}

//           <MapUpdater 
//             start={startCoords} 
//             destination={destinationCoords} 
//             route={routeData?.safestRoute} 
//           />
//         </MapContainer>

//         {/* ⭐ Floating SOS Button */}
//         <button className="floating-sos-btn" onClick={handleSOS}>
//           🚨 SOS
//         </button>
//       </div>
//     </div>
//   );
// }

// export default SafeRouteMap;

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { useNavigate } from "react-router-dom";


// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom danger zone icon
const createDangerIcon = (type) => {
  return L.divIcon({
    className: 'danger-marker',
    html: `<div class="danger-icon ${type}">${type === 'danger' ? '⚠️' : '🚨'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Component to handle routing and update map view
function MapUpdater({ start, destination, route, liveLocation }) {
  const map = useMap();

  useEffect(() => {
    if (start && destination && route) {
      const allPoints = [
        [start.lat, start.lng],
        [destination.lat, destination.lng],
        ...route.routeCoords
      ];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (start && destination) {
      const bounds = L.latLngBounds([
        [start.lat, start.lng],
        [destination.lat, destination.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, start, destination, route]);

  // Pan to live location as it updates (for auto-follow effect)
  useEffect(() => {
    if (liveLocation) {
      map.panTo([liveLocation.lat, liveLocation.lng]);
    }
  }, [map, liveLocation]);

  return null;
}

function SafeRouteMap() {
  const navigate = useNavigate(); // ⭐ ADDED
  const handleSOS = () => navigate("/sos");
  const [startAddress, setStartAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNight, setIsNight] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  // 🔵 Live GPS tracking
  const [liveLocation, setLiveLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Check if it's night time
  useEffect(() => {
  const checkNightTime = () => {
    const hour = new Date().getHours();
    const isNightTime = hour >= 18 || hour < 6;
    setIsNight(isNightTime);
    setNightMode(isNightTime);
  };
  
  checkNightTime();
  const interval = setInterval(checkNightTime, 60000); // Check every minute
  
  return () => clearInterval(interval);
}, []);

// Cleanup geolocation watch on unmount
useEffect(() => {
  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
}, [watchId]);

// 🧠 Auto Re-Route if user deviates from safe path
useEffect(() => {
  if (!liveLocation || !routeData?.safestRoute) return;

  const routeCoords = routeData.safestRoute.routeCoords;
  let minDistance = Infinity;

  // Haversine distance function
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const toRad = d => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest distance to any point in current route path
  routeCoords.forEach(point => {
    const dist = haversine(
      liveLocation.lat,
      liveLocation.lng,
      point[0],
      point[1]
    );
    if (dist < minDistance) minDistance = dist;
  });

  console.log("User distance from route:", minDistance);

  // If too far → Recalculate safest route 🚨
  if (minDistance > 40) {
    console.log("⚠️ User deviated → Auto rerouting...");
    handleGetRoute();
  }
}, [liveLocation, routeData]);

// Geocoding function - direct API call (no backend needed)
const geocode = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
};

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  const handleGetRoute = async () => {
    if (!startAddress || !destinationAddress) {
      setError('Please enter both start and destination');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const start = await geocode(startAddress);
      const destination = await geocode(destinationAddress);

      if (!start) {
        setError('Could not find start location');
        setLoading(false);
        return;
      }

      if (!destination) {
        setError('Could not find destination');
        setLoading(false);
        return;
      }

      setStartCoords(start);
      setDestinationCoords(destination);

      // Get safest route from backend with REAL data
      const response = await fetch(`${BACKEND_URL}/api/safe-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: { lat: start.lat, lng: start.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          isNight: nightMode
        })
      });

      const data = await response.json();
      
      if (data.safestRoute) {
        setRouteData(data);
      } else {
        setError(data.error || 'Failed to get route');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get route');
    } finally {
      setLoading(false);
    }
  };

  // 📌 Use current location + start live tracking
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device');
      return;
    }

    setError('');

    // One-time fetch to fill Start field + marker
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const locationObj = {
            lat: latitude,
            lng: longitude,
            display_name: data.display_name || 'Your location'
          };

          setStartCoords(locationObj);
          setStartAddress(data.display_name || '');
        } catch (e) {
          console.error('Reverse geocode error:', e);
          setStartCoords({
            lat: latitude,
            lng: longitude,
            display_name: 'Your location'
          });
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Failed to get current location. Please enable location access.');
      },
      { enableHighAccuracy: true }
    );

    // Continuous tracking for moving marker
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLiveLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        console.error('Tracking error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
  };

  const getSafetyColor = (score) => {
    if (score >= 70) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getSafetyText = (score) => {
    if (score >= 70) return 'Safe';
    if (score >= 50) return 'Use Caution';
    return 'High Risk';
  };

  return (
    <div className={`App ${nightMode ? 'night-mode' : ''}`}>
      <div className="search-panel">
        <div className="header-section">
          <h1>SafeJourney - Find Safe Route</h1>
          <p className="subtitle">Enter your start and destination to find the safest route</p>
          
          <div className="night-mode-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={nightMode}
                onChange={(e) => setNightMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">🌙 Night Mode</span>
            {isNight && <span className="auto-night">(Auto-enabled)</span>}
          </div>
        </div>
        
        <div className="input-group">
          <div className="input-wrapper">
            <span className="location-icon">📍</span>
            <input
              type="text"
              placeholder="Start location"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
            />
          </div>

          {/* 📌 Use Current Location Button */}
          <button 
            className="current-location-btn"
            onClick={handleUseCurrentLocation}
          >
            📌 Use Current Location
          </button>

          <div className="input-wrapper">
            <span className="location-icon">📍</span>
            <input
              type="text"
              placeholder="Destination"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className="input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleGetRoute()}
            />
          </div>

          <button 
            onClick={handleGetRoute} 
            disabled={loading}
            className="route-button"
          >
            {loading ? 'Finding Safest Route...' : 'Find Safe Route'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {routeData && routeData.safestRoute && (
          <div className="route-info">
            <div className="safety-score" style={{ borderColor: getSafetyColor(routeData.safestRoute.safetyScore) }}>
              <span className="score-label">Safety Score:</span>
              <span 
                className="score-value" 
                style={{ color: getSafetyColor(routeData.safestRoute.safetyScore) }}
              >
                {routeData.safestRoute.safetyScore}/100
              </span>
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">{getSafetyText(routeData.safestRoute.safetyScore)}</span>
            </div>
            
            <div className="route-analysis">
              <h3>Route Analysis</h3>
        
              <div className="analysis-item lighting">
                <span className="icon">💡</span>
                <span>Poorly lit sections: <strong>{routeData.safestRoute.poorlyLitSections}</strong></span>
                {nightMode && <span className="night-badge">Night Penalty Applied</span>}
              </div>
              <div className="analysis-item accident">
                <span className="icon">⚠️</span>
                <span>Accident-prone zones: <strong>{routeData.safestRoute.accidentCount}</strong></span>
              </div>
              <div className="analysis-item danger">
                <span className="icon">🚫</span>
                <span>Danger zones: <strong>{routeData.safestRoute.dangerZones.filter(z => z.type === 'danger').length}</strong></span>
              </div>
              <div className="analysis-item reported">
                <span className="icon">📢</span>
                <span>Reported unsafe spots: <strong>{routeData.safestRoute.reportedUnsafeSpots}</strong></span>
              </div>
              <div className="analysis-item info">
                <span className="icon">✅</span>
                <span>This is the safest available route considering crime data, lighting conditions, and danger zones.</span>
              </div>
              
              {routeData.alternatives && routeData.alternatives.length > 1 && (
                <div className="alternatives-info">
                  <p>Analyzed {routeData.alternatives.length} route alternatives</p>
                  <p>Selected safest option</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={[17.3850, 78.4867]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={nightMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          
          {startCoords && (
            <Marker position={[startCoords.lat, startCoords.lng]}>
              <Popup>
                <strong>Start:</strong> {startCoords.display_name || startAddress}
              </Popup>
            </Marker>
          )}
          
          {destinationCoords && (
            <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
              <Popup>
                <strong>Destination:</strong> {destinationCoords.display_name || destinationAddress}
              </Popup>
            </Marker>
          )}

          {/* 🔵 Live location marker */}
          {liveLocation && (
            <Marker
              position={[liveLocation.lat, liveLocation.lng]}
              icon={L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [35, 35],
                iconAnchor: [17, 17]
              })}
            >
              <Popup>You are here</Popup>
            </Marker>
          )}

          {routeData && routeData.safestRoute && (
            <>
              <Polyline
                positions={routeData.safestRoute.routeCoords}
                pathOptions={{ 
                  color: getSafetyColor(routeData.safestRoute.safetyScore), 
                  weight: 6,
                  opacity: 0.8
                }}
              />
              
              {/* Danger zone markers */}
              {routeData.safestRoute.dangerZones.filter((zone, index) => index % 5 === 0)
              .map((zone, index) => (
                <Marker
                  key={index}
                  position={[zone.lat, zone.lng]}
                  icon={createDangerIcon(zone.type)}
                >
                  <Popup>
                    <strong>{zone.type === 'danger' ? '⚠️ Danger Zone' : '🚨 Reported Unsafe'}</strong>
                    <br />
                    {zone.type === 'danger' 
                      ? 'High crime or accident risk area'
                      : 'Previously reported as unsafe location'
                    }
                  </Popup>
                </Marker>
              ))}
            </>
          )}

          <MapUpdater 
            start={startCoords} 
            destination={destinationCoords} 
            route={routeData?.safestRoute}
            liveLocation={liveLocation}
          />
              {/* ⭐ Floating SOS Button */}
        <button className="floating-sos-btn" onClick={handleSOS}>
          🚨 SOS
        </button>


        </MapContainer>
      </div>
    </div>
  );
}

export default SafeRouteMap;
