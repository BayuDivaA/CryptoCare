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
  const isSuperAdmin =
    account?.toLowerCase() ===
    "0x18A7361aCd7Da75e47Cd4A30Ef50693DE1605109".toLowerCase();
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
      {!isSuperAdmin && !isAdmin ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center h-screen z-1 gradient-bg-admin">
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
        <div className="flex flex-row min-h-screen p-4 sm:-8 gradient-bg-admin">
          <div className="relative hidden mr-10 sm:flex">
            <Sidebar verif={handleVerif} admin={handleAdmin} campaignList={handleCampaign} isAdmin={isAdmin} />
          </div>
          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar />
            <div className="sm:hidden flex flex-wrap gap-2 mb-4">
              <button onClick={handleVerif} className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive === "verification" ? "bg-[#302CED] text-white" : "bg-white text-[#302CED]"}`}>
                Verification
              </button>
              <button onClick={handleCampaign} className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive === "campaign" ? "bg-[#302CED] text-white" : "bg-white text-[#302CED]"}`}>
                Campaign
              </button>
              <button
                onClick={handleAdmin}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${(isActive === "admin" ? "bg-[#302CED] text-white" : "bg-white text-[#302CED]") + (isAdmin ? "" : " hidden")}`}
              >
                Admin
              </button>
            </div>
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
