import React, { useEffect } from 'react';
import Header from '.././Components/Header';
import JoinGame from '.././Components/JoinGame';
//import Draw from '.././Components/Draw';

import { socket } from "../context/socket";


const Accueil = () => {

    return (
        <>
            <Header />
            <main className=' h-full m-auto'>
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\capture intro yt gomaid.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl m-auto bg-center center w-full h-full mt-9o
                 flex content-center'>
                    <div className='m-auto min-h-1/2 bg-white w-3/4 h-1/2 flex'>


                        <JoinGame />
                        <div className='w-2/3 bg-red-600'>
                            <h2 className='text-red-500 bg-white font-semibold text-center pb-4 pt-4 border-red-400 border-l-2 text-xl font-semibold'>COMMENT JOUER ?</h2>
                            <div className='mx-8 mt-6 flex flex-col'>
                                <p className=' mt-4  text-left text-white'><strong>1 |</strong> Aller sur un serveur vocal de ton  choix avec tous les joueurs</p>
                                <p className=' mt-4 text-left text-white'><strong>2 |</strong> Choisissez le jeu iconique de votre choix</p>
                                <p className=' mt-4 text-left text-white'><strong>3 |</strong> Amusez vous !</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Accueil;