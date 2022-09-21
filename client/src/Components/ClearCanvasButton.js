import React from 'react'
import { useCanvas } from '../context/CanvasContext'

export const ClearCanvasButton = () => {
    const { clearCanvas } = useCanvas()

    return <button onClick={clearCanvas}>Очистить</button>
}