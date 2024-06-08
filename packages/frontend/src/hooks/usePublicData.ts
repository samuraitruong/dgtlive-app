import { useState, useEffect } from 'react';

// Define the structure of the data you're fetching
interface PublicData {
    name: string;
    slug: string;
}

const usePublicData = (apiUrl: string) => {
    const [data, setData] = useState<PublicData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from the public API
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl + "/api/public");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: PublicData[] = await response.json();
            setData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Prefetch data on load
    useEffect(() => {
        fetchData();
    }, [apiUrl]);

    return { data, loading, error, refetch: fetchData };
};

export default usePublicData;
