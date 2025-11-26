import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import HeroForm from '../components/HeroForm';
import { createHero } from '../api/heroApi';
import { useNavigate } from 'react-router-dom';
import { CreateHeroData } from '../types/Hero';

const AddHero: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: CreateHeroData) => {
        try {
            await createHero(values);
            navigate('/');
        } catch (error) {
            console.error('Error creating hero:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add New Hero
                </Typography>
                <HeroForm onSubmit={handleSubmit} submitLabel="Create Hero" />
            </Box>
        </Container>
    );
};

export default AddHero;
