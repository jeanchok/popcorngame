import React, { useEffect, useState, useRef } from "react";
import { useCanvas } from "../context/CanvasContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../Components/Header";
import { socket } from "../context/socket";
import Chat from "../Components/Chat";
import PlayerList from "../Components/PlayerList";
import ClearCanvasButton from "../Components/ClearCanvasButton";
import Canva from "../Components/Canva";
import Timer from "../Components/Timer";


export function Canvas() {
    const { state } = useLocation();
    const [playersList, setPlayersList] = useState(state);
    const [playersListUpdatedScore, setPlayersListUpdatedScore] = useState();
    const [time, setTime] = useState(0);
    const [endTime, setEndTime] = useState(true);
    const [score, setScore] = useState();


    socket.on('startTimer', ({ time }) => {
        setEndTime(false);
        setTime(time);
    })

    socket.on('updateScore', (data) => {


        let drawer = playersList.find(player => player.playerId === data.drawerID.name.playerId);
        drawer.score = data.drawerID.score;


        let player = playersList.find(player => player.playerId === data.playerID);
        player.score = data.score;
        setPlayersList([...playersList]);
    })


    console.log("playersListconsole", playersList)

    return (

        <>
            <Header />
            <main className=' h-full m-auto'>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\capture intro yt gomaid.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>

                <section className='max-w-screen-xl m-auto bg-center center w-full h-full mt-9o
                 flex content-center items-center flex-col'>
                    {time > 0 ? <Timer time={time} /> : null}
                    <div className='m-auto min-h-[70%] bg-white flex'>
                        <div className='flex flex-col m-6 w-1/3'>
                            <div className='flex flex-col h-full'>
                                <h2 className='text-red-500 bg-white font-semibold text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold'>JOUEURS</h2>
                                <ul className='h-full overflow-y-scroll scrollbar '>

                                    <PlayerList playersList={playersList} />



                                </ul>
                            </div>
                        </div>
                        <Canva key={playersList} playersList={playersList} />
                        <Chat />
                    </div>
                </section>
            </main>
        </>

    );
}

export default Canvas;