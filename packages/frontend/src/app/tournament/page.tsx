"use client";
import Loading from "@/components/Loading";
import { API_URL } from "@/config";
import usePublicData from "@/hooks/usePublicData";
import Link from "next/link";

export default function TournamentList() {
    const { data, loading, error, refetch } = usePublicData(API_URL);


    if (loading) return <Loading />
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="mx-auto p-10 bg-gray-400 shadow-lg min-h-screen">
            <div className="flex justify-between">

                <h1 className="text-2xl font-bold mb-4 text-center">Tournament list</h1>

                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>
            <ul className="divide-y divide-gray-200 mt-5">
                {data.map((item) => (
                    <li key={item.slug} className="p-4 hover:text-bold">
                        <Link href={'/tournament/' + item.slug}>
                            <div className="flex justify-between items-center">
                                <span className="font-large text-lg">{item.name}</span>
                                <span className="text-gray-200">{item.slug}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    );
}