import { useNavigate } from 'react-router-dom';
import constants from '../const';
const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      const response = await fetch(`${constants.API.BASE_URL}/user/logout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
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

  return logout;
};

export default useLogout;
