    import React, { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import { useEffect } from 'react';
    import axios from 'axios';
    import { useSelector } from 'react-redux';
    import { toast } from 'sonner';
    import { FaHeart } from 'react-icons/fa6';

    const ProductsGrid = ({products,loading,error}) => {
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
                const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/add`,{userId,productId});
            
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
        
        if(loading){
            return <p>Loading...</p>
        }

        if(error){
            return <p>Error : {error}</p>
        }
        
        const onProductClick=(id)=>{
            navigate(`/product/${id}`)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
       
       
            
    return (
        <div className='grid grid-cols-2 md:grid-cols-4  w-full  '>
                {
                    products.map((product)=>{
                            return(
                                <div key={product._id} className='w-full md:h-[400px]  p-1 hover:shadow-lg cursor-pointer ' onClick={()=>{onProductClick(product._id)}}>
                                    <div className='relative'>
                                        <img loading='lazy' className=' w-full h-[200px] md:h-[320px]  object-cover  object-top' src={product.images?.[0]?.url||"/placeholder.png"}/>
                                        <FaHeart onClick={(e)=>{
                                            e.stopPropagation();

                                            if(!user){
                                                toast.error("Please Login to Add items in Wishlist")
                                                return ;
                                            }
                                            
                                                handleWishList(user._id,product._id)
                                            
                                            }} className={`top-3 right-3 text-[25px] absolute ${favourites.includes(product._id)?"text-red-400":"text-gray-400"} `}/>
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
