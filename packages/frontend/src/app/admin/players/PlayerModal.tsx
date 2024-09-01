import React, { useState } from 'react';
import { FidePlayer } from 'library';

interface PlayerModalProps {
    player: FidePlayer;
    onClose: () => void;
    onSave: (id: string) => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose, onSave }) => {
    const [newId, setNewId] = useState(player.id || '');

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewId(e.target.value);
    };

    const handleSave = () => {
        onSave(newId);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-40">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full text-black">
                <h2 className="text-xl mb-4">Player Details</h2>
                <div>
                    <p><strong>Name:</strong> {player.name}</p>
                    <p><strong>Country:</strong> {player.country}</p>
                    <p><strong>Ratings:</strong> {player.ratings?.std}</p>
                </div>
                <div className="mt-4">
                    <label htmlFor="id" className="block mb-2">Player ID:</label>
                    <input
                        id="id"
                        type="text"
                        value={newId}
                        onChange={handleIdChange}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleSave}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
                <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default PlayerModal;
