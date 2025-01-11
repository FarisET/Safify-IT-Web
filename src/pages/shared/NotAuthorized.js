import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-lg mb-8">You are not authorized to access this page</p>
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Go to Login
      </button>
    </div>
  );
};



export default NotAuthorized;