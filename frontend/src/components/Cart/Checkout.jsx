
    import React, { useEffect, useState } from 'react'
    import { useDispatch, useSelector } from 'react-redux'
    import { useNavigate } from 'react-router-dom'
    import { createCheckout } from '../../../redux/slices/checkoutSlice'
    import {Razorpay} from './Razorpay'
    import axios from 'axios'




    const Checkout = ({setIsPaymentDone,isPaymentDone}) => {
        const navigate=useNavigate()
        const dispatch=useDispatch()
        const {cart,loading,error}=useSelector((state)=>state.cart)
        
        const {user}=useSelector((state)=>state.auth)
        const [checkoutId,setCheckoutId]= useState(null)
        const [orderId,setOrderId]=useState("")
        const [shippingAddress,setShippingAddress]=useState({
            firstName:"",
            lastName:"",
            address:"",
            city:"",
            postalCode:"",
            country:"",
            phone:"",
        });
        
        //ensure cart is loaded before proceeding
        useEffect(()=>{
                if(!cart||!cart.products||cart.products.length===0){
                    navigate("/")

                }
        },[cart,navigate])


        const handleCreateCheckout=async(e)=>{
            e.preventDefault()
            console.log("✅ Checkout form submitted"); // ADD THIS
            if(cart&&cart.products.length>0){
                const res=await dispatch(createCheckout( {
                    checkoutItems:cart.products,
                    shippingAddress,
                    paymentMethod:"Razorpay",
                    totalPrice:cart.totalPrice

                }))
                console.log("🛒 Response from backend:", res); // ADD THIS
                if (res.payload && res.payload.newCheckout && res.payload.newCheckout._id) {
                    setCheckoutId(res.payload.newCheckout._id);
                    console.log("✅ Checkout ID set:", res.payload.newCheckout._id);
                    }
            }

        }
        const handlePaymentSuccess= async (details)=>{
            try {
                
                const response=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                {  paymentStatus:"paid",paymentDetails:details}
                ,{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
                
                await handleFinalizeCheckout(checkoutId)
                
                window.scrollTo({ top: 0 });

                console.log(details)
            }
            
            catch (error) {
                console.log(error)
                setIsPaymentDone(false)
            }
        

        }

        const handleFinalizeCheckout=async(checkoutId)=>{
            try {
                
                const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,{},{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                })
                    console.log(response)
                    setIsPaymentDone(false)
                    navigate(`/order-confirmation/${response.data._id}`)
                
            } catch (error) {
                console.log(error)
                setIsPaymentDone(false)
                
            }

        }
        if(loading){
        return   <p>Loading cart...</p>
        }
        if(error){
        return  <p>Error {error}</p>
        }
        if(!cart||!cart.products||cart.products.length===0){
            return <p>Your cart is empty</p>
        }
        
    return (
        <div className='mt-[100px] h-full    '>
            {isPaymentDone&&<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/35'>
                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            </div>}
            {/* {left} */}
            <div className='md:flex-row md:text-[15px] text-[12px]  flex-wrap  flex  justify-center md:gap-6   p-5 md:h-full  items-center'>
            <div className='md:w-[40%] w-full md:order-0 order-1  m-0 max-w-[500px] '>  
                <h2 className='md:text-[19px] text-[16px] font-bold'>CHECKOUT</h2>
                <p className='md:text-[17px] text-[14px] font-bold'>Contact Details</p>
                <form onSubmit={handleCreateCheckout} className=''>
                <div className='flex flex-col'>
                    <label >E-mail</label>
                    <input disabled value={user?user.email:""}  className='border p-1 border-gray-400 rounded-md h-[35px] outline-gray-400'></input>
                </div>
                <div>
                    <h2 className='md:text-[17px] text-[14px] font-bold'>Delivery</h2>
                    <div className='flex justify-between mt-2 gap-2'>
                        <div className='flex-col flex'>
                        <label  >First Name</label>
                        <input value={shippingAddress.firstName} onChange={(e)=>setShippingAddress({...shippingAddress,firstName:e.target.value})} className='border border-gray-400 rounded-md h-[35px] outline-gray-400 w-full p-2'></input>
                        </div>
                    <div className='flex-col flex'>
                        <label >Last Name</label>
                        <input
                        value={shippingAddress.lastName} onChange={(e)=>setShippingAddress({...shippingAddress,lastName:e.target.value})}
                        className='border border-gray-400 rounded-md h-[35px] outline-gray-400 w-full p-2'></input>
                    </div>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label >Address</label>
                        <input
                        value={shippingAddress.address} onChange={(e)=>setShippingAddress({...shippingAddress,address:e.target.value})}
                        className='border border-gray-400 rounded-md h-[35px] outline-gray-400 p-2'></input>
                    </div>
                    <div className='flex justify-between mt-2 gap-2'>
                        <div className='flex-col flex'>
                        <label >City</label>
                        <input
                        value={shippingAddress.city} onChange={(e)=>setShippingAddress({...shippingAddress,city:e.target.value})}
                        className='border border-gray-400 w-full rounded-md h-[35px] outline-gray-400 p-2'></input>
                        </div>
                    <div className='flex-col flex'>
                        <label >Postal code</label>
                        <input 
                        value={shippingAddress.postalCode} onChange={(e)=>setShippingAddress({...shippingAddress,postalCode:e.target.value})}
                        className='border border-gray-400 w-full rounded-md h-[35px] outline-gray-400 p-2'></input>
                    </div>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label >Country</label>
                        <input
                        value={shippingAddress.country} onChange={(e)=>setShippingAddress({...shippingAddress,country:e.target.value})}
                        className='border border-gray-400 rounded-md h-[35px] outline-gray-400 p-2'></input>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label >Phone</label>
                        <input
                        value={shippingAddress.phone} onChange={(e)=>setShippingAddress({...shippingAddress,phone:e.target.value})}
                        className='border border-gray-400 rounded-md h-[35px] outline-gray-400 p-2'></input>
                    </div>

                </div>
                <div className=' items-center justify-center mt-2    '>
                        {!checkoutId?(
                            <button  className='bg-black hover:bg-gray-800 text-white px-2 py-2 rounded-md'>Continue to Payment</button>

                        ):(
                            <div>
                            <h1 className='text-xl font-semibold mb-2'>Continue with Razorpay</h1>
                            <Razorpay  onPayClick={() => setIsPaymentDone(true)}    amount={cart.totalPrice}  onSuccess={handlePaymentSuccess}
                             onError={(err)=>{alert("Payment failed")
                                setIsPaymentDone(false)}
                             }/> 
                            </div>   
                        )}
                    
                        
                </div>
                </form>


        
            </div>
            {/* {right}. */}

            <div className='md:w-[40%] md:h-full md:text-[15px] text-[12px] w-full shadow-md mb-5  bg-gray-50 mt-5 md:mt-0   p-4'>

                <div><h3 className='text-bold text-2xl mb-4'>Order Summary</h3></div>      
                    <div>
                        {
                            cart.products.map((item,index)=>{
                                return(
                                    <div key={index} className='flex  p-1 rounded bg-gray-200/40  justify-between mb-2'>
                    <div className='w-[10%] flex justify-center   items-center ml-2 '>
                        <img  className='object-cover rounded-md' src={item.image}/>
                    </div>
                    <div className='flex flex-col ml-4 w-[70%] '>
                    <h3 className='font-normal '>{item.name}</h3>
                    <span className=' text-gray-700'>Brand -{item?.brand} | Size:-{item.size}</span>
                    </div>
                    <div className=' w-[20%] flex  flex-col items-end px-2'>
                                        <p >₹{item.price}</p>
                                        
                                    </div>
                    </div>
                    
                                )
                            })
                        }
                    </div>
                    <div>
                        <div className='flex justify-between '><h3>Subtotal</h3><span>₹{cart.totalPrice}</span> </div>
                        <div className='flex justify-between'><h4>Shipping</h4> <p>Free</p> </div>
                    </div>
                    <div className='flex justify-between mt-5 '>
                        <h3>Total</h3>
                        <p>{`₹ ${cart.totalPrice}`}</p>
                    </div>


            </div>
            <div className='flex items-center justify-center mt-2 md:hidden   '>
                            
                
                       
                    
                        
                </div>
            </div>
        </div>
    )
    }

    export default Checkout
