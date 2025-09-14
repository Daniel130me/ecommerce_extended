import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token'); // note that token is stored in localStorage here. note that
  const user = JSON.parse(localStorage.getItem('user')); // user is stored in localStorage here

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;