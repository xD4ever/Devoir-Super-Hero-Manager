import axios from 'axios';
import { User } from '../types/User';
import { resolveApiUrl } from '../config';

const API_URL = resolveApiUrl('/api/auth');

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, payload, {
    withCredentials: true,
  });

  return res.data;
};

export const signup = async (payload: {
  username: string;
  password: string;
  role?: 'admin' | 'editor' | 'user';
}) => {
  const res = await axios.post<User>(`${API_URL}/signup`, payload, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

export const updateProfile = async (payload: {
  username?: string;
  password?: string;
}) => {
  const res = await axios.put<User>(`${API_URL}/update-profile`, payload, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
};

export const checkAuth = async (): Promise<{ user: User }> => {
  const res = await axios.get<{ message: string; user: User }>(
    `${API_URL}/check`,
    {
      headers: authHeaders(),
      withCredentials: true,
    },
  );
  return { user: res.data.user };
};

export const logout = async () => {
  try {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: authHeaders(),
        withCredentials: true,
      },
    );
  } finally {
    // local cleanup is handled by AuthContext.logout
  }
};
