import { GameMap, Tournament, GameEventResponse } from "library";
import { useMemo, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export function useWebSocket(url: string, path = '/') {
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [readyState, setReadyState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastMessage, setLastMessage] = useState<string>();
    const [games, setGames] = useState<GameMap>({});
    const [tournament, setTournament] = useState<Tournament>();

    const socketInstance = useMemo(() => io(url, {
        path: path + "/socket.io",
        transports: ["websocket", "polling"],
    }), [url, path]);

    useEffect(() => {
        setSocket(socketInstance);
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [socketInstance]);

    useEffect(() => {
        if (socket) {
            socket.connect();
            socket.on("hello", (data: any) => {
                setLoading(false);
                setTournament(data);
            });

            socket.on("message", ({ event, data }: { event: string, data: any }) => {
                if (event === "game") {
                    const key = `${data.round}_${data.game}`;
                    setGames((prevGame) => {
                        if (prevGame[key]?.moves.length < data.moves.length) {
                            return { ...prevGame, [key]: data };
                        } else {
                            return prevGame;
                        }
                    });
                }

                if (event === "tournament") {

                    setTournament(data);
                }
            });

            socket.on("game", (data: GameEventResponse) => {
                setLoading(false);
                const key = `${data.round}_${data.game}`;
                setGames((prevGames) => ({ ...prevGames, [key]: data }));
            });

            socket.on('connect', () => {
                setReadyState(true);
            });
        }

        return () => {
            console.log("someone disconnect me");
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return {
        loading,
        sendMessage: (type: string, data: any) => {
            setLoading(true);
            socket?.emit(type, data);
        },
        tournament,
        lastMessage,
        readyState,
        games,
    };
}
