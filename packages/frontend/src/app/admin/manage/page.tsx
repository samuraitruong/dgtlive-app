'use client';
import { ChangeEvent, useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRouter } from 'next/navigation'
import Loading from "@/components/Loading";
import Link from 'next/link'
import withAuth from "@/auth/withAuth";
import { useAuth } from "@/auth/authContext";
import useData, { RowData } from "@/hooks/useData";
import { API_URL } from "@/config";
import Form from "./form";



function ManageAdmin() {
  const { user } = useAuth();
  const { data, updateItem, addItem, error } = useData(API_URL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RowData | undefined>();

  const handleOpenModal = (row?: RowData) => {
    setCurrentRow(row || { id: '', name: '', slug: '', liveChessId: '', delayMoves: 0, delayTimes: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRow(undefined);
  };


  const handleFormEvent = (ev: 'close' | 'save', data?: RowData) => {
    if (ev === 'close') {
      handleCloseModal();
    }
    if (ev === "save") {
      if (data?.id) {
        // update
        updateItem({ ...data } as any);
      }
      else
        addItem({ ...data } as any);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center  bg-gray-100 text-black p-3">
      <h2 className="p-10 text-6xl">Welcome {user.username}</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => handleOpenModal()}
      >
        Add New
      </button>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Live Chess ID</th>
            <th className="py-2 px-4 border-b">Delay Moves</th>
            <th className="py-2 px-4 border-b">Delay Times</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="cursor-pointer" onClick={() => handleOpenModal(row)}>
              <td className="py-2 px-4 border-b">{row.name}</td>
              <td className="py-2 px-4 border-b">{row.slug}</td>
              <td className="py-2 px-4 border-b">{row.liveChessId}</td>
              <td className="py-2 px-4 border-b">
                {row.delayMoves}
              </td>
              <td className="py-2 px-4 border-b">
                {row.delayTimes}
              </td>
              <td className="py-2 px-4 border-b">
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && <Form data={currentRow} onEvent={handleFormEvent} errorMessage={error} />}
    </main>
  );
};


export default withAuth(ManageAdmin)