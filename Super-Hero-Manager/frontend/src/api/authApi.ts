import axiosInstance from './axiosInstance';

export const login = async (data: any) => {
    return axiosInstance.post('/auth/login', data);
};

export const signup = async (data: any) => {
    return axiosInstance.post('/auth/signup', data);
};

export const logout = async () => {
    return axiosInstance.post('/auth/logout');
};

export const checkAuth = async () => {
    return axiosInstance.get('/auth/check');
};

export const getAllUsers = async () => {
    return axiosInstance.get('/auth/users');
};

export default axiosInstance;
