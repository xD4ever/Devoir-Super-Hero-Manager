import axios from 'axios';

const API_URL = '/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Keep this for cookies if needed, or for CORS
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
