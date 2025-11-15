import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import './index.css';

function App() {
  // Clear invalid/old localStorage data on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    
    // If token exists but is empty or invalid, clear all auth data
    if (!token || token.trim() === "" || (!email && !userId)) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      localStorage.removeItem("role");
    }
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
