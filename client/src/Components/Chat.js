import React, { useState, useEffect } from 'react';
import { socket } from "../context/socket";

const Chat = () => {
    //const [roomId, setRoomId] = useState("");
    // Messages States
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([]);
    const playerUsername = sessionStorage.getItem('name');
    const roomId = sessionStorage.getItem('id');


    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit("message", { message, roomId, playerUsername });
        setMessage('');
    };

    socket.on('closeGuess', (data) => {
        setMessageReceived([...messageReceived, { playerUsername: "PopCorn : ", message: "Pas loin !" }]);
    });
    socket.on('correctGuess', async (data) => {

        let message = data.message;
        setMessageReceived([...messageReceived, { playerUsername: "PopCorn : ", message }]);
    });

    socket.on('lastWord', ({ word }) => {
        setMessageReceived([...messageReceived, { playerUsername: "PopCorn : ", message: "Bien joué roya !!" }]);
    });


    socket.on("message", (data) => {
        if (!data.correctGuess && data.playerUsername) {
            setMessageReceived([...messageReceived, { playerUsername: data.playerUsername + " : ", message: data.message }]);
        }



    });

    return (
        <div className='flex flex-col m-6 w-1/3'>
            <div className='flex flex-col h-full'>
                <h2 className='text-red-500 bg-white font-semibold text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold'>CHAT</h2>
                {messageReceived.map((messageReceived) =>
                    (messageReceived.playerUsername === playerUsername) ?
                        <div className='flex justify-end'>
                            <p className='w-5/6 mb-1 px-4 py-2 rounded-lg inline-block rounded-br-none bg-red-400 text-white text-right break-words	'><strong>{messageReceived.playerUsername}</strong>{messageReceived.message}</p>
                        </div>
                        :
                        <div className='flex justify-start '>
                            <p className='w-5/6 mb-1 px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600 break-words	'><strong>{messageReceived.playerUsername}</strong>{messageReceived.message}</p>
                        </div>
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