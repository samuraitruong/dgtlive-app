import { SponsorData } from "@/hooks/useSponsorData";
import { useEffect, useState } from "react";

interface FormProps {
    data?: SponsorData
    errorMessage?: string;
    onEvent: (ev: 'close' | 'save', data?: SponsorData) => void;
}

function Form({ data, onEvent, errorMessage }: FormProps) {
    const [currentRow, setCurrentRow] = useState<SponsorData | undefined>(data || {} as any);

    useEffect(() => {
        if (data !== currentRow) {
            setCurrentRow(data);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentRow) {
            const { name, value, type, checked } = e.target;
            if (type === 'checkbox') {
                setCurrentRow({ ...currentRow, [name]: checked });
            } else if (type === 'number') {
                setCurrentRow({ ...currentRow, [name]: +value });
            } else {
                setCurrentRow({ ...currentRow, [name]: value });
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/3">
                <h2 className="text-xl mb-3">Sponsor</h2>
                <div className="mb-3">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={currentRow?.name || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Website</label>
                    <input
                        type="text"
                        name="website"
                        value={currentRow?.website || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1">Description</label>
                    <input
                        name="description"
                        value={currentRow?.description || ''}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1">Logo</label>
                    <input
                        type="text"
                        name="logoUrl"
                        value={currentRow?.logoUrl}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Tournament</label>
                    <input
                        type="text"
                        name="tournament"
                        value={currentRow?.tournament}
                        onChange={handleChange}
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div className="mb-3 flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={currentRow?.isActive || false}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-500"
                    />
                    <label className="ml-2">Active</label>
                </div>
                {errorMessage && <div className="p-3 bg-red-400 text-white">{errorMessage}</div>}
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
        </div>
    );
}

export default Form;
