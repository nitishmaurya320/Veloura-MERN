import React, { useEffect } from "react";
import MyOrders from "./MyOrders";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetAuthState } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetAuthState());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row w-full mt-[100px] justify-center items-start gap-10 px-4 md:px-16">
      {/* Profile Info */}
      <div className="md:w-[30%] w-full rounded-2xl  p-6 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
        <p className="text-gray-600 text-center">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-[#9B2A90] hover:bg-[#7E1F75] text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>

      {/* Orders Section */}
      <div className="md:w-[70%] w-full">
        <MyOrders />
      </div>
    </div>
  );
};

export default Profile;
