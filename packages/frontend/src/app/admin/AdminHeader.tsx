"use client";
import Link from 'next/link';
import { useAuth } from "@/auth/authContext";

export default function AdminHeader() {
    const { user, logout } = useAuth();

    if (!user) {
        return <></>;
    }

    return (
        <header className="bg-gray-800 text-white shadow-lg p-4 flex justify-between w-full mb-10">
            <div className="flex items-center space-x-4">

                <nav className="space-x-6">
                    <Link href="/admin" passHref>
                        Admin
                    </Link>
                    <Link href="/admin/manage" passHref>
                        Manage Tournament
                    </Link>
                    <Link href="/admin/players" passHref>
                        Players
                    </Link>

                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <span className="font-semibold">Welcome, {user.username}</span>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
