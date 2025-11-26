import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import HeroDetails from './pages/HeroDetails';
import AddHero from './pages/AddHero';
import EditHero from './pages/EditHero';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';

const App: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/hero/:id" element={<HeroDetails />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['admin', 'editor']} />}>
                        <Route path="/add-hero" element={<AddHero />} />
                        <Route path="/edit-hero/:id" element={<EditHero />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['admin']} />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                </Routes>
            </Box>
        </Box>
    );
};

export default App;
