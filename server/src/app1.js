// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");

// const port = process.env.PORT || 3001;
// const index = require("../routes/index");

// const app = express();
// app.use(index);

// // app.use(index, function (req, res, next) {
// //     console.log('Request Type:', req.method);
// //     next();
// // });

// const server = http.createServer(app);

// const io = socketIo(server);

// let interval;

// io.on("connection", (socket) => {
//     console.log("New client connected");
//     if (interval) {
//         clearInterval(interval);
//     }
//     interval = setInterval(() => getApiAndEmit(socket), 1000);
//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//         clearInterval(interval);
//     });
// });

// const getApiAndEmit = socket => {
//     const response = new Date();
//     // Emitting a new message. Will be consumed by the client
//     socket.emit("FromAPI", response);
// };

// server.listen(port, () => console.log(`Listening on port ${port}`));

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

require('dotenv').config()
console.log(process.env.API_LINK)

// app.use(cors());
const index = require("../routes/index");
app.use(index);


const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        //origin: process.env.API_LINK,
        origin: "*",
        methods: ["GET", "POST"],
    },

    pingTimeout: 30000,
});


console.log(process.env.API_LINK)
// import Room from '../controllers/Rooms.js';
// import Canvas from '../controllers/Canvas.js';
// import Game from '../controllers/Game.js';

const Room = require('../controllers/Rooms.js');
const Canvas = require('../controllers/Canvas');
const Disconnect = require('../controllers/Disconnect');
const Game = require('../controllers/Game');

io.on("connection", (socket) => {
    //socket.setMaxListeners(15);
    console.log(`User Connected: ${socket.id}`);


    socket.on('newPrivateRoom', (player) => { new Room(io, socket).createPrivateRoom(player) });
    socket.on('startCountdown', async (data) => { await new Room(io, socket).startCountdown(data); });
    socket.on('joinRoom', async (data) => { await new Room(io, socket).joinRoom(data); });
    socket.on('players', async (data) => { await new Room(io, socket).players(data); });
    socket.on('selectGame', async (data) => { await new Room(io, socket).selectGame(data); });
    socket.on('settingsUpdate', (data) => new Room(io, socket).updateSettings(data));
    socket.on('restartToRoom', (data) => new Room(io, socket).restartToRoom(data));
    socket.on('restartExistingRoom', (player) => { new Room(io, socket).createPrivateRoom(player) });
    socket.on('joinExistingRoom', async (data) => { await new Room(io, socket).joinExistingRoom(data); });


    socket.on('drawing', (data) => new Canvas(io, socket).broadcastDrawing(data));
    socket.on('clearCanvas', (data) => new Canvas(io, socket).clearCanvas(data));
    socket.on('startPicass', async (data) => { await new Game(io, socket).startPicass(data); });
    socket.on('startGame', async () => { await new Game(io, socket).startGame(); });
    socket.on('getPlayers', async (roomID) => { await new Game(io, socket).getPlayers(roomID); });
    // socket.on('choosenWord', async (data) => { await new Game(io, socket).chosenWord(data); });
    socket.on('message', (data) => new Game(io, socket).onMessage(data));
    //socket.on('disconnect', () => new Disconnect(io, socket).onDisconnect());
    socket.on('disconnect', () => new Game(io, socket).onDisconnect());
    socket.on('disconnect', () => new Room(io, socket).onDisconnect());


    socket.on('draw', (data) => new Canvas(io, socket).draw(data));
    socket.on('startDrawing', (data) => new Canvas(io, socket).startDrawing(data));
    socket.on('finishDrawing', (data) => new Canvas(io, socket).finishDrawing(data));
    socket.on('changeColor', (data) => new Canvas(io, socket).changeColor(data));
    socket.on('changeLineWidth', (data) => new Canvas(io, socket).changeLineWidth(data));



});

server.listen(port, () => console.log(`Listening on port ${port}`));