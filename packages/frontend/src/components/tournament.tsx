'use client'

import { useWebSocket } from '@/hooks/useWebSocket';
import consrtants from '@/model/consrtants';
import { useEffect, useState } from 'react';
import Schedule from './Schedule';
import GameViewer from './GameViewer';
import { Pair } from 'library';
import Loading from './Loading';

interface TournamentProps {
    category: string
}
export default function Tournament({ category = 'junior' }: TournamentProps) {
    const [socketUrl, setSocketUrl] = useState(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
    const { sendMessage, lastMessage, readyState, tournament, games, loading } = useWebSocket(socketUrl, category)
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

    const [selectedGame, setSelectedGame] = useState<string>();

    const [selectedPair, setSelectedPair] = useState<Pair>();

    const onSelectGame = (round: number, game: number) => {
        sendMessage('game', { round, game })
        setSelectedGame(`${round}_${game}`)
        const pair = tournament?.rounds[round - 1].pairs[game - 1]
        setSelectedPair(pair)
    }
    useEffect(() => {
        if (lastMessage) {
            setMessageHistory((prev) => prev.concat(lastMessage as any));
        }
        else {
            if (readyState) {
                sendMessage(consrtants.EventNames.Hello, {})
            }
        }
    }, [lastMessage, readyState]);

    useEffect(() => {

    }, [games])

    if (!readyState || !tournament || loading) {
        return <Loading />
    }
    return (
        <div className="mx-auto mt-0 w-full">
            <div className='pt-2 pb-2 bg-slate-800 text-white'>
                <h1 className="text-3xl font-boldbg-black-50 text-center">{tournament?.name}</h1>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
                <div className="md:col-span-3 pl-2">
                    {tournament && <Schedule data={tournament.rounds} onSelect={onSelectGame} />}
                </div>
                <div className="md:col-span-9">
                    {games && selectedGame && games[selectedGame] && <GameViewer data={games[selectedGame]} pair={selectedPair as Pair} />}
                </div>
            </div>

        </div>
    )
}