import React from 'react';
import { avatars } from "../constant/const.js"

const PlayerList = ({ playersList }) => {
    return (
        <>
            <div className='flex flex-col lg:m-6 lg:w-[28%]  w-full h-[124px] lg:h-full p-2 lg:p-0 mt[70px]'>
                <div className='flex flex-col h-full'>
                    <h2 className='rounded-lg text-red-500 text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold hidden lg:block'>JOUEURS</h2>
                    <ul className='h-full overflow-y-auto lg:overflow-hidden scrollbar flex flex-row lg:flex-col'>
                        {playersList.map((player, index) =>
                            <li key={index} className='lg:rounded-l-full rounded-lg items-center lg:min-h-[60px] lg:mb-2 w-[80px] lg:w-[95%] lg:h-14 bg-transparent border-white lg:border mr-2 flex flex-col lg:flex-row h-full'>
                                <div className='rounded-full w-14 m-auto overflow-hidden lg:h-[95%] h-1/2 flex lg:block'>
                                    <img className='object-cover bg w-full h-full' src={`./img/avatars/${avatars[player.playerAvatarIndex]}.jpg`} alt={avatars[player.playerAvatarIndex]} />
                                </div>
                                <div className='w-[80%] lg:pl-2 flex flex-col lg:block '>
                                    <h3 className='text-white lg:m-auto text-center lg:text-left items-center mr-4 truncate pt-0'>{player.name}</h3>
                                    <strong className='text-white text-center'>{player.score} Pts</strong>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default PlayerList;