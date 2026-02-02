import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import login from "../assets/login.png"
import { loginUser } from '../../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { useEffect } from 'react'
import {toast} from "sonner"
import { mergeCart } from '../../redux/slices/cartSlice'
const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const location=useLocation()
    const {user,guestId,loading}=useSelector((state)=>state.auth)
     const {cart}=useSelector((state)=>state.cart)

     //get redirect parameter and check if its checkout or something 

     const redirect=new URLSearchParams(location.search).get("redirect")||"/"
     const isCheckoutRedirect=redirect.includes("checkout")

     useEffect(()=>{
      if(user){
        if(cart?.products.length>0&&guestId){
          dispatch(mergeCart({guestId,user})).then(()=>{
            navigate(isCheckoutRedirect?"/checkout":"/")
          })
        }else{
           navigate(isCheckoutRedirect?"/checkout":"/")
        }
      }
     },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch])

     const handleSubmit=async (e)=>{
        e.preventDefault()
      if(!email||!password){
        return toast.error("Please enter Email and Password",2000)
      }
        dispatch(loginUser({email,password}))
       
    }
    

  return (
    <div className='w-full h-[700px] md:h-screen mt-[100px] flex '>
      <div className='w-full md:w-1/2 flex md:p-10 p-0  justify-center items-center '>
        <form onSubmit={handleSubmit} className=' md:w-[80%] w-[95%] p-8 gap-2 h-[450px] flex-col justify-between  rounded-lg shadow-md '>
            <div className='text-3xl font-bold text-[#c8a261]'>Veloura</div>


        <div className='flex-col flex justify-evenly   p-2 h-[250px] '>
        <label className='text-[20px]' >E-mail</label>
        <input type="text" className='p-2' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter email'></input>

        <label className='text-[20px]'>Password</label>
        <input className='p-2' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Enter password' type="password"></input>
        </div>
        <div className='flex justify-center'>
          {
            loading?(<p>...</p>):<button type="submit"  className='px-3 py-2 w-full hover:bg-gray-800 bg-black text-white rounded-md' >Login</button>

          }
        </div>
        <div className=' place-items-center'>
          <p className='mt-5'>Don't have an account</p>
        <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`}>
            <p className='text-blue-400'>Sign up</p>
        </Link>
        </div>
        </form>
        
      </div>

      {/* image */}
      <div className='hidden md:block w-1/2 p-5'>
        <img className=' w-full h-full rounded-lg' src={login}/>
      </div>
    </div>
  )
}

export default Login
