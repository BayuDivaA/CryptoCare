import { SiEthereum } from "react-icons/si";
import React from "react";
import { useState, useEffect } from "react";
import { getRemainingTimeUntilMsTimestamp } from "../../utils/CountdownTimerUtils";
import { useEthers } from "@usedapp/core";
import UrgentDonateModal from "./UrgentDonateModal";
import { getAddresses } from "../../smart_contract/SmartcontractInteract";
import { useCoingeckoPrice } from "@usedapp/coingecko";
import { useNavigate } from "react-router-dom";

const defaultRemainingTime = {
  minutes: "00",
  hours: "00",
  days: "00",
};

export const CountdownTimer = ({ countdownTimestampsMs, durationCampaign }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampsMs, durationCampaign);
    }, 3000);
    return () => clearTimeout(intervalId);
  }, [countdownTimestampsMs, durationCampaign]);

  function updateRemainingTime(countdown, duration) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown, duration));
  }

  return (
    <div className=" md:text-base text-sm  font-bold text-[#302CED]">
      {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
    </div>
  );
};

const UrgentCampaignCard = ({ title, url, story, duration, timestamp, collectedFunds, daftar }) => {
  const { account } = useEthers();
  const [isOpen, setIsOpen] = useState(false);
  const address = getAddresses();

  const campaignAddress = address?.[daftar];
  const etherPriceUsd = useCoingeckoPrice("ethereum", "usd");
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/campaign_details/${campaignAddress}`);
  };

  return (
    <>
      {account && <UrgentDonateModal isOpen={isOpen} cancel={() => setIsOpen(false)} campaignAddress={campaignAddress} title={title} />}
      <div className="inline-block px-2 cursor-pointer">
        <div className="w-72 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <div className="rounded-md">
            <img src={url} alt="BANNER CAMPAIGN" className="w-full h-40 object-cover rounded-t-md" />
          </div>
          <div className="p-2 flex-col">
            <h3 className="text-lg font-bold pb-1 hover:text-blue-900" onClick={handleDetails}>
              {title}
            </h3>
            <p className="text-xs mb-4 font-thin line-clamp-3 text-justify text-[#7B7D8C]">{story}</p>
            <div className="flex flex-row justify-between">
              <p className=" text-xs font-thin text-[#7B7D8C]">Collected Funds</p>
              <p className=" text-xs font-thin text-[#7B7D8C]">Ends in</p>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex-col items-center">
                <div className="flex md:text-base text-sm font-bold items-center text-[#302CED]">
                  <SiEthereum className=" text-sm font-bold text-[#302CED] mr-1" />
                  {collectedFunds}
                </div>
                <span className="flex text-xs font-thin text-[#7B7D8C]"> ${(etherPriceUsd * collectedFunds).toFixed(2)}</span>{" "}
              </div>
              <CountdownTimer countdownTimestampsMs={timestamp} durationCampaign={duration} />
            </div>
            {!account ? (
              <div className="w-full text-[#302CED] md:flex justify-center  py-2 px-7 mt-1">
                <span>Connect for Donate</span>
              </div>
            ) : (
              <button onClick={() => setIsOpen(true)} className="w-full text-[#302CED] hover:text-white md:flex justify-center border border-[#302CED] hover:border-transparent py-2 px-7 mt-1 rounded-lg cursor-pointer hover:bg-[#302CED]">
                <span>Donate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UrgentCampaignCard;
