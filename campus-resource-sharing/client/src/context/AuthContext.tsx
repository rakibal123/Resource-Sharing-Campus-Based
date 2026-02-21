'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { fetchProfile } from '@/lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    department?: string;
    profileImage?: string;
    status?: string;
    rating?: number;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (token && storedUser && storedUser !== 'undefined') {
                try {
                    // Start with stored user to avoid flicker
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Fetch fresh profile from server
                    const freshUser = await fetchProfile();
                    if (freshUser) {
                        const userWithToken = { ...freshUser, token };
                        setUser(userWithToken);
                        localStorage.setItem('user', JSON.stringify(userWithToken));
                    }
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    // If fetching fails, we keep the stored user for offline mode/persistence,
                    // unless it was a 401 which is handled by interceptors.
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
