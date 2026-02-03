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
            <div key={index} className='flex w-full  rounded   p-1 border-gray-400 border justify-between mb-2'>
                <div className='md:w-[70px] md:h-[70px] w-[50px] h-[50px] aspect-square border   shrink-0 flex justify-center items-center  '>
                    <img  className=' w-full h-full  object-cover object-top border  border-gray-200 rounded-md' src={product.image}/>
                </div>
                <div className='flex flex-col ml-4 md:text-[15px] text-[12px]  w-[60%]'>
                <h3 className='font-normal   truncate'>{product.name}</h3>
                <span className=' text-gray-700'>Color -{product.color} | Size:-{product.size}</span>


                <div className='flex items-center  justify-self-start md:text-[15px] text-[12px]  h-[25px] m-1'>
                  
                    <div onClick={()=>{handleAddToCart(product.productId,-1,product.quantity,product.size,product.color)}} className='md:w-[25px] md:h-[25px] w-[20px] border h-[20px] cursor-pointer flex justify-center items-center  text-xl'>-</div>
                    <span className='mx-4 w-[10px]'>{product.quantity}</span>
                    <div onClick={()=>{handleAddToCart(product.productId,1,product.quantity,product.size,product.color)}} className='md:w-[25px] w-[20px] md:h-[25px] h-[20px] border  cursor-pointer  flex justify-center items-center  text-xl'>+</div>
                    
                </div>
                </div>
                <div className=' w-[20%] md:text-[15px] text-[12px] flex flex-col items-end px-2'>
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
