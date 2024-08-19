import { useAuth } from '@/auth/authContext';
import { useState, useEffect, useCallback } from 'react';

export interface SponsorData {
    _id: string;
    name: string;
    logoUrl: string;
    website: string;
    tournament: string;
    tournaments?: string[];
    isActive: boolean;
    description?: string;
}

interface UseSponsorDataHook {
    data: SponsorData[];
    isLoading: boolean;
    error: string | undefined;
    addItem: (item: SponsorData) => Promise<void>;
    updateItem: (item: SponsorData) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    loadData: () => void;
}

const useSponsorData = (url: string): UseSponsorDataHook => {
    const [data, setData] = useState<SponsorData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const { user } = useAuth();

    // Fetch sponsor data from API
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}/api/sponsors`, {
                headers: {
                    authorization: 'Bearer ' + user.token
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch sponsor data');
            }
            const result = await response.json();
            for (const item of result) {
                item.tournament = item.tournaments?.join(', ')
            }
            setData(result);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [url, user.token]);

    // Add sponsor item
    const addItem = useCallback(async (item: SponsorData) => {
        setIsLoading(true);
        setError(undefined);
        const updateUrl = `${url}/api/sponsors`;
        const res = await fetch(updateUrl, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...item, tournaments: item.tournament.split(','), tournament: undefined }),
        });
        setIsLoading(false);
        if (res.ok) {
            loadData();
        } else {
            console.log(await res.json());
            setError('Unable to create sponsor data');
        }
    }, [loadData, url, user.token]);

    // Update sponsor item
    const updateItem = useCallback(async (item: SponsorData) => {
        setIsLoading(true);
        setError(undefined);
        const updateUrl = `${url}/api/sponsors/${item._id}`;
        const res = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ ...item, tournaments: item.tournament.split(','), tournament: undefined }),
        });
        setIsLoading(false);
        if (res.ok) {
            loadData();
        } else {
            setError('Unable to update sponsor data');
        }
    }, [loadData, url, user.token]);

    // Delete sponsor item
    const deleteItem = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(undefined);
        const updateUrl = `${url}/api/sponsors/${id}`;
        const res = await fetch(updateUrl, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
        });
        setIsLoading(false);
        if (res.ok) {
            loadData();
        } else {
            setError('Unable to delete sponsor data');
        }
    }, [loadData, url, user.token]);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            await loadData();
        };

        fetchData();
    }, [url, user, loadData]);

    return {
        data,
        isLoading,
        error,
        addItem,
        updateItem,
        deleteItem,
        loadData,
    };
};

export default useSponsorData;
