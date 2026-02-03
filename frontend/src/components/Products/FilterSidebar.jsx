import React, { useEffect,useState } from 'react'
import {useSearchParams,useNavigate} from "react-router-dom"
 
const FilterSidebar = () => {
  const [searchParams,setSearchParams]=useSearchParams([])
  const navigate =useNavigate(); 
  const [filter,setFilter]=useState({
    category:"",
    gender:"",
    color:"",
    size:[],
    material:[],
    brand:[],
    minPrice:"",
    maxPrice:""
  })
  const [priceRange,setPriceRange]= useState([0,100])
  const categories=["Top Wear","Bottom Wear"]
  const colors=[
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ]
  const sizes = ["XS", "S", "м", "L", "XL", "XXL"];
  const materials = [
      "Cotton",
      "Wool",
      "Denim",
      "Polyester",
      "Silk", 
      "Linen",
      "Viscose",
      "Fleece",
  ]
  
      const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
      ]
    const gender =["Men","Women"]

      useEffect(()=>{
        const params=Object.fromEntries([...searchParams])

        setFilter({
          category: params.category ||"",
          gender: params.gender || "",
          color: params.color || "",
          size: params.size ? params. size.split(",") : [],
          material: params.material ? params.material.split(",") : [],
          brand: params.brand ? params.brand.split(",") : [],
          minPrice: params.minPrice||0,
          maxPrice: params.maxPrice||10000,
        })
        setPriceRange([0,params.maxPrice||10000])
      },[searchParams])

      const handleFilterChange=(e)=>{

        const {name,value,checked,type}=e.target;
        console.log(name,value,checked,type)
        let newFilters={...filter};
        if(type==="checkbox"){
          if(checked){
          newFilters[name]=[...(newFilters[name]|| []),value];
          }
         else{
          newFilters[name]=newFilters[name].filter((item)=>item!==value)
        }

      }
      else{
        newFilters[name]=value;
      }
      setFilter(newFilters) 
      console.log(newFilters)
      upadateURLParams(newFilters)
    }

    const upadateURLParams=(newFilters)=>{
      const params=new URLSearchParams()
      Object.keys(newFilters).forEach((key)=>{
         if(Array.isArray(newFilters[key])&& newFilters[key].length>0){
          params.append(key,newFilters[key].join(","));
         }
         else if(newFilters[key]){
          params.append(key,newFilters[key])
         }
      })
      setSearchParams(params);
      navigate(`?${params.toString()}`)
    }
    const handlePriceRange=(e)=>{
      const newPrice=e.target.value
      setPriceRange([0,newPrice])
      const newFilters={...filter,minPrice:0,maxPrice:newPrice}
      setFilter(filter)
      upadateURLParams(newFilters)

    }
  

  return (
    <div className='w-full h-[1080px] md:h-[1150px] text-[12px] md:text-[14px]  p-2 md:p-5'>
      <div>
        <label className='text-[14px] md:text-[16px] font-semibold'>Category</label>
        {
          categories.map((category)=>{
            return(
              <div  key={category}>
                <input checked={filter.category===category} type="radio" name="category" value={category} onChange={handleFilterChange}></input>
                 <span className="ml-2">{category}</span>
              </div>

            )
          })
        }
      </div>
       <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] font-semibold' >Gender</label>
        {
          gender.map((gender)=>{
            return(
              <div key={gender}>
                <input type="radio" checked={filter.gender===gender} value={gender} onChange={handleFilterChange} name="gender"></input>
                 <span className="ml-2">{gender}</span>
              </div>

            )
          })
        }
      </div>
       <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] font-semibold '>Color</label>
        <div className='grid grid-cols-4 gap-3' > 
        {
          colors.map((color)=>{
            return(
             
                <button name="color" checked={filter.color===color} key={color} className={`md:w-[40px] w-[30px] h-[30px] ${filter.color===color?"ring-2 ring-blue-500":""} rounded-full md:h-[40px] border border-gray-400 `} value={color} onClick={handleFilterChange} style={{backgroundColor:`${color.toLocaleLowerCase()}`}}> </button>
            )
          })
        }
        </div>
      </div>
      <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] font-semibold'>Size</label>
        {
          sizes.map((size)=>{
            return(
              <div key={size} >
                  
                <input type="checkbox" checked={filter.size.includes(size)} value={size} onChange={handleFilterChange} name="size"></input>
                 <span className="ml-2">{size}</span>
              </div>

            )
          })
        }
      </div>
       <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] font-semibold '>Material</label>
        {
          materials.map((material)=>{
            return(
              <div key={material} >
                <input type="checkbox" value={material} checked={filter.material.includes(material)} onChange={handleFilterChange} name="material"></input>
                 <span className="ml-2">{material}</span>
              </div>

            )
          })
        }
      </div>
       <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] font-semibold '>Brand</label>
        {
          brands.map((brand)=>{
            return(
                <div key={brand}>
                <input type="checkbox" value={brand} checked={filter.brand.includes(brand)} onChange={handleFilterChange} name="brand"></input>
                 <span className="ml-2">{brand}</span>
                 </div>
              

            )
          })
        }
      </div>
       <div className='mt-3'>
        <label className='text-[14px] md:text-[16px] flex flex-col font-semibold '>Price</label>
        
         
              
                <input className='w-full' value={priceRange[1]} onChange={handlePriceRange} type="range" name="pricerange" min={0} max={10000}></input>
                 <div className='flex justify-between w-full '>
                  <span>0</span>
                  <span>{priceRange[1]}</span>
                 </div>

              

           
        
      </div>
      
    </div>
  )
}

export default FilterSidebar
