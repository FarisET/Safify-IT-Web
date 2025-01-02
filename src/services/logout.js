// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const userId = sessionStorage.getItem('userId');
    const response = await fetch(`http://localhost:3001/user/logout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (response.ok) {
      sessionStorage.clear();
      navigate('/login');
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  return logout;
};

export default useLogout;
