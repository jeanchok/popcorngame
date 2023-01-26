import React from 'react'
import { useCanvas } from '../context/CanvasContext'

export const ClearCanvasButton = () => {
    const { clearCanvas } = useCanvas()

    return <button className="bg-white m-1 w-8" onClick={clearCanvas}>
        <img className='w-full h-full' src=".\img\icons8-bin-60.png" alt="logo poubelle" />
    </button>
}

export default ClearCanvasButton;