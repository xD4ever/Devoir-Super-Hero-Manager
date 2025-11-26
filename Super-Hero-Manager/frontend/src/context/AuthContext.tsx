import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkAuth, login as loginApi, logout as logoutApi } from '../api/authApi';
import { User } from '../types/User';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await checkAuth();
                setUser(response.data);
            } catch (error) {
                console.log("Not authenticated");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (data: any) => {
        const response = await loginApi(data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        const userResponse = await checkAuth();
        setUser(userResponse.data);
    };

    const logout = async () => {
        await logoutApi();
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
