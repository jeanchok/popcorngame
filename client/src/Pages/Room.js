import React, { useRef, useEffect, useState } from 'react';
import Header from '../Components/Header';
import { useSocket } from "../context/socket";
import { useNavigate } from "react-router-dom";
import Paricules from '../Components/Paricules';
import CountdownOverlay from '../Components/CountdownOverlay';
import PlayerList from '../Components/PlayerList';
import BackButton from '../Components/BackButton';
import GameButton from '../Components/GameButton';
import SoundButton from '.././Components/SoundButton';
import { useSoundOn } from '.././context/SoundContext';
import { useUser } from '.././context/user';
import { gamesList } from '.././constant/const';

const Room = () => {
    const user = useUser();
    const [socket] = useSocket();
    const soundOn = useSoundOn();
    const [startSound, setStartSound] = useState(false);
    const [gameLink, setGameLink] = useState('');
    const [players, setPlayers] = useState([]);
    const [gameErrorMessage, setGameErrorMessage] = useState("");
    const [toggleBubleCopyLink, setToggleBubleCopyLink] = useState(false);
    const [playersList, setPlayersList] = useState([]);
    const [startCountdownOverlay, setStartCountdownOverlay] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState(1);


    const navigate = useNavigate();
    const gameIdRef = useRef(null)
    const playerRef = useRef(null)
    const playersListRef = useRef(null)
    const userRef = useRef(null);
    const [gameId, setGameId] = useState(user.gameId);

    let countDownSound = new Audio("/sounds/coutdown-start.mp3")
    //let countDownSoundOgg = new Audio("/sounds/coutdown-start.ogg")

    useEffect(() => {
        playerRef.current = players
    }, [players, startCountdownOverlay]);

    useEffect(() => {
        userRef.current = user
    }, [user]);

    useEffect(() => {
        playersListRef.current = playersList
    }, [playersList]);

    useEffect(() => {
        gameIdRef.current = gameId
    }, [gameId]);

    useEffect(() => {
        socket.on('joinExistingRoom', (data) => {
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.player, score: 0, playerId: data.playerId, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${user.gameID}`)
            socket.sentMydata = false;
        });
    }, [socket]);

    useEffect(() => {
        const newPrivateRoom = (data) => {
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            socket.emit('restartToRoom', { roomID: user.gameId, user: user, newRoomID: data.gameID });
            socket.sentMydata = false;
        }
        socket.on('newPrivateRoom', newPrivateRoom);

        return () => {
            socket.off("newPrivateRoom", newPrivateRoom);
        };
    }, [socket]);

    useEffect(() => {
        socket.on('joinRoom', (data) => {
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.player, score: 0, playerId: data.playerId, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.id}`)
        });
    }, [socket]);

    useEffect(() => {
        socket.on('players', (data) => {
            setPlayersList(data)
        })
    }, [socket]);

    socket.on('disconnection', (playerId) => {
        setPlayersList((current) =>
            current.filter((player) => player.playerId !== playerId)
        );
        setPlayers((current) =>
            current.filter((player) => player.playerId !== playerId)
        );
    })

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (user.isHosting) {
            socket.emit('players', { id: user.gameId, players: players });
            setPlayersList(players);
        } else {
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${gameId}`)
        }
    }, [players]);

    socket.on('selectGame', (selectedGameId) => {
        setSelectedGameId(selectedGameId)
    })

    useEffect(() => {
        if (user.isHosting) {
            socket.emit('selectGame', { selectedGameId, roomID: user.gameId })
        }
    }, [selectedGameId]);

    const copyLink = () => {
        setToggleBubleCopyLink(true);
        setTimeout(() => {
            setToggleBubleCopyLink(false);
        }, 3000);
        navigator.clipboard.writeText(gameLink);
    }

    const launchGame = () => {
        if (selectedGameId === 1) {
            if (!socket.sentMydata) {
                socket.emit('startCountdown', { roomID: user.gameId });
                socket.sentMydata = true;
            }
        }
        if (selectedGameId === 2 || selectedGameId === 3) {
            setGameErrorMessage(`Le jeux sélectionné n'est pas encore disponible`)
        }
    }

    useEffect(() => {
        const startGame = async () => {
            if (selectedGameId === 1 && playerRef.current.length > 0) {
                socket.emit('startPicass', { id: userRef.current.gameId, players: playerRef.current });
            }
        }

        const startCountdown = async () => {
            setStartSound(true);
            await setStartCountdownOverlay(true);
            setTimeout(() => {
                startGame();
            }, 1);
        }
        socket.on('startCountdown', startCountdown);

        return () => {
            socket.off("startCountdown", startCountdown);
        };
    }, [socket]);

    if (startSound && soundOn) {
        countDownSound.play();
    }

    useEffect(() => {
        const startPicass = async (data) => {
            navigate("/picass", { state: playersListRef.current });
        }
        socket.on('startPicass', startPicass)

        return () => {
            socket.off("startPicass", startPicass);
        };
    }, [socket]);

    return (
        <>
            {
                startCountdownOverlay ? <CountdownOverlay /> : null
            }
            <main className='flex flex-col items-center gap-[10%] h-full m-auto'>
                <Header />
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\fondpop.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl bg-center justify-center lg:w-[67%] lg:h-[50%] w-[90%] h-[60%] mt-9o
                 flex content-center z-10 relative fade-in  backdrop-blur'>
                    <div className='absolute -top-[68px] left-[15%]'>
                        <BackButton to={"/"} roomID={null} />
                    </div>
                    <div className="w-20 absolute right-[15%] -top-[72px]">
                        <SoundButton />
                    </div>
                    <div className=' m-auto min-h-1/2 border-white/20 border bg-slate-50 bg-opacity-10 h-full flex rounded-md flex-col lg:flex-row w-full'>
                        <PlayerList playersList={playersList} />
                        <div className='bg-transparent h-full lg:w-[80%] w-full'>
                            <h2 className='text-white border-white/20 border text-center flex items-center justify-center lg:block lg:pb-4 lg:pt-4 border-red-400 border-l-2 text-xl font-semibold h-[15%]'>CHOISIR LE JEU</h2>
                            <div className='flex flex-col bg-neutral-900 h-full lg:h-[85%] w-full border-white/20 border gap-2 rounded-br-lg items-center'>
                                <div className='lg:w-[80%] flex flex-col h-full justify-between w-full'>
                                    <div className='lg:h-full h-[75%] flex flex-row justify-between p-6 mb-0 gap-4 overflow-x-auto w-full'>
                                        <>
                                            {gamesList.map((game) => {
                                                const isSelected = game.id === selectedGameId;
                                                return (
                                                    <GameButton
                                                        key={game.id}
                                                        game={game}
                                                        selected={isSelected}
                                                        onClick={(user.isHosting) ? () => setSelectedGameId(game.id) : null}
                                                    />)
                                            })}
                                        </>
                                    </div>
                                    <div className='flex w-full lg:m-auto justify-around lg:mt-10 lg:mb-10 relative lg:p-0 pb-5'>
                                        <button className='rounded-md bg-white hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 hover:border-transparent mt-4 w-1/3 transition relative flex justify-center' type='submit' value='Démarrer' onClick={copyLink}>INVITER
                                            {
                                                toggleBubleCopyLink ?
                                                    <div className='text-white p-1 absolute -bottom-8 left-[25%]'>
                                                        <p>Lien Copié !</p>
                                                    </div>
                                                    : null
                                            }
                                        </button>
                                        {user.isHosting ?
                                            <button className='rounded-md bg-white hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 hover:border-transparent mt-4 w-1/3 transition flex justify-center' type='submit' value='Démarrer' onClick={launchGame}>DEMARRER
                                                {
                                                    (gameErrorMessage !== "") ?
                                                        <div className='text-white p-1 absolute -bottom-8 left-[25%]'>
                                                            <p>{gameErrorMessage}</p>
                                                        </div>
                                                        : null
                                                }
                                            </button>
                                            : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Paricules />
            </main>
        </>
    );
};

export default Room;