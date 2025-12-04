import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketContext";
import { Sidebar } from "../components/Sidebar";
import { UserDataContext } from "../context/UserDataContext";
import { ActiveChat } from "../components/ActiveChat";
import { useNavigate } from "react-router-dom";
import { config } from "../config";

export const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { socketRef } = useContext(SocketContext)
    const navigate = useNavigate()
    const { messages, setMessages, allChannels, channelData, setChannelData, joinedChannels, setJoined } = useContext(UserDataContext)



    const channelClickHandler = async (ele) => {
        console.log("Channel clicked:", ele.channelName)

        setChannelData(ele)

        let isJoined = false;
        for (const channel of joinedChannels) {
            if (channel.channelName === ele.channelName) {
                console.log("User already joined this channel");
                isJoined = true;
                break;
            }
        }

        setJoined(isJoined);


        if (socketRef.current && ele._id) {
            const userName = localStorage.getItem('fullName');
            socketRef.current.emit('enter_channel', { channelId: ele._id, userName });
            console.log(`Joined socket room for channel: ${ele._id}`);
        }
    }

    useEffect(() => {

        if (!channelData) return

        if (channelData?._id) {
            const loadMessages = async () => {
                const response = await fetch(`${config.BACKEND_URL}/api/messages/msg-history/${channelData._id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log(data.messages, "history data");
                setMessages(data.messages || []);

            };

            loadMessages();
        }

    }, [channelData])

    useEffect(() => {
        if (!socketRef.current) {
            return
        }
        console.log("connected")
    }, []);

    return (
        <div className="h-screen bg-[#f8f8f8] flex gap-0 flex-col md:flex-row p-0 relative overflow-hidden">

            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 pt-16"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <div className={`fixed md:relative top-0 left-0 h-screen md:h-screen w-[75vw] md:w-[350px] md:flex z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <Sidebar channelClickHandler={(ele) => {
                    channelClickHandler(ele)
                    setSidebarOpen(false)
                }} allChannels={allChannels} />
            </div>


            <div className="flex-1 h-screen overflow-hidden">
                {channelData ? <ActiveChat /> : <div className="h-full bg-white shadow-xl rounded-md text-center flex items-center justify-center">
                    Select a channel or create one
                </div>}
            </div>
        </div >
    );
};
