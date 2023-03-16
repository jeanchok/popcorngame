import React, { useRef, useEffect, useState } from 'react';
import Header from '../Components/Header';
//import { socket } from "../context/socket";

import { useSocket } from "../context/socket";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { data } from 'autoprefixer';
import { avatars } from "../constant/const.js"
import Paricules from '../Components/Paricules';
import CountdownOverlay from '../Components/CountdownOverlay';
import PlayerList from '../Components/PlayerList';
import { errorMessage } from 'stream-chat-react/dist/components/AutoCompleteTextarea/utils';
import BackButton from '../Components/BackButton';
import SoundButton from '.././Components/SoundButton';
import { useSoundOn } from '.././context/SoundContext';
import { useUser, useUserUpdate } from '.././context/user';


const Room = () => {
    const user = useUser();
    const [socket] = useSocket();
    const soundOn = useSoundOn();
    const [startSound, setStartSound] = useState(false);
    //const gameId = sessionStorage.getItem('id');
    const [gameLink, setGameLink] = useState('');
    const { state } = useLocation();
    let games = ['Le Picass', 'Rat de Stars', 'Au + Proche'];
    const [players, setPlayers] = useState([]);
    const [selectedGame1, setSelectedGame1] = useState(true);
    const [selectedGame2, setSelectedGame2] = useState(false);
    const [selectedGame3, setSelectedGame3] = useState(false);
    const [gameErrorMessage, setGameErrorMessage] = useState("");

    const [toggleBubleCopyLink, setToggleBubleCopyLink] = useState(false);
    const [playersList, setPlayersList] = useState([]);
    const [startCountdownOverlay, setStartCountdownOverlay] = useState(false);
    let isHosting = sessionStorage.getItem('isHosting');
    let playerUsername = sessionStorage.getItem('name');
    const navigate = useNavigate();
    const didMount = useRef(false);

    const sessionIdRef = useRef(null)
    const playerRef = useRef(null)
    const playersListRef = useRef(null)
    const userRef = useRef(null);

    const [paramId, setParamId] = useState(sessionStorage.getItem('id'));
    let sessionId = sessionStorage.getItem('id');
    let countDownSound = new Audio("/sounds/coutdown-start.mp3")
    let countDownSoundOgg = new Audio("/sounds/coutdown-start.ogg")

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
        sessionIdRef.current = sessionId
    }, [sessionId]);




    // useEffect(() => {
    //     socket.on('restartExistingRoom', (data) => {
    //         setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
    //         const newPlayerArray = [...playerRef.current];
    //         newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id, playerAvatarIndex: data.playerAvatarIndex });
    //         setPlayers(newPlayerArray);
    //         console.log('restartExistingRoom', data.gameID);
    //     });
    // }, [socket]);

    useEffect(() => {

        console.log('joinExistingRoomBefore', players);
        socket.on('joinExistingRoom', (data) => {
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.player, score: 0, playerId: data.playerId, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            console.log('joinExistingRoom', playerRef.current, 'data', data);
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.id}`)
            socket.sentMydata = false;
        });
    }, [socket]);

    // useEffect(() => {
    //     const restartToRoom = (data) => {
    //         if (user.isHosting) {
    //             console.log('restartToRoom');
    //             setPlayers([...players, data.userName]);
    //             console.log(data, players);
    //         }
    //     }

    //     socket.on('restartToRoom', restartToRoom);

    //     return () => {
    //         socket.off("restartToRoom", restartToRoom);
    //     };
    // }, [socket]);

    // socket.on('restartToRoom', (data) => {
    //     setPlayers([...players, data.userName]);
    //     console.log(data, players);
    // });

    useEffect(() => {

        const newPrivateRoom = (data) => {
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            console.log('newPrivateRoom', data.gameID);

            socket.emit('restartToRoom', { roomID: user.gameId, user: user, newRoomID: data.gameID });
            socket.sentMydata = false;
        }

        socket.on('newPrivateRoom', newPrivateRoom);

        return () => {
            socket.off("newPrivateRoom", newPrivateRoom);
        };
        // socket.on('newPrivateRoom', (data) => {
        //     setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
        //     const newPlayerArray = [...playerRef.current];
        //     newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id, playerAvatarIndex: data.playerAvatarIndex });
        //     setPlayers(newPlayerArray);
        //     console.log('newPrivateRoom');
        // });
    }, [socket]);


    // socket.on('newPrivateRoom', (data) => {
    //     setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
    //     const newPlayerArray = [...players];
    //     newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id, playerAvatarIndex: data.playerAvatarIndex });
    //     setPlayers(newPlayerArray);
    //     console.log('newPrivateRoom');
    //     console.log(players)
    // });
    useEffect(() => {
        console.log('user', user);
    }, [user]);


    useEffect(() => {
        socket.on('joinRoom', (data) => {
            const newPlayerArray = [...playerRef.current];
            newPlayerArray.push({ name: data.player, score: 0, playerId: data.playerId, playerAvatarIndex: data.playerAvatarIndex });
            setPlayers(newPlayerArray);
            console.log('joinRoom', playerRef.current);
            setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.id}`)
        });
    }, [socket]);


    useEffect(() => {
        socket.on('players', (data) => {
            console.log('players', data)
            setPlayersList(data)
        })
    }, [socket]);

    socket.on('disconnection', (playerId) => {
        console.log('players', playerId)
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
        setGameLink(`${window.location.protocol}//${window.location.host}/?id=${sessionId}`)
        if (isHosting === '1' || user.isHosting === true) {
            console.log('user.gameId', user.gameId);
            socket.emit('players', { id: user.gameId, players: players });
            setPlayersList(players);
            console.log('otherplayname', players);
        }
    }, [players]);

    // useEffect(() => {
    //     if (Array.isArray(state)) {
    //         setPlayersList(state)
    //     }
    //     console.log(Array.isArray(state))
    // }, []);


    socket.on('selectGame', (data) => {
        //console.log('game', data)
        if (data.selectedGame1) {
            selectGame1();
        }
        if (data.selectedGame2) {
            selectGame2();
        }
        if (data.selectedGame3) {
            selectGame3();
        }
    })

    //let games = ['Le Picass', 'Rat de Stars', 'Au + Proche'];

    useEffect(() => {
        if (isHosting === '1') {
            if (selectedGame1) {
                socket.emit('selectGame', { selectedGame1, roomID: sessionId })
            }
            if (selectedGame2) {
                socket.emit('selectGame', { selectedGame2, roomID: sessionId })
            }
            if (selectedGame3) {
                socket.emit('selectGame', { selectedGame3, roomID: sessionId })
            }
        }

    }, [selectedGame1, selectedGame2, selectedGame3]);

    const selectGame1 = () => {
        setSelectedGame1(!selectedGame1);
        setSelectedGame3(false);
        setSelectedGame2(false);
    }

    const selectGame2 = () => {
        setSelectedGame2(!selectedGame2);
        setSelectedGame3(false);
        setSelectedGame1(false);
    }

    const selectGame3 = () => {
        setSelectedGame3(!selectedGame3);
        setSelectedGame2(false);
        setSelectedGame1(false);
    }


    const copyLink = () => {
        setToggleBubleCopyLink(true);
        setTimeout(() => {
            setToggleBubleCopyLink(false);
        }, 3000);
        navigator.clipboard.writeText(gameLink);
    }


    const launchGame = () => {
        if (selectedGame1) {
            console.log('DEMARRER4', socket.sentMydata)
            if (!socket.sentMydata) {
                socket.emit('startCountdown', { roomID: sessionId });
                socket.sentMydata = true;
            }
        }
        if (selectedGame2 || selectedGame3) {
            setGameErrorMessage(`Le jeux sélectionné n'est pas encore disponible`)
        }
        // if (selectedGame1 && players.length > 1) {
        //     socket.emit('startCountdown', { roomID: sessionId });
        // }
        // if (players.length < 2) {
        //     setGameErrorMessage(`Tu ne dois pas être tout seul pour jouer :(`)
        // }
    }

    useEffect(() => {
        const startGame = async () => {
            if (selectedGame1 && playerRef.current.length > 0) {
                socket.emit('startPicass', { id: sessionIdRef.current, players: playerRef.current });
                console.log('startGame', playerRef.current, 'sessionId', sessionId, playersList.length)
            }
        }

        const startCountdown = async () => {
            console.log('startCountdown')
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

    // socket.on('startCountdown', async () => {
    //     console.log('startCountdown')
    //     setStartSound(true);
    //     await setStartCountdownOverlay(true);
    //     setTimeout(() => {
    //         startGame();
    //     }, 1);
    // });

    if (startSound && soundOn) {
        countDownSound.play();
    }

    // socket.on('startPicass', async (data) => {
    //     console.log('startPicass', data)
    //     navigate("/picass", { state: playersList });
    // })

    useEffect(() => {

        const startPicass = async (data) => {
            navigate("/picass", { state: playersListRef.current });
        }

        socket.on('startPicass', startPicass)
        //     // socket.on('startPicass', async (data) => {
        //     //     console.log('startPicass', data)
        //     //     navigate("/picass", { state: playersList });
        //     // })
        return () => {
            socket.off("startPicass", startPicass);
        };
    }, [socket]);

    // const startGame = async () => {
    //     if (selectedGame1) {
    //         socket.emit('startPicass', { id: sessionId, players: players });
    //     }
    // }

    return (
        <>
            {
                startCountdownOverlay ? <CountdownOverlay /> : null
            }
            <main className='flex flex-col items-center gap-[10%] h-full m-auto'>
                <Header />
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\fondpop.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl bg-center justify-center md:w-[67%] md:h-[50%] w-[90%] h-[60%] mt-9o
                 flex content-center z-10 relative fade-in  backdrop-blur'>

                    <div className='absolute -top-[68px] left-[15%]'>
                        <BackButton to={"/"} roomID={null} />
                    </div>
                    <div className="w-20 absolute right-[15%] -top-[72px]">
                        <SoundButton />
                    </div>
                    <div className=' m-auto min-h-1/2 border-white/20 border bg-slate-50 bg-opacity-10 h-full flex rounded-md flex-col md:flex-row w-full'>

                        <PlayerList playersList={playersList} />


                        <div className='bg-transparent h-full md:w-[80%] w-full'>
                            <h2 className='text-white border-white/20 border text-center flex items-center justify-center md:block md:pb-4 md:pt-4 border-red-400 border-l-2 text-xl font-semibold h-[15%]'>CHOISIR LE JEU</h2>
                            <div className='flex flex-col bg-neutral-900 h-full md:h-[85%] w-full border-white/20 border gap-2 rounded-br-lg items-center'>
                                <div className='md:w-[80%] flex flex-col h-full justify-between w-full'>


                                    <div className='md:h-full h-[75%] flex flex-row justify-between p-6 mb-0 gap-4 overflow-x-auto w-full'>
                                        {/* {games.map((game) =>
                                        <button key={game} onClick={selectGame} className={selectedGame ? 'bg-red h-full' : 'bg-white h-full'}>
                                            <h3 className='flex justify-center h-full items-center'>{game}</h3>
                                        </button>
                                    )} */}
                                        {
                                            (isHosting === '1') ?
                                                <>

                                                    <div className='wrapper aspect-[3/4] h-full group'>
                                                        <button onClick={selectedGame1 ? null : selectGame1} className={selectedGame1 ? 'group-hover:translate-x-[9px] relative z-10 ease-in transition duration-75 group-hover:-translate-y-[9px] w-full max-h-full delay-75 bg-red h-full text-white border-2 border-white' : 'bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition delay-75'}>
                                                            <img src="/img/picass.webp" alt="picass" />
                                                        </button>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>
                                                    <div className='wrapper aspect-[3/4] h-full group '>
                                                        <button onClick={selectedGame2 ? null : selectGame2} className={selectedGame2 ? 'group-hover:translate-x-[9px] relative z-10 ease-in transition duration-75 group-hover:-translate-y-[9px] max-w-full max-h-full delay-75 bg-red h-full text-white border-2 border-white' : 'bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition delay-75'}>
                                                            <img src="/img/auplusproche.webp" alt="au plus proche" />
                                                        </button>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>
                                                    <div className='wrapper aspect-[3/4] h-full group'>
                                                        <button onClick={selectedGame3 ? null : selectGame3} className={selectedGame3 ? 'group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in transition duration-75 delay-75 max-w-full max-h-full bg-red h-full text-white border-2 border-white items-center' : 'bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition delay-75'}>
                                                            <img src="/img/rat2.webp" alt="rat de star" />
                                                        </button>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>

                                                </>
                                                :
                                                <>
                                                    <div className='wrapper aspect-[3/4] h-full group'>
                                                        <div className={selectedGame1 ? 'group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in transition duration-75 delay-75 aspect-[3/4] bg-red h-full text-white border-2 border-white flex items-center' : 'flex items-center bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition aspect-[3/4] delay-75'}>
                                                            <img src="/img/picass.webp" alt="picass" />
                                                        </div>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>
                                                    <div className='wrapper aspect-[3/4] h-full group'>
                                                        <div className={selectedGame2 ? 'group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in transition duration-75 delay-75 aspect-[3/4] bg-red h-full text-white border-2 border-white flex items-center' : 'flex items-center bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition aspect-[3/4] delay-75'}>
                                                            <img src="/img/auplusproche.webp" alt="picass" />
                                                        </div>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>
                                                    <div className='wrapper aspect-[3/4] h-full group'>
                                                        <div className={selectedGame3 ? 'group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in transition duration-75 delay-75 aspect-[3/4] bg-red h-full text-white border-2 border-white flex items-center' : 'flex items-center bg-white h-full group-hover:translate-x-[9px] group-hover:-translate-y-[9px] relative z-10 ease-in duration-75 transition aspect-[3/4] delay-75'}>
                                                            <img src="/img/rat2.webp" alt="picass" />
                                                        </div>
                                                        <div className='cornerRight'></div>
                                                        <div className='cornerLeft'></div>
                                                        <div className='bottom'></div>
                                                        <div className='left'></div>
                                                    </div>
                                                </>

                                        }

                                    </div>
                                    <div className='flex w-full md:m-auto justify-around md:mt-10 md:mb-10 relative md:p-0 pb-5'>

                                        <button className=' bg-white hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4 w-1/3 transition relative flex justify-center' type='submit' value='Démarrer' onClick={copyLink}>INVITER
                                            {
                                                toggleBubleCopyLink ?
                                                    <div className='text-white p-1 absolute -bottom-8 left-[25%]'>
                                                        <p>Lien Copié !</p>
                                                    </div>
                                                    : null
                                            }
                                        </button>
                                        {isHosting === '1' ?
                                            <button className=' bg-white hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4 w-1/3 transition flex justify-center' type='submit' value='Démarrer' onClick={launchGame}>DEMARRER
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