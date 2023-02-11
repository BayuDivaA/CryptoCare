import React from "react";
import { Progress } from "@material-tailwind/react";
import { SiEthereum } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import { AiOutlineFolder } from "react-icons/ai";

import { shortenAddress } from "../../utils/shortenAddress";
import { useNavigate } from "react-router-dom";
import { checkAddress, getAddresses } from "../../smart_contract/SmartcontractInteract";
import { useCoingeckoPrice } from "@usedapp/coingecko";

const CampaignCard = ({ title, url, timestamp, collectedFunds, creator, category, target, donatursCount, daftar }) => {
  const timeUnix = timestamp * 1000;
  const date = new Date(timeUnix);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  const dateFormat = month + " " + day + ", " + year;
  const etherPrice = useCoingeckoPrice("ethereum", "usd");

  const persentage = ((target - collectedFunds) / target) * 100;

  const userVerif = checkAddress(creator);
  const address = getAddresses();
  const navigate = useNavigate();

  const campaignAddress = address?.[daftar];

  const handleDetails = () => {
    navigate(`/campaign_details/${campaignAddress}`);
  };

  return (
    <div className="w-full inline-block">
      <div className="max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <img src={url} alt="BANNER CAMPAIGN" className="h-56 w-full object-cover rounded-t-md" />

        {/* <img src={url} alt="Banner" className="h-1/2" /> */}
        <div className="p-2 flex flex-col">
          <div className="flex justify-between">
            <div className="flex text-xs font-thin  text-[#7B7D8C] py-2">{dateFormat}</div>
            <div className="flex text-xs font-thin  text-[#7B7D8C] py-2 capitalize	items-center">
              <AiOutlineFolder className="mr-2" />
              {category}
            </div>
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="flex items-center mb-4">
            <button onClick={() => window.open(`/profile/${creator}`, "_blank")} target="_blank" rel="noopener noreferrer" className="text-xs font-thin text-[#7B7D8C] cursor-pointer hover:text-[#393b4e]">
              {shortenAddress(creator)}{" "}
            </button>
            {userVerif ? <MdVerified className="text-xs text-[#302CED] ml-1" /> : ""}
          </div>
          <div className="flex pb-5 ">
            <Progress value={100 - persentage} color="purple" variant="filled" />
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
                <span className="text-xs font-thin text-[#7B7D8C]"> ${(etherPrice * collectedFunds).toFixed(2)}</span>{" "}
              </p>
            </div>
            <div className="flex items-center text-lg font-bold text-[#302CED]">{donatursCount}</div>
          </div>
          <button onClick={handleDetails} className="w-full text-[#302CED] hover:text-white md:flex justify-center border border-[#302CED] hover:border-transparent py-1 px-7 mt-1 rounded-lg cursor-pointer hover:bg-[#302CED]">
            <span>See Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
