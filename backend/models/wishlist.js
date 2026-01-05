const mongoose=require("mongoose");





const wishlistSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        
        
    }
    ]
    

})
// wishlistSchema.index({ userId: 1, products: 1 }, { unique: true });


module.exports=mongoose.model("Wishlist",wishlistSchema);