import type { GameEventResponse, GameMap } from "library"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Board from "./Board"
import SmallPlayerDisplay from './SmallPlayerDisplay'
import { BsFullscreen } from "react-icons/bs";
import { AiOutlineFullscreenExit } from "react-icons/ai";
interface MultipleGameViewerProps {
    games: GameMap,
    gameIds: string[],
    title: string;
}
function MiniBoard({ game }: { game: GameEventResponse }) {
    const [currentIndex, setCurrentIndex] = useState(game.moves.length - 1)
    const parentRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState(200);

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

    return (
        <div className="flex flex-col w-1/3 p-1 mt-5" ref={parentRef}>
            <div className="pr-3">
                <SmallPlayerDisplay time={time} pair={game.pair} color="black" icon={false} /></div>
            <Board move={game.moves[currentIndex]} boardWidth={parentWidth - 20} ></Board>
            <div className="pr-3">
                <SmallPlayerDisplay icon={false} time={time} pair={game.pair} color="white" />
            </div>
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

export function MultipleGameViewer({ gameIds, games, title }: MultipleGameViewerProps) {
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



    if (!games || gameIds.length == 0) {
        return <></>
    }

    return (
        <div className={isFullscreen ? "fixed top-0 left-0 h-screen w-screen z-50 bg-white p-5" : ""}>
            {isFullscreen && <div className="text-3xl font-bold">{title}</div>}
            <div className={"flex flex-row w-full flex-wrap pt-10"}>
                {displayGames.map((game) => <MiniBoard game={game} key={game.game + game.round} />)}

                <div className="fixed bottom-5 right-5">
                    {isFullscreen ?
                        <AiOutlineFullscreenExit
                            onClick={handleFullscreenToggle}
                            className="text-red-500 cursor-pointer font-bold"
                        >
                        </AiOutlineFullscreenExit> :

                        <BsFullscreen
                            onClick={handleFullscreenToggle}
                            className="text-green-500 cursor-pointer font-bold"
                        >
                        </BsFullscreen>}
                </div>
            </div>
        </div>
    )
}