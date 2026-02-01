const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
            
        },
        comment:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            min:0,
            max:5
        }
    
    
})

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });


module.exports=mongoose.model("Review",reviewSchema);