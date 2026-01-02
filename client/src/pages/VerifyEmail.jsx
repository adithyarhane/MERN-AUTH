import React, { useState, useEffect } from "react";
import { MailCheck, ShieldCheck, RotateCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../components/useTitle";
import { useAuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const { isLoggedin, userData, verifyAccount } = useAuthContext();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  useTitle("Account Verification");

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);

    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    if (pasteArray.length > 6) return;

    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);

    // focus last filled input
    const nextIndex = pasteArray.length - 1;
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="absolute min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-gray-50">
      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-black text-white shadow-lg mb-4">
            <MailCheck size={32} />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Verify Your Email
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm mt-6 shadow-sm">
          <ShieldCheck size={18} />
          This helps us keep your account secure
        </div>

        {/* OTP FORM */}
        <form onSubmit={(e) => verifyAccount(e, otp)} className="mt-8">
          {/* OTP INPUTS */}
          <div
            className="flex justify-between gap-2"
            onPaste={(e) => handlePaste(e)}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-12 h-14 
                  text-center 
                  text-xl font-semibold 
                  rounded-xl 
                  border border-gray-300 
                  focus:border-black 
                  focus:ring-2 focus:ring-black/10 
                  outline-none 
                  bg-white
                "
              />
            ))}
          </div>

          {/* TIMER / RESEND */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <p className="text-gray-600">Didn’t receive the code?</p>

            {timer > 0 ? (
              <span className="text-gray-500">
                Resend in <strong>{timer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setTimer(60)}
                className="flex items-center gap-1 text-black font-medium hover:underline"
              >
                <RotateCcw size={14} /> Resend OTP
              </button>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="
              mt-8 w-full h-12 
              bg-black 
              text-white 
              rounded-xl 
              font-semibold 
              hover:bg-gray-900 
              transition-all
            "
          >
            Verify Email
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          Make sure to check your spam or promotions folder.
        </p>
      </div>
      <Link to={"/"} className="text-3xl font-bold absolute top-6 left-12">
        🔐 Auth
      </Link>
    </div>
  );
};

export default VerifyEmail;
