import React, { useState, useCallback } from 'react';
import axios from 'axios';
import constants from '../../const';
export const useFetchTeams = () => {
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jwtToken = sessionStorage.getItem('jwt');
      const response = await axios.get(
          `${constants.API.BASE_URL}/admin/dashboard/fetchAllActionTeamsWithDepartments?department_id=D1`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setTeams(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { teams, fetchTeams, loading, error };
};
