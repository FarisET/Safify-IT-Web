import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, allowAll = false }) => {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('role');

    if (!jwtToken || !role) {
      setRedirect(true);
    } else {
      setUserRole(role);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (redirect || !userRole) {
    return <Navigate to="/login" />;
  }

  // Allow all roles for shared pages
  if (allowAll) {
    return <>{children}</>;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
