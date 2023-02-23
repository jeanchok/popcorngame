import React from 'react';
import { avatars } from "../constant/const.js"

const PlayerList = ({ playersList }) => {
    return (
        <>
            <div className='flex flex-col md:m-6 md:w-[28%] w-full h-[124px] md:h-full p-2 md:p-0'>
                <div className='flex flex-col h-full'>
                    <h2 className='rounded-lg text-red-500 text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold hidden md:block'>JOUEURS</h2>
                    <ul className='h-full overflow-y-auto md:overflow-hidden scrollbar flex flex-row md:flex-col'>
                        {playersList.map((player, index) =>
                            <li key={index} className='md:ml-6 items-center md:mb-2 w-[80px] md:w-[80%] md:h-14 bg-transparent border-white md:border border-l-transparent mr-2 flex flex-col md:flex-row h-full'>
                                <div className='md:-ml-6 rounded-full w-14 m-auto overflow-hidden md:-mt-[1px] md:h-full h-1/2 flex md:block'>
                                    <img className='object-cover bg w-full' src={`./img/avatars/${avatars[player.playerAvatarIndex]}.jpg`} alt={avatars[player.playerAvatarIndex]} />
                                </div>
                                <div className='w-[80%] md:pl-2 flex flex-col md:block '>
                                    <h3 className='text-white md:m-auto text-center md:text-left items-center mr-4 truncate pt-1'>{player.name}</h3>
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