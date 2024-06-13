// src/hooks/useFidePlayers.ts

import { useState, useEffect } from 'react';
import { API_URL, BACKEND_URL } from '@/config';
import { useAuth } from '@/auth/authContext';

interface PlayerRating {
    std?: string;
    rapid?: string;
    blitz?: string;
}

interface FidePlayer {
    name: string;
    fideTitle?: string | null;
    title?: string | null;
    id?: string;
    table?: string;
    country?: string;
    federation?: string;
    gender?: string;
    rank?: string;
    birthYear?: string;
    errorCount?: number;
    ratings?: PlayerRating;
    lastRatingUpdate?: Date;
}

interface UseFidePlayersParams {
    page: number;
    limit: number;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    searchName: string;
}

interface UseFidePlayersResult {
    data: FidePlayer[];
    total: number;
    loading: boolean;
    error: string | null;
}

export const useFidePlayers = ({
    page,
    limit,
    sortField,
    sortOrder,
    searchName,
}: UseFidePlayersParams): UseFidePlayersResult => {
    const [data, setData] = useState<FidePlayer[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${API_URL}/api/players?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${encodeURIComponent(JSON.stringify({ name: searchName }))}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${user.token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const result = await response.json();

                setData(result.data);
                setTotal(result.total);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, limit, sortField, sortOrder, searchName]);

    return { data, total, loading, error };
};
