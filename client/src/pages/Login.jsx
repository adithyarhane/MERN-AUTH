import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import useTitle from "../components/useTitle";

/* ---------------- PASSWORD STRENGTH CHECKER ---------------- */
const checkPasswordStrength = (password = "") => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
};
/* ----------------------------------------------------------- */

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  useTitle(mode === "login" ? "Login" : "Register");

  const { backendUrl, setIsLoggedin, getUserData } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (mode === "signup" && passwordStrength === "weak") {
      toast.error("Password is too weak");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const url = mode === "signup" ? "/api/auth/register" : "/api/auth/login";

      const payload =
        mode === "signup" ? { name, email, password } : { email, password };

      const res = await axios.post(backendUrl + url, payload);

      if (res.data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-3xl p-10">
        {/* SWITCH TABS */}
        <div className="flex mb-10 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setMode("login")}
            className={`w-1/2 py-3 rounded-xl text-sm font-medium transition ${
              mode === "login" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`w-1/2 py-3 rounded-xl text-sm font-medium transition ${
              mode === "signup" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            Signup
          </button>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {mode === "login"
              ? "Login to continue shopping"
              : "Create your account to get started"}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">
          {/* NAME */}
          {mode === "signup" && (
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border">
                <UserRound size={18} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="John Doe"
                  className="bg-transparent w-full outline-none"
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border">
              <Mail size={18} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="john@example.com"
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border">
              <Lock size={18} />
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none"
              />
              {showPass ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowPass(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowPass(true)}
                />
              )}
            </div>

            {/* PASSWORD STRENGTH (SIGNUP ONLY) */}
            {mode === "signup" && password && (
              <p
                className={`mt-2 text-sm font-medium ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                Password strength: {passwordStrength}
              </p>
            )}

            {/* FORGOT PASSWORD LINK (LOGIN ONLY) */}
            {mode === "login" && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-gray-600 hover:text-black hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={onSubmitHandler}
          disabled={loading}
          className={`w-full mt-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : mode === "login" ? (
            <>
              <LogIn size={20} /> Login
            </>
          ) : (
            <>
              <UserPlus size={20} /> Create Account
            </>
          )}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                className="cursor-pointer font-medium hover:underline"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("login")}
                className="cursor-pointer font-medium hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>

      <Link to="/" className="absolute top-6 left-12 text-3xl font-bold">
        🔐 Auth
      </Link>
    </div>
  );
}
