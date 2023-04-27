class Canvas {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    broadcastDrawing(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('drawing', data);
    }

    draw(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('draw', data);
    }

    startDrawing(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('startDrawing', data);
    }

    finishDrawing(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('finishDrawing', data);
    }

    changeColor(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('changeColor', data);
    }

    changeLineWidth(data) {
        const { socket } = this;
        socket.to(data.RoomId).emit('changeLineWidth', data);
    }

    clearCanvas(RoomId) {
        const { socket } = this;
        socket.to(RoomId).emit('clearCanvas');

    }
}

module.exports = Canvas;
