import React, { useState, useEffect } from "react";
import { TbCurrencyEthereum } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi";
import { BiDonateHeart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { getDetail, fetchCampaign } from "../../smart_contract/SmartcontractInteract";
import Loader from "../../components/CampaignDetailLoader";

const Welcome = () => {
  const { account } = useEthers();
  const campaignData = getDetail();
  const [isLoading, setIsLoading] = useState(true);

  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [etherCount, setEtherCount] = useState(0);

  const newCampaignHandler = () => {
    navigate("/form");
  };

  const allCampaignsHandle = () => {
    navigate("/campaigns");
  };

  useEffect(() => {
    campaignData.map((result) => {
      if (!result || result?.value === undefined) {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setCampaigns(campaignData);
      }
    });

    if (campaigns.length !== 0) {
      console.log(campaigns);
      const parsedCampaigns = fetchCampaign(campaigns);
      const activeCampaigns = parsedCampaigns.filter((campaign) => campaign.active === true);
      setCampaignsCount(activeCampaigns.length);

      const donor = parsedCampaigns?.map((a) => {
        return a.donatursCount;
      });

      const ether = parsedCampaigns?.map((a) => {
        return a.collectedFunds;
      });

      setDonorsCount(
        donor.reduce((a, b) => {
          return a + b;
        })
      );
      setEtherCount(
        ether.reduce((a, b) => {
          return +a + +b;
        })
      );

      setIsLoading(false);
    }
  }, [campaignData, campaigns]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {/* SLOGAN CRYPTOCARE ---- */}
        <div className="flex flex-col md:pt-12 pt-5 w-5/6">
          <div className="flex flex-col">
            <h1 className="md:text-5xl text-2xl text-center font-semibold md:leading-snug">
              <span className="text-[#302CED]">Donate</span> your <span className="text-[#302CED] text-gradient">crypto assets</span> <br /> for those in need.
            </h1>
            <p className="md:text-lg text-sm text-center my-3 tracking-wide">Be a part of the breakthrough and make someone’s dream come true.</p>
          </div>
        </div>
        {/* HOW TO n DONATE BUTTON ---- */}
        <div className="flex md:flex-row flex-col justify-center items-center md:mt-12 w-full">
          <button onClick={allCampaignsHandle} className="md:w-1/5 w-2/5 bg-transparent hover:bg-[#2546bd] text-[#302CED] font-semibold hover:text-white md:py-3 py-1 md:mx-3 m-2 border border-blue-500 hover:border-transparent rounded-lg">
            Campaigns
          </button>

          {account && (
            <button onClick={newCampaignHandler} className="md:w-1/5 w-2/5 bg-[#2546bd] hover:bg-[#302CED] text-white font-semibold md:py-3 py-1 border border-[#2546bd] rounded-lg">
              New Campaigns
            </button>
          )}
        </div>
        {/* ACCUMULATE DONORS, CAMAPIGNS, ETHERS ---- */}
        <div className="flex md:flex-row flex-col md:justify-around mt-10 mb-12 md:px-24 md:py-7 px-10 white-glassmorphism md:w-5/6">
          <div className="flex flex-row items-center py-2">
            <HiOutlineUsers className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">{donorsCount}</span>
              <p className="md:text-xl text-sm">Donors</p>
            </div>
          </div>
          <div className="flex flex-row items-center py-2">
            <BiDonateHeart className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">{campaignsCount}</span>
              <span className="md:text-xl text-sm">Campaigns</span>
            </div>
          </div>
          <div className="flex flex-row items-center py-2">
            <TbCurrencyEthereum className="md:text-6xl text-3xl mr-2" />
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl font-bold text-[#302CED]">{etherCount}</span>
              <span className="md:text-xl text-sm">Ethers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
