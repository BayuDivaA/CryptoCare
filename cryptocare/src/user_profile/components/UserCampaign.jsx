import React, { useMemo } from "react";
import { getDetail, fetchCampaign, getAddresses } from "../../smart_contract/SmartcontractInteract";
import { useParams } from "react-router";
import MyCampaignCard from "./MyCampaignCard";
import loader_2 from "../../assets/loader_2.svg";

export default function UserCampaign() {
  const { account_address } = useParams();
  const addresses = getAddresses();
  const campaignData = getDetail();
  const isLoading = !campaignData || !addresses;

  const currentItems = useMemo(() => {
    if (!Array.isArray(campaignData) || !Array.isArray(addresses)) return [];
    return fetchCampaign(campaignData)
      .map((campaign) => ({
        ...campaign,
        campaignAddress: addresses?.[campaign.daftar],
      }))
      .filter((campaign) => campaign.campaignAddress)
      .slice()
      .reverse()
      .filter((campaign) => campaign.creator === account_address);
  }, [campaignData, addresses, account_address]);

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
