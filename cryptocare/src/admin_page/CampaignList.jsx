import React, { useState, useEffect } from "react";
import { getDetail, fetchCampaign } from "../smart_contract/SmartcontractInteract";
import { BiFilter } from "react-icons/bi";
import loader_2 from "../assets/loader_2.svg";
import { shortenAddress } from "../utils/shortenAddress";

function Card({ image, title, createdBy }) {
  return (
    <div className="flex w-[60%] justify-between admin-glassmorphism">
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">
          <img src={image} alt={title} className="w-20 h-20 rounded-full" />
        </div>
        <div className="ml-4">
          <h2 className="font-bold text-xl">{title}</h2>
          <p className="text-gray-500 text-sm">created by {createdBy}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-tr-[16px]">Accept</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ">Reject</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded-br-[16px]">Detail</button>
      </div>
    </div>
  );
}

function CampaignList() {
  const campaignData = getDetail();

  const [isLoading, setIsLoading] = useState();
  const [campaigns, setCampaigns] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(0); //Wait, Accept, Reject

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
      const currentI = parsedCampaigns.reverse().filter((campaign) => campaign.status === currentFilter);
      setCurrentItems(currentI);
      setIsLoading(false);
      console.log(currentI);
    }
  }, [campaignData, campaigns, currentFilter]);

  function handleFilter(status) {
    setCurrentFilter(status);
    console.log(status);
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 gap-2">
      <ul className="text-black md:flex hidden text-sm flex-row list-none items-center flex-initial">
        <li>
          <input type="radio" id="Wait" name="filter" onClick={() => setCurrentFilter(0)} className="hidden peer" />
          <label
            htmlFor="Wait"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism rounded-full border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Wait
          </label>
        </li>
        <li>
          <input type="radio" id="Accept" name="filter" onClick={() => setCurrentFilter(1)} className="hidden peer" />
          <label
            htmlFor="Accept"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism rounded-full border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Accept
          </label>
        </li>
        <li>
          <input type="radio" id="Reject" name="filter" onClick={() => setCurrentFilter(2)} className="hidden peer" />
          <label
            htmlFor="Reject"
            className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism rounded-full border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
          >
            Reject
          </label>
        </li>
      </ul>
      {currentItems.map((campaign, i) => (
        <Card key={i} image={campaign.url} title={campaign.title} createdBy={shortenAddress(campaign.creator)} />
      ))}
    </div>
  );
}

export default CampaignList;
