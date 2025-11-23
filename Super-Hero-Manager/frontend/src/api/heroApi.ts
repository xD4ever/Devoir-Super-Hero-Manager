import axios from 'axios';
import { Hero } from '../types/Hero';
import { resolveApiUrl } from '../config';

const API_URL = resolveApiUrl('/api/hero');

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHeroes = async (): Promise<Hero[]> => {
  const res = await axios.get<Hero[]>(API_URL);
  return res.data;
};

export const getHeroById = async (id: string): Promise<Hero> => {
  const res = await axios.get<Hero>(`${API_URL}/${id}`);
  return res.data;
};

export const createHero = async (formData: FormData): Promise<Hero> => {
  const res = await axios.post<Hero>(API_URL, formData, {
    headers: {
      ...authHeaders(),
      // let Axios set proper multipart boundary; do not set Content-Type manually
    },
  });
  return res.data;
};

export const updateHero = async (
  id: string,
  formData: FormData,
): Promise<Hero> => {
  const res = await axios.put<Hero>(`${API_URL}/${id}`, formData, {
    headers: {
      ...authHeaders(),
    },
  });
  return res.data;
};

export const deleteHero = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });
};
