import type { GameEventResponse, GameMap } from "library"
import { useEffect, useMemo, useRef, useState } from "react"
import Board from "./Board"
import SmallPlayerDisplay from './SmallPlayerDisplay'

interface MultipleGameViewerProps {
    games: GameMap,
    gameIds: string[]
}
function MiniBoard({ game }: { game: GameEventResponse }) {
    const [currentIndex, setCurrentIndex] = useState(game.moves.length - 1)
    const parentRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState(200);

    const time = useMemo(() => {
        const currentMove = game.moves[game.moves.length - 1];
        const previousMove = game.moves[game.moves.length - 2];
        if (game.moves.length % 2 === 0) {
            return { black: previousMove?.time || -1, white: currentMove?.time || 0 }
        }
        return { white: previousMove?.time || -1, black: currentMove?.time || 0 }
    }, [game])

    useEffect(() => {
        if (parentRef.current) {
            setParentWidth(parentRef.current.offsetWidth);
        }
    }, []);

    return (
        <div className="flex flex-col w-1/3 p-1" ref={parentRef}>
            <div className="pr-3">
                <SmallPlayerDisplay time={time} pair={game.pair} color="black" icon={false} /></div>
            <Board move={game.moves[currentIndex]} boardWidth={parentWidth - 20} ></Board>
            <div className="pr-3">
                <SmallPlayerDisplay icon={false} time={time} pair={game.pair} color="white" />
            </div>
        </div>

    )
}
export function MultipleGameViewer({ gameIds, games }: MultipleGameViewerProps) {

    const displayGames = useMemo(() => {
        return gameIds.map(x => games[x]).filter(Boolean)
    }, [games, gameIds])

    if (!games || gameIds.length == 0) {
        return <></>
    }

    return (

        <div className="flex flex-row w-full flex-wrap pt-10">
            {displayGames.map((game) => <MiniBoard game={game} key={game.game + game.round} />)}
        </div>
    )
}