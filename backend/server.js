const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const checkoutRoutes=require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const subscriberRoutes=require("./routes/subscriberRoutes")
const adminRoutes=require("./routes/adminRoutes")
const productAdminRoutes=require("./routes/productAdminRoutes")
const adminOrderRoutes=require("./routes/adminOrderRoutes")
const paymentRoutes=require("./routes/paymentRoutes")
const wishlistRoutes=require("./routes/wishListRoutes")
const ReviewRoutes=require("./routes/reviewRoutes")
const invoiceRoutes=require("./routes/invoiceRoutes")

const app=express();
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,             // max 5 AI calls per minute per IP
  message: "Too many AI requests, please try later."
});


app.use(cors({
  origin: process.env.FRONTEND_URL, // your frontend URL
  credentials: true
}));

app.use(express.json())

app.use(cookieParser());


dotenv.config();

const PORT=process.env.PORT||5000;

//mongodb connection
connectDB();
app.get("/",(req,res)=>{
    res.send("helllo")
})

app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/invoice",invoiceRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api",subscriberRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/users/wishlist",wishlistRoutes)
app.use("/api/product",ReviewRoutes)
app.use("/api/ai", aiLimiter);

//admin routes
app.use("/api/admin/users",adminRoutes)
app.use("/api/admin/products",productAdminRoutes)
app.use("/api/admin/orders",adminOrderRoutes)
app.get("/set-cookie", (req, res) => {
    res.cookie("test", "123", { httpOnly: true, sameSite: "lax", secure: false });
    res.json({ message: "cookie set" });
});


app.listen(PORT,()=>{
    console.log("Server is running on the port 8000!!")
})  