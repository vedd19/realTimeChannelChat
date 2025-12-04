import React, { useContext, useState, useEffect, useRef } from 'react'
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send"
import GroupsIcon from '@mui/icons-material/Groups';
import { UserDataContext } from '../context/UserDataContext';
import { config } from '../config';
import { SocketContext } from '../context/socketContext';
import './ActiveChat.css'

import LogoutIcon from '@mui/icons-material/Logout';

export const ActiveChat = () => {

    const [msg, setMsg] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { socketRef } = useContext(SocketContext)
    const messagesEndRef = useRef(null);

    const { messages, channelData, joined, setJoined, setMessages, setChannelData } = useContext(UserDataContext)

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            console.log("Message received:", data);
            if (data.messages && data.messages.length > 0) {

                const lastMessage = data.messages[data.messages.length - 1];
                setMessages((prevMessages) => {

                    const messageExists = prevMessages.some(
                        (m) => m.sender === lastMessage.sender && m.content === lastMessage.content && m.senderName === lastMessage.senderName
                    );
                    if (messageExists) {
                        return prevMessages;
                    }
                    return [...prevMessages, lastMessage];
                });
            }
        };

        const handleOnlineUsers = (users) => {
            console.log("Online users:", users);
            setOnlineUsers(users);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("online_users", handleOnlineUsers);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("online_users", handleOnlineUsers);
        };
    }, [setMessages, socketRef]);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const joinChannelHandler = async () => {

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/channels/join-channel`, {
                method: "POST",
                body: JSON.stringify({ userId: localStorage.getItem('id'), channelId: channelData._id }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"

                },
            })

            const data = await response.json();
            console.log("Join channel response:", data)


            if (data.data) {
                setChannelData(prev => ({
                    ...prev,
                    members: data.data.members || prev.members
                }));
            }

            setJoined(true)

        } catch (err) {
            console.log(err)
        }

    }

    const leaveChannelHandler = async () => {
        if (!window.confirm("Are you sure you want to leave this channel?")) {
            return;
        }

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/channels/leave-channel`, {
                method: "POST",
                body: JSON.stringify({ userId: localStorage.getItem('id'), channelId: channelData._id }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
            })

            const data = await response.json();
            console.log("Left channel:", data)


            if (data.data) {
                setChannelData(prev => ({
                    ...prev,
                    members: data.data.members || prev.members
                }));
            }

            setJoined(false);

        } catch (err) {
            console.log("Error leaving channel:", err)
        }

    }

    const handleSendMessage = () => {
        console.log(msg);
        if (!msg.trim()) return;

        const channelId = channelData._id
        const senderId = localStorage.getItem('id');
        const content = msg;
        const name = localStorage.getItem('fullName');


        const newMessage = {
            sender: senderId,
            content: content,
            senderName: name
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);


        socketRef.current.emit("send_message", { channelId, senderId, content, name });
        setMsg("")
    }
    return (
        <div className="flex-1 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-lg overflow-hidden flex flex-col h-full">
            <div className="flex flex-col border-b-2 border-gray-200 flex-shrink-0">

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center flex-1">
                        <div className="rounded-full bg-white w-12 h-12 flex justify-center items-center shadow-lg">
                            <GroupsIcon sx={{ color: '#667eea', fontSize: 28 }} />
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-white text-lg">{channelData.channelName}</h1>
                            <p className="text-purple-100 text-xs">{localStorage.getItem('fullName')}</p>
                        </div>
                    </div>
                    {joined && (
                        <button
                            onClick={leaveChannelHandler}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm"
                        >
                            <LogoutIcon sx={{ fontSize: 18 }} />
                            Leave
                        </button>
                    )}
                </div>


                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold text-sm p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex h-3 w-3 rounded-full bg-white animate-pulse"></span>
                        Online: {onlineUsers.length > 0 ? onlineUsers.map(user => user.fullName).join(", ") : "No users"}
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-blue-600">
                        {channelData?.members?.length || 0} member{channelData?.members?.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            <div className="chat-box flex-1 overflow-y-auto">
                {messages && messages.length > 0 ? (
                    messages.map((m, index) => (
                        <div key={index} className={`flex ${m.sender === localStorage.getItem('id') ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex flex-col w-[50%]">
                                <p className={`senderName ${m.sender === localStorage.getItem('id') ? "myName" : "otherName"}`}>
                                    {m.sender === localStorage.getItem('id') ? "You" : m.senderName || "Unknown User"}
                                </p>
                                <div className={`message ${m.sender === localStorage.getItem('id') ? "me" : "other"}`}>
                                    <p>{m.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <GroupsIcon sx={{ fontSize: 48, color: '#ddd', marginBottom: 2 }} />
                            <p className="text-gray-400 text-lg font-medium">No messages yet</p>
                            <p className="text-gray-300 text-sm">Start the conversation!</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>


            <div className="border-t-2 border-gray-200 p-4 bg-white flex-shrink-0">
                {joined ? (
                    <div className="flex gap-2">
                        <TextField
                            fullWidth
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#f5f7fa',
                                    border: '2px solid #e0e0e0',
                                    '&:hover': {
                                        border: '2px solid #667eea',
                                    },
                                    '&.Mui-focused': {
                                        border: '2px solid #667eea',
                                        backgroundColor: '#fff',
                                    }
                                }
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <SendIcon />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={joinChannelHandler}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Join Channel
                    </button>
                )}
            </div>
        </div >
    )
}
