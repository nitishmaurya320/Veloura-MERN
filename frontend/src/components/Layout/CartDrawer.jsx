import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Cartcontents from "../Cart/Cartcontents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ isopen, setCartDrawer }) => {
  const navigate = useNavigate();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=checkout");
      window.scrollTo({ top: 0 });
    } else {
      navigate("/checkout");
      window.scrollTo({ top: 0 });
    }

    setTimeout(() => {
      setCartDrawer(false);
    }, 200);
  };

  return (
    <>
      <div
        className={`z-50 bg-white shadow-2xl fixed top-0 h-full duration-300 transition-transform right-0 transform flex flex-col w-3/4 sm:w-1/2 md:w-[30rem] ${
          isopen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-2">
          <button onClick={() => setCartDrawer(false)}>
            <IoCloseSharp className="cursor-pointer text-3xl text-gray-700 hover:text-[#9B2A90] transition-colors" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your Cart
          </h2>
          {cart && cart?.products?.length > 0 ? (
            <Cartcontents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}
        </div>

        {/* Checkout Button */}
        <div className="p-4 sticky bottom-0 w-full bg-white">
          {cart && cart?.products?.length > 0 && (
            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-lg bg-[#9B2A90] hover:bg-[#7E1F75] text-white font-semibold text-lg shadow-md transition-all"
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
