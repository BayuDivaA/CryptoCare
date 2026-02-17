import React, { useEffect, useState } from "react";
import { shortenAddress } from "../../utils/shortenAddress";
import { SiEthereum } from "react-icons/si";
import { formatEther } from "@ethersproject/units";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { shortenAddress2 } from "../../utils/shortenAddress";

export default function DonationsHistory({ contributors, donations, donateTime }) {
  dayjs.extend(relativeTime);
  return (
    <div className="w-full px-6 py-4 shadow-xl rounded-md bg-white">
      <div className=" font-semibold mb-2">Donations History</div>
      <div className="w-full flex flex-col py-2 max-h-48 overflow-auto gap-2">
        {contributors?.length === 0 && (
          <div className="flex justify-center w-full">
            <div className="flex italic ">No Donations Yet</div>s
          </div>
        )}

        {contributors?.map((address, i) => (
          <div key={i} className="flex flex-row justify-between">
            <div className="flex flex-col">
              <a href={"https://sepolia-optimism.etherscan.io/address/" + address} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-blue-300">
                {address && shortenAddress(address)}
              </a>
              {/* {address && shortenAddress(address)} */}
              <div className="flex text-xs font-thin">{dayjs(donateTime?.[i].toNumber() * 1000).fromNow()}</div>
            </div>
            <div className="flex items-center text-purple-900">
              <SiEthereum />
              <div className="">{formatEther(donations?.[i])}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
