/* global games */
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const { v4: uuidv4 } = require('uuid');
const { getPlayersCount } = require('./helpers');


class Room {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    createPrivateRoom(data) {
        const { socket } = this;
        const id = uuidv4();
        if (data.playerUsername.length < 1) { return; }
        socket.playerUsername = data.playerUsername;
        socket.playerAvatarIndex = data.playerAvatarIndex
        socket.roomID = id;
        socket.join(id);
        socket.emit('newPrivateRoom', { gameID: id, userName: data.playerUsername, id: socket.id, playerAvatarIndex: data.playerAvatarIndex });
    }

    async joinRoom(data) {
        const { io, socket } = this;
        if (data.player.length < 1) { return; }
        const roomID = data.id;
        const players = Array.from(await io.in(roomID).allSockets());
        socket.player = data.player;
        socket.playerAvatarIndex = data.playerAvatarIndex
        socket.join(roomID);
        socket.roomID = roomID;
        data.playerId = socket.id;
        socket.to(roomID).emit('joinRoom', data);
        console.log(' data:', data, 'players:', io.sockets.adapter.rooms.get(roomID), 'socket', socket.player);
        socket.emit('otherPlayers',
            players.reduce((acc, id) => {
                console.log('otherPlayers', socket.id !== id)
                if (socket.id !== id) {
                    const { player } = io.of('/').sockets.get(id);
                    acc.push(player);
                    console.log('players', io.in(roomID).allSockets());
                }
                console.log(acc);
                return acc;

            }, []));
    }

    async players(data) {
        const { io, socket } = this;
        const roomID = data.id;
        const players = data.players;
        socket.roomID = roomID;
        console.log('players', players, 'roomID', roomID, "data", data);
        socket.to(roomID).emit('players', players);
    }
    /* Explain the previous function: */

    updateSettings(data) {
        const { socket } = this;
        const { customWords, ...rest } = data;
        games[socket.roomID].time = Number(data.time) * 1000;
        games[socket.roomID].rounds = Number(data.rounds);
        games[socket.roomID].probability = Number(data.probability);
        games[socket.roomID].customWords = customWords;
        games[socket.roomID].language = data.language;
        socket.to(socket.roomID).emit('settingsUpdate', rest);
        console.log(games[socket.roomID]);
    }

    async selectGame(data) {
        const { socket } = this;
        socket.to(data.roomID).emit('selectGame', data.selectedGameId);
        console.log(data);
    }

    startCountdown(data) {
        const { io, socket } = this;
        let roomID = data.roomID;
        io.in(roomID).emit('startCountdown');
    }

    restartToRoom(data) {
        const { io, socket } = this;
        let roomID = data.roomID;
        console.log("restartToRoomback", data.roomID);
        socket.broadcast.emit('restartToRoom', data);
    }

    restartExistingRoom(data) {
        const { socket } = this;
        socket.playerUsername = data.playerUsername;
        socket.playerAvatarIndex = data.playerAvatarIndex
        socket.roomID = data.roomID;
        console.log("restartExistingRoom", data.roomID, 'data', data);
        socket.emit('restartExistingRoom', { gameID: data.roomID, userName: data.playerUsername, id: socket.id, playerAvatarIndex: data.playerAvatarIndex });
    }

    async joinExistingRoom(data) {
        const { io, socket } = this;
        const roomID = data.roomID;
        const players = Array.from(await io.in(roomID).allSockets());
        socket.player = data.player;
        socket.playerAvatarIndex = data.playerAvatarIndex
        socket.roomID = roomID;
        data.playerId = socket.id;

        socket.to(roomID).emit('joinExistingRoom', data);
        console.log(' data:', data, 'players:', io.sockets.adapter.rooms.get(roomID), 'socket', socket.player);
        socket.emit('otherPlayers',
            players.reduce((acc, id) => {
                console.log('otherPlayers2', socket.id !== id);
                if (socket.id !== id) {
                    const { player } = io.of('/').sockets.get(id);
                    acc.push(player);
                    console.log('players', io.in(roomID).allSockets());
                }
                console.log(acc);
                return acc;
            }, []));
    }

    onDisconnect() {
        const { io, socket } = this;
        const { roomID } = socket;
        if (socket.player) {
            //socket.player.id = socket.id;
            socket.to(socket.roomID).emit('disconnection', socket.id);
        }
    }
}

module.exports = Room;
