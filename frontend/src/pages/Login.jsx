import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import login from "../assets/login.png";
import { loginUser } from "../../redux/slices/authSlice";
import { mergeCart } from "../../redux/slices/cartSlice";
import GoogleLoginBtn from "../components/Buttons/GoogleLoginBtn";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter Email and Password");
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="w-full mt-[100px] flex flex-col md:flex-row bg-gray-50 md:text-[15px] text-[13px]">
      {/* Form Section */}
      <div className="w-full flex justify-center items-center p-6 md:p-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col gap-6"
        >
          {/* Brand */}
          <div className="text-3xl font-extrabold text-[#9B2A90] text-center">
            Veloura
          </div>
          <p className="text-center text-gray-500">Login to your account</p>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9B2A90]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9B2A90]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#9B2A90] hover:bg-[#7E1F75] text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Google Login */}
          <GoogleLoginBtn />

          {/* Signup */}
          <p className="text-center text-gray-500">
            Don’t have an account?{" "}
            <Link
              to={`/signup?redirect=${encodeURIComponent(redirect)}`}
              className="text-[#9B2A90] font-medium hover:underline"
              onClick={() => window.scrollTo({ top: 0 })}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
