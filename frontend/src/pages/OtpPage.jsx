import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
      // If identifier is missing, go back to signup or login
      navigate(`/signup?redirect=${encodeURIComponent(redirect)}`); // or "/login"
    }
  }, [identifier, navigate]);

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

  const submitHandler = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    dispatch(verifyUser({ otp, identifier }));

    if (user) {
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    } else console.log(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify Your OTP
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full text-center text-lg border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-6"
          placeholder="Enter OTP"
        />
        {error && <p>{error}</p>}
        <OTPTimer
          identifier={identifier}
          onExpire={() => console.log("OTP expired")}
        />
        <button
          onClick={submitHandler}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
