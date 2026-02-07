import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlice";

const OTPTimer = ({ identifier }) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const [secondsLeft, setSecondsLeft] = useState(null); // 🔥 null = unknown
  const [loading, setLoading] = useState(true);

  // 🧹 clear timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // ⏳ start countdown
  const startTimer = (expiryRaw) => {
    clearTimer();

    const expiry =
      typeof expiryRaw === "string"
        ? new Date(expiryRaw).getTime()
        : Number(expiryRaw);

    const tick = () => {
      const diff = Math.ceil((expiry - Date.now()) / 1000);

      if (diff <= 0) {
        setSecondsLeft(0);
        clearTimer();
        return;
      }

      setSecondsLeft(diff);
      timerRef.current = setTimeout(tick, 1000);
    };

    tick(); // 🔥 instant UI update
  };

  // 🔁 on page load / refresh
  useEffect(() => {
    const fetchExpiry = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/expiry`,
          {
            params: { identifier },
            withCredentials: true,
          },
        );

        if (res.data.expiry && res.data.expiry !== 0) {
          startTimer(res.data.expiry);
        } else {
          setSecondsLeft(0);
        }
      } catch (err) {
        setSecondsLeft(0);
      } finally {
        setLoading(false); // 🔥 VERY IMPORTANT
      }
    };

    fetchExpiry();
    return clearTimer;
  }, [identifier]);

  // 🔁 resend otp
  const handleResend = async () => {
    try {
      const res = await dispatch(registerUser({ email: identifier })).unwrap();

      // 🔥 instant UI flip
      setSecondsLeft(60);

      if (res.expiry) {
        startTimer(res.expiry);
      }
    } catch (err) {
      console.error("Resend failed", err);
    }
  };

  // 🧮 format time
  const minutes = Math.floor((secondsLeft || 0) / 60);
  const seconds = (secondsLeft || 0) % 60;

  // 🧠 UI logic
  if (loading) return null; // ❌ NO flicker

  return (
    <div className="text-center">
      {secondsLeft > 0 ? (
        <p className="text-sm text-gray-600">
          Resend OTP in{" "}
          <span className="font-semibold">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
      ) : (
        <button
          onClick={handleResend}
          className="text-blue-600 font-medium hover:underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OTPTimer;
