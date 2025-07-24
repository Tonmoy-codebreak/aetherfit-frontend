import axios from 'axios';
import { useMemo } from 'react';
import { useNavigate } from 'react-router'; 
import Swal from 'sweetalert2'; 

const useAxios = () => {
  const navigate = useNavigate(); // Get navigate hook

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL, // your backend base URL
     
    });

    // Request interceptor to attach token from localStorage
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt_token'); // MODIFIED: Use 'jwt_token' key
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

   
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            // Unauthorized: Token missing, invalid, or expired
            console.error("401 Unauthorized:", data.message || "Token missing or invalid.");
            localStorage.removeItem('jwt_token'); // Clear the invalid token
            Swal.fire({
                title: '<span style="color:#faba22">Session Expired / Unauthorized</span>',
                text: data.message || "Please log in again.",
                icon: "info",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            }).then(() => {
                navigate('/login'); // Redirect to login page
            });
          } else if (status === 403) {
            // Forbidden: Token valid, but user doesn't have required permissions
            console.error("403 Forbidden:", data.message || "Insufficient permissions.");
            Swal.fire({
                title: '<span style="color:#faba22">Access Denied</span>',
                text: data.message || "You do not have permission to perform this action.",
                icon: "warning",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            }).then(() => {
                navigate('/'); // Redirect to home or a less restricted page
            });
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [navigate]); // Add navigate to dependencies to ensure interceptor has access

  return axiosSecure;
};

export default useAxios;