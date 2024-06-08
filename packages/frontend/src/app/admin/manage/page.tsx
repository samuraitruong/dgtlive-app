'use client';
import { useState } from "react";
import Loading from "@/components/Loading";
import Link from 'next/link'
import withAuth from "@/auth/withAuth";
import { useAuth } from "@/auth/authContext";
import useData, { RowData } from "@/hooks/useData";
import { API_URL } from "@/config";
import Form from "./form";



function ManageAdmin() {
  const { user } = useAuth();
  const { data, updateItem, addItem, error, deleteItem, isLoading } = useData(API_URL);
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
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    deleteItem(id);
    e.stopPropagation();
  }
  if (isLoading) {
    return <Loading />
  }
  return (
    <main className="flex min-h-screen flex-col items-center  bg-gray-100 text-black p-3">
      <h2 className="p-10 text-6xl">Welcome {user.username}</h2>
      <div className="w-full text-right">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 float-right"
          onClick={() => handleOpenModal()}
        >
          Add New
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Live Chess ID</th>
            <th className="py-2 px-4 border-b">Delay Moves</th>
            <th className="py-2 px-4 border-b">Delay Times</th>
            <th className="py-2 px-4 border-b">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="cursor-pointer">
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
              <td className="py-2 px-4 border-b">
                <button className="ml-5 round-sm bg-green-400 p-1 z-50 text-white rounded-sm hover:text-green-700" onClick={() => handleOpenModal(row)}>Edit</button>


                <button className="ml-5 round-sm bg-red-400 p-1 z-50 text-white rounded-sm hover:text-red-700" onClick={(e) => handleDeleteClick(e, row.id)}>Delete</button>

                <Link className="ml-5 round-sm bg-blue-400 p-1 z-50 text-white rounded-sm hover:text-red-700" href={'/tournament/' + row.slug}>Open</Link>
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