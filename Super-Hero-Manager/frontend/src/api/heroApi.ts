import axios from 'axios';
import { Hero } from '../types/Hero';

const API_URL = '/api/heroes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHeroes = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const getHeroById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const createHero = async (hero: Omit<Hero, '_id'>) => {
  const response = await axios.post(API_URL, hero, { headers: getAuthHeaders() });
  return response.data;
};

export const updateHero = async (id: string, hero: Partial<Hero>) => {
  const response = await axios.put(`${API_URL}/${id}`, hero, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteHero = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
