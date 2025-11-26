import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import HeroForm from '../components/HeroForm';
import { getHeroById, updateHero } from '../api/heroApi';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateHeroData, Hero } from '../types/Hero';

const EditHero: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hero, setHero] = useState<Hero | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHero = async () => {
            if (id) {
                try {
                    const response = await getHeroById(id);
                    setHero(response.data);
                } catch (error) {
                    console.error('Error fetching hero:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHero();
    }, [id]);

    const handleSubmit = async (values: CreateHeroData) => {
        if (id) {
            try {
                await updateHero(id, values);
                navigate('/');
            } catch (error) {
                console.error('Error updating hero:', error);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hero) {
        return <Typography>Hero not found</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Hero
                </Typography>
                <HeroForm initialValues={hero} onSubmit={handleSubmit} submitLabel="Update Hero" />
            </Box>
        </Container>
    );
};

export default EditHero;
