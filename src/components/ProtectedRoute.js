import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import parseJwt from '../utils/tokenUtils'; // Adjust path as necessary
import Modal from './SessionModal'; //
import useLogout from '../services/logout';
import useTokenMonitor from '../hooks/useTokenMoniter';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false); // State to track if redirect is needed
  const [jwtToken, setjwtToken] = useState(localStorage.getItem('jwtToken'));
  const location = useLocation();




  useEffect(() => {
    setLoading(false);
    if (!jwtToken) {
      setRedirect(true);
    }
  }, []);




  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
      </div>

    </div>; // Optional: show a loading indicator
  }

  if (redirect) {
    return <Navigate to="/login" />; // Redirect if the token is expired or invalid
  }

  return (
    <>
      {children}
    </>
  );
};


export default ProtectedRoute;