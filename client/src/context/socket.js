import React, { useContext, useState } from 'react'
import io from "socket.io-client";
//import { SOCKET_URL } from "config";

//export const socket = io('http://localhost:3001/');

//export const [socket, setSocket] = useState(io('http://localhost:3001/'));

//const SocketContext = React.createContext(socket);

// export async function socketReconnect(socket) {
//     await socket.disconnect();
//     setSocket(io('http://localhost:3001/'));
// }

// export async function socketConnect(socketToReconnect) {
//     const [socket, setSocket] = useState(io('http://localhost:3001/'));
//     if (socketToReconnect) {
//         await socket.disconnect();
//         setSocket(io('http://localhost:3001/'));
//     }
//     return socket;
// }


const SocketContext = React.createContext(null);
const SocketReconnectContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext)
}

// export function useSocketReconnect() {
//     return useContext(SocketReconnectContext)
// }

export function SocketContextProvider({ children }) {
    const [socket, setSocket] = useState(io('http://localhost:3001/'));


    // async function reconnect() {
    //     console.log('reconnecting');
    //     await socket.disconnect();
    //     setSocket(io('http://localhost:3001/'))
    // }

    return (
        <SocketContext.Provider value={[socket,
            //reconnect
        ]}>
            {children}
            {/* <SocketReconnectContext.Provider value={reconnect}>
                {children}
            </SocketReconnectContext.Provider> */}
        </SocketContext.Provider>
    )
}
