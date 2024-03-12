const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
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