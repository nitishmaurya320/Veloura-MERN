const express=require("express")
const User=require("../models/user")
const OTP=require("../models/otp")
const jwt= require("jsonwebtoken")
const dotenv=require('dotenv')
dotenv.config()
const {protect}=require("../middleware/authMiddleware")
const sendOtpEmail = require("../utils/sendOtpEmail")

const router=express.Router()

//register a new user
//access public
  
 
router.post("/register",async (req,res)=>{
    const {name,email,password}=req.body
    try{
        //registration logic

        let user=await User.findOne({email})
        if(user) return res.status(400).json({message:"user Already exists"})
        
          const otp = Math.floor(100000 + Math.random() * 900000).toString()
            await sendOtpEmail(email, otp); 
            console.log(otp)
            await OTP.create({
                identifier:email,
                otp,
                expiresAt:new Date(Date.now()+10*60*1000)
            })
            user=new User({name,email,password})
            await user.save();
            res.status(200).json({message:"user created"})

           
            
            
            
          
                
        
    }
    catch(error)
    {
        console.log(error)
    }
})

//otp-verification
    router.post("/verify-otp",async(req,res)=>{
        const {otp,identifier}= req.body

        try {
            let otpRecord=await OTP.findOne({identifier})
                if(!otp) {
                return res.status(400).json({ message: "Enter the OTP" });
                }
                if(!otpRecord) {
                    return res.status(404).json({ message: "No OTP record found" });
                }
                if(otpRecord.isVerified) {
                    return res.status(400).json({ message: "OTP already verified" });
                }
                if(Date.now() > otpRecord.expiresAt) {
                    return res.status(400).json({ message: "OTP Expired" });
                }
                if(otp !== otpRecord.otp) {
                    return res.status(400).json({ message: "Incorrect OTP" });
                }
                
                otpRecord.isVerified=true
                    await otpRecord.save()
                    let user=await User.findOne({email:identifier})
                     user.isVerified=true;
                     await user.save();
                    const payload = { user: { id: user._id, role: user.role } };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: "40h" },
                    (err, token) => {
                        if (err) throw err;
                         res.cookie("access_token", token, {
                            httpOnly: true,
                            // secure: process.env.NODE_ENV === "production",
                            secure:false,
                            sameSite: "lax",
                            maxAge: 40 * 60 * 60 * 1000, // 40h
                            });  
                            
                        res.status(201).json({
                            user,success:true
                            
                        });
                    }
                );
                    
            

          


        } catch (error) {
            res.status(500).json({message:"server error"})
        }

    })


//@route api/users/login
//access public

router.post("/login",async (req,res)=>{
    const {email,password}=req.body
    try{
        
        let user=await User.findOne({email})
        if(!user) return res.send("user not exist")

        const ismatch=await user.matchPassword(password)    
        if(!ismatch)
            return res.status(400).json({message:"invalid credentials"})
          //jwebtoken payload
            const payload ={user: {id:user._id,role:user.role}}  
           
            jwt.sign(payload,
                process.env.JWT_SECRET,
                {expiresIn:"40h"},
                (err,token)=>{
                    if(err) throw err; 
                       res.cookie("access_token", token, {
                            httpOnly: true,
                            // secure: process.env.NODE_ENV === "production",
                            secure:false,
                            sameSite: "lax",
                            maxAge: 40 * 60 * 60 * 1000, // 40h
                            });  
                            
                    res.status(201).json({user
                        
                    })
                })

            
    }
    catch(err){
        console.log(err)
        res.status(500).send("server error")
        

    }
})


//@route GET api/users/profile

router.get("/profile",protect, async (req,res)=>{
        res.json(req.user) ;
})

module.exports=router