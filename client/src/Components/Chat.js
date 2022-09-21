import React, { useState, useEffect } from 'react';
import { socket } from "../context/socket";

const Chat = () => {
    const [roomId, setRoomId] = useState("");
    // Messages States
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([]);
    const playerUsername = sessionStorage.getItem('name');

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit("message", { message, roomId, playerUsername });
        setMessage('');
    };

    // useEffect(() => {

    // }, [socket]);

    socket.on("message", (data) => {
        console.log(data);
        setMessageReceived([...messageReceived, { playerUsername: data.message }]);

    });

    return (
        <div className='flex flex-col m-6 w-1/3'>
            <div className='flex flex-col h-full'>
                <h2 className='text-red-500 bg-white font-semibold text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold'>CHAT</h2>
                {messageReceived.map((messageReceived) =>
                    <p className=''>{messageReceived.playerUsername}</p>
                )}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    placeholder="Message..."
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    value={message}
                />
                <button type='submit'>ENVOYER</button>
            </form>
        </div>
    );
};

export default Chat;