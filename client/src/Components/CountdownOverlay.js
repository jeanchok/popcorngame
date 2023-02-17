import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';

const CountdownOverlay = () => {
    const Completionist = () => <span>GO !</span>;

    const renderer = ({ hours, minutes, seconds }) => (
        <div className='relative w-1/2 h-1/2 flex justify-center items-center'>
            <svg height="200" width="200" className='absolute'>
                <circle cx="100" cy="100" r="80" stroke="white" stroke-width="3" fill="transparent" />
            </svg>
            <span className='text-8xl text-white bold absolute pb-4'>
                {zeroPad(seconds, 1)}
            </span>
        </div>

    );

    return (
        <div className='bg-black/80 fixed z-20 h-full w-full flex items-center justify-center'>
            <Countdown renderer={renderer} zeroPadTime={1} date={Date.now() + 3000}>
                <Completionist />
            </Countdown>
        </div>

    );
};

export default CountdownOverlay;