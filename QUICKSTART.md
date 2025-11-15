# Quick Start Guide

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
4. Create credentials (API Key)
5. Copy your API key

## 2. Setup Backend (Optional - Frontend works standalone)

```bash
cd backend
npm install
```

Create `.env` file:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
PORT=5000
```

Start backend:
```bash
npm start
```

## 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Start frontend:
```bash
npm start
```

## 4. Use the App

1. Open http://localhost:3000
2. Enter start location (e.g., "New York, NY")
3. Enter destination (e.g., "Boston, MA")
4. Click "Get Route"
5. See the route on the map!

## Note

The frontend works independently using Google Maps JavaScript API directly. The backend is optional and can be used for additional features later.

