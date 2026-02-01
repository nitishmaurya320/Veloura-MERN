import React, { useEffect, useReducer, useRef } from "react";
import { StarRating } from "./StarRating";
import { StarRatingInput } from "./StarRatingInput";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";


const Reviews = ({ reviews = [] ,handleSubmitOrEdit,userId,productId,handleDelete,isEditing,setIsEditing}) => {
    const [comment,setComment]=useState("")
    const [rating,setRating]=useState(0)
    const [open,setOpen]=useState(false)
    const inputRef=useRef(null);
    const handleEdit=()=>{
      setIsEditing(true)  
        const review=reviews.find(review=>review.userId._id===userId).comment
        setComment(review||"")
       
    }
    useEffect(() => {
  if (isEditing && inputRef.current) {
    inputRef.current.focus();
  }
}, [isEditing]);

    
  return (
    <div className="mt-6 ">
      <h3 className="text-xl font-semibold">Reviews</h3>
      {(!reviews.some((review=>(review?.userId?._id===userId)))||isEditing)&&(
        <div className="flex flex-col">
            <label>Add a Review</label>
            <div>
                <textarea type="text" ref={inputRef}  rows={4} cols={33} value={comment} onChange={(e)=>{setComment(e.target.value)}} placeholder="Type review here" className="px-2 py-1"></textarea>
                 <StarRatingInput rating={rating} onChange={setRating} />
                <button type="submit" 
                onClick={(e)=>{handleSubmitOrEdit(e,comment,rating)
                    setComment("")
                    setRating(0)
                }} className="bg-green-400 rounded-[5px] px-3 py-1">{isEditing?"Edit":"Submit"}</button>
            </div>
            
        </div>
      )}
        
      {reviews.length === 0 ? (
        <p className="mt-2 text-gray-500">No reviews yet</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              {/* Username + Rating */}
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-800">
                  {review.userId?.name || "Anonymous"}
                </p>
                {review?.userId?._id===userId&&(
                    <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-1 rounded hover:bg-gray-200"
                    >
                        <BiDotsVerticalRounded size={20} />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                        <button
                            onClick={() => {
                            setOpen(false);
                            
                            handleEdit();
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                            setOpen(false);
                            handleDelete(productId);
                            }}
                            className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
                        >
                            Delete
                        </button>
                        </div>
                    )}
                    </div>
                )}
                
               
              </div>

              {/* Comment */}
              <p className="mt-2 text-gray-700 leading-relaxed">
                {review.comment}
              </p>
               <StarRating rating={review.rating} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
