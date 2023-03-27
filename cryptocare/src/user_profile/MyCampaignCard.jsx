import React, { useState } from "react";
import { SiEthereum } from "react-icons/si";
import { AiOutlineFolder, AiOutlineInfoCircle } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { getAddresses } from "../smart_contract/SmartcontractInteract";
import { useEthers } from "@usedapp/core";
import EndCampaignModal from "./EndCampaignModal";

const MyCampaignCard = ({ title, url, timestamp, collectedFunds, creator, category, donatursCount, daftar, story, status }) => {
  const timeUnix = timestamp * 1000;
  const date = new Date(timeUnix);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  const dateFormat = month + " " + day + ", " + year;
  const { account } = useEthers();

  const address = getAddresses();
  const navigate = useNavigate();

  const campaignAddress = address?.[daftar];

  const handleDetails = () => {
    navigate(`/campaign_details/${campaignAddress}`);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EndCampaignModal isOpen={isOpen} campaignAddress={campaignAddress} closeHandle={() => setIsOpen(false)} />
      <div className="md:flex border border-gray-400 rounded w-5/6">
        <img className="object-cover w-full rounded-t-lg h-auto md:w-2/6 md:rounded-none md:rounded-l-lg" src={url} alt="" />
        <div className="bg-white rounded-b md:rounded-b-none md:rounded-r py-2 px-4 flex flex-col justify-between leading-normal md:w-4/6 w-full">
          <div className="mb-4">
            <p className="text-sm text-gray-600 flex items-center">{dateFormat}</p>
            <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base text-justify line-clamp-3">{story}</p>
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex items-center">
              <SiEthereum className="mr-2" />
              <div className="text-sm">
                <p className="text-gray-900 leading-none capitalize">{collectedFunds}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              <div className="text-sm">
                <p className="text-gray-900 leading-none capitalize">{donatursCount}</p>
              </div>
            </div>
            <div className="flex items-center">
              <AiOutlineFolder className="mr-2" />
              <div className="text-sm">
                <p className="text-gray-900 leading-none capitalize">{category}</p>
              </div>
            </div>
            <div className="flex items-center">
              <AiOutlineInfoCircle className="mr-2" />
              <div className="text-sm">
                {status === 0 && <p className="text-gray-900 leading-none capitalize">Validating</p>}
                {status === 1 && <p className="text-gray-900 leading-none capitalize">Active</p>}
                {status === 2 && <p className="text-gray-900 leading-none capitalize">Reject</p>}
                {status === 3 && <p className="text-gray-900 leading-none capitalize">Ended</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            {creator === account && status === 1 && (
              <button onClick={() => setIsOpen(true)} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 text-red-300 hover:text-red-900">
                End Campaign
              </button>
            )}
            <button onClick={handleDetails} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
              Detail
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCampaignCard;
