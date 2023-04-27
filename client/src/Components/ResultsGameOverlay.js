import React, { useState, useEffect } from 'react';
import BackButton from "../Components/BackButton";
import { avatars } from "../constant/const.js"
import { useSocket } from "../context/socket";
import { useUser, useUserUpdate } from '.././context/user';

const ResultsGameOverlay = ({ winnerName, playersList, roomID }) => {
    const userUpdate = useUserUpdate();
    const user = useUser();
    const [socket] = useSocket();
    const [hostRestartedToRoom, setHostRestartedToRoom] = useState(false);
    let isHosting = sessionStorage.getItem('isHosting');

    useEffect(() => {
        const restartToRoom = (data) => {
            setHostRestartedToRoom(true);
            userUpdate(user.name, user.playerAvatarIndex, data.newRoomID, user.isHosting);
        }
        socket.on('restartToRoom', restartToRoom)

        return () => {
            socket.off("restartToRoom", restartToRoom);
        };
    }, [socket]);

    return (
        <div className='bg-black/80 fixed z-20 h-full w-full flex items-center justify-center flex-col gap-2'>
            <BackButton to={"/"} roomID={roomID} />
            {
                isHosting === '1' ?
                    <BackButton to={"/room"} roomID={roomID} />
                    :
                    hostRestartedToRoom ?
                        <BackButton to={"/room"} roomID={roomID} />
                        :
                        null
            }
            <h2 className='text-4xl font-bold text-white mb-8 border-b-2 border-solid pb-3'>SCORE FINAL</h2>
            <h3 className='text-3xl text-white mb-8'>
                The gagnant is... <strong>{winnerName}</strong> !
            </h3>
            {playersList.map((player, index) =>
                <div key={index} className='ml-6 mb-2 flex w-9/10 h-14 bg-transparent border-white border-b-1'>
                    <div className='-ml-6 rounded-full w-14 m-auto overflow-hidden -mt-[1px] mr-4'>
                        <img className='object-cover bg' src={`./img/avatars/${avatars[player.playerAvatarIndex]}.jpg`} alt={avatars[player.playerAvatarIndex]} />
                    </div>
                    <h3 className='text-white m-auto items-center mr-4'>{player.name} - <strong>{player.score} Pts</strong></h3>
                </div>
            )}
        </div>
    );
};

export default ResultsGameOverlay;