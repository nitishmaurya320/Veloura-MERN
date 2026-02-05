import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { RiAccountCircleLine } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { HiMiniBars3 } from "react-icons/hi2";
import { FiHeart } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";

import Searchbar from './Searchbar';
import CartDrawer from '../Layout/CartDrawer';
import { useSelector } from 'react-redux';


const Navbar = () => {
  const {user}=useSelector((state)=>state.auth)
  const {cart}=useSelector((state)=>state.cart)
  const cartItemCount=cart?.products?.reduce((total,product)=>total+product.quantity,0)
  const [cartDrawer,setCartDrawer]=useState(false)
  const [menuColor,setMenuColor]=useState(null);
  const [showMenuBar,setShowMenuBar]=useState(false);
  const handleMenubar=()=>{
    setShowMenuBar(!showMenuBar)
  }
  const menuItems = [
    { name: 'Men', path: '/collections/all?gender=Men' },
    { name: 'Women', path: '/collections/all?gender=Women' },
    { name: 'Kids', path: '/collections/all?gender=Kids' },
    { name: 'Top wear', path: '/collections/all?category=Top Wear' },
    { name: 'Bottom wear', path: '/collections/all?category=Bottom Wear' },
  ]
  return (
    <>
    {/* <div className="fixed border  w-screen h-screen z-1000 bg-gray-800 opacity-90 text-5xl" >hello</div> */}
    <div className=' shadow-md fixed  top-0 z-1000 w-full  md:h-[100px] h-[80px]   flex justify-between items-center bg-[#11233b] px-3 md:px-5'>
      <HiMiniBars3 className='md:text-2xl text-[20px] text-white  md:hidden ml-1 ' onClick={handleMenubar}/>
      <div className='w-[150px]  h-[40%] mx-5  md:w-[250px] md:h-[60%] '>
            <Link to="/" >
                <img src="/logo.png" alt="logo" className='w-full h-full hover:scale-103' />
                
            </Link>
        </div>
        <div >
           <ul className=' space-x-6 text-[20px] font-bold md:flex hidden  ' >
            {
            menuItems.map((item,index)=>{
              return (
               
                  <Link to={item.path}   className='hover:text-blue-800' key={index}    >
                  <li onClick={()=>{window.scrollTo({ top: 0 });}}  className='text-white menu text-2xl hover:text-yellow-200'>
                    {item.name}
                  </li>
                  </Link>
                  
                
              )
            })
            }
            </ul>
          
        </div>
       <div className='  hidden md:flex'>
        <Searchbar/>
       </div>
       
        <div className='flex  border-red-400 space-x-10'>
          {user&&user.role==="admin"&&<Link to="/admin" >
          <button className='text-white px-2 py-1 bg-black rounded-sm text-[15px] hover:bg-gray-700'>
            Admin   
          </button>
          </Link>}  
          
            <Link to="/profile">

              <RiAccountCircleLine onClick={()=>window.scrollTo({top:0})} className='md:text-2xl text-[21px] text-white'/>
            </Link>
            <Link to="/mywishlist">
              <FiHeart   className='md:text-2xl text-[21px] text-white '/>
            </Link>
            <div className='relative ' onClick={()=>setCartDrawer(true)} >
              <HiOutlineShoppingBag className='md:text-2xl text-[21px] text-white' />
              {cartItemCount>0&&(
              <div className='absolute top-[70%] right-[-10%]  md:h-[17px] md:w-[17px] w-[14px] h-[14px] flex justify-center items-center bg-red-500  rounded-full cursor-pointer'>
                <span className='  md:text-[15px] text-[12px]   text-white   '>{cartItemCount}</span>
              </div>
  
              )}
            </div>
            
        </div>
        <CartDrawer isopen={cartDrawer} setCartDrawer={setCartDrawer}/>
        </div>
        <div className={`fixed h-screen  top-0 left-0 sm:w-1/2 md:w-1/4 w-3/5 z-1001  transition-transform  duration-100 bg-white ${showMenuBar?"translate-x-0":"translate-x-[-100%]"}`} >
             <div className=' flex justify-end'>
                     <button className='p-2 ' onClick={handleMenubar}>
                     <IoCloseSharp  className='cursor-pointer  text-2xl '/>
                 </button>
              </div>
             <ul className=' space-x-6 text-[20px]  p-5' >
            {
            menuItems.map((item,index)=>{
              return (
               
                  <Link to={item.path} className='hover:text-blue-800 text-[15px]' key={index}    >
                  <li onClick={()=>{window.scrollTo({ top: 0 },
                    handleMenubar()
                  );}}>
                    {item.name}
                  </li>
                  </Link>
                
              )
            })
            }
            </ul> 
        </div>
        
    </>
  )
}

export default Navbar
