import { useAuth } from '@/auth/authContext';
import { useState, useEffect, useCallback } from 'react';

export interface RowData {
    id: string;
    name: string;
    slug: string;
    liveChessId: string;
    delayMoves: number;
    delayTimes: number;
}

interface UseDataHook {
    data: RowData[];
    isLoading: boolean;
    error: string | null;
    addItem: (item: RowData) => void;
    updateItem: (item: RowData) => void;
    deleteItem: (id: string) => void;
    loadData: () => void;
}

const useData = (url: string): UseDataHook => {
    const [data, setData] = useState<RowData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    // Fetch data from API
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            await loadData();
        };

        fetchData();
    }, [url, user]);

    // Add item
    const addItem = useCallback((item: RowData) => {
        setData((prevData) => [...prevData, item]);
    }, []);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}/api/data`, {
                headers: {
                    authorization: 'Bearer ' + user.token
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    // Update item
    const updateItem = useCallback(async (item: RowData) => {
        setIsLoading(true)
        console.log('update', item)
        const updateUrl = `${url}/api/data/${item.id}`
        const res = await fetch(updateUrl, { method: 'PUT', headers: { authorization: `Bearer ${user.token}` }, body: JSON.stringify(item) });
        setIsLoading(false)
        if (res.ok) {
            loadData();
        }
        else {
            setError('Unable to update data')
        }
    }, []);

    // Delete item
    const deleteItem = useCallback((id: string) => {
        setData((prevData) => prevData.filter((item) => item.id && item.id !== id));
    }, []);

    return {
        data,
        isLoading,
        error,
        addItem,
        updateItem,
        deleteItem,
        loadData
    };
};

export default useData;