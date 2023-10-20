import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState,useEffect } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import {updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const dispatch=useDispatch();
  const fileRef=useRef(null);
  const {currentUser,loading,error} =useSelector( (state)=> state.user);
  const [file,setFile]=useState(undefined);
  const [filePer,setFilePer]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [fromData,setFromData]=useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false);
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
  const handleChange =(e)=>{
    setFromData({...fromData,[e.target.id]:e.target.value});
  };
  const handleSubmit= async (e) =>{
    e.preventDefault();
    try{
        dispatch(updateUserStart());
        const res= await fetch(`/api/user/update/${currentUser._id}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(fromData)
        });
        const data =await res.json()
        if(data.success===false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
    }
    catch(error){
        dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser = async ()=>{
    try{
        dispatch(deleteUserStart());
        const res= await fetch(`/api/user/delete/${currentUser._id}`,{
              method:'POST',
        });
        const data = res.json();
        if(data.success===false){
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserSuccess(data));

    }
    catch(error){
        dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignout =async ()=>{

      try{
        dispatch(signOutUserStart())
          const res= await fetch('/api/auth/sign-out');
          const data =await res.json();
          if(data.success===false){
              dispatch(signOutUserFailure(data.message))
            return;
          }
          dispatch(signOutUserSuccess(data))
      }
      catch(error){
          dispatch(signOutUserFailure(error.message))
      }

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
         <input  onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept="image/*"/>
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
        <input type='text' placeholder='username' id='username' defaultValue={currentUser.username} className='border p-3 rounded-lg ' onChange={handleChange}/>
        <input type='email' placeholder='Email' id='email' defaultValue={currentUser.email}className='border p-3 rounded-lg ' />
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg ' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{(loading)?'loading...':'update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 'to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser}className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout}className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error? error:""}</p>
      <p className='text-slate-700 uppercase '>{updateSuccess?"user update successfully":""}</p>
      </div>
  )
}
