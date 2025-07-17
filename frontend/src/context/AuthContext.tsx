// src/context/AuthContext.tsx
'use client';

import {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import * as apiClient from '@/lib/apiClient';
import {User} from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    register: (userInfo: { username: string; email: string; password?: string }) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('pokeHubUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = async (credentials: { email: string; password?: string }) => {
        try {
            const userData = await apiClient.login(credentials);
            setUser(userData);
            sessionStorage.setItem('pokeHubUser', JSON.stringify(userData));
            router.push('/my-pokedex');
        } catch (error) {
            console.error(error);
            alert('Login Failed: Invalid credentials.');
        }
    };

    const handleRegister = async (userInfo: { username: string; email: string; password?: string }) => {
        try {
            const userData = await apiClient.register(userInfo);
            setUser(userData);
            sessionStorage.setItem('pokeHubUser', JSON.stringify(userData));
            router.push('/my-pokedex');
        } catch (error) {
            console.error(error);
            alert('Registration Failed.');
        }
    };

    const handleLogout = () => {
        apiClient.logout();
        setUser(null);
        sessionStorage.removeItem('pokeHubUser');
        router.push('/');
    };

    const value = {user, loading, login: handleLogin, register: handleRegister, logout: handleLogout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
