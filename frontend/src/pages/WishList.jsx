import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRevalidator } from 'react-router-dom'
import ProductsGrid from '../components/Products/ProductsGrid'

const WishList = () => {
    const {user}=useSelector((state)=>state.auth)
    const [userId,setUserId]=useState(user._id)
    const [myWishist,setMyWishlist]=useState([])
    useEffect(()=>{
         const handleShowWishList=async()=>{
                const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist`,{
                    params:{userId}
         })
         setMyWishlist(res.data);
         }

         handleShowWishList();
    },[myWishist])
    console.log(myWishist)
  return (
    <>
    <div className='mt-[100px] '>
    <div className='md:text-3xl text-[18px] pl-2'>My WishList </div>
    <ProductsGrid products={myWishist}  />
    </div>
    
    </>
  )
}

export default WishList