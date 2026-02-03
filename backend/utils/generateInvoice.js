const PDFDocument = require("pdfkit");
const path = require("path");



const generateInvoice = (res, order) => {
  const doc = new PDFDocument({ margin: 50 });
  const fontPath = path.join(__dirname, "../fonts/Roboto-Regular.ttf");
doc.font(fontPath);
  // HEADERS
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  /* ================= HEADER ================= */
  doc
    .fontSize(22)
    .text("Veloura", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(`Invoice ID: ${order?.paymentDetails?.razorpay_order_id}`)
    .text(`Order Date: ${new Date(order.createdAt).toDateString()}`)
    .moveDown();

  /* ================= CUSTOMER ================= */
  doc.fontSize(14).text("Shipping Address", { underline: true });
  doc
    .fontSize(12)
    .text(`${order.shippingAddress.address}`)
    .text(`${order.shippingAddress.city}`)
    .text(`${order.shippingAddress.country}`)
    .moveDown();

  /* ================= ITEMS ================= */
  doc.fontSize(14).text("Order Items", { underline: true }).moveDown(0.5);

  let totalAmount = 0;

  order.orderItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    doc
      .fontSize(12)
      .text(
        `${index + 1}. ${item.name} | ₹${item.price} x ${
          item.quantity
        } = ₹${itemTotal}`
      );
  });

  doc.moveDown();

  /* ================= TOTAL ================= */
  doc
    .fontSize(16)
    .text(`Total Amount: ₹${totalAmount}`, { align: "right" });

  doc.moveDown(2);

  /* ================= FOOTER ================= */
  doc
    .fontSize(10)
    .text("Thank you for shopping with Veloura", { align: "center" });

  // END STREAM (ONLY ONCE)
  doc.end();
};

module.exports = { generateInvoice };
