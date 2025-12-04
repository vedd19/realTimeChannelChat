import React, { useEffect, useState } from 'react'
import { UserDataContext } from './UserDataContext'
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import axios from 'axios';
import { SocketContext } from './socketContext';
import { useContext } from 'react';
// import { config } from '../src/config';

export const UserContextProvider = ({ children }) => {


    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    const [myChannels, setMyChannels] = useState(null)
    const [allChannels, setAllChannels] = useState(null)
    const [channelData, setChannelData] = useState(null)
    const [joinedChannels, setJoinedChannels] = useState(null)
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState([])
    const [otherUserName, setOtherUserName] = useState("")
    const [recievedMsg, setRecievedMsg] = useState("")
    const [senderId, setSenderId] = useState()
    // const socketRef.current = useSocket();
    const { socketRef } = useContext(SocketContext)

    useEffect(() => {

        async function getMyChannelData() {
            try {
                const response = await fetch(`${config.BACKEND_URL}/api/channels/get-my-channels`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({ userId: localStorage.getItem('id') })
                })

                if (response.status === 200) {
                    const data = await response.json();
                    setMyChannels(data.data)
                    console.log(data.data)
                }

            } catch (err) {
                console.log(err)
            }
        }

        getMyChannelData()
    }, [])

    useEffect(() => {

        async function getJoinedChannelData() {
            try {
                const response = await fetch(`${config.BACKEND_URL}/api/channels/get-joined-channels`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({ userId: localStorage.getItem('id') })
                })

                if (response.status === 200) {
                    const data = await response.json();
                    setJoinedChannels(data.data)
                    console.log(data.data)
                }

            } catch (err) {
                console.log(err)
            }
        }

        getJoinedChannelData()
    }, [])

    useEffect(() => {

        async function getAllChannelData() {
            try {
                const response = await fetch(`${config.BACKEND_URL}/api/channels/get-all-channels`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"

                    },
                })

                if (response.status === 200) {
                    const data = await response.json();
                    setAllChannels(data.data)
                    console.log(data.data)
                }

            } catch (err) {
                console.log(err)
            }
        }

        getAllChannelData()
    }, [])


    return (
        <UserDataContext.Provider value={{ userData, setUserData, loginData, setLoginData, myChannels, allChannels, setAllChannels, channelData, setChannelData, joined, setJoined, setMyChannels, joinedChannels, setJoinedChannels, messages, setMessages, otherUserName, setOtherUserName, recievedMsg, setRecievedMsg, senderId, setSenderId }} >
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContextProvider;

