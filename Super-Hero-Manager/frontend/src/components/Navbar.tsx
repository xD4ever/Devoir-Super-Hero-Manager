import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          SuperHeroManager
        </Link>
        <NavLink to="/" className="navbar__link">
          Héros
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin" className="navbar__link">
            Admin
          </NavLink>
        )}
      </div>
      <div className="navbar__right">
        {isAuthenticated ? (
          <>
            <span className="navbar__user">
              connecté en tant que <strong>{user?.username}</strong> (
              {user?.role})
            </span>
            <button type="button" className="btn ghost" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login" className="btn ghost">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
