import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent re-execution if already loading
    setLoading(true);
    setError('');

    console.log('Login function triggered'); // Debugging log

    try {
      const deviceToken = "webapp";

      const response = await axios.post('http://localhost:3001/user/login', {
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
        if (role !== 'admin') {
          setError('You are not authorized');
          return; // Exit the function if not authorized
        }

        sessionStorage.setItem('jwt', token);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('deviceToken', deviceToken);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userId', userId);

        navigate('/incidents');
      } else if (response.status === 401) {
        setError("Incorrect credentials, please try again.");
      } else if (response.status === 500 && responseError) {
        handleServerError(responseError);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }

  };



  const handleServerError = (errorMessage) => {
    if (errorMessage.includes("Already logged in from another device")) {
      setError("Already logged in from another device.");
    } else if (errorMessage.includes("Authentication failed")) {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>

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
