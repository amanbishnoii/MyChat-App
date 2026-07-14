import express from 'express';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import {connect} from './lib/connect.db.js';
import authRoutes from "./route/auth.routes.js";
import messageRoutes from "./route/message.routes.js";
import { app , server} from './lib/socketio.lib.js';

dotenv.config();
const Port= process.env.Port;
app.use(express.json());
const __dirname=path.resolve();
app.use(cookie()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.originName,
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes)
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
  })
}

server.listen(Port, () => {
  console.log('Server is running on port port:'+Port);
  connect();
});