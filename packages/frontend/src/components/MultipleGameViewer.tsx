import type { GameEventResponse, GameMap } from "library"
import { useEffect, useMemo, useRef, useState } from "react"
import Board from "./Board"
import SmallPlayerDisplay from './SmallPlayerDisplay'
import { FaRegPlayCircle } from "react-icons/fa";
import { } from '@uidotdev/usehooks'
import { useFullscreen } from "@/hooks/useFullscreen";
import { FullscreenButton } from "./FullscreenButton";

interface MultipleGameViewerProps {
    games: GameMap,
    gameIds: string[],
    title: string;

    onClick: (t: GameEventResponse) => void
}

function MiniBoard({ game, onClick, result }: { game: GameEventResponse, gameCount: number, onClick: () => void, result: string }) {
    const [currentIndex, setCurrentIndex] = useState(game.moves.length - 1)
    const parentRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState(200);
    const [isHovered, setIsHovered] = useState(false);


    const time = useMemo(() => {
        const currentMove = game.moves[game.moves.length - 1];
        const previousMove = game.moves[game.moves.length - 2];
        if (game.moves.length % 2 === 1) {
            return { black: previousMove?.time || -1, white: currentMove?.time || 0 }
        }
        return { white: previousMove?.time || -1, black: currentMove?.time || 0 }
    }, [game])

    useEffect(() => {
        setCurrentIndex(game.moves.length - 1)
    }, [game])
    useEffect(() => {
        if (parentRef.current) {
            setParentWidth(parentRef.current.offsetWidth);
        }
    }, [parentRef.current?.offsetWidth]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    return (
        <div className={`flex flex-col md:w-1/2 lg:w-1/3 p-1 mt-5 relative w-full mb-5 md:mb-0`} ref={parentRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="pr-3">
                <SmallPlayerDisplay time={time} pair={game.pair} color="black" icon={false} /></div>
            <Board move={game.moves[currentIndex]} boardWidth={parentWidth - 20} ></Board>

            {result !== '*' && (
                <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50 opacity-70 text-slate-700 text-8xl font-bold">
                    {result}
                </div>
            )}

            <div className="pr-3">
                <SmallPlayerDisplay icon={false} time={time} pair={game.pair} color="white" />
            </div>

            {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="p-10 bg-white text-black rounded-lg shadow-md opacity-70">
                        <div className="flex gap-4">
                            <button className="m-3"><FaRegPlayCircle className="text-6xl text-blue-800" onClick={onClick} /></button>
                            {/* <button className="m-3">Remove</button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}


export function MultipleGameViewer({ gameIds, games, title, onClick }: MultipleGameViewerProps) {
    const [isFullscreen, toggleFullscreen] = useFullscreen();
    const displayGames = useMemo(() => {
        return gameIds.map(x => games[x]).filter(Boolean)
    }, [games, gameIds])

    const handleMiniGameClick = (g: GameEventResponse) => {
        onClick(g)
    }

    if (!games || gameIds.length == 0) {
        return <></>
    }

    return (
        <div className={isFullscreen ? "fixed top-0 left-0 h-screen w-screen z-50 bg-white p-5 overflow-y-auto" : ""}>
            {isFullscreen &&
                <div className='fixed top-0 left-0  w-full pt-2 pb-2 bg-slate-800 text-white'>
                    <h1 className="text-3xl font-bold text-center">{title}</h1>
                </div>
            }
            <div className={"flex flex-row w-full flex-wrap pt-0 md:pt-10"}>
                {displayGames.map((game) => <MiniBoard gameCount={gameIds.length} game={game} key={game.game + game.round} result={game.result || "*"} onClick={() => handleMiniGameClick(game)} />)}

                <div className="fixed bottom-5 right-5">
                    <FullscreenButton isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
                </div>
            </div>
        </div>
    )
}