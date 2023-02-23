import { emit } from "process";
import React, { useEffect, useContext, useRef, useState } from "react";
import { useSocket } from "../context/socket";
import { colors1, colors2 } from "../constant/const";

const Canva = ({ playersList }) => {
    const [socket] = useSocket();
    const [isDrawing, setIsDrawing] = useState(false);
    const [isChoosingWord, setIsChoosingWord] = useState(false);
    const [drawerisChoosing, setDrawerisChoosing] = useState(false);
    const [roundStarted, setRoundStarted] = useState(false);
    const [fillingMode, setFillingMode] = useState(false);
    const [currentColor, setCurrentColor] = useState('black');
    const [currentLineWidth, setCurrentLineWidth] = useState(25);

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
    const socketRef = useRef();


    useEffect(() => {
        // --------------- getContext() method returns a drawing context on the canvas-----

        const canvas = canvasRef.current;
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;


        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = 'black';
        context.lineWidth = 15;
        contextRef.current = context;
        setCurrentColor('black');


        // ----------------------- Colors --------------------------------------------------


        const current = {
            color: currentColor,
        };

        // const colors = document.getElementsByClassName('color');

        // // helper that will update the current color
        // const onColorUpdate = (e) => {

        //     current.color = e.target.value;
        //     console.log('onColorUpdate', current.color)
        // };

        // // loop through the color elements and add the click event listeners
        // for (let i = 0; i < colors.length; i++) {
        //     colors[i].addEventListener('click', onColorUpdate, false);
        // }

        let drawing = false;


        // ------------------------------- create the drawing ----------------------------
        let points = [];

        const drawLine = (x0, y0, x1, y1, color, size, emit) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            //context.strokeStyle = current.color;
            // context.lineWidth = size;
            context.stroke();
            context.closePath();

            if (!emit) { return; }
            const w = canvas.width;
            const h = canvas.height;

            socket.emit('drawing', {
                RoomId: RoomId, isDrawing, x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h,
                color: color, points: points, size: size
            })
        };

        const midPointBtw = (p1, p2) => {
            return {
                x: p1.x + (p2.x - p1.x) / 2,
                y: p1.y + (p2.y - p1.y) / 2
            };
        };


        // ---------------- mouse movement --------------------------------------

        const onMouseDown = (e) => {
            drawing = true;
            let bounding = canvas.getBoundingClientRect();
            current.x = e.clientX - bounding.left || e.touches[0].clientX - bounding.left;
            current.y = e.clientY - bounding.top || e.touches[0].clientY - bounding.top;
        };

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            let bounding = canvas.getBoundingClientRect();
            drawLine(current.x, current.y, e.clientX - bounding.left || e.touches[0].clientX - bounding.left, e.clientY - bounding.top || e.touches[0].clientY - bounding.top, current.color, currentLineWidth, true);
            current.x = e.clientX - bounding.left || e.touches[0].clientX - bounding.left;
            current.y = e.clientY - bounding.top || e.touches[0].clientY - bounding.top;
        };

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            let bounding = canvas.getBoundingClientRect();
            drawing = false;
            drawLine(current.x, current.y, e.clientX - bounding.left || e.touches[0].clientX - bounding.left, e.clientY - bounding.top || e.touches[0].clientY - bounding.top, current.color, currentLineWidth, true);
        };

        // ----------- limit the number of events per second -----------------------

        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime();
            return function () {
                const time = new Date().getTime();

                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        };

        // -----------------add event listeners to our canvas ----------------------
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        // Touch support for mobile devices
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

        // -------------- make the canvas fill its parent component -----------------

        // const onResize = () => {
        //     canvas.width = window.innerWidth;
        //     canvas.height = window.innerHeight;
        //     console.log(canvas.width, canvas.height, 'onResize');
        // };

        // window.addEventListener('resize', onResize, false);
        // onResize();

        // ----------------------- socket.io connection ----------------------------
        const onDrawingEvent = (data) => {
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.size);

        }

        socketRef.current = socket;
        socket.on('drawing', onDrawingEvent);
    }, [socket]);

    useEffect(() => {
        socket.on('hideWord', ({ word }) => {
            setWordToGuess(word);
        });


        socket.on('changeColor', async (data) => {
            console.log('changeColor')
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.strokeStyle = await data.color;
            contextRef.current = context;
        })

        socket.on('changeLineWidth', async (data) => {
            console.log('changeLineWidth')
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.lineWidth = await data.size;
            //contextRef.current = context;
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
            let drawer = playersList.find(player => player.playerId === name);
            await setDrawerisChoosing(true);
            setDrawer(drawer.name);
        });

        socket.on('startTimer', () => {
            setDrawerisChoosing(false);
        })
    }, [socket]);



    const chooseWord = async (words) => {
        await setIsChoosingWord(false);
        await setWordToGuess(words);
        socket.emit('chooseWord', { words, RoomId });
    };

    const clearCanvas = () => {

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        socket.emit('clearCanvas', RoomId);

    };

    const changeColor = (color) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = color;
        //contextRef.current = context;
        socket.emit('changeColor', { RoomId: RoomId, color });

    };

    const changeLineWidth = (size) => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.lineWidth = size;
        //contextRef.current = context;

        socket.emit('changeLineWidth', { RoomId: RoomId, size });

    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className='w-2/3 w-full md:h-auto h-full flex flex-col'>
            <h2 className='text-white  font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 border-r-2 text-xl h-auto md:h-[12%]'>{
                isChoosingWord ? 'CHOISISSEZ UNE EXPRESSION !'
                    :
                    drawerisChoosing ? `L'EXPRESSION EST EN TRAIN DE CHARGER...`
                        :
                        wordToGuess ? capitalizeFirstLetter(wordToGuess)
                            :
                            null
            }</h2>
            <div className='flex flex-col justify-between w-full md:h-[88%] h-full'>
                <div className=' flex flex-row m-auto justify-center align-center items-center mb-0 h-full w-full' >
                    {isChoosingWord ?
                        <div className={"flex align-center justify-center md:h-[250px] md:w-[450px] w-[90%] rounded-xl bg-neutral-800 z-10 absolute "}>
                            <div className="flex flex-col  align-center justify-center  gap-y-4 p-4">
                                {wordsChoice.map((words, index) =>
                                    <div className="flex items-center" key={index}>
                                        <button onClick={(e) => { chooseWord(words) }} className="h-[41px] whitespace-nowrap hover:bg-red-500 hover:border-transparent transition text-white border-white border-1 font-bold py-2 px-4 border border-red-700">
                                            Celle-la !
                                        </button>
                                        <p className="ml-2 py-2 text-white px-4 font-bold">{capitalizeFirstLetter(words)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        :
                        null
                    }
                    {
                        drawerisChoosing ?
                            <div className={"flex align-center justify-center h-[250px] w-[450px] rounded-xl bg-neutral-800 z-10 absolute "}>
                                <div className="flex flex-col  align-center justify-center  gap-y-4 p-4">

                                    <div className="flex items-center">

                                        <p className="ml-2 py-2 px-4 text-white"><strong>{drawer}</strong> est en train de choisir une expression.</p>
                                    </div>

                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        isThedrawer ?
                            <canvas className="h-full w-full bg-white"
                                ref={canvasRef}
                            />
                            :
                            <canvas className="h-full w-full bg-white"
                                ref={canvasRef}
                                style={{ pointerEvents: "none" }}
                            />
                    }

                </div>
                {
                    isThedrawer ?

                        <div className="bg-white flex space-around justify-center border-t-2 border-red-400">
                            <div className="md:flex items-center justify-center hidden">
                                <div className={"p-4 m-1 bg-" + currentColor} style={{ backgroundColor: currentColor }} >
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-full flex-col">
                                <div className="flex flex-raw">
                                    {colors1.map(color => (
                                        <button onClick={() => { changeColor(color.value); setCurrentColor(color.value) }} value={color.value} className={`bg-${color.name} p-2 color ${color.value}`} style={{ backgroundColor: color.value }}></button>
                                    ))}
                                </div>
                                <div className="flex flex-raw">
                                    {colors2.map(color => (
                                        <button onClick={() => { changeColor(color.value); setCurrentColor(color.value) }} value={color.value} className={`bg-${color.name} p-2 color ${color.value}`} style={{ backgroundColor: color.value }}></button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <button className=" m-1 w-8" onClick={() => setFillingMode(false)}>
                                    <img className='w-full h-full' src=".\img\icons8-crayon-64.png" alt="logo crayon" />
                                </button>
                            </div>
                            <div className="md:flex items-center justify-center hidden">
                                <button onClick={() => { changeColor('white'); setCurrentColor('white') }} className=" m-1 w-8">
                                    <img className='w-full h-full' src=".\img\icons8-eraser-64.png" alt="logo gomme" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={() => changeLineWidth(35)} className="m-1 w-8 h-8 flex items-center justify-center">
                                    <div className="rounded-full bg-black w-7 h-7"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={() => changeLineWidth(25)} className=" m-1 w-8 h-8 flex items-center justify-center">
                                    <div className="rounded-full bg-black w-6 h-6"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={() => changeLineWidth(15)} className=" m-1 w-8 h-8 flex items-center justify-center">
                                    <div className="rounded-full bg-black w-4 h-4"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={() => changeLineWidth(5)} className=" m-1 w-8 h-8 flex items-center justify-center">
                                    <div className="rounded-full bg-black w-2 h-2"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                                <button className=" m-1 w-8" onClick={() => clearCanvas()}>
                                    <img className='w-full h-full' src=".\img\icons8-bin-60.png" alt="logo poubelle" />
                                </button>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        </div>
    );
};

export default Canva;