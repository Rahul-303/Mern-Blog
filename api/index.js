import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(express.json());
dotenv.config();

const port = 3000;
const url = process.env.MONGO;

mongoose
  .connect(url)
  .then(() => {
    console.log("connection established!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(`server listening at ${port}!`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
