import React, { use,useEffect } from 'react'
import menscollection from '../../assets/menscollection.png'
import { useState } from 'react';
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const NewArrivals = () => {
  const navigate=useNavigate()
    
    // const [id,setId]=useState("")
     const onProductClick=(id)=>{
        // setId(id)
        navigate(`/product/${id}`)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  const [newArrivals,setNewArrivals] = useState([])

  useEffect(()=>{
    const fetchNewArrivals=async ()=>{
      try {
      const response= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
      
      setNewArrivals(response.data.newArrivals)
    } catch (error) {
      console.log(error)
      
    }

    }
    fetchNewArrivals();
  },[])
 
 
  
  


const [scrollx,setScrollx] =useState(0);
  const handleScrollx=()=>{
      setScrollx(scrollx+100)
      
  }

  return (
    <section className='px-7 md:px-10'>
        <div className='flex justify-center text-[25px] md:text-3xl font-bold '>
          Explore new Arrivals
        </div>
        <p className='flex justify-center text-[15px] text-justify mt-3'> Discover the Latest styles straight off the runway,freshly added to keep your wardrobe on the cutting edge of fashion</p>
        <div className='flex justify-end h-[40px] md:h-[50px] w-[100%] gap-2'>
          <button onClick={handleScrollx} className='text-4xl  rotate-180'><IoChevronForwardCircleOutline/></button>
          <button className=' text-4xl '><IoChevronForwardCircleOutline/></button>
        </div>
        <div className='container w-[100%] h-[400px]  flex mx-auto space-x-5  overflow-y-hidden  overflow-x-scroll '>
          {
            newArrivals.map((product,index)=>{
              return (
              <div key={index} onClick={()=>{onProductClick(product._id)}}  className={`min-w-[100%] cursor-pointer md:min-w-[25%] h-full   relative rounded-lg`}> 
                
                  <img className='w-full h-full object-cover object-top rounded-lg' src={product?.images[0]?.url.replace("/upload/","/upload/f_auto,q_auto,w_600/")} alt={product.images[0].altText}/>
                  <div className='absolute bottom-0 w-full h-[60px] bg-opacity-50 backdrop-blur-md p-2 rounded-b-lg text-white'> 
                    <h4>{product.name}</h4>
                    <p > Rs {product.price}</p>
                  </div>
                
              </div>
              )
            })
          }
        </div>
    </section>
  )
}

export default NewArrivals
