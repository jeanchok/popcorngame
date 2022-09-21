import React, { useEffect, useState, useRef } from "react";
import { useCanvas } from "../context/CanvasContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../Components/Header";
import { socket } from "../context/socket";
import Chat from "../Components/Chat";


export function Canvas() {
    const { state } = useLocation();
    const [playersList, setPlayersList] = useState(state);
    const contextRef = useRef(null);


    const {
        canvasRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        draw,
    } = useCanvas();

    // socket.on('drawing', (data) => {


    //     const { offsetX, offsetY } = data;
    //     console.log(data);
    //     contextRef.current.lineTo(offsetX, offsetY);
    //     contextRef.current.stroke();
    // })
    // useEffect(() => {

    // }, []);

    useEffect(() => {
        prepareCanvas();
    }, []);

    return (
        <>
            <Header />
            <main className=' h-full m-auto'>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\capture intro yt gomaid.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl m-auto bg-center center w-full h-full mt-9o
                 flex content-center'>
                    <div className='m-auto min-h-[70%] bg-white w-3/4 flex'>
                        <div className='flex flex-col m-6 w-1/3'>
                            <div className='flex flex-col h-full'>
                                <h2 className='text-red-500 bg-white font-semibold text-center pb-4 border-red-400 border-b-2 mb-4 text-xl font-semibold'>JOUEURS</h2>
                                {/* <div className='h-full overflow-y-scroll scrollbar '> */}
                                <ul className='h-full overflow-y-scroll scrollbar '>
                                    {playersList.map((player, index) =>
                                        <div key={index} className='ml-6 mb-2 flex w-9/10 h-14 bg-red-400'>
                                            <div className='-ml-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-14 m-auto overflow-hidden'>
                                                <img className='object-cover bg' src=".\img\ponce.png" alt="" />
                                            </div>
                                            <h3 className='text-white m-auto items-center mr-4'>{player}</h3>

                                        </div>
                                    )}
                                </ul>
                                {/* </div> */}

                            </div>
                        </div>
                        <div className='w-2/3 bg-red-600 w-full flex flex-col'>
                            <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>CHOISIR LE JEU</h2>
                            <div className='flex m-auto flex-col justify-between h-full w-full'>
                                <div className=' flex flex-row m-auto justify-between mb-0 h-full w-full' >
                                    <canvas className="h-full w-full bg-white"
                                        onMouseDown={startDrawing}
                                        onMouseUp={finishDrawing}
                                        onMouseMove={draw}
                                        ref={canvasRef}
                                    />
                                </div>
                            </div>
                        </div>
                        <Chat />
                    </div>
                </section>
            </main>
        </>

    );
}

export default Canvas;