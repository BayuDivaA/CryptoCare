import React from "react";
import { BsCheck2Circle } from "react-icons/bs";

const Page1a = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl font-bold py-5">
          Hi, <i>Syamsudin!</i>{" "}
        </h1>
        <div className="w-full md:flex-row flex-col mt-5 mb-12 rounded-md px-10 gradient-bg-verified">
          <div className="flex flex-row items-center py-2">
            <BsCheck2Circle className="md:text-8xl text-white text-3xl mr-5" />
            <div className="flex flex-col text-white">
              <span className="md:text-2xl text-xl font-bold italic">Wallet address is verified.</span>
              <p className="md:text-xs text-sm ">You can continue to the next step without the need to input personal data first, because you have already done it when you made a verification request.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-5">
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">Cyan to blue</span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">Cyan to blue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page1a;
