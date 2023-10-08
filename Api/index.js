import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();
mongoose.connect(process.env.Mongo).then(()=>{
    console.log("connected to the MongoDb")
})
.catch((err)=>{
    console.log(err);
});
const app=express();
app.listen(3000,()=>{
    console.log('server is running on prot 3000')
});
app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
