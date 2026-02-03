import React from 'react'
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../../redux/slices/cartSlice';
// import product from '../../../../backend/models/product';

const Cartcontents = ({cart,userId,guestId}) => {
   const dispatch=useDispatch()
  console.log(guestId)
   //handle adding and subtracting to cart
   const handleAddToCart=(productId,delta,quantity,size,color)=>{
    const newQuantity=quantity+delta;
    if(newQuantity>=1){
      console.log(productId,newQuantity,guestId,size,color)
      dispatch(updateCartItemQuantity({productId,quantity:newQuantity,guestId,userId,size,color}))
      
    }
   }

   const handleRemoveFromCart=(productId,size,color)=>{
    dispatch(removeFromCart({productId,guestId,userId,size,color}))
   }
  return (
    <div>
      {
        cart.products.map((product,index)=>(
            <div key={index} className='flex w-full md:h-[90px] rounded   p-1 border-gray-400 border justify-between mb-2'>
                <div className='w-[20%]    flex justify-center items-center ml-2 '>
                    <img  className='object-cover md:h-full h-[50px] w-full border object-top border-gray-200 rounded-md' src={product.image}/>
                </div>
                <div className='flex flex-col ml-4  w-[60%]'>
                <h3 className='font-normal text-[15px]  truncate'>{product.name}</h3>
                <span className='text-sm text-gray-700'>Color -{product.color} | Size:-{product.size}</span>


                <div className='flex items-center  justify-self-start  h-[25px] m-1'>
                  
                    <div onClick={()=>{handleAddToCart(product.productId,-1,product.quantity,product.size,product.color)}} className='w-[25px] border h-full cursor-pointer flex justify-center items-center  text-xl'>-</div>
                    <span className='mx-4'>{product.quantity}</span>
                    <div onClick={()=>{handleAddToCart(product.productId,1,product.quantity,product.size,product.color)}} className='w-[25px] border h-full cursor-pointer  flex justify-center items-center  text-xl'>+</div>
                    
                </div>
                </div>
                <div className=' w-[20%] flex flex-col items-end px-2'>
                    <p
                     className='text-1xl'>₹{product.price}</p>
                    <MdDeleteForever onClick={()=>{handleRemoveFromCart(product.productId,product.size,product.color)}} className='text-3xl cursor-pointer text-red-500 mt-2'/>
                </div>

                
            </div>
        ))
      }
    </div>
  )
}

export default Cartcontents
