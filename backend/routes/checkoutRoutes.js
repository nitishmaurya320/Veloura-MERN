const express=require("express")
const Checkout=require("../models/checkout")
const Cart=require("../models/cart")
const Product=require("../models/product")
const Order=require("../models/order")
const {protect}=require("../middleware/authMiddleware")


const router=express.Router()
//@route POST/api/checkout

router.post("/",protect,async (req,res)=>{
    const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body

    if(!checkoutItems||checkoutItems.length===0){
        return res.status(400).json({message:"No items to checkout"})
    }

    try{
        const newCheckout=await Checkout.create({
            user:req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paytmentStatus:"Pending",
            isPaid:false,


        })
        console.log(`Checkout created for user ${req.user._id}`);
        res.status(201).json({newCheckout});
    }
    catch(err){
        console.log("Error creating checkout session",err),
        res.status(500).json({message:"Server error"})


    }
})

//@route PUT api/checkout/:id/pay

router.put("/:id/pay",protect,async (req,res)=>{
    const {paymentStatus,paymentDetails}=req.body
    try{
            const checkout=await Checkout.findById(req.params.id)
            if(!checkout){
                return res.status(404).json({message:"checkout not found"})
            }
            if(paymentStatus=="paid"){
                checkout.isPaid="true",
                checkout.paymentStatus=paymentStatus
                checkout.paymentDetails=paymentDetails
                
                await checkout.save()

                res.status(200).json(checkout)
            }
            else{
                    res.status(400).json( {message:"Invalid payment status"})
            }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})

    }

})

//@route POST  /api/checkout/:id/finalize

router.post("/:id/finalize",protect,async (req,res)=>{
    try{
        const checkout=await Checkout.findById(req.params.id)
        if(!checkout){
            res.status(404).json({message:"checkout not found"})
        }

        if(checkout.isPaid&&!checkout.isFinalized){
            //create final order based on checkout details
            const finalOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails,

            })

            //Mark the checkout as finalized
            checkout.isFinalized=true,
            checkout.finalizedAt=Date.now();
            await checkout.save();

            //delete the users cart       

            await Cart.findOneAndDelete({user:checkout.user})
            res.status(201).json(finalOrder)
        }else if(checkout.isFinalized){
            res.status(400).json( {message:"Checkout already finalized"})
        }else{
            res.status(400).json({message:"Checkout is not paid"});
        }
    }
    catch(err){
        console.error(err)  
        res.status(500).json({message:"Server error"})

    }
})

module.exports=router
