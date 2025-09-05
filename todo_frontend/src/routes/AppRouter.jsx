import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

// Placeholder login page (no UI yet)
function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  // Immediately no-op render for scaffolding; example usage shown in comments
  // Example:
  // useEffect(() => { login('email@example.com', 'password'); }, [login]);

  if (isAuthenticated) {
    // If already logged in, navigate to app root.
    // React Router v6 doesn't have Redirect component here; handled by route definitions.
  }

  return null;
}

// Placeholder secured app page (no UI)
function AppHome() {
  return null;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Router configuration with public and private routes. */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AppHome />} />
          <Route path="/app" element={<AppHome />} />
        </Route>
        <Route path="*" element={<AppHome />} />
      </Routes>
    </BrowserRouter>
  );
}
