import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import AddHero from './pages/AddHero';
import EditHero from './pages/EditHero';
import HeroDetails from './pages/HeroDetails';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/add-hero"
          element={
            <ProtectedRoute>
              <AddHero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-hero/:id"
          element={
            <ProtectedRoute>
              <EditHero />
            </ProtectedRoute>
          }
        />
        <Route path="/hero/:id" element={<HeroDetails />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
