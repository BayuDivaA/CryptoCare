import { useEthers } from "@usedapp/core";
import React from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { getUsername } from "../../smart_contract/SmartcontractInteract";

const Page1a = ({ formData, setFormData, page, setPage }) => {
  const { account } = useEthers();
  const userName = getUsername(account);
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl font-bold py-3">
          Hi, <i>{userName ? userName : account}!</i>
        </h1>
        <div className="w-full md:flex-row flex-col my-5 rounded-md md:px-10 px-2 gradient-bg-verified">
          <div className="flex flex-row items-center md:py-2">
            <BsCheck2Circle className=" text-white text-8xl mr-5" />
            <div className="flex flex-col text-white">
              <span className="md:text-2xl text-base font-bold italic">Wallet address is verified.</span>
              <p className="md:text-sm text-xs ">You can choose the type of campaign you want according to your needs.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="md:text-sm text-xs">Choose the type of fundraising that you need</p>
        </div>
        <div className="flex md:flex-row flex-col justify-center pt-5 gap-3">
          <button
            onClick={(e) => {
              setFormData({
                ...formData,
                campaignType: 0,
                duration: 180,
              }),
                setPage(page + 1);
            }}
            className="flex-col md:w-2/6 w-full max-w-lg bg-white border border-blue-800 text-blue-800 p-4 rounded-md hover:text-white hover:bg-blue-800 cursor-pointer"
          >
            <h1 className="text-lg font-bold pb-2">Normal Fundraising</h1>
            <p className="text-sm text-justify">An Urgent Fundraiser is a fundraiser created for those who are in need of funds as quickly as possible, no need to go through a voting process for the use of funds.</p>
          </button>
          <button
            onClick={(e) => {
              setFormData(
                {
                  ...formData,
                  campaignType: 1,
                },
                setPage(page + 1)
              );
            }}
            className="flex-col md:w-2/6 w-full max-w-lg bg-white border border-blue-800 text-blue-800 p-4 rounded-md hover:text-white hover:bg-blue-800 cursor-pointer"
          >
            <h1 className="text-lg font-bold pb-2">Urgent Fundraising</h1>
            <p className="text-sm text-justify">Withdrawing funds at a regular fundraiser will require a vote from donors so that the funds are used as needed.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page1a;
