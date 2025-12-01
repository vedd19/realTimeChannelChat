import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { config } from "../config";

Modal.setAppElement('#root');

export const CreateChannelModal = ({ isOpen, setIsOpen }) => {

    const [value, setValue] = useState("");

    const handleCreate = async () => {
        const payload = {
            channelName: value,
            userId: localStorage.getItem('id')
        }
        try {
            const response = await fetch(`${config.BACKEND_URL}/api/channels/create-channel`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...payload
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log(data)
            }

        } catch (err) {
            console.log(err)
        }

        console.log("Created:", value);
        setValue("");

        setIsOpen(false);
    };

    return (
        <div className="p-4">
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    content: {
                        width: "350px",
                        height: "400px",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "12px",
                        inset: "0px",
                    },
                }}
            >
                <h2 className="text-lg font-semibold mb-4">Create</h2>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter channel name..."
                    className="w-full border px-3 py-2 rounded-md mb-4"
                />


                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
                    >
                        Create
                    </button>
                </div>
            </Modal>
        </div>
    );
};
