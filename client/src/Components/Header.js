import React, { useState, useEffect } from "react";


const Header = () => {
    const [isLightning, setIsLightning] = useState(false);


    useEffect(() => {
        const neonEffects =
            setTimeout(() => {
                setIsLightning(!isLightning);
            }, 1000);
        return () => clearTimeout(neonEffects);
    }, [isLightning]);

    return (
        <header>
            {isLightning ?
                <img className='m-auto w-80 mt-4 absolute top-0' id='popcornLogo' src=".\img\Logo_Popcorn blanc neon.png" alt="logo popcorn blanc néon" />
                :
                <img className='m-auto w-80 mt-4' id='popcornLogo' src=".\img\Logo_Popcorn blanc.png" alt="logo popcorn blanc" />
            }
        </header>
    );
};

export default Header;