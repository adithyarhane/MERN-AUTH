import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const NewPasswordForm = ({ resetOtp, email }) => {
  const navigate = useNavigate();
  const { backendUrl } = useAppContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const res = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp: resetOtp,
        newPassword: password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-10">
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
          <ShieldCheck className="text-white" size={26} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Password
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Choose a strong password to secure your account
        </p>
      </div>

      {/* FORM */}
      <form className="space-y-5">
        {/* PASSWORD */}
        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            New Password
          </label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Lock size={18} className="text-gray-600" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent w-full outline-none text-gray-900"
              required
            />

            {showPass ? (
              <EyeOff
                size={18}
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPass(false)}
              />
            ) : (
              <Eye
                size={18}
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPass(true)}
              />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Must be at least 8 characters
          </p>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Confirm Password
          </label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Lock size={18} className="text-gray-600" />
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent w-full outline-none text-gray-900"
              required
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={(e) => handleSubmit(e)}
          className="
              w-full py-3 mt-2
              bg-black text-white font-medium
              rounded-xl shadow-md
              hover:bg-gray-800 transition
            "
        >
          Update Password
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Remembered your password?{" "}
        <span className="text-black font-medium cursor-pointer hover:underline">
          Login
        </span>
      </p>
    </div>
  );
};

export default NewPasswordForm;
