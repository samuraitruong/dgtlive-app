// src/hooks/useFidePlayers.ts

import { useState, useEffect, useCallback } from 'react';
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
    updatePlayerWith: (id: string, player: Partial<FidePlayer>) => Promise<void>;
    fetchData: () => void
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

    const updatePlayerWith = useCallback(async (id: string, data: Partial<FidePlayer>) => {
        setLoading(true);
        setError('')
        const response = await fetch(
            `${API_URL}/api/player/${id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.token}`
                }
            }
        );
        setLoading(false);
        if (!response.ok) {

            setError('Unable to update user')
        }

    }, [
        user
    ])

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_URL}/api/player?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&searchName=${searchName}`,
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

    }, [user.token, searchName])

    useEffect(() => {

        fetchData();
    }, [page, limit, sortField, sortOrder, searchName]);

    return { data, total, loading, error, updatePlayerWith, fetchData };
};
