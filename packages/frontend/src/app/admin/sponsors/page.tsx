'use client';
import { useState } from "react";
import Loading from "@/components/Loading";
import Link from 'next/link'
import withAuth from "@/auth/withAuth";
import { API_URL } from "@/config";
import SponsorForm from "./form";
import useSponsorData, { SponsorData } from "@/hooks/useSponsorData";

function SponsorAdmin() {
  const { data, updateItem, addItem, error, deleteItem, isLoading } = useSponsorData(API_URL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<SponsorData | undefined>({} as any);

  const handleOpenModal = (row?: SponsorData) => {
    setCurrentRow(row || { _id: '', name: '', description: '', website: '', logoUrl: '', tournament: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRow(undefined);
  };


  const handleFormEvent = async (ev: 'close' | 'save', data?: SponsorData) => {
    if (ev === 'close') {
      handleCloseModal();
    }
    if (ev === "save") {
      if (data?._id) {
        // update
        updateItem({ ...data } as any).then(() => setIsModalOpen(false))
      }
      else
        addItem({ ...data } as any).then(() => setIsModalOpen(false));
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
    <>
      <h1 className="text-2xl font-bold mb-4">Manage Tournaments</h1>
      <div className="w-full text-right">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 float-right"
          onClick={() => handleOpenModal()}
        >
          Add New
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead >
          <tr >
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Logo</th>
            <th className="py-2 px-4 border-b">Website</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Tournament</th>
            <th className="py-2 px-4 border-b">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row._id} className={"cursor-pointer" + (!row.isActive ? "bg-slate-500 opacity-50" : "")}>
              <td className="py-2 px-4 border-b">{row.name}</td>
              <td className="py-2 px-4 border-b">{row.logoUrl}</td>
              <td className="py-2 px-4 border-b">{row.website}</td>
              <td className="py-2 px-4 border-b">{row.description}</td>
              <td className="py-2 px-4 border-b">{row.tournaments?.join(',')}</td>
              <td className="py-2 px-4 border-b">
                <button className="ml-5 round-sm bg-green-400 p-1 z-40 text-white rounded-sm hover:text-green-700" onClick={() => handleOpenModal(row)}>Edit</button>
                <button className="ml-5 round-sm bg-red-400 p-1 z-40 text-white rounded-sm hover:text-red-700" onClick={(e) => handleDeleteClick(e, row._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && <SponsorForm data={currentRow} onEvent={handleFormEvent} errorMessage={error} />}
    </>
  );
};


export default withAuth(SponsorAdmin)