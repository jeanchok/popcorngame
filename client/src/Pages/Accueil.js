import React, { useEffect } from 'react';
import Header from '.././Components/Header';
import JoinGame from '.././Components/JoinGame';

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
                        {/* <form className='flex flex-col m-6 w-1/3'>
                            <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-40 m-auto border border-white overflow-hidden'>
                                <img className='object-cover bg' src=".\img\ponce.png" alt="" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='playerNickname' className='text-center'>Choisis ton chroniqueur et ton pseudo</label>
                                <input className=' bg-red-100 mt-4 placeholder:italic placeholder:text-white block bg-white w-full border border-red-300 py-2 px-4 pl-2 pr-3 shadow-sm focus:outline-none focus:border-red-300 focus:ring-red-300 focus:ring-1 sm:text-sm' type='text' placeholder='Ponce...'>
                                </input>
                            </div>
                            <button className='bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent mt-4' onSubmit={(e) => handleSubmit(e)} type='submit' value='Démarrer'>DEMARRER</button>
                        </form> */}
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