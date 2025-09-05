import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import TasksPage from '../pages/TasksPage';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Router configuration with public and private routes. */
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          {/* Default authenticated landing -> /tasks */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/app" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Route>

        {/* Fallback: if route not found, send to tasks if authed else login via PrivateRoute */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
