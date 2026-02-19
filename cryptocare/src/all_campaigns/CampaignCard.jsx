import React, { useState } from "react";
import { SiEthereum } from "react-icons/si";
import { MdVerified } from "react-icons/md";

import { shortenAddress } from "../utils/shortenAddress";
import { useNavigate } from "react-router-dom";
import { checkAddress, getAddresses } from "../smart_contract/SmartcontractInteract";
import useEthFiatPrices from "../utils/useEthFiatPrices";

const CampaignCard = ({ title, url, timestamp, collectedFunds, creator, category, target, donatursCount, daftar, type }) => {
  const timeUnix = timestamp * 1000;
  const date = new Date(timeUnix);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  const dateFormat = month + " " + day + ", " + year;
  const { usd: etherPrice, ready } = useEthFiatPrices();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);

  const userVerif = checkAddress(creator);
  const address = getAddresses();
  const navigate = useNavigate();

  const campaignAddress = address?.[daftar];

  const handleDetails = () => {
    navigate(`/campaign_details/${campaignAddress}`);
  };

  return (
    <div onClick={handleDetails} className="flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
      <div className="flex flex-col">
        <div className="relative aspect-[16/9] w-full bg-blue-gray-100">
          {isImageLoading && <div className="absolute inset-0 animate-pulse bg-blue-gray-100" />}
          {!isImageError ? (
            <img
              src={url}
              alt="BANNER CAMPAIGN"
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                setIsImageError(true);
              }}
              className={`h-full w-full object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-blue-gray-400">Image unavailable</div>
          )}
        </div>
        <div className="px-2">
          <div className="flex justify-between">
            <div className="flex text-xs font-thin  text-[#7B7D8C] py-2">{dateFormat}</div>
            {type === 1 && <div className="flex text-xs  text-red-600 font-semibold py-2 capitalize	items-center">Urgent</div>}
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="flex items-center mb-2">
            <a href={`/profile/${creator}`} target="_blank" rel="noopener noreferrer" className="text-xs font-thin text-[#7B7D8C] cursor-pointer hover:text-[#393b4e]">
              {shortenAddress(creator)}{" "}
            </a>
            {userVerif ? <MdVerified className="text-xs text-[#302CED] ml-1" /> : ""}
          </div>
        </div>
      </div>
      <div className="flex flex-col px-2">
        <div className="flex flex-row justify-between">
          <p className="text-xs font-thin text-[#7B7D8C]">Collected Funds</p>
          <p className="text-xs font-thin text-[#7B7D8C]">Donaturs</p>
        </div>
        <div className="flex flex-row justify-between pb-2">
          <div className="flex-col items-center">
            <div className="flex md:text-base text-sm font-bold items-center text-[#302CED]">
              <SiEthereum className=" text-sm font-bold text-[#302CED] mr-1" />
              {collectedFunds}
            </div>
            <span className="flex text-xs font-thin text-[#7B7D8C] text-right">{ready ? `$ ${(Number(collectedFunds || 0) * etherPrice).toFixed(2)}` : "Rate unavailable"}</span>{" "}
          </div>
          <div className="flex items-center text-lg font-bold text-[#302CED]">{donatursCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
