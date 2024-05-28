"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';

interface AuthContextType {
    loading?: boolean
    user: any; // Replace `any` with your user type
    verifyToken: (token: string) => void;
    setUser: React.Dispatch<React.SetStateAction<any>> | null; // Adjust the type accordingly
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: null, verifyToken: () => { }, loading: true });


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const verifyToken = (token: string) => {
        fetch(`${API_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setUser(data))
    }

    useEffect(() => {
        // Add logic to check if the user is authenticated
        // For example, check if a token exists in localStorage or check a session
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data with the token
            fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                    // Handle errors, for example, remove invalid token
                    localStorage.removeItem('token');
                    // router.push('/login');
                });
        } else {
            // router.push('/login');
            setLoading(false);
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, setUser, verifyToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
