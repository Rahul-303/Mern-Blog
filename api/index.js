import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js'

const app = express();
dotenv.config();
const port = 3000;
const url = process.env.MONGO;

mongoose
.connect(url)
.then(()=>{
    console.log('connection established!');
})
.catch((error)=>{
    console.log(error);
})

app.listen(port, ()=>{
    console.log(`server listening at ${port}!`);
})

app.use('/api/user', userRoutes);
