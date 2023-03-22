import React, { useEffect, useState, useRef } from "react";
//import { useCanvas } from "../context/CanvasContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../Components/Header";
// import { socket } from "../context/socket";
import { useSocket } from "../context/socket";

import Chat from "../Components/Chat";
import PlayerList from "../Components/PlayerList";
import Canva from "../Components/Canva";
import Timer from "../Components/Timer";
import Paricules from "../Components/Paricules";
import ResultsGameOverlay from "../Components/ResultsGameOverlay";
import BackButton from "../Components/BackButton";
import SoundButton from '.././Components/SoundButton';
import { useSoundOn } from '.././context/SoundContext';
import { useUser, useUserUpdate } from '.././context/user';


export function Canvas() {
    const [socket] = useSocket();
    const { state } = useLocation();
    const [playersList, setPlayersList] = useState(state);
    const [playersListUpdatedScore, setPlayersListUpdatedScore] = useState();
    const [time, setTime] = useState(0);
    const [endTime, setEndTime] = useState(true);
    const [endGame, setEndGame] = useState(false);
    const [score, setScore] = useState();
    const [winnerName, setWinnerName] = useState("");
    const [givenHint, setGivenHint] = useState("");
    const soundOn = useSoundOn();
    const [startSoundRoundStart, setStartSoundRoundStart] = useState(false);
    const [startSoundRoundEnd, setStartSoundRoundEnd] = useState(false);
    const [startSoundEndGame, setStartSoundEndGame] = useState(false);
    let roundEndSound = new Audio("/sounds/roundEnd.mp3")
    let endGameSound = new Audio("/sounds/finish.mp3")
    const user = useUser();
    const [sessionId, setSessionId] = useState(user.gameId);
    const [scaleRatio, setScaleRatio] = useState(null);

    const [sectionWidth, setSectionWidth] = useState('');
    const [sectionHeight, setSectionHeight] = useState('');

    // Timer const
    const [seconds, setSeconds] = useState(null);
    const [switchColorTimer, setSwitchColorTimer] = useState(false);
    let secLeft = new Audio("/sounds/5secLeft.mp3")
    const secondsRef = useRef(null);

    const [hints, setHints] = useState([]);


    useEffect(() => {
        secondsRef.current = seconds;
    }, [seconds]);

    useEffect(() => {
        setSessionId(user.gameId);
        console.log('useEffectRoomId: ' + user.gameId);
    }, [user.gameId]);
    //let sessionId = sessionStorage.getItem('id');

    if (startSoundEndGame && soundOn) {
        endGameSound.play();
    }

    useEffect(() => {
        socket.on('startTimer', ({ time }) => {
            setEndTime(false);
            setTime(time);

            setStartSoundRoundEnd(true);
        })

        socket.on('disconnection', (playerId) => {
            console.log('players', playerId)
            setPlayersList((current) =>
                current.filter((player) => player.playerId !== playerId)
            );
        })

        socket.on('updateScore', (data) => {
            let drawer = playersList.find(player => player.playerId === data.drawerID.name.playerId);
            drawer.score = data.drawerID.score;
            let player = playersList.find(player => player.playerId === data.playerID);
            player.score = data.score;
            setPlayersList([...playersList]);
        })

        socket.on('endGame', async ({ stats }) => {
            let highestScore = -1;
            let highestScoringUserId = "";
            // let players = Object.keys(stats).filter((val) => val.length === 20);
            // players.forEach((player) => {
            //     if (player.score > highestScore) {
            //         highestScore = player.score;
            //         highestScoringUserId = player.name.playerId;
            //     }
            // })
            for (let userId in stats) {
                if (userId !== "rounds" && userId !== "time" && userId !== "totalGuesses" && userId !== "currentWord" && userId !== "drawer" && userId !== "startTime") {
                    if (stats[userId].score > highestScore) {
                        highestScore = stats[userId].score;
                        highestScoringUserId = userId;
                    }
                }
            }
            let winner = playersList.find(player => player.playerId === highestScoringUserId);
            setTime(0);
            await setWinnerName(winner.name);
            setEndGame(true);
            await setStartSoundRoundEnd(false);
            setStartSoundEndGame(true);
        })

    }, [socket]);

    useEffect(() => {
        if (time > 0) {
            setSeconds(time / 1000);
        }
        console.log('time', time)
    }, [time]);


    const updateGivenHint = (hint) => {
        setGivenHint(hint.hint);
        console.log(hints, 'Hints');
    }

    // const updateSize = () => {
    //     if (window.innerWidth > 1024) {
    //         let ratio = window.innerWidth * 0.8 / 1500
    //         if (ratio > 1.11) {
    //             setScaleRatio(1.11)
    //         } else {
    //             setScaleRatio(window.innerWidth * 0.8 / 1500)
    //         }

    //     } else {
    //         setScaleRatio(null)
    //     }
    // }

    // useEffect(() => {
    //     updateSize();
    //     window.addEventListener("resize", updateSize);
    // }, []);

    return (

        <>

            <main className='flex flex-col items-center md:gap-2 h-full m-auto relative'>
                <div className="md:block hidden">
                    <Header />
                </div>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\fondpop.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                {/* {
                    time > 0 ?
                        <Timer time={time} updateGivenHint={updateGivenHint} /> : <div className=' justify-center mb-2 mt-5 h-[41px] py-1 px-2 text-xl md:flex hidden'></div>
                } */}

                <Timer updateGivenHint={updateGivenHint} />


                {
                    endGame ?
                        <ResultsGameOverlay winnerName={winnerName} playersList={playersList} roomID={sessionId} />
                        :
                        <section className={`w-full h-full md:w-[80%] md:h-[60%] bg-center justify-center mt-9o
                 flex content-center z-10 relative fade-in  backdrop-blur`}
                            style={(window.innerWidth > 768) ? { transform: `scale(${scaleRatio})` } : null}
                        >

                            <div className='absolute -top-[68px] left-[2%] md:block hidden'>
                                <BackButton to={"/"} roomID={null} />
                            </div>
                            <div className="w-20 absolute right-[15%] -top-[72px] md:block hidden">
                                <SoundButton />
                            </div>
                            <div className=' min-h-[70%] border-white/20 border bg-slate-50 bg-opacity-10 flex rounded-md backdrop-blur-sm md:w-full w-full flex-col md:flex-row'>

                                <PlayerList playersList={playersList} />

                                <Canva playersList={playersList} givenHint={givenHint} />
                                <Chat />
                            </div>
                        </section>
                }
                <Paricules />
            </main >
        </>

    );
}

export default Canvas;