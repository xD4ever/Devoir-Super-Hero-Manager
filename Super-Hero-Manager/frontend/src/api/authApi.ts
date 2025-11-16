import axios from 'axios';

const API_URL = '/api/auth';

export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
