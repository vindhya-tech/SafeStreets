import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/signup";
import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import EmergencyPage from "../pages/EmergencyPage.jsx";
import SOSPage from "../pages/SOSPage.jsx";
import HomePage from "../pages/HomePage";
import SafeRouteMap from "../SafeRouteMap.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Default first page → HomePage */}
      <Route path="/" element={<HomePage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <SafeRouteMap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <EmergencyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <SOSPage />
          </ProtectedRoute>
        }
      />

      {/* Unknown Route → Redirect Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
