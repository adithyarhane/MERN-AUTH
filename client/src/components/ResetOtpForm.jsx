import React, { useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const ResetOtpForm = ({ setIsOtpSubmitted, setResetOtp }) => {
  const { onSubmitResetOTP } = useAuthContext();
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);

    inputsRef.current[newOtp.length - 1].focus();
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-10">
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
          <MailCheck className="text-white" size={26} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Verify Reset Code
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* OTP INPUTS */}
      <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            type="text"
            className="
                w-12 h-14 text-center text-xl font-semibold
                border border-gray-300 rounded-xl
                focus:outline-none focus:border-black
                transition
              "
          />
        ))}
      </div>

      {/* VERIFY BUTTON */}
      <button
        onClick={(e) =>
          onSubmitResetOTP(e, otp, OTP_LENGTH, setResetOtp, setIsOtpSubmitted)
        }
        className="
            w-full py-3 bg-black text-white font-medium
            rounded-xl hover:bg-gray-800 transition
          "
      >
        Verify OTP
      </button>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Didn’t receive the code?{" "}
        <span className="text-black font-medium cursor-pointer hover:underline">
          Resend
        </span>
      </p>
    </div>
  );
};

export default ResetOtpForm;
