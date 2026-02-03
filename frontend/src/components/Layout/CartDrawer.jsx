import React from 'react'
import { IoCloseSharp } from "react-icons/io5";
import Cartcontents from '../Cart/Cartcontents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const CartDrawer = ({isopen,setCartDrawer}) => {
  const navigate=useNavigate()

  const {user,guestId}=useSelector((state)=>state.auth)
  const {cart}= useSelector((state)=>state.cart)
  const userId=user?user._id:null;
    
    const handleCheckout=()=>{
      if(!user){
        navigate("/login?redirect=checkout")
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      else{
        navigate("/checkout")
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      setTimeout(()=>{
        setCartDrawer(false)
      },200)
    }
  return (
    <>
    <div className={`z-50 bg-white fixed top-0  h-full  duration-300 transition-transform right-0 transform flex flex-col  w-3/4 sm:w-1/2 md:w-[30rem] ${isopen?"translate-x-0":"translate-x-full"}`}>
    <div className=' flex justify-end'>
        <button className='p-2' onClick={()=>setCartDrawer(false)}>
        <IoCloseSharp className='cursor-pointer text-3xl'/>
    </button>
    </div>
    <div className="flex-grow p-4 overflow-y-auto"> 
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart&&cart?.products?.length>0?(<Cartcontents cart={cart} userId={userId} guestId={guestId}/>):(<p>Your cart is empty</p>)}
      

    </div>
    <div className='p-4 sticky bottom-0 w-'>
      {cart&&cart?.products?.length>0&&(
        <>
              <button onClick={handleCheckout}  className='w-full px-2 border border-black hover:bg-gray-800 bg-black rounded-sm  text-white text-2xl'>Checkout</button>

        </>
      )}
    </div>
    </div>
    </>
  )
}

export default CartDrawer
