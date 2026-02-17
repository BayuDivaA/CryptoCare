import React, { useMemo, useState } from "react";
import { getDetail, fetchCampaign, checkAddress, getUserDonateValue } from "../smart_contract/SmartcontractInteract";
import { useParams } from "react-router";
import { useEthers } from "@usedapp/core";
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
    }  inline-flex items-center justify-center p-0.5 mb-2 mr-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-br `}
    onClick={handleClick}
  >
    <span className={` px-3 sm:px-5 py-2 sm:py-2.5 transition-all ease-in duration-75 rounded-md`}>{name}</span>
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
  const userVerif = checkAddress(account_address);
  const [isActive, setIsActive] = useState("User Campaign");

  function handleModalUsername() {
    setIsUsernameModal(true);
  }
  function handleModalPhoto() {
    setIsPhotoModal(true);
  }

  const currentItems = useMemo(() => {
    if (!Array.isArray(campaignData)) return [];
    return fetchCampaign(campaignData)
      .slice()
      .reverse()
      .filter((campaign) => campaign.creator === account_address);
  }, [campaignData, account_address]);

  const userDonated = useMemo(() => {
    if (!Array.isArray(userDonateValue) || userDonateValue.length === 0) return 0;
    return userDonateValue.reduce((sum, amount) => {
      const value = amount?.value;
      const raw = Array.isArray(value) ? value[0] : value;
      const ether = raw ? Number(formatEther(raw.toString())) : 0;
      return sum + ether;
    }, 0);
  }, [userDonateValue]);

  return (
    <>
      <PhotoProfilModal isOpen={isPhotoModal} cancel={() => setIsPhotoModal(false)} />
      <UserNameModal isOpen={isUsernameModal} cancel={() => setIsUsernameModal(false)} />

      <div className="gradient-bg-profile min-h-screen w-full">
        <Navbar showList={false} />
        <div className="flex items-center justify-center px-3">
          <div className="flex w-full max-w-5xl flex-col sm:flex-row profile-glassmorphism shadow-xl rounded-md py-4 px-4 sm:px-6 justify-between gap-4 sm:gap-7">
            <div className="flex items-center min-w-0">
              <div className="flex">
                <img src={photoUrl ? photoUrl : logo} alt="" className="object-cover bg-gray-300 md:w-40 md:h-40 w-20 h-20 rounded-full" />
              </div>
              <div className="ml-4 sm:ml-6 flex-col justify-between min-w-0">
                <p className="text-blue-gray-900 font-semibold md:text-xl text-base truncate">{userName ? userName : shortenAddress(account_address)}</p>
                <p className="text-blue-gray-600 font-semibold md:text-sm text-xs truncate">{shortenAddress(account_address)}</p>
                {userVerif ? (
                  <span className="inline-flex bg-purple-900 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mt-2">Verified</span>
                ) : (
                  <span className="inline-flex bg-gray-700 text-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mt-2">Unverified</span>
                )}

                <div className="flex flex-row flex-wrap gap-3 mt-4 sm:mt-5">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base">{currentItems.length}</span> Campaigns
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base">{userDonated.toFixed(4)}</span> Ethers
                  </div>
                </div>
              </div>
            </div>
            <div className="items-end self-end sm:self-auto">{account === account_address && <UserSettingDropdown address={account_address} verif={userVerif} handleUsername={handleModalUsername} handlePhoto={handleModalPhoto} />}</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between items-center bg-white py-2 my-8 sm:my-12">
          <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 px-2">
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
