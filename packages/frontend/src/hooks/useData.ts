import { useAuth } from '@/auth/authContext';
import { useState, useEffect, useCallback } from 'react';

export interface RowData {
    id: string;
    name: string;
    slug: string;
    liveChessId: string;
    delayMoves: number;
    delayTimes: number;
    isActive: boolean;
}

interface UseDataHook {
    data: RowData[];
    isLoading: boolean;
    error: string | undefined;
    addItem: (item: RowData) => Promise<void>;
    updateItem: (item: RowData) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    loadData: () => void;
}

const useData = (url: string): UseDataHook => {
    const [data, setData] = useState<RowData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const { user } = useAuth();
    // Fetch data from API

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
    }, [url, user.token]);

    // Add item
    const addItem = useCallback(async (item: RowData) => {
        setIsLoading(true)
        setError(undefined);
        const updateUrl = `${url}/api/data`
        const res = await fetch(updateUrl, { method: 'POST', headers: { authorization: `Bearer ${user.token}`, "Content-Type": "application/json", }, body: JSON.stringify(item) });
        setIsLoading(false)
        if (res.ok) {
            loadData();
        }
        else {
            console.log(await res.json())
            setError('Unable to create data')
        }
    }, [loadData, url, user.token]);



    // Update item
    const updateItem = useCallback(async (item: RowData) => {
        setIsLoading(true)
        setError(undefined);
        const updateUrl = `${url}/api/data/${item.id}`
        const res = await fetch(updateUrl, {
            method: 'PATCH', headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`
            }, body: JSON.stringify(item)
        });
        setIsLoading(false)
        if (res.ok) {
            loadData();
        }
        else {
            setError('Unable to update data')
        }
    }, [loadData, url, user.token]);

    // Delete item
    const deleteItem = useCallback(async (id: string) => {

        setIsLoading(true)
        setError(undefined);
        const updateUrl = `${url}/api/data/${id}`
        const res = await fetch(updateUrl, {
            method: 'DELETE', headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`
            }
        });
        setIsLoading(false)
        if (res.ok) {
            loadData();
        }
        else {
            setError('Unable to update data')
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
        loadData
    };
};

export default useData;
