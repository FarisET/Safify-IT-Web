import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('jwt');
  if (!token) {
    // If no token exists, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child components (the protected page)
  return children;
};

export default ProtectedRoute;
