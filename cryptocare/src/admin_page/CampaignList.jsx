import React, { useMemo, useState } from "react";
import { getDetail, fetchCampaign } from "../smart_contract/SmartcontractInteract";
import loader_2 from "../assets/loader_2.svg";
import { shortenAddress } from "../utils/shortenAddress";
import { getAddresses } from "../smart_contract/SmartcontractInteract";
import AcceptButton from "./component/AcceptButton";
import RejectButton from "./component/RejectButton";

function Card({ image, title, createdBy, campaignAddress, status }) {
  const handleDetails = () => {
    window.open(`/campaign_details/${campaignAddress}`, "_blank");
  };

  return (
    <div className="flex w-full max-w-4xl flex-col sm:flex-row sm:justify-between admin-glassmorphism">
      <div className="flex items-center p-4 min-w-0">
        <div className="flex-shrink-0">
          <img src={image} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
        </div>
        <div className="ml-4 min-w-0">
          <h2 className="font-bold text-lg sm:text-xl truncate">{title}</h2>
          <p className="text-gray-500 text-sm truncate">created by {createdBy}</p>
        </div>
      </div>
      <div className="flex sm:flex-col">
        <AcceptButton address={campaignAddress} status={status} />
        <RejectButton address={campaignAddress} status={status} />
        <button onClick={handleDetails} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:rounded-br-[16px] flex-1">
          Detail
        </button>
      </div>
    </div>
  );
}

function CampaignList() {
  const addresses = getAddresses();
  const campaignData = getDetail();
  const [currentFilter, setCurrentFilter] = useState(0); //Wait, Accept, Reject

  const isLoading = !addresses || !campaignData;

  const currentItems = useMemo(() => {
    if (!Array.isArray(campaignData) || !Array.isArray(addresses)) {
      return [];
    }

    const parsedCampaigns = fetchCampaign(campaignData)
      .map((campaign) => ({
        ...campaign,
        campaignAddress: addresses?.[campaign.daftar],
      }))
      .filter((campaign) => campaign.campaignAddress);

    return parsedCampaigns
      .slice()
      .reverse()
      .filter((campaign) => campaign.status === currentFilter);
  }, [campaignData, addresses, currentFilter]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 gap-2">
      <ul className="text-black flex flex-wrap text-sm flex-row list-none items-center justify-center gap-1 mb-5">
        <li>
          <input type="radio" id="Wait" name="filter" onClick={() => setCurrentFilter(0)} className="hidden peer" />
          <label
            htmlFor="Wait"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Wait
          </label>
        </li>
        <li>
          <input type="radio" id="Accept" name="filter" onClick={() => setCurrentFilter(1)} className="hidden peer" />
          <label
            htmlFor="Accept"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism  border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Accept
          </label>
        </li>
        <li>
          <input type="radio" id="Reject" name="filter" onClick={() => setCurrentFilter(2)} className="hidden peer" />
          <label
            htmlFor="Reject"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Reject
          </label>
        </li>
      </ul>
      {isLoading ? (
        <div className="flex items-center flex-col mt-5 justify-center">
          <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
          <p className="flex text-base text-blue-gray-900 font-semibold">Loading Campaigns ...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex justify-center my-5 italic">No Campaigns Found</div>
      ) : (
        currentItems.map((campaign, i) => <Card key={i} {...campaign} image={campaign.url} title={campaign.title} createdBy={shortenAddress(campaign.creator)} />)
      )}
    </div>
  );
}

export default CampaignList;
