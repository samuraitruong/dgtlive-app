"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';

interface AuthContextType {
    loading?: boolean
    user: any; // Replace `any` with your user type
    verifyToken: (token: string) => void;
    setUser: React.Dispatch<React.SetStateAction<any>> | null;
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: null, verifyToken: () => { }, loading: true, logout: () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null)

    }
    const verifyToken = (token: string) => {
        fetch(`${API_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Unauthorized')
                }
                return res.json()
            })
            .then(data => {
                setLoading(false)
                setUser({ ...data, token })
            })
            .catch(e => {
                setLoading(false)
                setUser(null);
            })
    }

    useEffect(() => {
        // Add logic to check if the user is authenticated
        // For example, check if a token exists in localStorage or check a session
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data with the token
            verifyToken(token)
        } else {
            // router.push('/login');
            setUser(null)
            setLoading(false);
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, setUser, verifyToken, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
