import { GameEventResponse, GameMap, Tournament } from "library/src/model/tournament";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
export function useWebSocket(url: string) {
    const socketRef = useRef(null); // Create a mutable reference for the WebSocket instance

    const [socket, setSocket] = useState<Socket>();
    const [readyState, setReadyState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastMessage, setLastMessage] = useState<string>();

    const [games, setGames] = useState<GameMap>({});

    const [tournament, setTournament] = useState<Tournament>();

    const sendMessage = (type: string, data: any) => {
        setLoading(true)
        socket?.emit(type, data)
    }
    useEffect(() => {

        if (!socket) {
            const client = io(url, {
                transports: ["websocket", "polling"],
            });

            setSocket(client)

            client.connect();

            client.on("hello", (data: any) => {
                //setLastMessage(data) 
                setLoading(false);
                setTournament(data)
            })

            client.on("message", ({ event, data }: { event: string, data: any }) => {
                if (event === "game") {
                    const key = `${data.round}_${data.game}`

                    setGames((prevGame) => {
                        if (prevGame[key]?.moves.length < data.moves.length) {
                            return { ...prevGame, [key]: data } as any
                        }
                        else {
                            return prevGame
                        }
                    })
                }

                if (event === "tournament") {
                    setTournament(data)
                }

            })

            client.on("game", (data: GameEventResponse) => {
                setLoading(false);
                //setLastMessage(data) 
                const key = `${data.round}_${data.game}`
                setGames({ ...games, [key]: data } as any)
            })

            client.on('connect', () => {
                setReadyState(true)
            })

        }
        return () => {
            if (socket) {
                socket.disconnect()
            }
        }

    }, [url, socket, games])
    return {
        loading,
        sendMessage,
        tournament,
        lastMessage,
        readyState,
        games
    }
}