import { GameMap, Tournament, GameEventResponse } from "library";
import { useMemo, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export function useWebSocket(url: string, path = '/') {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [readyState, setReadyState] = useState<boolean>(false);
    const [connectedTime, setConnectedTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>()
    const [games, setGames] = useState<GameMap>({});
    const [tournament, setTournament] = useState<Tournament>();
    const [messageHistory, setMessageHistory] = useState<any>({})

    const messageHistoryRef = useRef(messageHistory);
    const socketRef = useRef<Socket | null>(socket);

    useEffect(() => {
        messageHistoryRef.current = messageHistory;
    }, [messageHistory]);

    const socketInstance = useMemo(() => io(url, {
        path: path + "/socket.io",
        transports: ["websocket", "polling"],
        reconnection: true,
    }), [url, path]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSocket(socketInstance);

        }, 1000)
        return () => {
            clearTimeout(timeout);
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [socketInstance]);

    useEffect(() => {
        if (socketInstance) {
            socketInstance.connect();
            socketInstance.on("hello", (data: any) => {
                setLoading(false);
                setTournament(data);
            });

            socketInstance.on("error", (error) => {
                setError(error?.message || 'Unexpected error occured')
                setLoading(false);
                // ...
                console.error(error)
            });

            socketInstance.on("message", ({ event, data }: { event: string, data: any }) => {
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

            socketInstance.on("game", (data: GameEventResponse) => {
                setLoading(false);
                const key = `${data.round}_${data.game}`;
                setGames((prevGames) => ({ ...prevGames, [key]: data }));
            });

            socketInstance.on('connect', () => {
                setReadyState(true);
                setConnectedTime(new Date());
                console.log("socket reconnect", messageHistoryRef.current);
                // socketRef.current?.emit('hello', {});
                for (const key in messageHistoryRef.current) {
                    console.log("resend data", messageHistoryRef.current[key])
                    socketRef.current?.emit('game', messageHistoryRef.current[key]);
                }

            });
            socketInstance.on('disconect', () => {
                setReadyState(false);
                setLoading(false)
            });
        }

        return () => {
            console.log("use socket hook unmounting");
            if (socketInstance) {
                setLoading(false);
                socketInstance.disconnect();
            }
        };
    }, [socketInstance]);

    return {
        connectedTime,
        loading,
        sendMessage: (type: string, data: any, silent = false) => {
            if (!silent)
                setLoading(true);
            if (type == "game") {
                setMessageHistory((prev: any) => ({ ...prev, [data.round + "_" + data.game]: data }))
            }
            socket?.emit(type, data);
        },
        tournament,
        readyState,
        error,
        games,
    };
}
