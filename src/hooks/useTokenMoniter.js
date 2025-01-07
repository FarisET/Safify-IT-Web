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

        if (decodedToken.exp < currentTime) {
          setShowModal(true);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { showModal, setShowModal };
};

export default useTokenMonitor;
