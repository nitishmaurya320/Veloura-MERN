import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [searchParams,setSearchParams]=useSearchParams()
    
  const handleSortChange=(e)=>{
    const sortBy=e.target.value 
    searchParams.set("sortBy",sortBy)
    setSearchParams(searchParams)
    
  }
  return (
    <div  className='flex items-center justify-center'>
      <select id="sort" className='' onChange={handleSortChange} value={searchParams.get("sortBy")||""}>
        <option className='' value="Default">Default</option>
        <option value="PriceDesc" >Price: High to Low</option>
        <option value="PriceAsc">Price: Low to High</option>
        <option value="Popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions
