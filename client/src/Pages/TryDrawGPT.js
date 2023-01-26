import React, { useRef, useState, useEffect } from 'react';

const TryDrawGPT = () => {
    const [fillColor, setFillColor] = useState('white');
    const [canvasPaths, setCanvasPaths] = useState([]);
    const [isFillActive, setIsFillActive] = useState(false);

    function handleFillClick() {
        setIsFillActive(!isFillActive);
    }

    function handleCanvasClick(event) {
        if (!isFillActive) {
            return;
        }

        const x = event.clientX;
        const y = event.clientY;

        // Vérifier si les coordonnées de la souris se trouvent dans une forme fermée sur le canevas
        const foundPath = canvasPaths.find((path) => {
            return path.isClosed &&
                path.x <= x &&
                x <= path.x + path.width &&
                path.y <= y &&
                y <= path.y + path.height;
        });

        if (foundPath) {
            // Remplir la forme trouvée avec la couleur de remplissage actuelle
            foundPath.fillColor = fillColor;
            setCanvasPaths([...canvasPaths]);
        }
    }

    return (
        <div>
            <button onClick={handleFillClick}>Activer/Désactiver le remplissage</button>
            <input type="color" onChange={(event) => setFillColor(event.target.value)} />
            <canvas onClick={handleCanvasClick}>
                {canvasPaths.map((path, index) => (
                    <path
                        key={index}
                        d={path.d}
                        fill={path.fillColor}
                    />
                ))}
            </canvas>
        </div>
    );
}


export default TryDrawGPT;