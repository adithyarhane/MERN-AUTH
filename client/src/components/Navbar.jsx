import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useAuthContext();

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
  return (
    <div className="flex justify-between px-12 py-6 text-black">
      <Link to={"/"} className="text-3xl font-bold ">
        🔐 Auth
      </Link>

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center bg-black text-white rounded-full relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={() => logout()}
                className="py-1 px-2 hover:bg-gray-200 pr-10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link
          to={"/login"}
          className="text-black border px-8 py-1.5 rounded-full border-gray-400 text-[14px] flex items-center gap-1 hover:shadow-sm"
        >
          <p>login</p>
          <MoveRight className="text-gray-500" size={18} />
        </Link>
      )}
    </div>
  );
};

export default Navbar;
