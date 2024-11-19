
import React, {useState, useEffect } from 'react';
import axios from 'axios';


const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      
    useEffect(() => {
      const loadTeams = async () => {
        setLoading(true);
        try {
          const jwtToken = sessionStorage.getItem('jwt');
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });
  
          setData(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      loadTeams();
    }, [url]);
  
    return { data, loading, error };
  };
  
export default useFetch
