import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in localStorage

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;