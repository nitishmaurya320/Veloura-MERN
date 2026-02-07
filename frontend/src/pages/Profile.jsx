import React from "react";
import MyOrders from "./MyOrders";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  logout,
  logoutUser,
  resetAuthState,
} from "../../redux/slices/authSlice";
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
    <div className="flex flex-col w-full md:flex-row h-full justify-center items-center md:items-start md:h-[500px]   mt-[100px] ">
      <div className="w-[30%]  border-red-400 flex  justify-center items-top mt-5 ">
        <div className=" h-[40%] justify-center flex flex-col items-center ">
          <h1 className="text-2xl font-bold ">{user?.name}</h1>
          <p className="text-1xl text-center">{user?.email}</p>
          <button
            onClick={handleLogout}
            class="bg-red-500 text-center mt-2 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition-all duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="md:w-[70%] h-full w-full">
        <MyOrders />
      </div>
    </div>
  );
};

export default Profile;
