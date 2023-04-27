import React, { useState, useEffect } from 'react';
import { useSocket } from "../context/socket";
import { useNavigate } from "react-router-dom";
import { avatars } from "../constant/const.js"
import { useUserUpdate } from '.././context/user';

const JoinGame = () => {
    const [socket] = useSocket();
    const [playerUsername, setPlayerUsername] = useState("");
    const [playerAvatarIndex, setPlayerAvatarIndex] = useState(0);
    const [response, setResponse] = useState("");
    const [paramId, setParamId] = useState("");
    const navigate = useNavigate();
    const userUpdate = useUserUpdate();

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (id) {
            setParamId(id)
        }
    }, []);

    const joinRoom = () => {
        let isHosting = false;
        userUpdate(playerUsername, playerAvatarIndex, paramId, isHosting)
        socket.emit('joinRoom', { id: paramId, player: playerUsername, playerAvatarIndex: playerAvatarIndex });
        navigate("/room", { state: playerUsername });
    }

    const ChooseAvatar = (e) => {
        e.preventDefault();
        if (playerAvatarIndex + 1 > avatars.length - 1) {
            setPlayerAvatarIndex(0)
        }
        else {
            setPlayerAvatarIndex(playerAvatarIndex + 1)
        }
    }

    const createRoom = async () => {
        let isHosting = true;
        socket.emit('newPrivateRoom', { playerUsername: playerUsername, playerAvatarIndex: playerAvatarIndex });
        await socket.on('newPrivateRoom', async (data) => {
            setResponse(data);
            await setParamId(data.gameID);
            sessionStorage.setItem('id', data.gameID);
            userUpdate(playerUsername, playerAvatarIndex, data.gameID, isHosting)
        });
        await navigate("/room", { state: paramId });
    }

    return (
        <form onSubmit={paramId ? (e) => joinRoom() : (e) => createRoom()} className='flex flex-col m-6 md:w-1/3 w-full'>
            <div className='bg-gradient-to-r  rounded-full w-40 m-auto overflow-hidden relative'>
                <img className='object-cover bg' src={`./img/avatars/${avatars[playerAvatarIndex]}.jpg`} alt={avatars[playerAvatarIndex]} />
                <button type="button" className='z-20 w-8 h-8 bg-white rounded-full absolute bottom-0 left-[40%] flex justify-center items-center hover:bg-slate-200 transition' onClick={(e) => ChooseAvatar(e)}>
                    <img className='w-6' src="./img/deux-fleches-circulaires.png" alt="flèche changement avatar" />
                </button>
            </div>
            <div className='flex flex-col'>
                <label htmlFor='playerNickname' className='text-center text-white'>Choisis ton chroniqueur et ton pseudo<time dateTime={response}>{response}</time></label>
                <input className='rounded-md mt-4 placeholder:italic bg-transparent placeholder:text-white text-white block bg-white w-full border border-red-300 py-2 px-4 pl-2 pr-3 shadow-sm focus:outline-none focus:border-red-300 focus:ring-red-300 focus:ring-1 sm:text-sm'
                    type='text'
                    placeholder={avatars[playerAvatarIndex] + '...'}
                    required
                    onChange={(e) => { setPlayerUsername(e.target.value) }}>
                </input>
            </div>
            <button className='rounded-md transition bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4'
                type='submit' value='Démarrer'
            >
                {
                    paramId ? 'REJOINDRE'
                        :
                        'DEMARRER'
                }
            </button>
        </form>
    );
};

export default JoinGame;