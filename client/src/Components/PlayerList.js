import React from 'react';

const PlayerList = ({ playersList }) => {
    return (
        <>
            {playersList.map((player, index) =>
                <div key={index} className='ml-6 mb-2 flex w-9/10 h-14 bg-red-400'>
                    <div className='-ml-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-14 m-auto overflow-hidden'>
                        <img className='object-cover bg' src=".\img\ponce.png" alt="" />
                    </div>
                    <h3 className='text-white m-auto items-center mr-4'>{player.name} - {player.score} Pts</h3>
                </div>
            )}
        </>
    );
};

export default PlayerList;