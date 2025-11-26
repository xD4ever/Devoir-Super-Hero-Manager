import axiosInstance from './axiosInstance';
import { CreateHeroData } from '../types/Hero';

export const getAllHeroes = async () => {
    return axiosInstance.get('/hero/');
};

export const getHeroById = async (id: string) => {
    return axiosInstance.get(`/hero/${id}`);
};

export const createHero = async (data: CreateHeroData) => {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('alias', data.alias);
    formData.append('univers', data.univers);
    data.pouvoirs.forEach((pouvoir) => formData.append('pouvoirs[]', pouvoir)); // Handle array
    if (data.description) formData.append('description', data.description);
    if (data.origine) formData.append('origine', data.origine);
    if (data.premiereApparition) formData.append('premiereApparition', data.premiereApparition);
    if (data.image) formData.append('image', data.image);

    return axiosInstance.post('/hero/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateHero = async (id: string, data: CreateHeroData) => {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('alias', data.alias);
    formData.append('univers', data.univers);
    data.pouvoirs.forEach((pouvoir) => formData.append('pouvoirs[]', pouvoir));
    if (data.description) formData.append('description', data.description);
    if (data.origine) formData.append('origine', data.origine);
    if (data.premiereApparition) formData.append('premiereApparition', data.premiereApparition);
    if (data.image) formData.append('image', data.image);

    return axiosInstance.put(`/hero/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteHero = async (id: string) => {
    return axiosInstance.delete(`/hero/${id}`);
};

export default axiosInstance;
