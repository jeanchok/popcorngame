import React, { useContext, useState, useEffect, useRef } from 'react'
import io from "socket.io-client";


const SocketContext = React.createContext(null);
// const SocketReconnectContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext)
}

// export function useSocketReconnect() {
//     return useContext(SocketReconnectContext)
// }

export function SocketContextProvider({ children }) {
    const isSecondRender = useRef(false)
    const [socket, setSocket] = useState(null);
    // const API_URL = import.meta.env.API_URL;process.env.API_KEY

    useEffect(() => {
        !isSecondRender.current && setSocket(io(process.env.REACT_APP_API_URL, {
            transports: ['websocket'],
        }));
        isSecondRender.current = true;
        console.log(process.env.REACT_APP_API_URL, socket)
    }, []);



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
