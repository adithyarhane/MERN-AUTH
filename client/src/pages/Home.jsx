import React from "react";
import Navbar from "../components/Navbar";
import WelcomeScreen from "../components/WelcomeScreen";

const Home = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <WelcomeScreen />
    </div>
  );
};

export default Home;
