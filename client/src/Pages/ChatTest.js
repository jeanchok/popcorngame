import React from 'react';
import { useEffect, useState } from "react";
import { socket } from "../context/socket";
import "../App.css";

const ChatTest = () => {
    //Room State
    const [room, setRoom] = useState("");

    // Messages States
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
    };

    const sendMessage = () => {
        socket.emit("send_message", { message, room });
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message);
        });
    }, [socket]);

    return (
        <div className="App">
            <input
                placeholder="Room Number..."
                onChange={(event) => {
                    setRoom(event.target.value);
                }}
            />
            <button onClick={joinRoom}> Join Room</button>
            <input
                placeholder="Message..."
                onChange={(event) => {
                    setMessage(event.target.value);
                }}
            />
            <button onClick={sendMessage}> Send Message</button>
            <h1> Message:</h1>
            {messageReceived}
        </div>
    );
};

export default ChatTest;