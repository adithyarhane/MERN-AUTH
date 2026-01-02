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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
