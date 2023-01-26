import React, { useContext, useRef, useState } from "react";
import { socket } from "../context/socket";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
    const [isDrawing, setIsDrawing] = useState(false)
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    let RoomId = sessionStorage.getItem('id');

    const prepareCanvas = () => {
        const canvas = canvasRef.current
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        // canvas.style.width = `${canvas.clientWidth}px`;
        // canvas.style.height = `${canvas.clientHeight}px`;

        const context = canvas.getContext("2d")
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    };

    const startDrawing = async ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);

        socket.emit('startDrawing', { RoomId: RoomId, nativeEvent: { offsetX, offsetY } }, console.log('yo'));
        socket.on('startDrawing', (data) => {
            console.log('yoo');
            const { offsetX, offsetY } = data.nativeEvent;
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        })
        // await socket.emit('drawing', { RoomId: RoomId, isDrawing, nativeEvent: { offsetX, offsetY } });
        // socket.on('drawing', (data) => {
        //     if (data.isDrawing = true) {
        //         if (data.nativeEvent) {
        //             const { offsetX, offsetY } = data.nativeEvent;
        //             contextRef.current.beginPath();
        //             contextRef.current.moveTo(offsetX, offsetY);
        //         }
        //     }
        // })
    };

    const finishDrawing = async () => {
        contextRef.current.closePath();
        setIsDrawing(false);

        socket.emit('finishDrawing', RoomId, contextRef.current);
        socket.on('finishDrawing', (data) => {
            contextRef.current.closePath();
            setIsDrawing(false);
        })

        // await socket.emit('drawing', { RoomId: RoomId, isDrawing });
        // socket.on('drawing', (data) => {
        //     if (data.isDrawing = false) {
        //         contextRef.current.closePath();
        //         console.log('here')
        //     }
        // })
    };

    const draw = ({ nativeEvent }) => {
        // socket.on('drawing', (data) => {
        //     if (data.nativeEvent) {
        //         if (data.isDrawing = false) {
        //             return;
        //         }
        //         const { offsetX, offsetY } = data.nativeEvent;
        //         contextRef.current.beginPath();
        //         contextRef.current.moveTo(offsetX, offsetY);
        //         contextRef.current.lineTo(offsetX, offsetY);
        //         contextRef.current.stroke();
        //         if (data.isDrawing = true) {
        //             //contextRef.current.closePath();
        //         }
        //     }
        // })


        socket.on('draw', (data) => {
            // if (!isDrawing) {
            //     return;
            // }

            const { offsetX, offsetY } = data.nativeEvent;
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        })

        if (!isDrawing) {
            return;
        }

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        socket.emit('draw', { RoomId: RoomId, nativeEvent: { offsetX, offsetY } });
        //socket.emit('drawing', { RoomId: RoomId, isDrawing, nativeEvent: { offsetX, offsetY } });


    };

    const clearCanvas = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        socket.emit('clearCanvas', RoomId);
        socket.on('clearCanvas', () => {
            console.log('yoyoy');
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        })
    }

    return (
        <CanvasContext.Provider
            value={{
                canvasRef,
                contextRef,
                prepareCanvas,
                startDrawing,
                finishDrawing,
                clearCanvas,
                draw,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);