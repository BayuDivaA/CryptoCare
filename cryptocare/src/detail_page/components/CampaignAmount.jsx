import React from "react";
import { SiEthereum } from "react-icons/si";
import { useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

export default function CampaignAmount({ collectedFunds, caddress }) {
  const etherBalance = useEtherBalance(caddress);
  return (
    <div className="rounded-md flex-col bg-white shadow-xl px-5 py-4">
      <div className=" font-semibold mb-2">Campaign Funds</div>
      <div className="bg-blue-gray-50 rounded-md py-2 px-4">
        <div className="flex flex-row justify-between items-center ">
          <span className="">Collected</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />
            {collectedFunds}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mt-2 ">
          <span className="">Used</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />

            {etherBalance && (collectedFunds - formatEther(etherBalance)).toFixed(3)}
          </div>
        </div>
        <hr className="h-px my-2 bg-blue-900 border-0"></hr>
        <div className="flex flex-row justify-between  items-center mt-2 ">
          <span className="">Amount</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />
            {etherBalance && formatEther(etherBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}
