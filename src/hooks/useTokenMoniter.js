import { useState, useEffect } from 'react';
import parseJwt from '../utils/tokenUtils';

const useTokenMonitor = (logout) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;

        // Only show modal if token is expired and no tab close modal is open
        if (decodedToken.exp < currentTime) {
          setShowModal(true);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []); // Dependency on isTabClosing to avoid session modal during tab close

  return { showModal, setShowModal };
};

export default useTokenMonitor;
