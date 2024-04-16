import express from 'express'
import http from 'http'
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);

// Configure Socket.IO to allow CORS from your client's origin
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
 console.log('a user connected');

 socket.on('chat message', (msg) => {
   
 });

 socket.on('message sent', (msg) => {
    socket.broadcast.emit('bordcast-message', msg);
 });

 socket.on('disconnect', () => {
    console.log('user disconnected');
 });
});

server.listen(3001, () => {
 console.log('listening on 3001');
});


