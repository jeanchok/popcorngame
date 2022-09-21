import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { socket } from "../context/socket";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";


const JoinGame = () => {
    const [playerUsername, setPlayerUsername] = useState("");

    const [response, setResponse] = useState("");
    const [paramId, setParamId] = useState("");
    const navigate = useNavigate();



    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (id) {
            setParamId(id)
        }

    }, []);


    const joinRoom = () => {

        sessionStorage.setItem('name', playerUsername);
        sessionStorage.setItem('id', paramId);
        sessionStorage.setItem('isHosting', '0');
        socket.emit('joinRoom', { id: paramId, player: playerUsername });
        navigate("/room", { state: playerUsername });
    }



    const createRoom = async () => {
        await sessionStorage.setItem('name', playerUsername);

        socket.emit('newPrivateRoom', playerUsername);
        await socket.on('newPrivateRoom', (data) => {
            setResponse(data);
            console.log(data, 'response');

            sessionStorage.setItem('id', data.gameID);
            sessionStorage.setItem('isHosting', '1');
        });

        await navigate("/room", { state: paramId });
    }



    return (
        <form onSubmit={paramId ? (e) => joinRoom() : (e) => createRoom()} className='flex flex-col m-6 w-1/3'>
            <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-40 m-auto border border-white overflow-hidden'>
                <img className='object-cover bg' src=".\img\ponce.png" alt="" />

            </div>

            <div className='flex flex-col'>
                <label htmlFor='playerNickname' className='text-center'>Choisis ton chroniqueur et ton pseudo //  It's <time dateTime={response}>{response}</time></label>
                <input className=' bg-red-100 mt-4 placeholder:italic placeholder:text-white block bg-white w-full border border-red-300 py-2 px-4 pl-2 pr-3 shadow-sm focus:outline-none focus:border-red-300 focus:ring-red-300 focus:ring-1 sm:text-sm'
                    type='text'
                    placeholder='Ponce...'
                    onChange={(e) => { setPlayerUsername(e.target.value) }}>
                </input>
            </div>
            {paramId ?
                <button className='bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4'
                    type='submit' value='Démarrer'
                >REJOINDRE
                </button>
                :
                <button className='bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4'
                    type='submit' value='Démarrer'
                >DEMARRER
                </button>}
        </form>
    );
};

export default JoinGame;