import React, { useContext, useState, useEffect, useRef } from 'react'
import io from "socket.io-client";



const SocketContext = React.createContext(null);
const SocketReconnectContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext)
}

// export function useSocketReconnect() {
//     return useContext(SocketReconnectContext)
// }

export function SocketContextProvider({ children }) {
    const isSecondRender = useRef(false)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        isSecondRender.current && setSocket(io('http://localhost:3001/'));
        isSecondRender.current = true
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
