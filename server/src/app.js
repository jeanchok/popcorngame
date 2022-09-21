const express = require('express');
const socketio = require('socket.io');
const helmet = require("helmet");
const path = require('path');
const cors = require('cors')

const app = express();


app.use(helmet());

app.use(express.json());
app.use(cors());

// setting headers to avoid CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const index = require("../routes/index");
app.use(index);


const Room = require('../controllers/Rooms.js');

module.exports.init = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        console.log('connected user');
        socket.on('newPrivateRoom', (player) => new Room(io, socket).createPrivateRoom(player));
        // socket.on('joinRoom', async (data) => { await new Room(io, socket).joinRoom(data); });
        // socket.on('settingsUpdate', (data) => new Room(io, socket).updateSettings(data));
        // socket.on('drawing', (data) => new Canvas(io, socket).broadcastDrawing(data));
        // socket.on('clearCanvas', () => new Canvas(io, socket).clearCanvas());
        // socket.on('startGame', async () => { await new Game(io, socket).startGame(); });
        // socket.on('getPlayers', async () => { await new Game(io, socket).getPlayers(); });
        // socket.on('message', (data) => new Game(io, socket).onMessage(data));
        // socket.on('disconnect', () => new Disconnect(io, socket).onDisconnect());
    });
};

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

//app.use('/api/post', postRoutes);




module.exports = app;