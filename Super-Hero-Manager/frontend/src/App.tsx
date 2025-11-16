import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import HeroDetails from './pages/HeroDetails';
import AddHero from './pages/AddHero';
import EditHero from './pages/EditHero';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/hero/:id" element={<ProtectedRoute><HeroDetails /></ProtectedRoute>} />
        <Route path="/add-hero" element={<ProtectedRoute><AddHero /></ProtectedRoute>} />
        <Route path="/edit-hero/:id" element={<ProtectedRoute><EditHero /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
