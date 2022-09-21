import logo from './logo.svg';
import './App.css';
import Accueil from './Pages/Accueil';
import Room from './Pages/Room';
import Canvas from './Pages/Canvas';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatTest from './Pages/ChatTest';



function App() {



  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/chattest" element={<ChatTest />} />
        <Route path="*" element={<Accueil />} />
        <Route path="/room" element={<Room />} />
        <Route path="/picass" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
