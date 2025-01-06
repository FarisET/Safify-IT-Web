import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import parseJwt from '../utils/tokenUtils'; // Adjust path as necessary

const ProtectedRoute = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false); // State to track if redirect is needed
  const location = useLocation(); // Hook to detect route changes

  // Sync token with localStorage and handle loading state
  useEffect(() => {
    setJwtToken(localStorage.getItem('jwtToken')); // Always sync token from localStorage
    setLoading(false); // End loading state once token is set
  }, []); // Run only once on initial mount

  // Use effect to handle token validation and redirection
  useEffect(() => {
    if (!jwtToken) return; // Don't check if there's no token

    try {
      const decodedToken = parseJwt(jwtToken);
      const currentTime = Date.now() / 1000;
      // Check if token is expired or invalid
      if (!decodedToken || decodedToken.exp < currentTime) {
        localStorage.removeItem('jwtToken');
        setRedirect(true); // Trigger the redirect state
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('jwtToken');
      setRedirect(true); // Trigger the redirect state
    }
  }, [jwtToken, location]); // Run the effect whenever `jwtToken` or `location` changes

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>; // Optional: show a loading indicator
  }

  if (redirect) {
    return <Navigate to="/login" />; // Redirect if the token is expired or invalid
  }

  if (!jwtToken) {
    return <Navigate to="/login" />; // Redirect if there's no token
  }

  return children;
};

export default ProtectedRoute;
