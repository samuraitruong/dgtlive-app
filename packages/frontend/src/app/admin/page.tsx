'use client';
import { ChangeEvent, useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRouter } from 'next/navigation'
import Loading from "@/components/Loading";
import Link from 'next/link'
import withAuth from "@/auth/withAuth";
import { useAuth } from "@/auth/authContext";

function GameIdChanner({ type, title }: { type: string, title: string }) {
  const router = useRouter()

  const [socketUrl, setSocketUrl] = useState(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');

  const { sendMessage, readyState, loading } = useWebSocket(socketUrl, '/' + type)
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    sendMessage("admin", { gameId: inputValue })

    router.push('/' + type)
  }
  if (loading) {
    return <Loading />
  }
  return (
    <div className="flex items-center mt-5">
      <div className="mr-1">
        <input
          type="text"
          className="w-full text-4xl px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder={title}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit} disabled={inputValue === undefined || inputValue === ''} className="w-full h-[55px] px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
          {title}
        </button>
      </div>
    </div>
  );
}

function Admin() {
  const { user } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 text-black">
      <h2 className="p-10 text-6xl">Welcome {user.username}</h2>
      <div className="flex items-center  flex-col justify-center h-screen">
        <GameIdChanner type="junior" title="Set Junior Tournament ID"></GameIdChanner>

        <GameIdChanner type="senior" title="Set Senior Tournament ID"></GameIdChanner>
        <div className="flex justify-between mt-5">
          <Link href='/admin/manage' className="bg-blue-500 hover:bg-blue-700  mr-5 text-white font-bold py-2 px-4 rounded flex items-center">Manage</Link>
          <Link href='/' className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded flex items-center">Cancel</Link>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Admin)