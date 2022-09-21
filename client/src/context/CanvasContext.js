import React, { useContext, useRef, useState } from "react";
import { socket } from "../context/socket";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
    const [isDrawing, setIsDrawing] = useState(false)
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

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

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        //socket.emit('drawing', { isDrawing: true, nativeEvent: { offsetX, offsetY } });
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

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        // socket.emit('drawing', { isDrawing: false });
        // socket.on('drawing', (data) => {
        //     console.log(data)
        //     if (data.isDrawing = false) {
        //         contextRef.current.closePath();
        //         console.log('here')
        //     }
        // })
    };

    const draw = ({ nativeEvent }) => {
        socket.on('drawing', (data) => {
            if (data.nativeEvent) {
                if (data.isDrawing = false) {
                    return;
                }
                const { offsetX, offsetY } = data.nativeEvent;
                contextRef.current.beginPath();
                contextRef.current.moveTo(offsetX, offsetY);
                contextRef.current.lineTo(offsetX, offsetY);
                contextRef.current.stroke();
                if (data.isDrawing = true) {
                    contextRef.current.closePath();
                }
            }

        })
        if (!isDrawing) {
            return;
        }

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        socket.emit('drawing', { isDrawing, nativeEvent: { offsetX, offsetY } });

    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
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