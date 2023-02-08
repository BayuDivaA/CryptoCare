import { Progress } from "@material-tailwind/react";
import { SiEthereum } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import React from "react";
import { shortenAddress } from "../../utils/shortenAddress";

export function ProgressBar(collected, target) {
  return;
}

const CampaignCard = ({ title, url, description, Duration, userVerif, creatorAddress, Target, timestamp, collectedFunds, donaturs, campaignType }) => {
  const timeUnix = timestamp * 1000;
  const date = new Date(timeUnix);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  const dateFormat = month + " " + day + ", " + year;

  const persentage = ((Target - collectedFunds) / Target) * 100;

  return (
    <div className="inline-block">
      <div className="max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <img src={url} alt="Banner" className="h-1/2" />
        <div className="p-2 flex flex-col">
          <div className="flex text-xs font-thin  text-[#7B7D8C] py-2">{dateFormat}</div>
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="flex items-center mb-4">
            <a href={"https://optimistic.etherscan.io/address/" + creatorAddress} target="_blank" rel="noopener noreferrer" className="text-xs font-thin text-[#7B7D8C] cursor-pointer hover:text-[#393b4e]">
              {shortenAddress(creatorAddress)}{" "}
            </a>
            {userVerif ? <MdVerified className="text-xs text-[#302CED] ml-1" /> : ""}
          </div>
          <div className="pb-5 ">
            <Progress value={100 - persentage} color="purple" />
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-xs font-thin text-[#7B7D8C]">Collected Funds</p>
            <p className="text-xs font-thin text-[#7B7D8C]">Donaturs</p>
          </div>
          <div className="flex flex-row justify-between pb-2">
            <div className="flex items-center">
              <SiEthereum className=" text-sm font-bold text-[#302CED] mr-1" />
              <p className=" text-lg font-bold text-[#302CED]">
                {collectedFunds}
                <span className="text-xs font-thin italic text-[#7B7D8C]"> ( Rp 200.000 )</span>{" "}
              </p>
            </div>
            <div className="flex items-center text-lg font-bold text-[#302CED]">{donaturs}</div>
          </div>
          <button className="w-full text-[#302CED] hover:text-white md:flex justify-center border border-[#302CED] hover:border-transparent py-1 px-7 mt-1 rounded-lg cursor-pointer hover:bg-[#302CED]" onClick={() => {}}>
            <span>See Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
