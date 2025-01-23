import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, method = 'GET', body = null, config = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController(); // To abort the request
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const jwtToken = localStorage.getItem('jwt');
                const headers = {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json', // Default Content-Type
                    ...config.headers, // Allow overriding headers
                };

                const response = await axios({
                    url,
                    method,
                    headers,
                    data: body,
                    signal: controller.signal, // Attach AbortController signal
                });

                setData(response.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled:', err.message);
                } else {
                    setError(err.response?.data?.message || err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort(); // Cancel the request on cleanup
        };
    }, [url, method, body, config]);

    return { data, loading, error };
};

export default useFetch;
