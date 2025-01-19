import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import constants from '../const';

const useLogout = () => {
  const [isTabClosing, setIsTabClosing] = useState(false); // Track if tab is closing

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const payload = JSON.stringify({ user_id: userId });

      // Use `fetch` for manual logout
      const response = await fetch(`${constants.API.BASE_URL}/user/logout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Logout failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        alert('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleTabClose = (event) => {
    if (!isTabClosing) {
      // Set the state to true to track that the tab is about to close
      setIsTabClosing(true);
      // Show the confirmation modal for tab close
      event.preventDefault();
      event.returnValue = ''; // Standard for most browsers

      // Here we just stop the logout. No need to actually log out until confirmed
    }
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener('beforeunload', handleTabClose);

    // If user confirms closing (Leave), then call logout
    const onConfirmClose = () => {
      if (isTabClosing) {
        logout(); // Call logout when user confirms leave
      }
    };

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      onConfirmClose();
    };
  }, [isTabClosing]); // Re-run when isTabClosing state changes

  return logout;
};

export default useLogout;
