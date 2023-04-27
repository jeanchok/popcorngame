/* global MAX_POINTS, round, games */

const { readFileSync } = require('fs');
const Chance = require('chance');
const GraphemeSplitter = require('grapheme-splitter');

const chance = new Chance();
const splitter = new GraphemeSplitter();
const words = JSON.parse(readFileSync('words.json').toString('utf-8'));

function getScore(startTime, roundtime) {
    const now = Date.now() / 1000;
    const MAX_POINTS = 500;
    const elapsedTime = now - startTime;
    const roundTime = roundtime / 1000;
    return Math.floor(((roundTime - elapsedTime) / roundTime) * MAX_POINTS);
}

function populateDisplayTime(hints, roomID, games) {
    const roundTime = games[roomID].time;
    const startTime = Math.floor(roundTime / 2);
    const hintInterval = Math.floor(startTime / hints.length);
    return hints.map((hint, i) => ({
        hint,
        displayTime: Math.floor((startTime - (i * hintInterval)) / 1000),
    }));
}

function getHints(word, roomID, games) {
    let hints = [];
    const wordLength = splitter.countGraphemes(word);
    const hintsCount = Math.floor(0.7 * wordLength);
    const graphemes = splitter.splitGraphemes(word);
    let prevHint = graphemes.map((char) => (char !== ' ' ? '_' : ' '));
    while (hints.length !== hintsCount) {
        const pos = chance.integer({ min: 0, max: wordLength - 1 });
        // eslint-disable-next-line no-continue
        if (prevHint[pos] !== '_') continue;
        prevHint = [...prevHint.slice(0, pos), graphemes[pos], ...prevHint.slice(pos + 1)];
        hints.push(prevHint);
    }
    hints = hints.map((hint) => hint.join(' '));
    return populateDisplayTime(hints, roomID, games);
}

function wait(roomID, drawer, ms, games) {
    const { io, socket } = this;
    return new Promise((resolve, reject) => {
        global.round.on('everybodyGuessed', ({ data: callerRoomID }) => {
            if (callerRoomID === roomID) {
                resolve(true);
            }
        });
        drawer.on('disconnect', (err) => reject(err));
        setTimeout(() => resolve(true), ms);
    });
}

function get3Words(roomID) {
    const pickedWords = [];
    while (pickedWords.length !== 3) {
        const randIndex = Math.floor(Math.random() * words.fr.length);
        pickedWords.push(words.fr[randIndex]);

    }
    return Array.from(pickedWords);
}

module.exports = {
    getScore,
    getHints,
    wait,
    get3Words,
};
