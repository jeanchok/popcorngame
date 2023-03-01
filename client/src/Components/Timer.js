import React, { useState, useEffect } from 'react';
//import { socket } from "../context/socket";
import { useSocket } from "../context/socket";

const Timer = (props) => {
    const [socket] = useSocket();
    const [seconds, setSeconds] = useState(props.time / 1000);
    const [startTimer, setStartTimer] = useState(false);

    socket.on('clearCanvas', () => {
        setSeconds(0);
        setStartTimer(false)
    })

    socket.on('startTimer', () => {
        setSeconds(props.time / 1000);
        setStartTimer(true);
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((seconds) => seconds - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {
                (seconds > 0) ?
                    <div className='flex justify-center mb-2 mt-5 border border-white font-bold text-white py-1 px-2 text-xl z-20 bg-zinc-800 md:relative md:top-0 md:left-0 absolute top-[54%] left-[2%]'>{seconds}</div>
                    : <div className='md:flex justify-center mb-2 mt-5 h-[41px] py-1 px-2 text-xl hidden'></div>
            }
        </>
    );
}

export default Timer;