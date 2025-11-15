import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/signup";
import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import EmergencyPage from "../pages/EmergencyPage.jsx";
import SOSPage from "../pages/SOSPage.jsx";



import SafeRouteMap from "../SafeRouteMap.jsx"; // ✅ Correct import
// import EmergencyPage from "../pages/EmergencyPage"; // ❌ Comment until created

export default function AppRouter() {
  const isAuthenticated = () => {
    const authUser = localStorage.getItem("authUser");
    return !!authUser;
  };

  const isLoggedIn = isAuthenticated();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/map" element={<ProtectedRoute><SafeRouteMap /></ProtectedRoute>} />

      <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} /> 
      <Route
  path="/sos"
  element={
    <ProtectedRoute>
      <SOSPage />
    </ProtectedRoute>
  }
/>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
