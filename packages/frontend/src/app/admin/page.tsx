'use client';
import { ChangeEvent, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  const [socketUrl, setSocketUrl] = useState(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');

  const { sendMessage, lastMessage, readyState, tournament, games, loading } = useWebSocket(socketUrl, 'senior')
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    sendMessage("admin", { gameId: inputValue })

    router.push('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 text-black">
      <div className="flex items-center justify-center h-screen">
        <div className="mr-1">
          <input
            type="text"
            className="w-full text-3xl px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter game ID"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button onClick={handleSubmit} className="w-full h-[55px] px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
            Set
          </button>
        </div>
      </div>
    </main>
  );
}
