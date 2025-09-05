import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function PrivateRoute() {
  /** Protect routes requiring authentication. Redirects to /login if not authenticated. */
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // In real UI, show spinner; here we just render nothing during bootstrap
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
