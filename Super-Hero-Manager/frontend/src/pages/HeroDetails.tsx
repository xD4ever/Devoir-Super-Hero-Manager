import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Chip, Paper } from '@mui/material';
import { getHeroById, deleteHero } from '../api/heroApi';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Hero } from '../types/Hero';
import { useAuth } from '../hooks/useAuth';

const HeroDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
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

    const handleDelete = async () => {
        if (id && window.confirm('Are you sure you want to delete this hero?')) {
            try {
                await deleteHero(id);
                navigate('/');
            } catch (error) {
                console.error('Error deleting hero:', error);
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

    let imageUrl = 'https://via.placeholder.com/600x400';
    if (hero.image) {
        if (hero.image.startsWith('http')) {
            imageUrl = hero.image;
        } else {
            let cleanPath = hero.image.startsWith('/') ? hero.image.substring(1) : hero.image;
            
            if (cleanPath.match(/^(md|sm|xs|lg)\//)) {
                cleanPath = `uploads/images/${cleanPath}`;
            } else if (!cleanPath.startsWith('uploads/')) {
                cleanPath = `uploads/${cleanPath}`;
            }

            imageUrl = `http://localhost:5001/${cleanPath.replace(/\\/g, '/')}`;
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <img src={imageUrl} alt={hero.nom} style={{ width: '100%', borderRadius: '8px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" component="h1" gutterBottom>
                            {hero.nom}
                        </Typography>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {hero.alias}
                        </Typography>
                        <Chip label={hero.univers} color={hero.univers === 'Marvel' ? 'error' : hero.univers === 'DC' ? 'primary' : 'default'} sx={{ mb: 2 }} />
                        
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Powers</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {hero.pouvoirs.map((power, index) => (
                                <Chip key={index} label={power} variant="outlined" />
                            ))}
                        </Box>

                        <Typography variant="body1" paragraph>
                            {hero.description}
                        </Typography>

                        {hero.origine && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Origin:</strong> {hero.origine}
                            </Typography>
                        )}
                        {hero.premiereApparition && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>First Appearance:</strong> {new Date(hero.premiereApparition).toLocaleDateString()}
                            </Typography>
                        )}

                        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                            {(user?.role === 'admin' || user?.role === 'editor') && (
                                <Button variant="contained" component={RouterLink} to={`/edit-hero/${hero._id}`}>
                                    Edit
                                </Button>
                            )}
                            {user?.role === 'admin' && (
                                <Button variant="outlined" color="error" onClick={handleDelete}>
                                    Delete
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default HeroDetails;
