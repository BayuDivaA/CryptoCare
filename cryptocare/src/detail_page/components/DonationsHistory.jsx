import React, { useEffect, useState } from "react";
import { shortenAddress } from "../../utils/shortenAddress";
import { SiEthereum } from "react-icons/si";
import { formatEther } from "@ethersproject/units";

export default function DonationsHistory({ contributors, donations }) {
  return (
    <div className="w-full px-6 py-4 shadow-xl rounded-md bg-white">
      <div className=" font-semibold mb-2">Donations History</div>
      <div className="w-full flex flex-row justify-between items-start py-2 max-h-48 overflow-auto">
        {contributors?.length === 0 && (
          <div className="flex justify-center w-full">
            <div className="flex italic ">No Donations Yet</div>
          </div>
        )}

        <div className="flex flex-col  gap-1">
          {contributors?.map((address, i) => (
            <div key={i} className="flex">
              {address && shortenAddress(address)}
            </div>
          ))}
        </div>
        <div className="flex flex-col  gap-1">
          {donations?.map((amount, i) => (
            <div key={i} className="flex items-center text-purple-900">
              <SiEthereum />
              <div className="">{amount && formatEther(amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
