import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socket";
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

    const backTo = async (e) => {
        const userConfirmation = window.confirm("Voulez-vous vraiment quitter le jeu ?");
        if (userConfirmation) {
            window.location.href = '/';
        } else {
            console.log("L'utilisateur a annulé l'action.");
        }
    }

    const handleBeforeUnload = (e) => {
        e.preventDefault();
        window.confirm('Voulez-vous vraiment quitter le jeu ?');
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
            {
                to === '/room' ?
                    <button onClick={(e) => { backToRoom(to) }} className=" mb-4">
                        <div className='bg-white flex p-2 rounded group hover:bg-neutral-900 transition'>
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                            <nav className='text-black text-xl pr-2 font-bold group-hover:text-white transition'>
                                REJOUER
                            </nav>
                        </div>
                    </button>
                    :
                    <button onClick={(e) => { backTo(e) }} className=" mb-4">
                        <div className='bg-white flex p-2 rounded  group hover:bg-neutral-900  transition'>
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                            <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                            <nav className='text-xl text-black pr-2 font-bold group-hover:text-white transition'>
                                ACCUEIL
                            </nav>
                        </div>
                    </button>
            }
        </>
    );
};

export default BackButton;