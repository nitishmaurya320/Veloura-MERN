import React, { useEffect, useState } from 'react'
import kids from '../../assets/kidscollection.png'
import { FaRupeeSign } from "react-icons/fa";
import {toast} from "sonner"
import { useDispatch,useSelector } from 'react-redux';
import { fetchProductDetails } from '../../../redux/slices/productsSlice';
import { addToCart } from '../../../redux/slices/cartSlice';
import { useParams } from 'react-router-dom';

const ProductDetails = ({productId}) => {

    const {id}=useParams()
    const dispatch =useDispatch()
        
    const {selectedProduct,loading,error}=useSelector((state)=>state.products)
   
    const {user,guestId}=useSelector((state)=>state.auth)
    const [currentProduct,setcurrentProduct]=useState(0)
    const [selectedColor,setSelectedColor]=useState("");
    const [selectedSize,setSelectedSize]=useState("");
    const [quantity,setQuantity]=useState(1)
    const [isButtonDisabled,setIsButtonDisabled]=useState(true)
    const handlecurrentProduct=(index)=>{
            setcurrentProduct(index)
    }
    const handleSelectedColor=(color)=>{
        setSelectedColor(color)
    }
    const handleSelectedSize=(size)=>{
        setSelectedSize(size)
    }
    const handleAddToCart=()=>{
        if(!selectedColor||!selectedSize){
            toast.error("Please Add color and size",{
                duration:1000
            })
            return;

        }
        
        setIsButtonDisabled(false);
    
       dispatch(
        addToCart({
            productId:productFetchId,
            quantity,
            size:selectedSize,
            color:selectedColor,
            guestId,
            userId:user?._id,



        })
       ).then(()=>{
        toast.success("Product added to the cart",{
            duration:1000
        })
       })
       .finally(()=>{
        setIsButtonDisabled(true)
       })

       if(loading){
        return <p>Loading...</p>
       }
       if(error){
        return <p>Error :{error}</p>
       }
        
        console.log(isButtonDisabled)
    }
        const productFetchId=productId||id
        useEffect(()=>{
            if(productFetchId)
                dispatch(fetchProductDetails(productFetchId))
            
        },[dispatch,productFetchId])

       

    // const Products=[
    //     {
    //         name:"Stylish jacket",
    //         price:1200,
    //         originalPrice:1500,
    //         brand:"Fashion Brand",
    //         description:"Stay warm and on-trend with this sleek, modern jacket designed for all-day comfort.",
    //         material:"Leather",
    //         sizes:["S","M","L","XL"],
    //         colors:["red","black"],
    //         images: [
    //             {
    //                 url:"https://images.bestsellerclothing.in/data/JJ/08-oct-2024/139444107_g0.jpg?width=415&height=550&mode=fill&fill=blur&format=auto",
    //                 altText:"Stylish Jacket 1"
    //             },
    //             {
    //                 url:"https://chkokko.com/cdn/shop/files/044A0043-2.jpg?v=1726554662",
    //                 altText:"Stylish Jacket 1"
    //             }
    //         ]
    //     }
    // ]
    
  return (
    <div className='max-w-screen mx-auto md:pt-2  md:p-8 '>
        {selectedProduct&&(
            <div className='md:max-w-[80%]  w-[100%] mx-auto p-4      flex flex-col md:flex-row h-full'>
            <div className='flex-col-reverse flex  md:flex-row mx-auto  md:mx-0 md:w-[40%] ml-0 mr-0 w-full  md:space-y-4  md:gap-2 mt-5 md:mt-0'>
                <div className='  flex flex-row md:flex-col mt-2 gap-2  md:mt-0 mr-0 mb-0'>
                    {
                    selectedProduct.product.images.map((Product,index)=>{
                        return(
                            <div className='box-border' key={index}><img className={`w-[80px] h-[80px] rounded-lg  box-content object-cover transition-all outline-2  ${index==currentProduct?" outline-gray-600   ":"outline-transparent"}`}  onClick={()=>{handlecurrentProduct(index)}} src={Product.url}/></div>
                        )
                    })
                }
                </div>
                <div className='w-full flex  border-blue-600 h-[500px]  md:h-[500px]'>
                        <img className='rounded-lg w-full h-full object-cover' src={selectedProduct.product.images[`${currentProduct}`]?.url} alt="Main product    "/>
                 </div>

            </div>
            <div className='  w-full md:w-[50%] flex mt-2 md:mt-0 md:ml-5 '>
                    
                    <div>
                        <div className='text-2xl font-semibold text-gray-600'>{selectedProduct.product.name}</div>
                        <div className='line-through  font-semibold text-gray-500'>₹{selectedProduct.product.originalPrice&& selectedProduct.product.originalPrice}</div>
                        <p className='flex font-semibold  items-center text-2xl'>₹{selectedProduct.product.price}</p>
                        <p>{selectedProduct.product.description}</p>
                        <span>Color:</span>
                        <div className='space-x-2'>
                            {
                                selectedProduct.product.colors.map((color)=>{
                                    return(
                                       <button key={color} className={`rounded-full w-[30px] h-[30px] border-3 outline outline-gray-200 p-3 ${color==selectedColor?"border-3 border-blue-700":"border-transparent"}`} onClick={()=>{handleSelectedColor(color)}} style={{backgroundColor: `${color}`}}></button>
                                    )
                                })
                            }
                            
                            
                        </div>
                        <span>Size:</span>
                        <div className='space-x-3'>
                            {
                                selectedProduct.product.sizes.map((size)=>{
                                    return(
                                        <button key={size} className={`border-2 px-2 ${size===selectedSize?"border-2 border-blue-500 ":"border-gray-200"}`} onClick={()=>setSelectedSize(size)}>{size}</button>
                                    )
                                })
                            }
                        </div>
                        <span>Quantitiy:</span>
                        <div className='space-x-3'>
                            <button onClick={()=>{setQuantity(quantity>1?quantity-1:quantity)}} className='border w-[25px]'>-</button>
                            <span>{quantity}</span>
                            <button onClick={()=>{setQuantity(quantity+1)}} className='border w-[25px]'>+</button>
                        </div>
                        <button onClick={handleAddToCart} className={`w-[90%] h-[40px]  text-white bg-black rounded mt-4 ${isButtonDisabled?"bg-black-600 ":"bg-gray-800"}`}>{isButtonDisabled?"Add to Cart":"Adding..."}</button>
                        <div className='mt-3'>
                            <h3>Characteristics</h3>
                            <table className='w-full text-left'>
                                <tbody>
                                    <tr>
                                    <td className='py-1'>Brand</td>
                                    <td className='py-1'>{selectedProduct.product.brand}</td>
                                </tr>
                                <tr>
                                    <td className='py-1'>Material</td>
                                    <td className='py-1'>{selectedProduct.product.material}</td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
            </div>

        </div>
        )}
        

      
    </div>
  )
}

export default ProductDetails
