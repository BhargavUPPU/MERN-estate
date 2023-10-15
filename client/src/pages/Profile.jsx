import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState,useEffect } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';

export default function Profile() {
  
  const fileRef=useRef(null);
  const {currentUser} =useSelector( (state)=> state.user);
  const [file,setFile]=useState(undefined);
  const [filePer,setFilePer]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [fromData,setFromData]=useState({});
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    
    }
  },[file]);
  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime() + file.name;
    const storageRef= ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
      setFilePer(Math.round(progress))
    },
      (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
        setFromData({...fromData, avatar:downloadUrl});
      });
    });
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={fromData.avatar||currentUser.avatar} alt="Profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          { fileUploadError? (<span className='text-red-700'>Error Image Upload(Image must be less than 2 MB)</span>):
            (filePer>0 && filePer<100 ?(
              <span className='text-slate-700'>{`Uploading ${filePer}`}</span>):
              filePer===100?(
                <span className='text-green-700'>Image Successfully Uploaded </span>
              ):(''))
            
          }
        </p>
        <input type='text' placeholder='username' id='username' className='border p-3 rounded-lg ' />
        <input type='email' placeholder='Email' id='email' className='border p-3 rounded-lg ' />
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg ' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      </div>
  )
}
