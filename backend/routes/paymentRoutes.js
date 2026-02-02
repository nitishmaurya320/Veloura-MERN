// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create-order", async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paisa
            currency,
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log(order)  
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Razorpay order creation failed", error: err });
    }
});
    const crypto = require("crypto"); 
    router.post("/verify-payment",(req,res)=>{
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;
         const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            // Step 2: Compare
            console.log(`generatedSignature ${generatedSignature}`)
            console.log(`razorpay_signature ${razorpay_signature}`)
            if (generatedSignature === razorpay_signature) {
                return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
                });
            } else {
                return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
                });
            }
    })

module.exports = router;
