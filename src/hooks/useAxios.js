import axios from 'axios';
import { useMemo } from 'react';

const useAxios = () => {
  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL, // your backend base URL
    });

    // Attach token from localStorage
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  return axiosSecure;
};

export default useAxios;
