import React from 'react';
import Header from '.././Components/Header';
import JoinGame from '.././Components/JoinGame';
import SoundButton from '.././Components/SoundButton';
import Paricules from '.././Components/Paricules';


const Accueil = () => {
    return (
        <>

            <main className='flex flex-col items-center gap-[10%] h-full m-auto'>
                <Header />
                <img className='object-cover absolute h-screen w-screen bg-object bg-cover -z-10 top-0' src=".\img\fondpop.png" alt="popcorn rouge fond" />
                <div className='bg-black/25 w-screen h-2/4 -z-10 absolute top-0'></div>
                <section className='max-w-screen-xl bg-center justify-center w-auto h-[45%] md:h-[45%] mt-9o
                 flex content-center z-10 relative fade-in backdrop-blur max-h-[436px] '>
                    <div className="w-20 absolute right-[15%] -top-[72px]">
                        <SoundButton />
                    </div>
                    <div className='m-auto min-h-1/2 lg:h-full border-white/20 border bg-slate-50 bg-opacity-10 flex rounded-md blured' style={{ boxShadow: "inset 0px 2px 0px 0px rgb(255 255 255 / 15%), 0px 3px 0px 0px rgb(255 255 255 / 15%);" }}>
                        <JoinGame />
                        <div className='w-2/3 bg-transparent md:block hidden'>
                            <h2 className='text-white border-white/20 border text-center pb-4 pt-4 h-[15%] border-red-400 border-l-2 text-xl font-semibold'>COMMENT JOUER ?</h2>
                            <div className='flex flex-col bg-neutral-900 h-[85%] w-full border-white/20 border p-8 gap-6 rounded-br-lg '>
                                <div className='flex text-xl items-center p-2 border-white border hover:bg-slate-100 group transition h-full relative'>
                                    <div className='absolute -top-4 -left-4 z-10 bg-white rounded-full w-8 h-8 font-bold flex items-center justify-center'>1</div>
                                    <svg
                                        className='micIcone group-hover:stroke-red-500 transition'
                                        width={46}
                                        height={46}
                                        fill="none"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        color="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <path d="M12 19v4" />
                                        <path d="M8 23h8" />
                                    </svg>
                                    <p className='ml-4 flex text-left text-white group-hover:text-red-500 transition'>Aller sur un serveur vocal avec tous les joueurs</p>
                                </div>
                                <div className='flex text-xl items-center p-2 border-white border hover:bg-slate-100 group transition h-full relative'>
                                    <div className='absolute -top-4 -left-4 z-10 bg-white rounded-full w-8 h-8 font-bold flex items-center justify-center'>2</div>
                                    <svg className='micIcone group-hover:stroke-red-500 transition' width={46} height={46} fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    <p className='ml-4 flex text-left text-white group-hover:text-red-500 transition'>Choisissez le jeu iconique que vous préférez</p>
                                </div>
                                <div className='flex text-xl items-center p-2 border-white border hover:bg-slate-100 group transition h-full relative rounded-br-md'>
                                    <div className='absolute -top-4 -left-4 z-10 bg-white rounded-full w-8 h-8 font-bold flex items-center justify-center'>3</div>
                                    <svg className='micIcone group-hover:stroke-red-500 transition' width={46} height={46} fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <path d="M9 9h.01" />
                                        <path d="M15 9h.01" />
                                    </svg>
                                    <p className='ml-4 flex text-left text-white group-hover:text-red-500 transition'>Amusez vous !</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Paricules />
            </main>
        </>
    );
};

export default Accueil;