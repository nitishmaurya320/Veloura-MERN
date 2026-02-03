const {generateInvoice} =require("../utils/generateInvoice.js")
const Order=require("../models/order.js")
const express=require("express")
const router=express.Router()

router.get("/:orderId", async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return generateInvoice(res, order);
});

module.exports=router
