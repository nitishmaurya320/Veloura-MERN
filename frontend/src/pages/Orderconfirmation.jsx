import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { fetchOrderDetails } from "../../redux/slices/orderSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Orderconfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  const [showAnimation, setShowAnimation] = useState(true);

  const { orderId } = useParams();

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

  const checkout = orderDetails;

  // Clear cart when order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [checkout, dispatch]);

  useEffect(() => {
    if (checkout && checkout._id) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 2000); // 2 seconds animation
      return () => clearTimeout(timer);
    }
  }, [checkout]);

  return (
    <div className="relative  flex flex-col justify-center items-center mt-[100px] p-3 md:p-10 ">
      {(loading || showAnimation) && (
        <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/9b1ee2d6-a0a3-48a2-8f1f-7024e1f6952c/wE1SHm7mmo.lottie"
            className="w-[400px]"
            autoplay
            loop={false}
          />
        </div>
      )}

      {!loading && (
        <div className="container w-full md:w-[50%] mx-auto p-6 m-5 shadow-lg bg-white rounded-2xl">
          {/* Main Headings */}
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Order Confirmation
          </h1>
          <p className="mb-2 text-[#9B2A90] text-2xl font-bold">
            Thank you for your order!
          </p>
          <p className="mb-2 font-semibold">
            Order ID: #{checkout?.paymentDetails?.razorpay_order_id}
          </p>
          <p className="mb-2">
            Order Date: {new Date(checkout?.createdAt).toDateString()}
          </p>

          {/* Subheadings */}
          <h2 className="text-xl font-semibold mt-6 mb-4 md:text-[15px] text-[13px]">
            Shipping Address
          </h2>
          <p className="md:text-[15px] text-[13px]">
            {checkout?.shippingAddress?.address}
          </p>
          <p className="md:text-[15px] text-[13px]">
            {checkout?.shippingAddress?.city}
          </p>
          <p className="md:text-[15px] text-[13px]">
            {checkout?.shippingAddress?.country}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4 md:text-[15px] text-[13px]">
            Order Items
          </h2>
          <ul className="list-disc pl-5">
            {checkout?.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex p-2 rounded shadow-sm justify-between mb-2 items-center"
              >
                <div className="w-[15%] flex justify-center items-center">
                  <img
                    className="object-cover rounded-md"
                    src={item?.image}
                    alt={item?.name}
                  />
                </div>
                <div className="flex flex-col ml-4 w-[60%]">
                  <h3 className="font-normal md:text-[15px] text-[13px]">
                    {item?.name}
                  </h3>
                  <span className="text-sm text-gray-500 md:text-[15px] text-[13px]">
                    Brand: {item?.brand} | Size: {item?.size}
                  </span>
                </div>
                <div className="w-[25%] flex flex-col items-end px-2">
                  <p className="text-lg font-semibold md:text-[15px] text-[13px]">
                    ₹{item?.price}
                  </p>
                  <p className="text-sm text-gray-500 md:text-[15px] text-[13px]">
                    Qty: {item?.quantity}
                  </p>
                </div>
              </div>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4 md:text-[15px] text-[13px]">
            Total Amount
          </h2>
          <p className="text-lg font-bold md:text-[15px] text-[13px]">
            ₹{" "}
            {checkout?.orderItems?.reduce(
              (total, item) => total + item?.price * item?.quantity,
              0,
            )}
          </p>

          <button
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_BACKEND_URL}/api/invoice/${orderId}`,
                "_blank",
              )
            }
            className="mt-4 bg-[#9B2A90] hover:bg-[#7E1F75] text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
          >
            Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Orderconfirmation;
