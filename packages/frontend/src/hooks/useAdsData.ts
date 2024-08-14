import { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/config';

interface Ad {
    name: string;
    image: string;
    url: string;
}

const useAdsData = (tournamentName: string): { data: Ad[] } => {
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/public/ads/${tournamentName.split('/').pop()}`);
                if (response.ok) {
                    const data: Ad[] = await response.json();
                    setAds(data);
                } else {
                    console.error('Failed to fetch ads:', response.status, response.statusText);
                }
            } catch (err) {

            }
        };

        fetchAds();
    }, [tournamentName]);

    return { data: ads };
};

export default useAdsData;
