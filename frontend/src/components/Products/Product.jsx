import React, { useEffect, useRef } from 'react'
import ProductDetails from './ProductDetails'
import ProductsGrid from './ProductsGrid'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSimilarProducts } from '../../../redux/slices/productsSlice'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import Reviews from './Reviews'

const Product = () => {
  const {id}=useParams()
  const {user}=useSelector((state)=>state.auth)
  const userId=user?._id;
  const [reviews,setReviews]=useState([])
  const [isEditing,setIsEditing]=useState(false)
  const footerTriggerRef = useRef(null);

    const dispatch=useDispatch()
        const {similarProducts,loading,error}=useSelector((state)=>state.products)
       


         useEffect(()=>{
                dispatch(fetchSimilarProducts(id))
            },[dispatch])
            const handleFetchReviews=async(id)=>{
              const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/reviews`,{
                params:{productId:id} 
              })
              setReviews(res.data.reviews)
              
            
            } 
          useEffect(()=>{
           
            handleFetchReviews(id)
              
          },[id])
            console.log(reviews)
          
            //add a comment
          const handleSubmitOrEdit = async (e,comment,rating) => {
                e.preventDefault();

                if (isEditing) {
                  // Call your edit API
                  await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/product/review/edit`, {
                    productId: id,
                    comment,
                    rating,
                    
                    
                  },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            });
                  setIsEditing(false); // stop editing after saving
                } else {
                  // Call your submit API
                  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/product/review`, {
                    productId: id,
                    comment,
                    rating,
                    
                    
                  },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            });
                }

               
                handleFetchReviews(id); // refresh reviews
              };

    //delete a comment
    const handleDelete=async(productId)=>{
      const res=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/review/delete/${productId}`, {
               withCredentials:true
            })
            handleFetchReviews(id)
    }
         
          return (
    <div className='md:mt-[120px] mt-[80px] w-full '>
      <ProductDetails productId={id}/>
        <h1 className='text-center md:text-2xl text-[18px] mt-4 font-bold mb-2 md:mb-5'>Similar Products</h1>
      <div className='w-full px-2 md:px-20 flex justify-center items-center mx-auto  '>
        <ProductsGrid cols={4} products={similarProducts} loading={loading} error={error}/>
      </div>  
      

      <div className='w-[90%] mx-auto'>
        <Reviews  setIsEditing={setIsEditing} isEditing={isEditing} handleDelete={handleDelete} handleSubmitOrEdit={handleSubmitOrEdit} reviews={reviews} userId={userId} productId={id}/>
      </div>
    </div>
  )
}

export default Product
