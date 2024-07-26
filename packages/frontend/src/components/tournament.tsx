'use client'

import { useWebSocket } from '@/hooks/useWebSocket';
import consrtants from '@/model/consrtants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Schedule from './Schedule';
import GameViewer from './GameViewer';
import { GameEventResponse, Pair } from 'library';
import Loading from './Loading';
import { MultipleGameViewer } from './MultipleGameViewer';
import { BACKEND_URL } from '@/config';
import { useRouter, useParams } from 'next/navigation';

interface TournamentProps {
    category: string
}
export default function Tournament({ category = 'junior' }: TournamentProps) {
    const pathParmas = useParams<{ slug: string }>();
    const [socketUrl, setSocketUrl] = useState(BACKEND_URL);
    const socketPath = useMemo(() => {
        if (pathParmas.slug && pathParmas.slug !== category) {
            return "/" + pathParmas.slug
        }
        return category
    }, [category, pathParmas]);

    console.log("pathParmas", pathParmas, socketPath)
    const { sendMessage, readyState, tournament, games, loading } = useWebSocket(socketUrl, socketPath)
    const [multipleGameId, setMultipleGameIds] = useState<string[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>();
    const [selectedRound, setSelectedRound] = useState<number>(0);
    const [selectedPair, setSelectedPair] = useState<Pair>();
    const onSelectGame = useCallback((round: number, game: number) => {

        if (game === -1) {
            setSelectedGame(undefined)
            const roundPairs = tournament?.rounds[round - 1];
            var gamesPairs = roundPairs?.pairs.map((x, i) => {
                sendMessage(consrtants.EventNames.Game, { round, game: i + 1 })
                return `${round}_${i + 1}`
            })
            setMultipleGameIds(gamesPairs as any);
            return;
        }
        setMultipleGameIds([])
        sendMessage(consrtants.EventNames.Game, { round, game })
        setSelectedGame(`${round}_${game}`)
        const pair = tournament?.rounds[round - 1].pairs[game - 1]
        setSelectedPair(pair)
        setSelectedRound(round)
    }, [sendMessage, tournament?.rounds]);

    useEffect(() => {

        if (readyState && !tournament) {
            sendMessage(consrtants.EventNames.Hello, {})
        }
    }, [readyState, sendMessage, tournament]);


    useEffect(() => {

        if (!selectedGame && multipleGameId.length == 0) {
            const p = tournament?.rounds.filter(x => x.pairs.length > 0).pop();
            if (p) {
                onSelectGame((p?.index || 0) + 1, -1)
                setSelectedRound((p.index || 0) + 1)
            }
        }
    }, [tournament, multipleGameId?.length, onSelectGame, selectedGame]);

    const handleMiniGameClick = (g: GameEventResponse) => {
        const { round, game } = g;
        onSelectGame(round, game)
    }

    const isStarted = useMemo(() => {
        if (!tournament) {
            return false;
        }
        return tournament.rounds.flatMap(x => x.pairs).length > 0;
    }, [tournament]);


    console.log(tournament)
    if (!readyState || !tournament || loading) {
        return <Loading />
    }

    return (
        <div className="mx-auto mt-0 w-full">
            <div className='pt-2 pb-2 bg-slate-800 text-white'>
                <h1 className="text-3xl font-boldbg-black-50 text-center">{tournament?.name}</h1>

            </div>

            {isStarted ? <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
                <div className="md:col-span-3 pl-2">
                    {tournament && <Schedule data={tournament.rounds} onSelect={onSelectGame} selectedRound={selectedRound} />}
                </div>
                <div className="md:col-span-9 xs:col-span-12">
                    {games && multipleGameId && <MultipleGameViewer games={games} gameIds={multipleGameId} title={tournament.name} onClick={handleMiniGameClick} />}
                    {games && selectedGame && games[selectedGame] && <GameViewer tournamentName={tournament.name} data={games[selectedGame]} pair={selectedPair as Pair} />}
                </div>
            </div> : <div className='m-10 text-center p-12 border-solid bg-yellow-200 text-lg  rounded-sm'>This tournament has not started yet. Please come back later.</div>
            }


        </div>
    )
}