import { RowData } from "@/hooks/useData";
import { useEffect, useState } from "react";

interface FormProps {
    data?: RowData
    errorMessage?: string;
    onEvent: (ev: 'close' | 'save', data?: RowData) => void;
}
function Form({ data, onEvent, errorMessage }: FormProps) {
    const [currentRow, setCurrentRow] = useState<RowData | undefined>(data);
    useEffect(() => {
        if (data != currentRow) {
            setCurrentRow(data)
        }

    }, [data, currentRow])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentRow) {
            const { name, value, type } = e.target;
            if (type === 'number') {
                setCurrentRow({ ...currentRow, [name]: +value });
            } else
                setCurrentRow({ ...currentRow, [name]: value });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/3">
                <h2 className="text-xl mb-4">Row Details</h2>
                <div className="mb-4">
                    <label className="block mb-1">Live Chess ID</label>
                    <input
                        type="text"
                        name="liveChessId"
                        value={currentRow?.liveChessId || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                {/* <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data?.name || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div> */}
                <div className="mb-4">
                    <label className="block mb-1">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={currentRow?.slug || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Delay Moves</label>
                    <input
                        type="number"
                        name="delayMoves"
                        value={currentRow?.delayMoves || 0}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Delay Time</label>
                    <input
                        type="number"
                        name="delayTimes"
                        value={currentRow?.delayTimes || 0}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                {errorMessage && <div className="p-3 bg-red-400 text-white"> {errorMessage}
                </div>
                }
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => onEvent('close', undefined)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => onEvent('save', currentRow)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>)
}
export default Form