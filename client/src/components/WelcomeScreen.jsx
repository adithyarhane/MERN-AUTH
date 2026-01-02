import React from "react";

import { useAuthContext } from "../context/AuthContext";

export default function WelcomeScreen() {
  const { userData } = useAuthContext();

  return (
    <div className=" h-[calc(100vh-20vh)] flex items-center justify-center  px-4">
      <div className="text-center max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <p className="text-sm text-gray-500 mb-2">
          Hey {userData ? userData.name : "Developer"}! 👋
        </p>
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Welcome to our app
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Let’s start with a quick product tour and we will have you up and
          running in no time!
        </p>

        {/* Button */}
        <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}
