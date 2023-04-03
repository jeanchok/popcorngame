import React, { useState, useEffect } from 'react';
//import { socket } from "../context/socket";
import { useSocket } from "../context/socket";
import { useSoundOn } from '.././context/SoundContext';

const Timer = ({ updateGivenHint }) => {
    const [socket] = useSocket();


    //const [startTimer, setStartTimer] = useState(false);

    const [hints, setHints] = useState([]);
    const [time, setTime] = useState(0);
    const [seconds, setSeconds] = useState(0);
    //const [seconds, setSeconds] = useState(time / 1000);
    const [switchColorTimer, setSwitchColorTimer] = useState(false);
    const soundOn = useSoundOn();
    let secLeft = new Audio("/sounds/5secLeft.mp3")

    socket.on('clearCanvas', () => {
        //setSeconds(0);
        console.log('clearCanvas')
    })

    useEffect(() => {
        socket.on('startTimer', ({ time }) => {
            setTime(time)
            setSeconds(time / 1000);
        })
    }, [socket]);

    useEffect(() => {
        socket.on('hints', (data) => { setHints(data); console.log('hintshintshints', data); });
    }, [socket]);

    if (hints[0] && seconds === hints[0].displayTime) {
        let hintsNewArr = hints;
        updateGivenHint(hints[0])
        hintsNewArr.shift();
        setHints(hintsNewArr);
        console.log(hints[0], 'hints');
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((seconds) => seconds - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // variable to store our intervalID

    let nIntervId;

    function changeColor() {
        // check if an interval has already been set up
        if (!nIntervId) {
            nIntervId = setInterval(flashText, 1000);
        }
    }

    function flashText() {
        switchColorTimer ? setSwitchColorTimer(false) : setSwitchColorTimer(true)
    }

    // useEffect(() => {
    if (seconds < 6) {
        changeColor();
    }

    if (seconds === 5 && soundOn) {
        secLeft.play()
    }

    if (seconds === 1) {
        clearInterval(nIntervId);
        // release our intervalID from the variable
        nIntervId = null;
        secLeft.remove();
    }
    // }, []);


    return (
        <>
            {
                time > 0 ?
                    (seconds >= 0) ?
                        <div className={
                            switchColorTimer ?
                                'flex justify-center mb-2 mt-5 border border-white font-bold text-white py-1 px-2 text-xl z-20 bg-zinc-800 md:relative md:top-0 md:left-0 absolute top-[54%] left-[2%]'
                                :
                                'flex justify-center mb-2 mt-5 border border-black font-bold text-black py-1 px-2 text-xl z-20 bg-white md:relative md:top-0 md:left-0 absolute top-[54%] left-[2%]'
                        }>
                            {seconds}
                        </div>
                        : <div className='md:flex justify-center mb-2 mt-5 h-[41px] py-1 px-2 text-xl hidden'></div>
                    : <div className=' justify-center mb-2 mt-5 h-[41px] py-1 px-2 text-xl md:flex hidden'></div>
            }
        </>
    );
}

export default Timer;