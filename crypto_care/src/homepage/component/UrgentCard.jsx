import { SiEthereum } from "react-icons/si";
import React from "react";
import { useState, useEffect } from "react";
import { getRemainingTimeUntilMsTimestamp } from "../../utils/CountdownTimerUtils";

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
    <div className=" md:text-lg text-sm  font-bold text-[#302CED]">
      {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
    </div>
  );
};

const UrgentCampaignCard = ({ title, url, description, Duration, creatorAddress, target, timestamp, collectedFunds, campaignType }) => {
  return (
    <div className="inline-block px-2">
      <div className="w-72 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <img src={url} alt="Banner" className="h-1/2" />
        <div className="p-2 flex-col">
          <h3 className="text-lg font-bold pb-1">{title}</h3>
          <p className="text-xs mb-4 font-thin line-clamp-3 text-justify text-[#7B7D8C]">{description}</p>
          <div className="flex flex-row justify-between">
            <p className=" text-xs font-thin text-[#7B7D8C]">Collected Funds</p>
            <p className=" text-xs font-thin text-[#7B7D8C]">Ends in</p>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex items-center">
              <SiEthereum className=" text-sm font-bold text-[#302CED] mr-1" />
              <p className=" md:text-lg text-sm font-bold text-[#302CED]">
                {collectedFunds}
                <span className="text-xs font-thin italic text-[#7B7D8C]"> ( Rp 200.000)</span>{" "}
              </p>
            </div>
            <CountdownTimer countdownTimestampsMs={timestamp} durationCampaign={Duration} />
          </div>
          <button className="w-full text-[#302CED] hover:text-white md:flex justify-center border border-[#302CED] hover:border-transparent py-2 px-7 mt-1 rounded-lg cursor-pointer hover:bg-[#302CED]" onClick={() => {}}>
            <span>Donate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrgentCampaignCard;
