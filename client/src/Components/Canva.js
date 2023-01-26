import { emit } from "process";
import React, { useEffect, useContext, useRef, useState } from "react";
import { socket } from "../context/socket";
import { LazyBrush } from 'lazy-brush';

const Canva = ({ playersList }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isChoosingWord, setIsChoosingWord] = useState(false);
    const [drawerisChoosing, setDrawerisChoosing] = useState(false);
    const [roundStarted, setRoundStarted] = useState(false);
    const [fillingMode, setFillingMode] = useState(false);
    const [currentColor, setCurrentColor] = useState('');
    const [wordsChoice, setWordsChoice] = useState([]);
    const [wordToGuess, setWordToGuess] = useState('');
    const [drawer, setDrawer] = useState('');
    const [isThedrawer, setIsThedrawer] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const canvasDrawerRef = useRef(null);
    let RoomId = sessionStorage.getItem('id');
    const [fillPaths, setFillPaths] = useState([]);
    //const [points, setPoints] = useState([]);
    const [canvasPaths, setCanvasPaths] = useState([]);

    useEffect(() => {
        prepareCanvas();
        prepareCanvasDrawer();

    }, []);

    //const colors = [{ name: 'white', value: 'white' }, { name: 'black', value: 'black' }, { name: 'slate-400', value: 'rgb(148 163 184)' }, { name: 'slate-700', value: 'rgb(51 65 85)' }, { name: 'red-400', value: 'rgb(252 165 165)' }, { name: 'red-700', value: 'rgb(185 28 28)' }, { name: 'orange-400', value: 'rgb(251 146 60)' }, { name: 'orange-700', value: 'rgb(194 65 12)' }, { name: 'yellow-400', value: 'rgb(250 204 21)' }, { name: 'yellow-700', value: 'rgb(161 98 7)' }, { name: 'green-400', value: 'rgb(74 222 128)' }, { name: 'green-700', value: 'rgb(21 128 61)' }, { name: 'blue-400', value: 'rgb(96 165 250)' }, { name: 'blue-700', value: 'rgb(29 78 216)' }, { name: 'purple-400', value: 'rgb(192 132 252)' }, { name: 'purple-700', value: 'rgb(126 34 206)' }, { name: 'pink-400', value: 'rgb(244 114 182)' }, { name: 'pink-700', value: 'rgb(190 24 93)' }];

    const prepareCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        // canvas.style.width = `${canvas.clientWidth}px`;
        // canvas.style.height = `${canvas.clientHeight}px`;


        // const divStyle = {
        //     width: canvas.width,
        //     height: canvas.height,
        // };

        // const canvasDrawer = canvasDrawerRef.current;
        // canvasDrawer.width = canvasDrawer.clientWidth * 2;
        // canvasDrawer.height = canvasDrawer.clientHeight * 2;
        // canvasDrawer.style.width = canvasDrawer.width;
        // canvasDrawer.style.height = canvasDrawer.height;

        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    };

    const prepareCanvasDrawer = () => {


        const canvasDrawer = canvasDrawerRef.current;
        // canvasDrawer.width = canvasDrawer.clientWidth * 2;
        // canvasDrawer.height = canvasDrawer.clientHeight * 2;
        // canvasDrawer.style.width = canvasDrawer.width;
        // canvasDrawer.style.height = canvasDrawer.height;


    };



    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        socket.emit('startDrawing', { RoomId: RoomId, nativeEvent: { offsetX, offsetY } });
    };



    const finishDrawing = async () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit('finishDrawing', { RoomId: RoomId, contextRef: contextRef.current });


    };



    const midPointBtw = (p1, p2) => {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    };

    let points = [];

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }


        const { offsetX, offsetY } = nativeEvent;
        points.push({ x: offsetX, y: offsetY });
        let p1 = points[0];
        let p2 = points[1];
        contextRef.current.moveTo(p2.x, p2.y);
        contextRef.current.beginPath();
        for (let i = 1, len = points.length; i < len; i++) {
            const midPoint = midPointBtw(p1, p2);
            contextRef.current.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = points[i];
            p2 = points[i + 1];
        }
        contextRef.current.lineTo(p1.x, p1.y);
        contextRef.current.stroke();

        socket.emit('drawing', { RoomId: RoomId, isDrawing, nativeEvent: { offsetX, offsetY }, points: points });
    };



    socket.on('startDrawing', async (data) => {
        const { offsetX, offsetY } = data.nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        await setIsDrawing(true);
    });

    socket.on('finishDrawing', async (data) => {
        contextRef.current.closePath();
        await setIsDrawing(false);
    })

    socket.on('drawing', (data) => {
        if (!isDrawing) {
            return;
        }
        let p1 = data.points[0];
        let p2 = data.points[1];
        contextRef.current.moveTo(p2.x, p2.y);
        contextRef.current.beginPath();
        for (let i = 1, len = data.points.length; i < len; i++) {
            const midPoint = {
                x: p1.x + (p2.x - p1.x) / 2,
                y: p1.y + (p2.y - p1.y) / 2
            };
            contextRef.current.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = data.points[i];
            p2 = data.points[i + 1];
        }
        contextRef.current.lineTo(p1.x, p1.y);
        contextRef.current.stroke();
    })

    socket.on('changeColor', async (data) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = await data.color;
        contextRef.current = context;
    })

    socket.on('changeLineWidth', async (data) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineWidth = await data.size;
        contextRef.current = context;
    })

    socket.on('clearCanvas', async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.fillStyle = "white";
        // context.fillRect(0, 0, canvas.width, canvas.height);
    })

    socket.on('chooseWord', async ([word1, word2, word3]) => {
        setIsThedrawer(true);
        await setDrawerisChoosing(false);
        await setIsChoosingWord(true);
        setWordsChoice([word1, word2, word3]);


    });

    socket.on('choosing', async ({ name }) => {
        setIsThedrawer(false);
        console.log('playersList', playersList);
        let drawer = playersList.find(player => player.playerId === name);
        await setDrawerisChoosing(true);
        setDrawer(drawer.name);
    });

    socket.on('hideWord', ({ word }) => {
        console.log('hideWord', word);
        //setDrawerisChoosing(false);
        // setIsChoosingWord(false);
        setWordToGuess(word);
    });



    socket.on('startTimer', () => {
        setDrawerisChoosing(false);
    })


    const chooseWord = async (words) => {
        await setIsChoosingWord(false);
        await setWordToGuess(words);
        socket.emit('chooseWord', { words, RoomId });
    };



    const clearCanvas = () => {

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.fillStyle = "white";
        // context.fillRect(0, 0, canvas.width, canvas.height);

        socket.emit('clearCanvas', RoomId);

    };

    socket.on('lastWord', ({ word }) => {


    })




    const changeColor = (color) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = color;
        contextRef.current = context;

        socket.emit('changeColor', { RoomId: RoomId, color });

    };

    const changeLineWidth = (size) => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.lineWidth = size;
        contextRef.current = context;

        socket.emit('changeLineWidth', { RoomId: RoomId, size });

    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className='w-2/3 bg-red-600 w-full flex flex-col'>
            {
                isChoosingWord ?
                    <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>CHOISISSEZ UNE EXPRESSION !</h2> :
                    drawerisChoosing ?
                        <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>L'EXPRESSION EST EN TRAIN DE CHARGER...</h2> :
                        wordToGuess ?
                            <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>{capitalizeFirstLetter(wordToGuess)}</h2> :
                            null
            }
            <div className='flex m-auto flex-col justify-between h-full w-full'>
                <div className=' flex flex-row m-auto justify-between mb-0 h-full w-full' >
                    {isChoosingWord ?
                        <div className={"flex align-center justify-center h-[250px] w-[450px] bg-red-200 z-10 absolute "}>
                            <div className="flex flex-col  align-center justify-center">
                                {wordsChoice.map((words, index) =>
                                    <div className="flex mt-4" key={index}>
                                        <button onClick={(e) => { chooseWord(words) }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700">
                                            Celle-la !
                                        </button>
                                        <p className="ml-2 py-2 px-4 ">{capitalizeFirstLetter(words)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        :
                        null
                    }
                    {
                        drawerisChoosing ?
                            <div className={"flex align-center justify-center h-[250px] w-[450px] bg-red-200 z-10 absolute "}>
                                <div className="flex flex-col  align-center justify-center">
                                    <div className="flex mt-4" >
                                        <p className="ml-2 py-2 px-4 ">{drawer} est en train de choisir une expression.</p>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        isThedrawer ?
                            <canvas className="h-full w-full bg-white"
                                onMouseDown={!fillingMode ? startDrawing : null}
                                onMouseUp={!fillingMode ? finishDrawing : null}
                                onMouseMove={!fillingMode ? draw : null}
                                //onClick={fillingMode ? (e) => fillDrawing(e) : null}
                                ref={canvasRef}
                            />
                            :
                            <canvas className="h-full w-full bg-white"

                                ref={canvasRef}
                            />
                    }

                </div>
            </div>




            {
                isThedrawer ?

                    <div className="bg-slate-200 flex space-around justify-center">
                        <div className="flex items-center justify-center">
                            <div className={"p-4 m-1 bg-" + currentColor} >
                            </div>
                        </div>
                        {/* <div className="flex items-center justify-center h-full">
                            {colors.map(color => (
                                <div className="flex flex-col">
                                    <button onClick={() => { changeColor(color.value); setCurrentColor(color.name) }} className={`bg-${color.name} p-2`}></button>
                                </div>
                            ))}
                        </div> */}
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('white'); setCurrentColor('white') }} className="bg-white p-2"></button>
                                <button onClick={() => { changeColor('black'); setCurrentColor('black') }} className="bg-black p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(148 163 184)'); setCurrentColor('slate-400') }} className="bg-slate-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(51 65 85)'); setCurrentColor('slate-700') }} className="bg-slate-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(252 165 165)'); setCurrentColor('red-400') }} className="bg-red-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(185 28 28)'); setCurrentColor('red-700') }} className="bg-red-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(251 146 60)'); setCurrentColor('orange-400') }} className="bg-orange-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(194 65 12)'); setCurrentColor('orange-700') }} className="bg-orange-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(250 204 21)'); setCurrentColor('yellow-400') }} className="bg-yellow-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(161 98 7)'); setCurrentColor('yellow-700') }} className="bg-yellow-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(74 222 128)'); setCurrentColor('green-400') }} className="bg-green-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(21 128 61)'); setCurrentColor('green-700') }} className="bg-green-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(96 165 250)'); setCurrentColor('blue-400') }} className="bg-blue-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(29 78 216)'); setCurrentColor('blue-700') }} className="bg-blue-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(192 132 252)'); setCurrentColor('purple-400') }} className="bg-purple-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(126 34 206)'); setCurrentColor('purple-700') }} className="bg-purple-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(244 114 182)'); setCurrentColor('pink-400') }} className="bg-pink-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(190 24 93)'); setCurrentColor('pink-700') }} className="bg-pink-700 p-2"></button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={() => { changeColor('rgb(251 191 36)'); setCurrentColor('amber-400') }} className="bg-amber-400 p-2"></button>
                                <button onClick={() => { changeColor('rgb(180 83 9)'); setCurrentColor('amber-700') }} className="bg-amber-700 p-2"></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="bg-white m-1 w-8" onClick={() => setFillingMode(false)}>
                                <img className='w-full h-full' src=".\img\icons8-crayon-64.png" alt="logo crayon" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="bg-white m-1 w-8">
                                <img className='w-full h-full' src=".\img\icons8-eraser-64.png" alt="logo gomme" />
                            </button>

                        </div>
                        {/* <div className="flex items-center justify-center">
                            <button className="bg-white m-1 w-8" onClick={() => setFillingMode(true)}>
                                <img className='w-full h-full' src=".\img\icons8-bucket-64.png" alt="logo sceau" />
                            </button>
                        </div> */}
                        <div className="flex items-center justify-center">
                            <button onClick={() => changeLineWidth(35)} className="bg-white m-1 w-8 h-8 flex items-center justify-center">
                                <div className="rounded-full bg-black w-7 h-7"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={() => changeLineWidth(25)} className="bg-white m-1 w-8 h-8 flex items-center justify-center">
                                <div className="rounded-full bg-black w-6 h-6"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={() => changeLineWidth(15)} className="bg-white m-1 w-8 h-8 flex items-center justify-center">
                                <div className="rounded-full bg-black w-4 h-4"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button onClick={() => changeLineWidth(5)} className="bg-white m-1 w-8 h-8 flex items-center justify-center">
                                <div className="rounded-full bg-black w-2 h-2"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="bg-white m-1 w-8" onClick={() => clearCanvas()}>
                                <img className='w-full h-full' src=".\img\icons8-bin-60.png" alt="logo poubelle" />
                            </button>
                        </div>
                    </div>
                    :
                    null
            }
        </div >
    );
};

export default Canva;