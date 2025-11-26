import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Box } from '@mui/material';
import { Hero } from '../types/Hero';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface HeroCardProps {
    hero: Hero;
    onDelete: (id: string) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onDelete }) => {
    const { user } = useAuth();
    
    let imageUrl = 'https://via.placeholder.com/300';
    if (hero.image) {
        if (hero.image.startsWith('http')) {
            imageUrl = hero.image;
        } else {
            // Ensure we don't double slash if hero.image starts with /
            let cleanPath = hero.image.startsWith('/') ? hero.image.substring(1) : hero.image;
            
            // Handle legacy seed data paths (md/, sm/, etc.) which are in uploads/images/
            if (cleanPath.match(/^(md|sm|xs|lg)\//)) {
                cleanPath = `uploads/images/${cleanPath}`;
            } else if (!cleanPath.startsWith('uploads/')) {
                cleanPath = `uploads/${cleanPath}`;
            }

            imageUrl = `http://localhost:5001/${cleanPath.replace(/\\/g, '/')}`;
        }
    }

    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={hero.nom}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {hero.nom}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {hero.alias}
                </Typography>
                <Chip label={hero.univers} color={hero.univers === 'Marvel' ? 'error' : hero.univers === 'DC' ? 'primary' : 'default'} size="small" sx={{ mt: 1 }} />
                <Box sx={{ mt: 1 }}>
                    {hero.pouvoirs.slice(0, 3).map((pouvoir, index) => (
                        <Chip key={index} label={pouvoir} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                    {hero.pouvoirs.length > 3 && <Typography variant="caption">+{hero.pouvoirs.length - 3} more</Typography>}
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" component={RouterLink} to={`/hero/${hero._id}`}>Learn More</Button>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                    <Button size="small" component={RouterLink} to={`/edit-hero/${hero._id}`}>Edit</Button>
                )}
                {user?.role === 'admin' && (
                    <Button size="small" color="error" onClick={() => onDelete(hero._id)}>Delete</Button>
                )}
            </CardActions>
        </Card>
    );
};

export default HeroCard;
