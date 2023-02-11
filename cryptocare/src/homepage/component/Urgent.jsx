import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import React, { useState, useEffect } from "react";
import UrgentCampaignCard from "./UrgentCard";
import { getDetail, fetchCampaign } from "../../smart_contract/SmartcontractInteract";
import dayjs from "dayjs";

const slideLeft = () => {
  var slider = document.getElementById("slider");
  slider.scrollLeft = slider.scrollLeft - 300;
};
const slideRight = () => {
  var slider = document.getElementById("slider");
  slider.scrollLeft = slider.scrollLeft + 300;
};

const Urgent = () => {
  const campaignData = getDetail();
  const [isLoading, setIsLoading] = useState(true);

  const [campaigns, setCampaigns] = useState([]);
  const [urgent, setUrgent] = useState([]);

  const nowDay = dayjs();

  useEffect(() => {
    campaignData.map((result) => {
      if (!result || result?.value === "undefined") {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setCampaigns(campaignData);
      }
    });

    if (campaigns.length !== 0) {
      const parsedCampaigns = fetchCampaign(campaigns);
      const urgents = parsedCampaigns.reverse().filter((campaign) => campaign.type === 1 && campaign.active === true && campaign.timestamp >= dayjs(nowDay).subtract(campaign.duration, "d").unix());

      setUrgent(urgents);
      setIsLoading(false);
    }
  }, [campaignData, campaigns]);

  return (
    <div className="flex flex-col items-center bg-[#EFF2F2] py-3">
      <div className="flex w-5/6 m-2">
        <h1 className="md:text-3xl font-bold">
          <span className="text-[#E04D4D]">Urgent</span> Fundraising
        </h1>
      </div>
      <div className="flex w-full items-center justify-around">
        <MdChevronLeft onClick={slideLeft} className="hidden md:flex cursor-pointer items-center md:text-5xl text-8xl hover:rounded-full hover:bg-blue-300" />

        {isLoading || urgent.length === 0 ? (
          <div className="flex items-center w-5/6 my-5 justify-center">
            <p className="flex text-base text-blue-gray-900 font-semibold">No Urgent Campaign Yet.</p>
          </div>
        ) : (
          <div className="flex w-5/6 items-center mt-2">
            <div className="flex overflow-x-scroll scroll scroll-smooth pb-5" id="slider">
              <div className="flex flex-nowrap">
                {urgent.map((Campaign, i) => (
                  <div className="" key={i}>
                    <UrgentCampaignCard {...Campaign} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <MdChevronRight onClick={slideRight} className="hidden md:flex cursor-pointer items-center md:text-5xl text-8xl hover:rounded-full hover:bg-blue-300" />
      </div>
    </div>
  );
};

export default Urgent;
