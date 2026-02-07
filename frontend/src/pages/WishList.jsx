import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRevalidator } from "react-router-dom";
import ProductsGrid from "../components/Products/ProductsGrid";

const WishList = () => {
  const { user } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(user._id);
  const [myWishList, setMyWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleShowWishList = async () => {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist`,
        {
          params: { userId },
          withCredentials: true,
        },
      );

      setMyWishlist(res.data);
      setLoading(false);
    };

    handleShowWishList();
  }, []);
  console.log(myWishList);
  return (
    <>
      <div className="mt-[100px] p-2 md:p-10 ">
        <div className="md:text-3xl text-[18px] pl-2">My WishList </div>
        {loading ? (
          <p>Loading</p>
        ) : myWishList.length > 0 ? (
          <ProductsGrid cols={5} products={myWishList} />
        ) : (
          <p>Your WishList is Empty</p>
        )}
      </div>
    </>
  );
};

export default WishList;
