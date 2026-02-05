const mongoose=require("mongoose")


const otpSchema=new mongoose.Schema({
    identifier:{
        type:String,
        required:true,
        index:true
    },
    otp:{
        type:String,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("OTP", otpSchema)