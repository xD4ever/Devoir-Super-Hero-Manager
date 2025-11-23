import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { User } from '../types/User';
import { checkAuth, logout as apiLogout } from '../api/authApi';

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    setIsAuthLoading(true);
    try {
      const { user: me } = await checkAuth();
      setUser(me);
    } catch {
      // token invalid => clean everything
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // backend logout failing is not a reason to keep a dead token
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
