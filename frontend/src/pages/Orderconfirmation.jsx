import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearCart } from '../../redux/slices/cartSlice'
import { fetchOrderDetails } from '../../redux/slices/orderSlice'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Orderconfirmation = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {orderDetails,loading,error}=useSelector((state)=>state.orders)
  const [showAnimation, setShowAnimation] = useState(true)
  
  const {orderId}=useParams();
  useEffect(()=>{
          dispatch(fetchOrderDetails(orderId))
      },[dispatch,orderId])

      const checkout=orderDetails
  //clear the cart when order is confirmed
    
  useEffect(()=>{
    if(checkout&&checkout._id){
      dispatch(clearCart())
      localStorage.removeItem("cart")
    }
     
   
  },[checkout,dispatch,navigate])

  useEffect(() => {
    if (checkout && checkout._id) {
      const timer = setTimeout(() => {
        setShowAnimation(false)
        
      }, 2000) // 2 seconds animation
      return () => clearTimeout(timer)
    }
  }, [checkout])


  
    return (
    <div className=' relative min-h-screen flex-col justify-center items-center mt-[100px] p-3 md:p-10 '>
      {(loading||showAnimation)&&
      <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/9b1ee2d6-a0a3-48a2-8f1f-7024e1f6952c/wE1SHm7mmo.lottie"
          className="w-[400px]"
          autoplay
          loop={false}
          
        />
      </div>}
    
  

  {!loading&&(
      <div className="container w-full   md:w-[50%] mx-auto p-4 m-5 shadow-md ">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <p className="mb-2 text-green-500 text-2xl font-bold">Thank you for your order!</p>
        <p className="mb-2 font-bold">Order ID: #{checkout?.paymentDetails?.razorpay_order_id}</p>
        <p className="mb-2">Order Date: {new Date(checkout?.createdAt).toDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">Shipping Address</h2>
        <p>{checkout?.shippingAddress?.address}</p>
        <p>{checkout?.shippingAddress?.city}</p>
        <p>{checkout?.shippingAddress?.country}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Order Items</h2>
        <ul className="list-disc pl-5">
          {checkout?.orderItems?.map((item,index) => (
            <div key={index} className='flex  p-1 rounded shadow-md justify-between mb-2'>
                    <div className='w-[10%] flex justify-center   items-center ml-2 '>
                        <img  className='object-cover rounded-md' src={item?.image}/>
                    </div>
                    <div className='flex flex-col ml-4 w-[70%] '>
                    <h3 className='font-normal text-[15px]'>{item?.name}</h3>
                    <span className='text-sm text-gray-700'>Brand -{item?.brand} | Size:-{item?.size}</span>
                    </div>
                    <div className=' w-[20%] flex  flex-col items-end px-2'>
                                        <p className='text-1xl'>₹{item?.price}</p>
                                        
                                    </div>
                    </div>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">Total Amount</h2>
        <p>₹ {checkout?.orderItems?.reduce((total, item) => total + item?.price * item?.quantity, 0)}</p>
        <button
  onClick={() =>
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/invoice/${orderId}`,
      "_blank"
    )
  }
  className="bg-black text-white px-3 mt-2 py-2 rounded"
>
  Download Invoice
</button>
      </div>
      
      
    )}
    

    </div>
  )
    
  
}

export default Orderconfirmation
