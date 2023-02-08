import React from "react";
import { BsXCircle } from "react-icons/bs";

const Page1b = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl font-bold py-5">
          Hi, <i>0hs6d734hdtyda8s378sadjhas78h7fk</i>{" "}
        </h1>
        <div className="w-full md:flex-row flex-col mt-5 mb-12 rounded-md px-10 gradient-bg-unverified">
          <div className="flex flex-row items-center py-2">
            <BsXCircle className="md:text-8xl text-white text-3xl mr-5" />
            <div className="flex flex-col text-white">
              <span className="md:text-2xl text-xl font-bold italic">wallet address is not verified.</span>
              <p className="md:text-xs text-sm ">You cannot select a campaign type. Click here to request verification so you can choose the type of campaign.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1b;
