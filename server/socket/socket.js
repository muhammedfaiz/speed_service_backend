import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'https://speed-service-tan.vercel.app/',
        credentials: true
    }
});

export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}

const removeUserSocket = (id)=>{
    delete userSocketMap[id];
}

const userSocketMap = {};

io.on('connection', (socket)=>{
    console.log('a user connected',socket.id);
    const userId = socket.handshake.query.userId;
    const employeeId = socket.handshake.query.employeeId;
    if(userId!=undefined) userSocketMap[userId]=socket.id;
    if(employeeId!=undefined) userSocketMap[employeeId]=socket.id;
    socket.on('disconnect', ()=>{
        if(userSocketMap[userId]==socket.id){
            removeUserSocket(userId);
        }else{
            removeUserSocket(employeeId);
        }
        console.log('a user disconnected',socket.id);
    });
});

export {app,io,server};