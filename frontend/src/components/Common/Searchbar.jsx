import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilter, setFilters } from "../../../redux/slices/productsSlice";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilter({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
  };

  return (
    <div className="hidden md:flex max-w-[420px]">
      <form
        onSubmit={handleSearch}
        className="relative w-full"
      >
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full h-[42px]
            rounded-full
            pl-4 pr-12
            bg-white
            border border-gray-300
            outline-none
            text-sm
            focus:border-black
            focus:ring-1 focus:ring-black
            transition
          "
        />

        <button
          type="submit"
          className="
            absolute right-1 top-1/2 -translate-y-1/2
            w-[36px] h-[36px]
            rounded-full
            bg-yellow-400
            flex items-center justify-center
            hover:bg-yellow-500
            transition
          "
        >
          <IoIosSearch className="text-xl text-black" />
        </button>
      </form>
    </div>
  );
};

export default Searchbar;
