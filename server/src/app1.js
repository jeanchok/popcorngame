const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

require('dotenv').config()


app.use(cors());
const index = require("../routes/index");
app.use(index);

const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    pingTimeout: 30000,
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

const Room = require('../controllers/Rooms.js');
const Canvas = require('../controllers/Canvas');
const Disconnect = require('../controllers/Disconnect');
const Game = require('../controllers/Game');

io.on("connection", (socket) => {
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
    socket.on('message', (data) => new Game(io, socket).onMessage(data));
    socket.on('disconnect', () => new Game(io, socket).onDisconnect());
    socket.on('disconnect', () => new Room(io, socket).onDisconnect());
    socket.on('draw', (data) => new Canvas(io, socket).draw(data));
    socket.on('startDrawing', (data) => new Canvas(io, socket).startDrawing(data));
    socket.on('finishDrawing', (data) => new Canvas(io, socket).finishDrawing(data));
    socket.on('changeColor', (data) => new Canvas(io, socket).changeColor(data));
    socket.on('changeLineWidth', (data) => new Canvas(io, socket).changeLineWidth(data));
});

server.listen(port, () => console.log(`Listening on port ${port}`));