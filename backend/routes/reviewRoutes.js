const express=require('express')

const Review=require("../models/review");
const {protect}=require("../middleware/authMiddleware")
const router =express.Router()


//Post comment

router.post("/review",protect,async(req,res)=>{
    const {productId,comment,rating}=req.body;
    const userId = req.user._id;
    
    try {
       
       
            const review=new Review({userId,productId,comment,rating})
            await review.save();
            return res.status(201).json({message:"First Comment Added"})
        }
           
     catch (error) {
        
        return res.status(500).json({message:"Server error",error:error.message})
    }
})

//Edit comment
    router.put("/review/edit",protect,async(req,res)=>{
            const {productId,comment,rating}=req.body;
            const userId = req.user.id;
            let review=await Review.findOne({productId,userId})

            try {
                if(!review){
                    return res.status(404).json({message:"Product not found"})
                }
                
                    review.comment="";
                    review.rating=rating
                    review.comment=comment
                    
                    await review.save();
                    return res.status(200).json({message:"Comment Edited"})

                
            } catch (error) {
                res.status(500).json({message:"server error",error:error.message})
            }
    })

    //delete review
    router.delete("/review/delete/:productId",protect,async(req,res)=>{
        const {productId} =req.params;
        const userId = req.user._id;
       
        try {
            
             await Review.deleteOne({userId,productId})
            return res.status(200).json({message:"review deleted"})
            
        } catch (error) {
            return res.status(500).json({message:"server error",error:error.message})
        }
    })

    //get all comments
    router.get("/reviews",async(req,res)=>{
        const {productId}=req.query 

        try {
            const reviews=await Review.find({productId}).populate("userId","name")

            if(!reviews){
                return res.status(400).json({message:"No comments"})
            }
            
            return res.status(200).json({message:"comments fetched",reviews})
        } catch (error) {
            return res.status(500).json({message:"server error",error:error.message})
        }
    })


module.exports=router