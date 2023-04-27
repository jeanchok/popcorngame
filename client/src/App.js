import './App.css';
import Accueil from './Pages/Accueil';
import Room from './Pages/Room';
import Canvas from './Pages/Canvas';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundContextProvider } from 'context/SoundContext';
import { SocketContextProvider } from 'context/socket';
import { UserContextProvider } from 'context/user';



function App() {



  return (
    <UserContextProvider>
      <SocketContextProvider>
        <SoundContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="*" element={<Accueil />} />
              <Route path="/room" element={<Room />} />
              <Route path="/picass" element={<Canvas />} />
            </Routes>
          </BrowserRouter>
        </SoundContextProvider>
      </SocketContextProvider>
    </UserContextProvider>
  );
}

export default App;
