import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlice";

const OTPTimer = ({ duration = 600, identifier }) => {
  const dispatch = useDispatch();

  // 1️⃣ Get stored expiry from localStorage
  const storedExpiry = localStorage.getItem("otpTimerEnd");
  let expiryTimestamp;

  if (storedExpiry && Number(storedExpiry) > Date.now()) {
    // Use existing expiry if still in future
    expiryTimestamp = new Date(Number(storedExpiry));
  } else {
    // Start a new timer if none exists or expired
    expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);
    localStorage.setItem("otpTimerEnd", expiryTimestamp.getTime());
  }

  const { seconds, minutes, restart, isRunning } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      console.log("OTP expired");
      localStorage.removeItem("otpTimerEnd"); // Remove when expired
    },
  });

  // Handle resend OTP
  const handleResend = () => {
    dispatch(registerUser({ email: identifier })); // call API to resend OTP
    console.log("OTP resent");

    // Restart timer fresh
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + duration);
    localStorage.setItem("otpTimerEnd", newExpiry.getTime());
    restart(newExpiry, true);
  };

  return (
    <div className="text-center">
      {isRunning ? (
        <p className="text-gray-700">
          Resend OTP in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      ) : (
        <button
          onClick={handleResend}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OTPTimer;
