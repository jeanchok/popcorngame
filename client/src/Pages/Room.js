import React, { useRef, useEffect, useState } from 'react';
import Header from '../Components/Header';
import { socket } from "../context/socket";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { data } from 'autoprefixer';


const Room = () => {
    //const gameId = sessionStorage.getItem('id');
    const [gameLink, setGameLink] = useState('');
    let games = ['Le Picass', 'Rat de Stars', 'Au + Proche'];
    const [players, setPlayers] = useState([]);
    const [selectedGame1, setSelectedGame1] = useState(true);
    const [selectedGame2, setSelectedGame2] = useState(false);
    const [selectedGame3, setSelectedGame3] = useState(false);
    const [playersList, setPlayersList] = useState([]);
    let isHosting = sessionStorage.getItem('isHosting');
    let playerUsername = sessionStorage.getItem('name');
    const navigate = useNavigate();
    const didMount = useRef(false);
    const { state } = useLocation();
    const [paramId, setParamId] = useState(sessionStorage.getItem('id'));

    socket.on('newPrivateRoom', (data) => {
        setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.gameID}`);
        const newPlayerArray = [...players];
        newPlayerArray.push({ name: data.userName, score: 0, playerId: data.id });
        setPlayers(newPlayerArray);
        console.log(players)
    });
    socket.on('joinRoom', (data) => {
        const newPlayerArray = [...players];
        newPlayerArray.push({ name: data.player, score: 0, playerId: data.playerId });
        setPlayers(newPlayerArray);
        setGameLink(`${window.location.protocol}//${window.location.host}/?id=${data.id}`)
        console.log(players)
    });


    socket.on('players', (data) => {
        console.log('players', data)
        setPlayersList(data)
    })

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (isHosting === '1') {
            socket.emit('players', { id: id, players: players });
            setPlayersList(players);
            console.log('otherplayname', players);
        }
    }, [players]);



    socket.on('selectGame', (data) => {
        console.log('game', data)
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
                socket.emit('selectGame', { selectedGame1 })
            }
            if (selectedGame2) {
                socket.emit('selectGame', { selectedGame2 })
            }
            if (selectedGame3) {
                socket.emit('selectGame', { selectedGame3 })
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
        navigator.clipboard.writeText(gameLink);
    }


    socket.on('startPicass', (data) => {
        console.log('startpicass', data);
        navigate("/picass", { state: playersList });
    })


    const startGame = () => {
        if (selectedGame1) {
            let sessionId = sessionStorage.getItem('id');
            console.log('here obj', { id: paramId, players: players });
            socket.emit('startPicass', { id: sessionId, players: players });
        }
    }



    return (
        <>
            <Header />
            <main className=' h-full m-auto'>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\capture intro yt gomaid.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl m-auto bg-center center w-full h-full mt-9o
                 flex content-center'>
                    <div className='m-auto min-h-1/2 bg-white w-3/4 h-1/2 flex'>
                        <div className='flex flex-col m-6 w-1/3'>
                            <div className='flex flex-col h-full'>
                                <h2 className='text-red-500 bg-white font-semibold text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold'>JOUEURS</h2>
                                {/* <div className='h-full overflow-y-scroll scrollbar '> */}
                                <ul className='h-full overflow-y-scroll scrollbar '>
                                    {playersList.map((player) =>
                                        <div className='ml-6 mb-2 flex w-9/10 h-14 bg-red-400'>
                                            <div className='-ml-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-14 m-auto overflow-hidden'>
                                                <img className='object-cover bg' src=".\img\ponce.png" alt="" />
                                            </div>
                                            <h3 className='text-white m-auto items-center mr-4'>{player.name}</h3>

                                        </div>
                                    )}
                                </ul>
                                {/* </div> */}

                            </div>
                        </div>
                        <div className='w-2/3 bg-red-600 h-full w-full'>
                            <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>CHOISIR LE JEU</h2>
                            <div className='flex m-auto flex-col justify-between h-full'>
                                <div className='mx-8 mt-6 flex flex-row m-auto justify-between h-1/2 mb-0'>
                                    {/* {games.map((game) =>
                                        <button key={game} onClick={selectGame} className={selectedGame ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                            <h3 className='flex justify-center h-full items-center'>{game}</h3>
                                        </button>
                                    )} */}
                                    {
                                        (isHosting === '1') ?
                                            <>
                                                <button onClick={selectedGame1 ? null : selectGame1} className={selectedGame1 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                    <h3 className='flex justify-center h-full items-center'>Picass</h3>
                                                </button>
                                                <button onClick={selectedGame2 ? null : selectGame2} className={selectedGame2 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                    <h3 className='flex justify-center h-full items-center'>Rat de Star</h3>
                                                </button>
                                                <button onClick={selectedGame3 ? null : selectGame3} className={selectedGame3 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                    <h3 className='flex justify-center h-full items-center'>Au + proche</h3>
                                                </button>
                                            </>
                                            :
                                            <><div className={selectedGame1 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                <h3 className='flex justify-center h-full items-center'>Picass</h3>
                                            </div>
                                                <div className={selectedGame2 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                    <h3 className='flex justify-center h-full items-center'>Rat de Star</h3>
                                                </div>
                                                <div className={selectedGame3 ? 'bg-red h-full w-1/4' : 'bg-white h-full w-1/4'}>
                                                    <h3 className='flex justify-center h-full items-center'>Au + proche</h3>
                                                </div>
                                            </>

                                    }

                                </div>
                                <div className='flex w-full m-auto justify-between mt-10'>
                                    <button className='m-auto bg-white hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4 w-1/3' type='submit' value='Démarrer' onClick={copyLink}>INVITER</button>
                                    {isHosting === '1' ?
                                        <button className='m-auto bg-white hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4 w-1/3' type='submit' value='Démarrer' onClick={startGame}>DEMARRER</button>
                                        : <></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Room;