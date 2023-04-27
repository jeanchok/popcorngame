/* global games, BONUS, round */
const { EventEmitter } = require('events');
const leven = require('../controllers/Leven.js');

global.round = new EventEmitter();
global.games = {};


const GraphemeSplitter = require('grapheme-splitter');
const {
    get3Words,
    getScore,
    wait,
    getHints,
} = require('./helpers');

const splitter = new GraphemeSplitter();
class Game {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }



    async onDisconnect() {
        const { io, socket } = this;
        const { roomID } = socket;
        if (socket.player) {
            socket.to(socket.roomID).emit('disconnection', socket.id);
        }
        if (games[roomID]) {
            if (games[roomID][socket.id].score === 0) delete games[roomID][socket.id];
            if (Array.from(await io.in(roomID).allSockets()).length === 0) delete games[roomID];
            if (Array.from(await io.in(roomID).allSockets()).length === 1) {
                io.to(roomID).emit('endGame', { stats: games[roomID] });
            }
        }
    }


    chosenWord(playerID, roomID) {
        const { io } = this;
        return new Promise((resolve, reject) => {
            function rejection(err) { reject(err); }
            const socket = io.of('/').sockets.get(playerID);
            socket.on('chooseWord', async ({ words }) => {
                socket.to(roomID).emit('hideWord', {
                    word: splitter.splitGraphemes(words).map((char) => (char !== ' ' ? '_' : char)).join('\xa0')
                });
                socket.removeListener('disconnect', rejection);
                resolve(words);
            });
            socket.once('disconnect', rejection);
        });
    }

    resetGuessedFlag(players) {
        const { io } = this;
        players.forEach((playerID) => {
            const player = io.of('/').sockets.get(playerID);
            if (player) player.hasGuessed = false;
        });
    }

    async startPicass(data) {
        const { io, socket } = this;
        const roomID = data.id;
        games[roomID] = {
            rounds: 2,
            time: 60 * 1000,
        };
        let rounds = 2;
        io.in(roomID).emit('startPicass', data);
        const players = Array.from(await io.in(roomID).allSockets());
        players.forEach((player, index) => {
            games[roomID][player] = {};
            games[roomID][player].score = 0;
            games[roomID][player].name = data.players[index];
        })
        for (let j = 0; j < rounds; j++) {
            /* eslint-disable no-await-in-loop */
            io.to(roomID).emit('round', { round: j + 1 });
            for (let i = 0; i < players.length; i++) {
                await this.giveTurnTo(players, i, roomID, games);
            }
        }
        io.to(roomID).emit('endGame', { stats: games[roomID] });
        delete games[roomID];
    }

    async giveTurnTo(players, i, roomID, games) {
        const { io, socket } = this;
        if (!games[roomID]) return;
        const { time } = games[roomID];
        const player = players[i];
        const prevPlayer = players[(i - 1 + players.length) % players.length];
        const drawer = io.of('/').sockets.get(player);
        if (!drawer || !roomID) return;
        this.resetGuessedFlag(players);
        games[roomID].totalGuesses = 0;
        games[roomID].currentWord = '';
        games[roomID].drawer = player;
        io.to(prevPlayer).emit('disableCanvas');
        drawer.to(roomID).emit('choosing', { name: player, socket: socket.id });
        //drawer.to(roomID).broadcast.emit('choosing', { name: drawer.player.name });
        io.to(player).emit('chooseWord', get3Words(roomID));
        try {
            io.to(roomID).emit('clearCanvas');
            const word = await this.chosenWord(player, roomID);
            games[roomID].currentWord = word;
            drawer.to(roomID).emit('hints', getHints(word, roomID, games));
            games[roomID].startTime = Date.now() / 1000;
            io.to(roomID).emit('startTimer', { time });
            if (await wait(roomID, drawer, time, games)) drawer.to(roomID).emit('lastWord', { word });
        } catch (error) {
            console.log(error);
        }
    }

    async onMessage(data) {
        const { io, socket } = this;
        const guess = data.message.toLowerCase().trim();
        if (guess === '') return;
        const currentWord = games[data.roomId].currentWord.toLowerCase();
        const distance = leven(guess, currentWord);
        if (distance < 4 && currentWord !== '') {
            data.correctGuess = true;
            socket.emit('message', { data, id: socket.id });
            if (games[data.roomId].drawer !== socket.id && !socket.hasGuessed) {
                const drawer = io.of('/').sockets.get(games[data.roomId].drawer);
                const { startTime } = games[data.roomId];
                const roundTime = games[data.roomId].time;
                const roomSize = Array.from(await io.in(data.roomId).allSockets()).length;
                socket.emit('correctGuess', { message: 'Bien joué Roya', id: socket.id });
                socket.broadcast.emit('correctGuess', { message: `${data.playerUsername} a trouvé le mot !`, id: socket.id });
                games[data.roomId].totalGuesses++;
                games[data.roomId][socket.id].score += getScore(startTime, roundTime);
                games[data.roomId][games[data.roomId].drawer].score += 250;
                io.in(data.roomId).emit('updateScore', {
                    name: games[data.roomId][socket.id].name,
                    playerID: socket.id,
                    score: games[data.roomId][socket.id].score,
                    drawerID: games[data.roomId][games[data.roomId].drawer],
                    drawerScore: games[data.roomId][games[data.roomId].drawer].score,
                });
                if (games[data.roomId].totalGuesses === roomSize - 1) {
                    global.round.emit('everybodyGuessed', { data: data.roomId });
                }
            }
            socket.hasGuessed = true;
        }
        else if (distance < 5 && currentWord !== '') {
            io.in(data.roomId).emit('message', { ...data, name: data.playerUsername });
            if (games[data.roomId].drawer !== socket.id && !socket.hasGuessed) socket.emit('closeGuess', { message: 'That was very close!' });
        } else {
            io.in(data.roomId).emit('message', { ...data, name: data.playerUsername });
        }
    }


    async getPlayers(roomID) {
        const { io, socket } = this;
        const players = Array.from(await io.in(socket.roomID).allSockets());
        players.forEach(player => {
            games[roomID][player] = {};
            games[roomID][player].score = 0;
        })
        io.in(socket.roomID).emit('getPlayers',
            players.reduce((acc, id) => {
                const { player } = io.of('/').sockets.get(id);
                acc.push(player);
                return acc;
            }, []));
    }
}

module.exports = Game;
