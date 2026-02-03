import React, { useEffect,useState,useRef} from 'react'
import ProductsGrid from '../components/Products/ProductsGrid'
import { IoFilter } from "react-icons/io5";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilter } from '../../redux/slices/productsSlice';

const CollectionPage = ({id,setId}) => {
    const {collection}=useParams()
    const [searchParams]=useSearchParams()
    const footerTriggerRef = useRef(null);
    const dispatch=useDispatch()
    const {products,loading,error}=useSelector((state)=>state.products)
    
    const [showFooter,setShowFooter]=useState(false)
    const queryParams=Object.fromEntries([...searchParams])
    // const [products,setProducts]=useState([])
    const [showFilterBar,setShowFilterBar]=useState(false)

    useEffect(()=>{
        dispatch(fetchProductsByFilter({collection,...queryParams}))
    },[dispatch,collection,searchParams])

    const handleFilterBar=()=>{
        setShowFilterBar(!showFilterBar)
    }
    

   useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowFooter(entry.isIntersecting);
    },
    {
      root: null,        // viewport
      threshold: 0.2,    // 20% visible
    }
  );

  if (footerTriggerRef.current) {
    observer.observe(footerTriggerRef.current);
  }

  return () => observer.disconnect();
}, []);





    
      
    
    

  return (
    <section className='w-full  mt-[80px] md:mt-[100px] flex relative '>
        {/* {mobile filter} */}
        <div className={`fixed h-full w-[50%]  md:hidden overflow-y-scroll  border-green-400 bg-white  top-[80px] duration-100 z-3 ${showFilterBar?"translate-x-0":"-translate-x-full"}`}>
            <FilterSidebar/>
        </div>
        <div className={` fixed overlay w-screen h-screen top-0  border-yellow-300 bg-gray-500 opacity-23 z-2 ${showFilterBar?"block":"hidden"} `} onClick={handleFilterBar}>

        </div>
        {/* {desktop filter} */}    
        <div className={`w-[20%] ${showFooter?"sticky top-[100px]":"fixed top-[100px]"} hidden     h-screen left-0 bg-white overflow-y-scroll border md:block transform-all `}>
            <FilterSidebar/>
        </div>
        <div className={`w-full border md:w-[80%] md:p-3 relative ${showFooter?"":"md:left-[20%]"}  `}>
            <div>
                <div className='md:text-2xl text-[15px] ml-5 font-bold mt-1 md:mt-5'>ALL COLLECTIONS</div>
                <div className='flex justify-center items-center gap-2 md:hidden text-[15px]' onClick={handleFilterBar}>
                    <IoFilter/>Filter</div>
                    <div className='flex justify-end items-center'>
                        <p className='text-right'>Sort</p>
                        <SortOptions/>
                    </div>
            </div>
            <ProductsGrid setShowFooter={setShowFooter} id={id} setId={setId}  products={products} loading={loading} error={error}/>
            <div ref={footerTriggerRef} className="h-1 w-full"></div>
        </div>
    </section>
  )
}

export default CollectionPage
