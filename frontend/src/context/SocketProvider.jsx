import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./socketContext";
import { config } from "../config";
import { useRef } from "react";

export const SocketProvider = ({ children }) => {
    // const [socket, setSocket] = useState(null);
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(`${config.BACKEND_URL}`);

        socketRef.current.on('connect', () => {
            console.log('connected to backend')
        })
        socketRef.current.on('disconnect', () => {
            console.log('disconnected')
        })
        // function establishConnection() {
        //     setSocket(s);
        // }

        // establishConnection();
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socketRef }}>
            {children}
        </SocketContext.Provider>
    );
}