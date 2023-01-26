import React, { useState, useEffect } from 'react';
import { socket } from "../context/socket";

const Timer = (props) => {
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
                    <div className='flex justify-center mb-63 mt-50 border border-black font-bold bg-gray-700 text-white py-5 text-xl'>{seconds}</div>
                    : null
            }
        </>
    );
}

export default Timer;