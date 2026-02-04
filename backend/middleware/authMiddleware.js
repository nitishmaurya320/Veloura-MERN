const jwt=require("jsonwebtoken");

const User=require("../models/user")

//middleware to protect routes

const protect=async (req,res,next)=>{
     const token = req.cookies.access_token;
     console.log(token)
     if(!token){
        return res.status(401).json({message:"Not Authorized"})
     }
    
        try{
              
                const decoded=jwt.verify(token,process.env.JWT_SECRET)

                req.user=  await User.findById(decoded.user.id).select("-password")
                console.log(req.user)
                next();
        }
        catch(err){

                console.log("token verification failed")
                res.status(401).json({message:"Not authorized,token failed"})
        }
    
}

//middleware to check if the user is admin

const admin=(req,res,next)=>{
    if(req.user&&req.user.role==="admin"){
        next()
    }   
    else{
        res.status(403).json({message:"user is not authorized"})
    }
}


module.exports={protect,admin}
