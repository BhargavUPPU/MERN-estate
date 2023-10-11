import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import {errorHandler}  from "../utils/error.js";
import  Jwt  from "jsonwebtoken";

export const signup=async (req,res,next )=>{
    console.log(req.body)
    const {username,email,password}=req.body;
    const hashPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashPassword});
    try{
        await newUser.save();
        res.status(201).json("user created successfully");
        console.log('user created successfully');

    }
    catch(error){
        next(error);
    }  
}
export const sign_in =async (req,res,next)=>{
        const {email,password} =req.body;
        try{
            const validUser=await User.findOne({email});
            if(!validUser) return next(errorHandler(404,'user not found'));
            const validPassword =bcryptjs.compareSync(password,validUser.password);
            if(!validPassword)return next(errorHandler(401,'Wrong Credentials!'));
            const token=Jwt.sign({id:validUser._id},process.env.Jwt_SECRET);
            const {password:pass,...rest}=validUser._doc;
            res.cookie('access_token',token,{httOnly:true}).status(200).json(rest);     
        }
        catch(error){
            next(error);
        }
}
export const google= async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=Jwt.sign({id:user._id},process.env.Jwt_SECRET);
            const {password:pass,...rest}=user._doc;
            res
            .cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest);
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashPassword=bcryptjs.hashSync(generatedPassword,10);
            const newUser= new User({username:req.body.name.split(' ').join('').toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashPassword,avatar:req.body.photo});
            await newUser.save();
            const token=Jwt.sign({id:newUser._id},process.env.Jwt_SECRET);
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    }
    catch(error){
        next(error)
    }
}