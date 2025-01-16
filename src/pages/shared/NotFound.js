import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    const previousPath = location.state?.from || '/';
    navigate(previousPath);
  };

  const goBackTwoSteps = () => {
    navigate(-2);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <button
         onClick={goBackTwoSteps}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-sky-600 transition-transform transform hover:scale-105"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
