'use client';
import withAuth from '@/auth/withAuth';
import Loading from '@/components/Loading';
import React, { useState } from 'react';
import PlayerModal from './PlayerModal';
import type { FidePlayer, Player } from 'library';
import { useFidePlayers } from '@/hooks/useFidePlayers';
import { MdDeleteForever } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";

function FidePlayersPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchInput, setSearchInput] = useState('');
    const [searchName, setSearchName] = useState('');

    const [selectedPlayer, setSelectedPlayer] = useState<FidePlayer>()

    const { data, total, loading, error, updatePlayerWith, fetchData, deletePlayer, syncPlayer } = useFidePlayers({
        page,
        limit,
        sortField,
        sortOrder,
        searchName,

    });

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleSearch = () => {
        setSearchName(searchInput);
        setPage(1); // Reset to first page when searching
        fetchData();
    };
    const handleSave = (id: string) => {
        console.log(id, selectedPlayer)
        if (selectedPlayer && (selectedPlayer as any)._id) {
            updatePlayerWith((selectedPlayer as any)._id, { id })
        }
    }

    const handleDeleteClick = async (id: string) => {
        await deletePlayer(id)
        fetchData();
    }

    const handleSyncClick = async (playerId: string) => {
        await syncPlayer(playerId)
        fetchData();
    }

    const totalPages = Math.ceil(total / limit);

    if (loading) return <Loading />
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">FIDE Players</h1>

            <div className="mb-4 flex">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by name"
                    className="border p-2 rounded-l w-64 text-slate-800"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r"
                >
                    Search
                </button>
            </div>

            {error ? (
                <p className='text-red p-10 border border-red-400'>{error}</p>
            ) : (
                <>
                    <table className="min-w-full border-collapse bg-white">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort('id')}
                                    className="cursor-pointer px-4 py-2 border"
                                >
                                    Id
                                </th>

                                <th
                                    onClick={() => handleSort('name')}
                                    className="cursor-pointer px-4 py-2 border"
                                >
                                    Name
                                </th>
                                <th
                                    onClick={() => handleSort('fideTitle')}
                                    className="cursor-pointer px-4 py-2 border"
                                >
                                    FIDE Title
                                </th>

                                <th
                                    onClick={() => handleSort('birthYear')}
                                    className="cursor-pointer px-4 py-2 border"
                                >
                                    Birth Year
                                </th>
                                <th
                                    onClick={() => handleSort('lastRatingUpdate')}
                                    className="cursor-pointer px-4 py-2 border"
                                >
                                    Ratings

                                    <div className='flex w-full justify-between'>
                                        <span> std</span>
                                        <span>rapid </span>
                                        <span> blitz</span>
                                    </div>

                                </th>
                                <th className='cursor-pointer px-4 py-2 border text-center'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((player) => (
                                <tr key={player.id}>
                                    <td className="border px-4 py-2">

                                        {player.id && <a href={"https://ratings.fide.com/profile/" + player.id} target='_blank'>{player.id}</a>}

                                    </td>
                                    <td className="border px-4 py-2">{player.name}</td>
                                    <td className="border px-4 py-2">{player.title}</td>
                                    <td className="border px-4 py-2">{player.birthYear}</td>
                                    <td className="border px-4 py-2">
                                        <div className='flex w-full justify-between'>
                                            <span> {player.ratings?.std} </span>
                                            <span> {player.ratings?.rapid} </span>
                                            <span> {player.ratings?.blitz} </span>
                                        </div>

                                    </td>
                                    <td className='border px-4 py-2 flex justify-arround space-x-2 align-middle'>
                                        <button className='z-50 px-2 py-1 rounded-sm bg-red-500 text-white text-sm' onClick={() => handleDeleteClick(player._id)} >
                                            <MdDeleteForever className='inline' /> Delete
                                        </button>

                                        <button className='z-50 px-2 py-1 rounded-sm bg-green-500 text-white text-sm' onClick={() => setSelectedPlayer(player as any)} >
                                            <CiEdit className='inline' /> Edit
                                        </button>

                                        <button className='z-50 px-2 py-1 rounded-sm bg-blue-500 text-white text-sm' onClick={() => handleSyncClick(player._id)} >
                                            <RxUpdate className='inline' /> Update
                                        </button>


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-between items-cente r">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )
            }
            {selectedPlayer && <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(undefined)} onSave={handleSave} />}
        </div >
    );
};

export default withAuth(FidePlayersPage);