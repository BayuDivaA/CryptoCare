import React, { useState, useEffect } from "react";
import { getDetail, fetchCampaign, checkAddress, getUserDonateValue } from "../smart_contract/SmartcontractInteract";
import { useParams } from "react-router";
import { useEthers } from "@usedapp/core";
import { shortenAddress } from "../utils/shortenAddress";
import { formatEther } from "@ethersproject/units";
import { getUsername, getPhotoUrl } from "../smart_contract/SmartcontractInteract";
import Navbar from "../homepage/component/Navbar";
import MyCampaignCard from "./MyCampaignCard";
import loader_2 from "../assets/loader_2.svg";
import UserSettingDropdown from "./UserSettingDropdown";
import UserNameModal from "./UserNameModal";
import PhotoProfilModal from "./PhotoProfilModal";
import logo from "../../images/Logo.png";

export default function myCampaign() {
  const { account_address } = useParams();
  const { account } = useEthers();
  const campaignData = getDetail();
  const userDonateValue = getUserDonateValue(account_address);
  const userName = getUsername(account_address);
  const photoUrl = getPhotoUrl(account_address);

  const [isUsernameModal, setIsUsernameModal] = useState(false);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [userDonated, setUserDonated] = useState(0);
  const userVerif = checkAddress(account_address);

  function handleModalUsername() {
    setIsUsernameModal(true);
  }
  function handleModalPhoto() {
    setIsPhotoModal(true);
  }

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

    userDonateValue.map((result) => {
      if (!result || result?.value === "undefined") {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setUserValue(userDonateValue);
        setIsLoading(false);
      }
    });

    if (campaigns.length !== 0 && userValue.length !== 0) {
      const parsedCampaigns = fetchCampaign(campaigns);

      const current = parsedCampaigns.reverse().filter((campaign) => campaign.creator === account_address);

      const ethers = userValue?.map((amount) => ({
        total: formatEther(amount?.value?.[0]),
      }));

      const totalEther = ethers?.map((a) => {
        return a.total;
      });

      setUserDonated(
        totalEther.reduce((a, b) => {
          return +a + +b;
        })
      );

      setCurrentItems(current);
      setIsLoading(false);
    }
  }, [campaignData, campaigns, userDonateValue]);

  return (
    <>
      <PhotoProfilModal isOpen={isPhotoModal} cancel={() => setIsPhotoModal(false)} />
      <UserNameModal isOpen={isUsernameModal} cancel={() => setIsUsernameModal(false)} />

      <div className="gradient-bg-profile min-h-screen">
        <Navbar showList={false} />
        <div className="flex items-center justify-center">
          <div className="flex flex-row profile-glassmorphism shadow-xl rounded-md py-4 px-6 justify-between gap-7">
            <div className="flex items-center">
              <div className="flex">
                <img src={photoUrl ? photoUrl : logo} alt="" className="object-cover bg-gray-300 md:w-40 md:h-40 w-20 h-20 rounded-full" />
              </div>
              <div className="ml-6 flex-col justify-between">
                <p className="text-blue-gray-900 font-semibold md:text-xl text-base">{userName ? userName : shortenAddress(account_address)}</p>
                <p className="text-blue-gray-600 font-semibold md:text-sm text-xs">{shortenAddress(account_address)}</p>
                {userVerif ? (
                  <span className="bg-purple-900 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mt-2">Verified</span>
                ) : (
                  <span className="bg-gray-700 text-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mt-2">Unverified</span>
                )}

                <div className="flex flex-row gap-3 mt-5">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base">{currentItems.length}</span> Campaigns
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base">{userDonated}</span> Ethers
                  </div>
                </div>
              </div>
            </div>
            <div className="items-end">{account === account_address && <UserSettingDropdown address={account_address} verif={userVerif} handleUsername={handleModalUsername} handlePhoto={handleModalPhoto} />}</div>
          </div>
        </div>
        <div className="flex flex-col items-center py-3">
          <div className="flex w-5/6 m-5 items-center justify-between md:justify-start">
            <h1 className="md:text-3xl font-bold mr-6">User Deployed Campaigns</h1>
          </div>
          <div className="flex md:bg-white shadow-xl md:w-5/6 px-5 md:p-5 justify-center rounded-md">
            {isLoading ? (
              <div className="flex items-center flex-col my-5 justify-center">
                <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
                <p className="flex text-base text-blue-gray-900 font-semibold">Loading Campaigns ...</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex justify-center my-5 italic">No Campaigns Yet</div>
            ) : (
              <div className="flex flex-col md:grid grid-cols-2 gap-3">
                {currentItems.map((campaign, i) => (
                  <div key={i} className="flex justify-center w-full">
                    <MyCampaignCard {...campaign} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
