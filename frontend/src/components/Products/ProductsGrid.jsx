    import React, { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import { useEffect } from 'react';
    import axios from 'axios';
    import { useSelector } from 'react-redux';
    import { toast } from 'sonner';
    
import ProductGridSkeleton from '../../Skeletons/ProductGridSkeleton';
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

    const ProductsGrid = ({products,loading,error,setShowFooter}) => {
        const {user}=useSelector((state)=>state.auth)
        const navigate=useNavigate()
        const userId=user?._id;
        
        
        
        
    
        const [favourites,setFavourites]=useState([]);

        const handleWishList= async(userId,productId)=>{
           
            const alreadyInWishlist=favourites.includes(productId)

            if(alreadyInWishlist){
                setFavourites(prev=>prev.filter(id=>id!=productId));
            }
            else{
                setFavourites(prev=>[...prev,productId]);
            }
            
            try {
                let res;
                if(alreadyInWishlist){
                     res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/remove`,{userId,productId});

                }
                else{
                     res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/add`,{userId,productId});
                }
                
            
            if(res.data.message==="Added"){
                
                 toast.success("Added to wishlist",{
                duration:1000
            })
            }
            else{
                
                 toast.success("Removed from wishlist",{
                duration:1000
            })
            }
            } catch (error) {
                if(alreadyInWishlist){
                    setFavourites(prev=>[...prev,productId]);
                }
                else{
                    setFavourites(prev=>prev.filter(id=>id!==productId))
                }
                toast.error("Something went Wrong")
            }
           
            
            
        }
        useEffect(()=>{
                const getWishList=async(userId)=>{
                
                    const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/all`,{
                        params:{userId}
                    });
                    
                    setFavourites(res.data.user.products)
                
                }

                getWishList(userId);
                

            },[userId])
        
        // if(loading){
        //     return <p>Loading...</p>
        // }

        if(error){
            return <p>Error : {error}</p>
        }
        
        const onProductClick=(id)=>{
            navigate(`/product/${id}`)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
       
       if(loading){
        return <ProductGridSkeleton count={20}/>
       }
            
    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-3 xl:grid-cols-5 md:grid-cols-4  '>
                {
                    products.map((product)=>{
                            return(
                                <div key={product._id} className='w-full md:h-[400px]   p-1 hover:shadow-lg cursor-pointer ' onClick={()=>{onProductClick(product._id)}}>
                                    <div className='relative flex items-center justify-center'>
                                        <img loading='lazy' className=' w-[95%] h-[200px] md:h-[320px]  object-cover  object-top' src={product.images?.[0]?.url.replace("/upload/","/upload/f_auto,q_auto,w_600/")||"/placeholder.png"}/>
                                        <div onClick={(e)=>{
                                            e.stopPropagation()
                                            handleWishList(userId,product._id)}} className='top-3  right-3  rounded-[5px] absolute py-1 px-1 bg-white/80 '>
                                           {favourites.includes(product._id)?
                                           (<FaHeart
                                           className='text-[20px] text-red-500'
                                           onClick={(e)=>{
                                            // e.stopPropagation()
                                           }}
                                           />):
                                           (<FaRegHeart
                                           className='text-[20px] text-red-500'
                                            onClick={(e)=>{
                                            // e.stopPropagation()
                                           }}
                                           />)}
                                        </div>
                                        </div>  
                                    <div className='p-2'>
                                        <h3 className='text-[13px] truncate'>{product.name}</h3>
                                        <p>₹{product.price}</p>
                                    </div>
                                    
                                </div>
                            )
                    })
                }
            </div>
    )
    }

    export default ProductsGrid
