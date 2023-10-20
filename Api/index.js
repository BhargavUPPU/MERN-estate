import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
mongoose.connect("mongodb+srv://bhargavsai:bhargav@mern-estate.nmwjppn.mongodb.net/mern-estate?retryWrites=true&w=majority");
const app=express();
app.use(express.json())
app.use(cookieParser())
app.listen(3000,()=>{
    console.log('server is running on prot 3000')
});
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message||'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,

    })
})