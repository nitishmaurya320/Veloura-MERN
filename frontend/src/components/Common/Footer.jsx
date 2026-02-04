import React from 'react'
import { Link } from 'react-router-dom'
import { FaMeta } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <div className='w-full  h-[850px] md:h-[370px]  bg-white footer  border-b-0  border-t-gray-200' >
      <div className='grid grid-cols-1 md:grid-cols-4 px-5 py-3 pt-10' >
        <div className='pb-4 md:pb-0 md:pl-10'>
            <h1 className='text-lg font-semibold'>Newsletter</h1>
            <p>Be the first to hear about new products,exclusive events and online offers</p>
            <h5>Sign up and get 10% off on your first order</h5>
            <form className='flex mt-4'>
                <input placeholder="Enter you email" className='p-2 w-9/10 h-[40px] text-sm rounded-l-sm border-l border-t border-b focus:outline-none focus:ring-1'></input>
                <button className='px-5 bg-black text-white rounded-r-sm hover:bg-gray-800 duration-300  '>Subscribe</button>
            </form>
        </div>
        {/* shops links */}
        <div className='md:pl-10 pb-4' >
            <h3 className='text-lg mb-4 text-gray-800 font-semibold'>Shop</h3>
            <ul className='gap-1 flex flex-col    '>
               <Link to="#"><li className='hover:text-gray-600'>Mens top wear</li></Link>
               <Link to="#"><li className='hover:text-gray-600'>Womens top wear</li></Link>
               <Link to="#"><li className='hover:text-gray-600' >Kids top wear</li></Link>
               <Link to="#"><li className='hover:text-gray-600'>Bottom wear</li></Link>
            </ul>
            
        </div >
        {/* support Links */}
        <div className='md:pl-10 pb-4'>
            <h3 className='text-lg mb-4 text-gray-800 font-semibold'>Support </h3>
            <ul className='gap-1 flex flex-col    '>
               <Link to="#"><li className='hover:text-gray-500'>Contact Us</li></Link>
               <Link to="#"><li className='hover:text-gray-600'>About Us</li></Link>
               <Link to="#"><li className='hover:text-gray-600'>FAQs</li></Link>
               <Link to="#"><li className='hover:text-gray-600'>Features</li></Link>
            </ul>
            
        </div>
        {/* follow links */}
        <div className='md:pl-10 pb-4'>
            <h3 className='text-lg font-semibold'>Follow</h3>
            <div className='flex gap-3'>
                 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaMeta/>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaInstagram/>
          </a>
           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaXTwitter/>
          </a>
            </div>
            <div>
                <p>Call Us</p>
                <div className='flex items-center'>
                    <FiPhoneCall/>
                    <p>123-456-789      </p>
                </div>
                
            </div>
        </div>

        
      </div>
      <div className='flex justify-center mt-12 px:4 pt-6 border-t border-gray-400'>
        <p>© 2025, Veloura All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
