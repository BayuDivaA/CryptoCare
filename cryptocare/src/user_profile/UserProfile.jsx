import React, { useState, useEffect } from "react";
import { getDetail, fetchCampaign, checkAddress, getUserDonateValue } from "../smart_contract/SmartcontractInteract";
import { useParams } from "react-router";
import { useEthers, useTransactions } from "@usedapp/core";
import { shortenAddress } from "../utils/shortenAddress";
import { formatEther } from "@ethersproject/units";
import { getUsername, getPhotoUrl } from "../smart_contract/SmartcontractInteract";
import Navbar from "../homepage/component/Navbar";
import UserSettingDropdown from "./components/UserSettingDropdown";
import UserNameModal from "./components/UserNameModal";
import PhotoProfilModal from "./components/PhotoProfilModal";
import logo from "../../images/Logo.png";
import UserCampaign from "./components/UserCampaign";
import UserHistory from "./components/UserHistory";

{
  /* <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white">
  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
      Cyan to blue
  </span>
</button> */
}

const Icon = ({ name, isActive, handleClick }) => (
  <button
    className={`${
      isActive === name ? "from-green-400 to-blue-600 text-white" : "hover:from-green-400 hover:to-blue-600 hover:text-white"
    }  inline-flex items-center justify-center p-0.5 mb-2 mr-2  text-sm font-medium rounded-lg bg-gradient-to-br `}
    onClick={handleClick}
  >
    <span className={` px-5 py-2.5 transition-all ease-in duration-75 rounded-md`}>{name}</span>
  </button>
);

export default function myCampaign() {
  const { account_address } = useParams();
  const { account } = useEthers();
  const campaignData = getDetail();
  const userDonateValue = getUserDonateValue(account_address);
  const userName = getUsername(account_address);
  const photoUrl = getPhotoUrl(account_address);

  const [isUsernameModal, setIsUsernameModal] = useState(false);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDonated, setUserDonated] = useState(0);
  const userVerif = checkAddress(account_address);
  const [isActive, setIsActive] = useState("User Campaign");

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

      <div className="gradient-bg-profile min-h-screen w-full">
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
        <div className="flex-1 flex flex-col justify-between items-center bg-white py-2 my-12">
          <div className="flex flex-row justify-center items-center gap-3">
            <Icon
              name="User Campaign"
              isActive={isActive}
              handleClick={() => {
                setIsActive("User Campaign");
              }}
            />
            {account === account_address && (
              <Icon
                name="History"
                isActive={isActive}
                handleClick={() => {
                  setIsActive("History");
                }}
              />
            )}
          </div>
        </div>
        {isActive === "User Campaign" && <UserCampaign />}
        {isActive === "History" && <UserHistory />}
      </div>
    </>
  );
}
