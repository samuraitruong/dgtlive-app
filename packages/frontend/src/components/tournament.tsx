'use client'

import { useWebSocket } from '@/hooks/useWebSocket';
import consrtants from '@/model/consrtants';
import { useEffect, useState } from 'react';


export default function Tournament(){
    const [socketUrl, setSocketUrl] = useState('http://localhost:3001');
    const { sendMessage, lastMessage, readyState, tournament} = useWebSocket(socketUrl)
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

    console.log(tournament)
    useEffect(() => {
        if (lastMessage) {
          setMessageHistory((prev) => prev.concat(lastMessage as any));
        }
        else {
            if(readyState) {
                sendMessage(consrtants.EventNames.Hello , {})
            }
        }
      }, [lastMessage, readyState]);
      
    return <div>
        <h1>{tournament?.name}</h1>
    </div>
}