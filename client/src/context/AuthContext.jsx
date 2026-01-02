/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const getAuthState = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/auth/is-auth");
      if (res.data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/data");
      res.data.success
        ? setUserData(res.data.userData)
        : toast.error(res.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const onRegister = async (e, name, email, password, passwordStrength) => {
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

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (res.data.success) {
        navigate("/verify-email");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verifyAccount = async (e, otp) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;

    const enteredOtp = otp.join("");
    try {
      const res = await axios.post(backendUrl + "/api/auth/verify-account", {
        otp: enteredOtp,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendResetOtp = async (e, email, setIsEmailSent) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/auth/send-reset-otp", {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setIsEmailSent(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmitResetOTP = async (
    e,
    otp,
    OTP_LENGTH,
    setResetOtp,
    setIsOtpSubmitted
  ) => {
    e.preventDefault();

    try {
      const finalOtp = otp.join("");
      if (finalOtp.length === OTP_LENGTH) {
        setResetOtp(finalOtp);
        setIsOtpSubmitted(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetPassword = async (
    e,
    password,
    confirmPassword,
    email,
    resetOtp
  ) => {
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

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const res = await axios.post(backendUrl + "/api/auth/logout");
      if (res.data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    mode,
    setMode,
    onRegister,
    sendVerificationOtp,
    verifyAccount,
    sendResetOtp,
    onSubmitResetOTP,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
