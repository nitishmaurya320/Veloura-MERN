import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.png";
import { registerUser, resetRegisterState } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { registerSuccess, loading, error } = useSelector(
    (state) => state.auth,
  );

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate(
        `/verify-otp?redirect=${encodeURIComponent(
          redirect,
        )}&identifier=${encodeURIComponent(email)}`,
      );
      dispatch(resetRegisterState());
    }
  }, [registerSuccess, navigate, email, redirect, dispatch]);

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 md:text-[15px] text-[13px]">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col gap-6"
        >
          {/* Brand */}
          <div className="text-3xl font-extrabold text-[#c8a261] text-center">
            Veloura
          </div>
          <p className="text-center text-gray-500">Create your account</p>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a261]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a261]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a261]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Login link */}
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-[#c8a261] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <img src={login} alt="Signup" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default Signup;
