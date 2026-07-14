import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app=express();
const server= http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:[process.env.originName],
    },
}
);
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
const userSocketMap={};

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId)userSocketMap[userId]=socket.id;    

    // send this online user list to everyone
    io.emit("onelineusers",Object.keys(userSocketMap)); 
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("onelineusers",Object.keys(userSocketMap)); 

    })
})
export{io, app, server};