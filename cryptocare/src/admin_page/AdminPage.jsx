import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { checkIfAdmin } from "../smart_contract/SmartcontractInteract";
import { useNavigate } from "react-router";
import AddAdmin from "./AddAdmin";
import UserVerification from "./UserVerification";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CampaignList from "./CampaignList";
import ConnectModal from "../homepage/component/WalletConnectModal";

export default function AdminPage() {
  const { account } = useEthers();
  const navigate = useNavigate();
  const isAdmin = checkIfAdmin(account);
  const [isActive, setIsActive] = useState("verification");
  const [showWallet, setShowWallet] = useState(false);

  function handleOnClose() {
    setShowWallet(false);
  }

  function handleVerif() {
    setIsActive("verification");
    console.log(isActive);
  }
  function handleAdmin() {
    setIsActive("admin");
    console.log(isActive);
  }
  function handleCampaign() {
    setIsActive("campaign");
    console.log(isActive);
  }

  return (
    <>
      {account !== "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" && !isAdmin ? (
        <div className="fixed inset-0 z-1 h-screen gradient-bg-admin flex items-center justify-center flex-col">
          <p className="mt-[20px] font-epilogue font-bold text-[20px] text-blue-gray-900 text-center">You Are Not Admin</p>
          <p className=" font-epilogue font-bold text-[20px] text-blue-gray-900 text-center mb-[20px]">Please change your wallet address.</p>
          <button
            type="button"
            className="bg-[#7d37ec] font-epilogue justify-center font-semibold text-[16px] leading-[26px] text-white min-h-[35px] px-4 rounded-[10px] "
            onClick={() => {
              setShowWallet(true);
            }}
          >
            Connect Different Wallet
          </button>
          <button
            type="button"
            className=" justify-center text-[16px] mt-2 text-[#7d37ec]"
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className=" sm:-8 p-4 gradient-bg-admin  min-h-screen flex flex-row">
          <div className="sm:flex hidden mr-10 relative">
            <Sidebar verif={handleVerif} admin={handleAdmin} campaignList={handleCampaign} isAdmin={isAdmin} />
          </div>
          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar />
            {isActive === "verification" && <UserVerification />}
            {isActive === "admin" && <AddAdmin />}
            {isActive === "campaign" && <CampaignList />}
          </div>
        </div>
      )}

      <ConnectModal onClose={handleOnClose} visible={showWallet} />
    </>
  );
}
