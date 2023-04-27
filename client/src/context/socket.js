import React, { useContext, useState, useEffect, useRef } from 'react'
import io from "socket.io-client";


const SocketContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketContextProvider({ children }) {
    const isSecondRender = useRef(false)
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        !isSecondRender.current && setSocket(io(process.env.REACT_APP_API_URL, {
            transports: ['websocket'],
        }));
        isSecondRender.current = true;
        console.log(process.env.REACT_APP_API_URL, socket)
    }, []);

    return (
        <SocketContext.Provider value={[socket]}>
            {children}
        </SocketContext.Provider>
    )
}
