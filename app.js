const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// Create server and initialize socket.io
const server = app.listen(port, () => {
    console.log(`server listening on ${port}`);
});
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, "public")));

const socketConnected = new Set();

// Handle each new connection
io.on('connection', (socket) => {
    onConnected(socket);
    
    socket.on('disconnect', () => {
        onDisconnected(socket.id); // Handle disconnection within the socket context
    });
});

function onConnected(socket) {
    console.log(`Connected: ${socket.id}`);
    socketConnected.add(socket.id);
    io.emit("client-total", socketConnected.size);

    socket.on('new-message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data); // Emit message to all other clients
    });

    socket.on('feedback', (data) => {
     socket.broadcast.emit('typing-feedback', data); // Broadcast the typing feedback
 });
}

function onDisconnected(socketId) {
    console.log(`Disconnected: ${socketId}`);
    socketConnected.delete(socketId);
    io.emit('client-total', socketConnected.size);
}
