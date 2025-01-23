import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SafifyIcon } from '../../assets/images/safify_it_icon.svg';
import { getTabsFromLocalStorage, saveTabsToLocalStorage } from '../../utils/tabUtils'
import constants from '../../const';
const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retrying,setRetrying] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || retrying) return;
    setLoading(true);
    setError('');


    try {
      const deviceToken = "webapp";

      const response = await axios.post(`${constants.API.BASE_URL}/user/login`, {
        user_id: userId,
        user_pass: password,
        device_token: deviceToken
      },
        {
          headers: {
            'x-clientType': 'webapp',
          },
        }
      );

      const { status, token, error: responseError } = response.data;

      if (response.status === 200 && token) {
        const decodedToken = parseJwt(token);
        const role = decodedToken.role_name;
        const userName = decodedToken.user_name;


        // Check if the role is not 'admin'
        if (role == null) {
          setError('You are not authorized');
          return; // Exit the function if not authorized
        }


        const currentTime = Date.now() / 1000;
        const timeToExpire = decodedToken.exp - currentTime;

        
        localStorage.setItem('jwt', token);
        localStorage.setItem('role', role);
        localStorage.setItem('deviceToken', deviceToken);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userId', userId);



        localStorage.setItem('jwtToken', token);
        localStorage.setItem('timeToExpire', timeToExpire);


        if (role == 'admin') {
          navigate('/tickets');
        } else if (role == 'user') {
          navigate('/my-tickets');

        } else if (role == 'action_team') {
          navigate('/my-tasks');

        } else {
          setError('You are not authorized');
        }


      }
      else if (response.status === 401) {
        setError("Incorrect credentials, please try again.");
      } else if (response.status === 500 && responseError) {
        handleServerError(responseError);
      }
    } catch (err) {
      if (err.response.data.error === "This Account is Already Logged in From Another Device") {
        setRetrying(true);
        await logoutUserAsync();
        await handleLogin(e);
        setRetrying(false);

      } 
      else if (err.response && err.response.data && err.response.data.error && err.response.data.error != "This Account is Already Logged in From Another Device") {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      if (!retrying) setLoading(false);
    }

  };



  const handleServerError = (errorMessage) => {

    if (errorMessage.includes("Authentication failed")) {
      setError("Authentication failed.");
    } else if (errorMessage.includes("Wrong Password")) {
      setError("Incorrect password.");
    } else if (errorMessage.includes("Incorrect User ID")) {
      setError("Incorrect username.");
    } else {
      setError(errorMessage);
    }
  };

  // Utility function to parse JWT token (simple version)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  };

  const logoutUserAsync = async () => {
    try {
      const response = await fetch(`${constants.API.BASE_URL}/user/logout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId || '' }), // Use entered userId if localStorage is not set
      });

      if (response.ok) {
        localStorage.clear();
        // ... rest of your logout logic (e.g., navigate to login)
      } else {
        const errorData = await response.json();
        setError.error("Logout failed:", errorData.message || 'Please try again.');
      }
    } catch (error) {
      setError.error("Logout error:", error);
      // Handle logout errors (optional: display error message to user)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg mx-4 sm:mx-6">
        <div
          className="flex flex-col items-center justify-center gap-3 w-full h-full cursor-pointer"
        >
          <SafifyIcon className="w-16 h-16" />
          <h1 className="text-lg lg:text-xl px-3 py-1 bg-sky-100 text-gray-700 font-semibold rounded text-center">
            SAFIFY IT Service Management
          </h1>
        </div>

        <h2 className="text-xl lg:text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your user ID"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-black p-2 rounded bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
