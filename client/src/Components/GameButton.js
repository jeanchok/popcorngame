import React from 'react';

const GameButton = ({ game, selected, onClick }) => (

    <div className="wrapper aspect-[3/4] h-full group">
        <button
            onClick={selected ? null : onClick}
            className={
                selected
                    ? 'group-hover:translate-x-[9px] relative z-10 ease-in transition duration-75 group-hover:-translate-y-[9px] w-full max-h-full delay-75 bg-red h-full text-white border-2 border-white'
                    : 'bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition delay-75'
            }
        >
            {!game.available && (
                <div className="h-full w-full bg-black/70 flex justify-center items-center absolute top-0">
                    <h3 className="text-white font-semibold text-xl">Bientôt</h3>
                </div>
            )}
            <img src={game.img} alt={game.name} />
        </button>
        <div className="cornerRight"></div>
        <div className="cornerLeft"></div>
        <div className="bottom"></div>
        <div className="left"></div>
    </div>
);

export default GameButton;