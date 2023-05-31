import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socket";
import { colors1, colors2, lineWidths } from "../constant/const";
import { useUser } from '.././context/user';

const Canva = ({ playersList, givenHint }) => {
    const user = useUser();
    const [socket] = useSocket();
    const [isDrawing, setIsDrawing] = useState(false);
    const [isChoosingWord, setIsChoosingWord] = useState(false);
    const [drawerisChoosing, setDrawerisChoosing] = useState(false);
    const [currentColor, setCurrentColor] = useState('black');
    const [currentLineWidth, setCurrentLineWidth] = useState(25);
    const [wordsChoice, setWordsChoice] = useState([]);
    const [wordToGuess, setWordToGuess] = useState('');
    const [drawer, setDrawer] = useState('');
    const [isThedrawer, setIsThedrawer] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [RoomId, setRoomId] = useState(user.gameId);
    const socketRef = useRef();

    useEffect(() => {
        setRoomId(user.gameId);
    }, [user.gameId]);

    useEffect(() => {
        setWordToGuess(givenHint)
    }, [givenHint]);

    useEffect(() => {
        // --------------- getContext() method returns a drawing context on the canvas-----
        const canvas = canvasRef.current;
        canvas.width = canvas.getBoundingClientRect().width * 2;
        canvas.height = canvas.getBoundingClientRect().height * 2;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        contextRef.current = context;
        setCurrentColor('black');


        // ----------------------- Colors --------------------------------------------------


        const current = {
            color: currentColor,
        };


        // ------------------------------- create the drawing ----------------------------
        let points = [];
        let drawing = false;

        const drawLine = (x0, y0, x1, y1, color, size, emit) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
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

        // const midPointBtw = (p1, p2) => {
        //     return {
        //         x: p1.x + (p2.x - p1.x) / 2,
        //         y: p1.y + (p2.y - p1.y) / 2
        //     };
        // };


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
        //     canvas.width = canvas.getBoundingClientRect().width * 2;
        //     canvas.height = canvas.getBoundingClientRect().height * 2;

        //     canvas.style.width = canvas.width;
        //     canvas.style.height = canvas.height;
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
        })

        socket.on('clearCanvas', async () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        })

        socket.on('choosing', async ({ name }) => {
            setIsThedrawer(false);
            let drawer = playersList.find(player => player.playerId === name);
            await setDrawerisChoosing(true);
            setDrawer(drawer.name);
        });
    }, [socket]);

    useEffect(() => {
        const chooseWord = async ([word1, word2, word3]) => {
            setIsThedrawer(true);
            await setDrawerisChoosing(false);
            await setIsChoosingWord(true);
            setWordsChoice([word1, word2, word3]);
        }
        socket.on('chooseWord', chooseWord);

        return () => {
            socket.off("chooseWord", chooseWord);
        };
    }, [socket]);

    useEffect(() => {
        const hideWord = ({ word }) => {
            setWordToGuess(word);
        }
        socket.on('hideWord', hideWord);

        return () => {
            socket.off("hideWord", hideWord);
        };
    }, [socket]);

    useEffect(() => {
        const startTimer = () => {
            setDrawerisChoosing(false);
        }
        socket.on('startTimer', startTimer)

        return () => {
            socket.off("startTimer", startTimer);
        };
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
        socket.emit('changeColor', { RoomId: RoomId, color });
    };

    const changeLineWidth = (size) => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.lineWidth = size;
        socket.emit('changeLineWidth', { RoomId: RoomId, size });
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className='w-full h-full flex flex-col relative'>
            <h2 className='text-white  font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 border-r-2 lg:h-[60px] text-xl'>{
                isChoosingWord ? 'CHOISISSEZ UNE EXPRESSION !'
                    :
                    drawerisChoosing ? `L'EXPRESSION EST EN TRAIN DE CHARGER...`
                        :
                        wordToGuess ? <pre className="font-sans"> {capitalizeFirstLetter(wordToGuess)}</pre>
                            :
                            null
            }</h2>
            <div className='flex flex-col justify-between w-full relative h-inherit'>
                <div className=' flex flex-row m-auto justify-center align-center items-center w-full h-full relative'>
                    {isChoosingWord ?
                        <div className={"flex align-center justify-center md:h-[250px] md:w-[450px] w-[90%] rounded-xl bg-neutral-800 z-10 absolute "}>
                            <div className="flex flex-col  align-center justify-center  gap-y-4 p-4">
                                {wordsChoice.map((words, index) =>
                                    <div className="flex items-center" key={index}>
                                        <button onClick={(e) => { chooseWord(words) }} className="h-[41px] rounded-md whitespace-nowrap hover:bg-red-500 hover:border-transparent transition text-white border-1 font-bold py-2 px-4 border border-red-700">
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
                        isThedrawer && !isChoosingWord ?
                            <canvas className="w-full h-auto bg-slate-50 lg:-mb-[44px] lg:absolute lg:top-0"
                                ref={canvasRef}
                            />
                            :
                            <canvas className="h-full w-full bg-slate-50 lg:-mb-[44px] lg:absolute lg:top-0"
                                ref={canvasRef}
                                style={{ pointerEvents: "none" }}
                            />
                    }
                </div>
                {
                    isThedrawer ?
                        <div className="bg-white flex space-around justify-center items-center border-t-2 border-red-400 bottom-0  w-full h-[42px] z-10">
                            <>
                                <div className="md:flex items-center justify-center hidden">
                                    <div className={"p-4 m-1 bg-" + currentColor} style={{ backgroundColor: currentColor }} >
                                    </div>
                                </div>
                                <div className="flex items-center justify-center h-full flex-col">
                                    <div className="flex flex-raw">
                                        {colors1.map(color => (
                                            <button key={color.value} onClick={() => { changeColor(color.value); setCurrentColor(color.value) }} value={color.value} className={`bg-${color.name} p-2 color ${color.value}`} style={{ backgroundColor: color.value }}></button>
                                        ))}
                                    </div>
                                    <div className="flex flex-raw">
                                        {colors2.map(color => (
                                            <button key={color.value} onClick={() => { changeColor(color.value); setCurrentColor(color.value) }} value={color.value} className={`bg-${color.name} p-2 color ${color.value}`} style={{ backgroundColor: color.value }}></button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button className=" m-1 w-8">
                                        <img className='w-full h-full' src=".\img\icons8-crayon-64.png" alt="logo crayon" />
                                    </button>
                                </div>
                                <div className="md:flex items-center justify-center hidden">
                                    <button onClick={() => { changeColor('white'); setCurrentColor('white') }} className=" m-1 w-8">
                                        <img className='w-full h-full' src=".\img\icons8-eraser-64.png" alt="logo gomme" />
                                    </button>
                                </div>
                                {lineWidths.map((item) => (
                                    <div key={item.lineWidth} className="flex items-center justify-center">
                                        <button
                                            onClick={() => changeLineWidth(item.lineWidth)}
                                            className="m-1 w-8 h-8 flex items-center justify-center"
                                        >
                                            <div className={`rounded-full bg-black ${item.circleSize}`}></div>
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center">
                                    <button className=" m-1 w-8" onClick={() => clearCanvas()}>
                                        <img className='w-full h-full' src=".\img\icons8-bin-60.png" alt="logo poubelle" />
                                    </button>
                                </div>
                            </>
                        </div>
                        :
                        null
                }
            </div>
            {/* <div className="flex space-around justify-center items-center w-full h-[0px]"></div> */}
        </div>
    );
};

export default Canva;