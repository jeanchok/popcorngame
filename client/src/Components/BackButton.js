import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../context/socket";
import io from "socket.io-client";
import { useUser } from '.././context/user';

const BackButton = ({ to, roomID }) => {
    const [socket, reconnect] = useSocket();
    const user = useUser();
    const navigate = useNavigate();

    const backToRoom = async (to) => {
        if (user.isHosting) {
            socket.emit('restartExistingRoom', { roomID: user.gameId, playerUsername: user.name, playerAvatarIndex: user.playerAvatarIndex });
            //await socket.emit('restartToRoom', { roomID: user.gameId, user: user });
            console.log('restartToRoomgameId', user.gameId);

            //navigate(to, { state: state });
            navigate(to);
        } else if (!user.isHosting) {
            socket.emit('joinRoom', { id: user.gameId, player: user.name, playerAvatarIndex: user.playerAvatarIndex });
            //socket.emit('joinExistingRoom', { roomID: user.gameId, player: user.name, playerAvatarIndex: user.playerAvatarIndex });
            console.log('joinExistingRoom', user)
            //navigate(to, { state: state });
            navigate(to);
        }

    }

    const backTo = async (to) => {
        //await reconnect();
        //navigate(to);
        window.location.href = '/';
    }



    return (
        <>
            {
                to === '/room' ?
                    <button onClick={(e) => { backToRoom(to) }}>
                        <div className='bg-white flex p-2 mb-4 rounded group hover:bg-black hover:border border  transition'>
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                            <nav className='text-black text-xl pr-2 font-bold group-hover:text-white transition'>
                                REJOUER
                            </nav>
                        </div>
                    </button>
                    :
                    <button onClick={() => { backTo(to) }}>
                        <div className='bg-white flex p-2 mb-4 rounded  group hover:bg-black hover:border border  transition'>
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                            <nav className='text-xl text-black pr-2 font-bold group-hover:text-white transition'>
                                ACCUEIL
                            </nav>
                        </div>
                    </button>
            }
            {/* <button onClick={() => { backTo(to) }}>
                <div className='bg-white flex p-2 mb-4 rounded group hover:bg-black hover:border border  transition'>
                    <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                    <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                    <nav className='text-xl pr-2 font-bold group-hover:text-white transition md:block hidden'>
                        ACCUEIL
                    </nav>
                </div>
            </button> */}
        </>
    );
};

export default BackButton;