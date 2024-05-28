import type { GameEventResponse, GameMap } from "library"
import { useEffect, useMemo, useRef, useState } from "react"
import Board from "./Board"

interface MultipleGameViewerProps {
    games: GameMap,
    gameIds: string[]
}
function MiniBoard({ game }: { game: GameEventResponse }) {
    const [currentIndex, setCurrentIndex] = useState(game.moves.length - 1)
    const parentRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState(200);

    useEffect(() => {
        if (parentRef.current) {
            setParentWidth(parentRef.current.offsetWidth);
        }
    }, []);

    return (
        <div className="flex flex-col w-1/3 p-1" ref={parentRef}>
            <div className="text-bold">{game.black}</div>
            <Board move={game.moves[currentIndex]} boardWidth={parentWidth - 20}></Board>
            <div className="text-bold">{game.white}</div>
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

        <div className="flex flex-row w-full flex-wrap">
            {displayGames.map((game) => <MiniBoard game={game} key={game.game + game.round} />)}
        </div>
    )
}