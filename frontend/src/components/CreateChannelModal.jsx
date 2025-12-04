import React, { useState } from "react";
import Modal from "react-modal";
import { config } from "../config";

Modal.setAppElement('#root');

export const CreateChannelModal = ({ isOpen, setIsOpen, setAllChannels }) => {

    const [value, setValue] = useState("");

    const handleCreate = async () => {
        if (!value.trim()) {
            alert("Please enter a channel name");
            return;
        }




        const payload = {
            channelName: value,
            userId: localStorage.getItem('id')
        }

        let channelCreated = false;

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

            console.log("Create channel response status:", response.status);

            if (response.status === 201 || response.status === 200) {
                const data = await response.json();
                console.log("Channel created:", data);
                channelCreated = true;


                try {
                    const allChannelsResponse = await fetch(`${config.BACKEND_URL}/api/channels/get-all-channels`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-type': 'application/json'
                        }
                    });

                    if (allChannelsResponse.status === 200) {
                        const allChannelsData = await allChannelsResponse.json();
                        console.log("Updated all channels:", allChannelsData.data);

                        if (typeof setAllChannels === 'function') {
                            setAllChannels(allChannelsData.data);
                            alert("Channel created successfully!");
                        } else {
                            console.error("setAllChannels is not a function after refetch");
                            alert("Channel created but failed to update UI. Please refresh.");
                        }
                    }
                } catch (fetchError) {
                    console.error("Error fetching updated channels:", fetchError);
                    alert("Channel created but failed to fetch updated list: " + fetchError.message);
                }
            } else if (response.status === 409) {
                alert("Channel name already exists. Please choose a different name.");
            } else {
                try {
                    const errorData = await response.json();
                    alert(errorData.message || "Failed to create channel");
                } catch {
                    alert("Failed to create channel. Status: " + response.status);
                }
            }

        } catch (err) {
            console.log("Error creating channel:", err);
            alert("Error: " + (err.message || "Failed to create channel"));
        }

        if (channelCreated) {
            console.log("Created:", value);
            setValue("");
            setIsOpen(false);
        }
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
                <h2 className="text-lg font-semibold mb-4">Create Channel</h2>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                    placeholder="Enter channel name..."
                    className="w-full border px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
                    >
                        Create
                    </button>
                </div>
            </Modal>
        </div>
    );
};
