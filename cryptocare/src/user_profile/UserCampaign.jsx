import React, { useState, useEffect } from "react";
import { getDetail, fetchCampaign, getUserDonateValue } from "../smart_contract/SmartcontractInteract";
import { useParams } from "react-router";
import { formatEther } from "@ethersproject/units";
import MyCampaignCard from "./MyCampaignCard";
import loader_2 from "../assets/loader_2.svg";

export default function UserCampaign() {
  const { account_address } = useParams();
  const campaignData = getDetail();
  const userDonateValue = getUserDonateValue(account_address);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    campaignData.map((result) => {
      if (!result || result?.value === "undefined") {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setCampaigns(campaignData);
        setIsLoading(false);
      }
    });

    if (campaigns.length !== 0) {
      const parsedCampaigns = fetchCampaign(campaigns);

      const current = parsedCampaigns.reverse().filter((campaign) => campaign.creator === account_address);

      setCurrentItems(current);
      setIsLoading(false);
    }
  }, [campaignData, campaigns, userDonateValue]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center flex-col my-5 justify-center">
          <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
          <p className="flex text-base text-blue-gray-900 font-semibold">Loading Campaigns ...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex justify-center my-5 italic">No Campaigns Yet</div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentItems.map((campaign, i) => (
            <div key={i} className="flex justify-center">
              <MyCampaignCard {...campaign} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
