import React from 'react';
import { Link, useNavigate } from "react-router-dom";
//import { socket } from "../context/socket";

//import { useSocket, useSocketReconnect } from "../context/socket";
import { useSocket } from "../context/socket";
import io from "socket.io-client";

const BackButton = ({ to, state }) => {
    //const reconnect = useSocketReconnect();
    const [socket, reconnect] = useSocket();
    const navigate = useNavigate();

    const backToRoom = (to) => {
        navigate(to, { state: state });
    }

    const backTo = async (to) => {
        //await reconnect();
        //navigate(to);
        window.location.href = '/';
    }

    return (
        <>
            {
                // to === '/room' ?
                //     <button onClick={() => { backToRoom(to) }}>
                //         {/* <button onClick={reconnect}> */}
                //         <div className='bg-white flex p-2 mb-4 rounded group hover:bg-black hover:border border  transition'>
                //             <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                //             <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                //             <nav className='text-xl pr-2 font-bold group-hover:text-white transition'>
                //                 REJOUER
                //             </nav>
                //         </div>
                //     </button>
                //     :
                //     <button onClick={() => { reconnect(); backTo(to) }}>
                //         <div className='bg-white flex p-2 mb-4 rounded group hover:bg-black hover:border border  transition'>
                //             <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                //             <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                //             <nav className='text-xl pr-2 font-bold group-hover:text-white transition'>
                //                 ACCUEIL
                //             </nav>
                //         </div>
                //     </button>
            }
            <button onClick={() => { backTo(to) }}>
                <div className='bg-white flex p-2 mb-4 rounded group hover:bg-black hover:border border  transition'>
                    <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche.png" className='w-8 pr-2 group-hover:hidden transition' alt="flêche" />
                    <img src="/img/angle-de-la-fleche-pointant-vers-la-gauche-white.png" className='w-8 pr-2 hidden transition group-hover:block' alt="flêche" />
                    <nav className='text-xl pr-2 font-bold group-hover:text-white transition md:block hidden'>
                        ACCUEIL
                    </nav>
                </div>
            </button>
        </>
    );
};

export default BackButton;