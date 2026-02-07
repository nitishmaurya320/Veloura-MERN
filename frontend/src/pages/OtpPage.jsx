import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyUser } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { mergeCart } from "../../redux/slices/cartSlice";
import OTPTimer from "../components/Buttons/OTPTimer";

export const OtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const location = useLocation();
  const identifier = new URLSearchParams(location.search).get("identifier");
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (!identifier) {
      navigate(`/signup?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [identifier, navigate, redirect]);

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

  const submitHandler = () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    dispatch(verifyUser({ otp, identifier }));
  };

  return (
    <div className=" mt-[150px]  flex items-center justify-center  px-4 md:text-[15px] text-[13px]">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col gap-6">
        {/* Brand */}
        <div className="text-3xl font-extrabold text-[#9B2A90] text-center">
          Veloura
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Verify your OTP
          </h2>
          <p className="text-gray-500 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* OTP Input */}
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center text-lg tracking-widest border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9B2A90]"
          placeholder="••••••"
        />

        {/* Error */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* OTP Timer */}
        <OTPTimer
          identifier={identifier}
          onExpire={() => console.log("OTP expired")}
        />

        {/* Verify Button */}
        <button
          onClick={submitHandler}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold transition disabled:opacity-60 bg-[#9B2A90] hover:bg-[#7E1F75]"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-[#9B2A90] font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
