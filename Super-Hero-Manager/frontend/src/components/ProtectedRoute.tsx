import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly) {
    const decodedToken: { role: string } = jwtDecode(token!);
    if (decodedToken.role !== 'admin') {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
