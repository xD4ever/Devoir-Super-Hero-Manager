import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, SelectChangeEvent } from '@mui/material';
import { getAllHeroes, deleteHero } from '../api/heroApi';
import { Hero } from '../types/Hero';
import HeroCard from '../components/HeroCard';
import SearchBar from '../components/SearchBar';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUnivers, setFilterUnivers] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchHeroes();
    }, []);

    useEffect(() => {
        let result = heroes;

        if (searchTerm) {
            result = result.filter(hero =>
                hero.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hero.alias.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterUnivers) {
            result = result.filter(hero => hero.univers === filterUnivers);
        }

        setFilteredHeroes(result);
    }, [searchTerm, filterUnivers, heroes]);

    const fetchHeroes = async () => {
        try {
            const response = await getAllHeroes();
            setHeroes(response.data);
            setFilteredHeroes(response.data);
        } catch (error) {
            console.error('Error fetching heroes:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this hero?')) {
            try {
                await deleteHero(id);
                fetchHeroes();
            } catch (error) {
                console.error('Error deleting hero:', error);
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterUnivers(event.target.value as string);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Dashboard
                </Typography>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                    <Button variant="contained" component={RouterLink} to="/add-hero">
                        Add Hero
                    </Button>
                )}
            </Box>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterUnivers={filterUnivers}
                onFilterChange={handleFilterChange}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {filteredHeroes.map((hero) => (
                    <Box key={hero._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.33% - 24px)' } }}>
                        <HeroCard hero={hero} onDelete={handleDelete} />
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default Dashboard;
