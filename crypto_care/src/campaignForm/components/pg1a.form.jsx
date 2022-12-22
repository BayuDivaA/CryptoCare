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
        <div className="flex justify-center">
          <p className="md:text-xs text-sm">Choose the type of fundraising that you need</p>
        </div>
        <div className="flex justify-center pt-5 gap-3">
          <div className="flex-col w-2/6 max-w-lg bg-white border border-blue-800 text-blue-800 p-4 rounded-md hover:text-white hover:bg-blue-800 cursor-pointer" onClick={""}>
            <h1 className="text-lg font-bold pb-2">Normal Fundraising</h1>
            <p className="text-sm text-justify">An Urgent Fundraiser is a fundraiser created for those who are in need of funds as quickly as possible, no need to go through a voting process for the use of funds.</p>
          </div>
          <div className="flex-col w-2/6 max-w-lg bg-white border border-blue-800 text-blue-800 p-4 rounded-md hover:text-white hover:bg-blue-800 cursor-pointer" onClick={""}>
            <h1 className="text-lg font-bold pb-2">Urgent Fundraising</h1>
            <p className="text-sm text-justify">Withdrawing funds at a regular fundraiser will require a vote from donors so that the funds are used as needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1a;
