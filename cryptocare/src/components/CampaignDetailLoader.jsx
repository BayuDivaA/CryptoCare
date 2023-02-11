import React from "react";

import loader_3 from "../assets/loader_4.svg";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-10 h-screen loader-glassmorphism flex items-center justify-center flex-col">
      <img src={loader_3} alt="loader" className="w-[100px] h-[100px] object-contain" />
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-blue-gray-900 text-center">Loading Campaign...</p>
    </div>
  );
};

export default Loader;
