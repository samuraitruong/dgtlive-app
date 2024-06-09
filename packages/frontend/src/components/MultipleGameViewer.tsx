import type { GameEventResponse, GameMap } from "library"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Board from "./Board"
import SmallPlayerDisplay from './SmallPlayerDisplay'
import { BsFullscreen } from "react-icons/bs";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { FaRegPlayCircle } from "react-icons/fa";

interface MultipleGameViewerProps {
    games: GameMap,
    gameIds: string[],
    title: string;
    onClick: (t: GameEventResponse) => void
}
function MiniBoard({ game, onClick }: { game: GameEventResponse, onClick: () => void }) {
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
        <div className="flex flex-col w-1/3 p-1 mt-5 relative" ref={parentRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="pr-3">
                <SmallPlayerDisplay time={time} pair={game.pair} color="black" icon={false} /></div>
            <Board move={game.moves[currentIndex]} boardWidth={parentWidth - 20} ></Board>
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

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

export function MultipleGameViewer({ gameIds, games, title, onClick }: MultipleGameViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreenToggle = useCallback(() => {
        toggleFullscreen();
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    const displayGames = useMemo(() => {
        return gameIds.map(x => games[x]).filter(Boolean)
    }, [games, gameIds])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const handleMiniGameClick = (g: GameEventResponse) => {
        onClick(g)
    }

    if (!games || gameIds.length == 0) {
        return <></>
    }

    return (
        <div className={isFullscreen ? "fixed top-0 left-0 h-screen w-screen z-50 bg-white p-5" : ""}>
            {isFullscreen &&
                <div className='fixed top-0 left-0  w-full pt-2 pb-2 bg-slate-800 text-white'>
                    <h1 className="text-3xl font-bold text-center">{title}</h1>
                </div>
            }
            <div className={"flex flex-row w-full flex-wrap pt-10"}>
                {displayGames.map((game) => <MiniBoard game={game} key={game.game + game.round} onClick={() => handleMiniGameClick(game)} />)}

                <div className="fixed bottom-5 right-5">
                    {isFullscreen ?
                        <AiOutlineFullscreenExit
                            onClick={handleFullscreenToggle}
                            className="text-red-400 cursor-pointer font-bold"
                        >
                        </AiOutlineFullscreenExit> :

                        <BsFullscreen
                            onClick={handleFullscreenToggle}
                            className="text-slate-800 cursor-pointer font-bold hover:font-bold"
                        >
                        </BsFullscreen>}
                </div>
            </div>
        </div>
    )
}