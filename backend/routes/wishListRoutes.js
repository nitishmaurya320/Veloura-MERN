    const express=require("express")

    const Wishlist=require('../models/wishlist');

    const router=express.Router();

    router.post("/add",async(req,res)=>{
            const {userId,productId}=req.body;
                let user=await Wishlist.findOne({userId})
            try {
                if(!user){
                user=new Wishlist({userId,products:[productId]})
                await user.save();
                return res.status(200).json({message:"Added"})
                
                }
               
                 
                    if(user.products.some(id=>id.toString()===productId)){
                        return res.status(409).json({message:"Product already added"})
                    }
                  
                        user.products.push(productId);
                        await user.save();
                        res.status(200).json({message:"Added"})
                   
                        
                    
                
                
            } catch (error) {
                res.status(500).json({message:"Not Added",error:error.message})
            }
    })

    router.post("/remove",async(req,res)=>{
        const {userId,productId}=req.body;

        let user=await Wishlist.findOne({userId});
        try {
            if(!user){
            return res.status(404).json({message:"Nothing to remove"})
            
        }
        
            user.products=user.products.filter(id=>id.toString()!=productId)
            await user.save();
            res.status(200).json({message:"Removed"})
        
        
        } catch (error) {
            res.status(500).json({message:"Not Removed",error:error.message})
        }
        
    })

    // retrieve wishlist for a user

    router.get("/all",async(req,res)=>{
        const {userId}=req.query;
        let user=await Wishlist.findOne({userId})
        try {
            if(user){
                return res.status(200).json({message:"Retrived Success",user})
            }
            
            return res.status(400).json({message:"user not found"})
            
        } catch (error) {
            return res.status(500).json({message:"server error",error})
        }
    })

    // get all wishlist with product details

    router.get("/",async(req,res)=>{
        const {userId}=req.query;
        const wishlist=await Wishlist.findOne({userId}).populate("products");
        try {
            if(!wishlist){
            return res.json({products:[]})
        }
        return res.status(200).json(wishlist.products);
        } catch (error) {
            return res.status(500).json({message:"Server error",error});
        }
        

    })

    module.exports=router;