import { Tournament } from "@/model/tournament";
import {  useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
export function useWebSocket(url: string) {
    const [socket, setSocket] = useState<Socket>();
    const [readyState, setReadyState] = useState<boolean>(false);
    const [lastMessage, setLastMessage] = useState<string>();

    const [tournament, setTournament] = useState<Tournament>();

    const sendMessage= (type: string, data: any) =>{
        socket?.emit(type, data)
    }
    useEffect(() =>     {
        if(!socket) {
            const client = io(url, {
                transports: ["websocket", "polling"],
            });
            setSocket(client)

            client.connect();

            client.on("hello",(data: any) =>  {
                //setLastMessage(data) 
                setTournament(data)
        })
            client.on('connect', () =>  {
                setReadyState(true)
            })

        }
        return () => {
            if(socket) {
                socket.disconnect()
            }
        }
        
    }, [url, socket])
    return {
        sendMessage,
        tournament,
        lastMessage,
        readyState
    }
}