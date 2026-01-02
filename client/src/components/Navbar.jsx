import React from "react";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { userData, sendVerificationOtp, logout } = useAuthContext();

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
