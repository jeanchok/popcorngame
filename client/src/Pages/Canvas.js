import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../Components/Header";
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
    const [time, setTime] = useState(0);
    const [endGame, setEndGame] = useState(false);
    const [winnerName, setWinnerName] = useState("");
    const [givenHint, setGivenHint] = useState("");
    const soundOn = useSoundOn();
    const [startSoundRoundStart, setStartSoundRoundStart] = useState(false);
    const [startSoundRoundEnd, setStartSoundRoundEnd] = useState(false);
    const [startSoundEndGame, setStartSoundEndGame] = useState(false);
    const user = useUser();
    const [gameId, setGameId] = useState(user.gameId);
    const [scaleRatio, setScaleRatio] = useState(null);
    const [seconds, setSeconds] = useState(null);
    const secondsRef = useRef(null);

    useEffect(() => {
        secondsRef.current = seconds;
    }, [seconds]);

    useEffect(() => {
        setGameId(user.gameId);
    }, [user.gameId]);


    useEffect(() => {
        const endGameSound = new Audio("/sounds/finish.mp3")
        if (startSoundEndGame && soundOn) {
            endGameSound.play()
        }
        return () => {
            endGameSound.remove();
        };
    }, [startSoundEndGame && soundOn]);

    useEffect(() => {
        const roundStartSound = new Audio("/sounds/roundStart.mp3")
        if (startSoundRoundStart && soundOn) {
            roundStartSound.play()
            setStartSoundRoundStart(false)
        }
    }, [startSoundRoundStart]);

    useEffect(() => {
        socket.on('startTimer', ({ time }) => {
            setTime(time);
            setStartSoundRoundStart(true);
        })

        socket.on('disconnection', (playerId) => {
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
    }, [time]);

    const updateGivenHint = (hint) => {
        setGivenHint(hint.hint);
    }

    return (
        <>
            <main className='flex flex-col items-center lg:gap-2 h-full m-auto relative'>
                <div className="lg:block hidden">
                    <Header />
                </div>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\fondpop.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <Timer updateGivenHint={updateGivenHint} />

                {
                    endGame ?
                        <ResultsGameOverlay winnerName={winnerName} playersList={playersList} roomID={gameId} />
                        :
                        <>

                            <section className={`w-full h-full lg:w-[80%] lg:h-[60%] bg-center justify-center mt-9o
                 flex content-center z-10 relative fade-in  backdrop-blur`}
                                style={(window.innerWidth > 768) ? { transform: `scale(${scaleRatio})` } : null}
                            >
                                <div className='absolute -top-[68px] left-[2%] lg:block hidden'>
                                    <BackButton to={"/"} roomID={null} />
                                </div>
                                <div className="w-20 absolute right-[15%] -top-[72px] lg:block hidden">
                                    <SoundButton />
                                </div>
                                <div className=' min-h-[70%] border-white/20 border bg-slate-50 bg-opacity-10 flex rounded-md backdrop-blur-sm lg:w-full w-full flex-col lg:flex-row lg:pt-0 pt-[38px]'>
                                    <PlayerList playersList={playersList} />
                                    <Canva playersList={playersList} givenHint={givenHint} />
                                    <Chat />
                                </div>
                            </section>
                        </>
                }
                <Paricules />
            </main >
        </>
    );
}

export default Canvas;