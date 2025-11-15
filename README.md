# Safe Journey - Smart Safety Routing App

A hackathon project that helps users navigate safely by analyzing multiple routes and selecting the safest path based on real-time safety factors.

## ✨ Features

### Core Safety Features
- ✅ **Safest Route Selection** - Analyzes multiple route alternatives and chooses the safest
- ✅ **Danger Zone Avoidance** - Identifies and avoids high-risk areas
- ✅ **Poorly Lit Street Detection** - Flags and penalizes poorly lit sections
- ✅ **Accident-Prone Zone Avoidance** - Avoids areas with high accident rates
- ✅ **Reported Unsafe Spots** - Considers user-reported dangerous locations

### Awareness Features
- ✅ **Danger Zone Markers** - Visual markers on map showing unsafe areas
- ✅ **Crime Incident Tracking** - Shows crime incidents along route
- ✅ **Lighting Analysis** - Identifies poorly lit sections

### Dynamic & Real-Time
- ✅ **Dynamic Route Updates** - Recalculates when conditions change
- ✅ **Night Mode Detection** - Auto-detects night time (6 PM - 6 AM)
- ✅ **Lighting-Based Scoring** - Higher penalties for poor lighting at night
- ✅ **Real-Time Safety Data** - Simulated real-time crime/lighting/accident data

### Informed Decisions
- ✅ **Detailed Safety Score** - 0-100 safety rating
- ✅ **Component-Wise Breakdown**:
  - Crime incidents count
  - Poorly lit sections count
  - Accident-prone zones
  - Danger zones
  - Reported unsafe spots
- ✅ **Route Comparison** - Shows how many alternatives were analyzed

### Night-Time Optimization
- ✅ **Night Mode Toggle** - Manual night mode switch
- ✅ **Auto Night Detection** - Automatically enables at night
- ✅ **Night-Time Penalties** - Higher penalties for poor lighting at night
- ✅ **Dark Map Theme** - Dark map tiles for night mode

## 🚀 Quick Setup

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## 📋 How It Works

1. **Enter Locations**: Input start and destination addresses
2. **Route Analysis**: Backend fetches multiple route alternatives
3. **Safety Scoring**: Each route is scored based on:
   - Crime incidents along the route
   - Poorly lit sections (higher penalty at night)
   - Accident-prone zones
   - Danger zones
   - User-reported unsafe spots
4. **Safest Route Selection**: Route with highest safety score is selected
5. **Visualization**: 
   - Route displayed on map
   - Danger zones marked with warning icons
   - Detailed safety breakdown shown

## 🎯 Safety Scoring Algorithm

The safety score (0-100) is calculated as:

```
Base Score: 100
- Crime incidents × 0.5
- Poor lighting: -5 (day) or -15 (night)
- Accidents × 3
- Danger zones: -20
- Reported unsafe: -15
```

**Night Mode**: Poor lighting penalties are 3x higher at night (6 PM - 6 AM)

## 🗺️ Map Features

- **OpenStreetMap** tiles (free, no API key)
- **OSRM Routing** for route calculation (free)
- **Danger Zone Markers**:
  - ⚠️ Red markers for danger zones
  - 🚨 Pink markers for reported unsafe spots
- **Route Color Coding**:
  - Green: Safe (70-100)
  - Yellow: Caution (50-69)
  - Red: High Risk (0-49)

## 🌙 Night Mode

- **Auto-Detection**: Automatically enabled 6 PM - 6 AM
- **Manual Toggle**: Switch available in UI
- **Enhanced Penalties**: Poor lighting penalized more at night
- **Dark Theme**: Dark map tiles and UI for better night viewing

## 📊 Route Analysis Display

Shows detailed breakdown:
- **Safety Score**: Overall rating with color coding
- **Crime Incidents**: Total count on route
- **Poorly Lit Sections**: Count with night penalty indicator
- **Accident-Prone Zones**: Number of high-risk areas
- **Danger Zones**: Count of identified danger areas
- **Reported Unsafe Spots**: User-reported locations
- **Alternatives Analyzed**: Number of routes compared

## 🛠️ Tech Stack

- **Frontend**: React with `.jsx` files
- **Backend**: Node.js + Express
- **Maps**: Leaflet + OpenStreetMap
- **Routing**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim (OpenStreetMap)

## 📝 API Endpoints

### `POST /api/safe-route`
Get the safest route between two points

**Request:**
```json
{
  "start": { "lat": 17.3850, "lng": 78.4867 },
  "destination": { "lat": 17.4486, "lng": 78.3908 },
  "isNight": false
}
```

**Response:**
```json
{
  "safestRoute": {
    "safetyScore": 75,
    "crimeIncidents": 23,
    "poorlyLitSections": 2,
    "accidentCount": 1,
    "dangerZones": [...],
    "routeCoords": [[lat, lng], ...]
  },
  "alternatives": [...]
}
```

### `POST /api/geocode`
Convert address to coordinates

## 🎨 UI Features

- Clean sidebar with input fields
- Real-time safety score display
- Color-coded safety indicators
- Animated danger zone markers
- Night mode with dark theme
- Responsive design

## 🔄 Dynamic Updates

The system simulates real-time updates:
- Safety data is recalculated on each route request
- Night mode automatically adjusts scoring
- Route alternatives are re-analyzed each time
- Danger zones are dynamically identified

## 📱 Usage Example

1. Enter "Narayanaguda" as start
2. Enter "Himayat Nagar" as destination
3. Click "Find Safe Route"
4. View the safest route with:
   - Safety score (e.g., 57/100)
   - Crime incidents count
   - Poorly lit sections
   - Danger zones on map
   - Detailed analysis

## 🚨 Note

This is a hackathon project with simulated safety data. In production, you would integrate with:
- Real crime databases
- Street lighting APIs
- Traffic accident databases
- User reporting systems
- Real-time data feeds
