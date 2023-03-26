import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { checkIfAdmin } from "../smart_contract/SmartcontractInteract";
import { useNavigate } from "react-router";
import AddAdmin from "./AddAdmin";
import UserVerification from "./UserVerification";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CampaignList from "./CampaignList";

export default function AdminPage() {
  const { account } = useEthers();
  const navigate = useNavigate();
  const isAdmin = checkIfAdmin(account);
  const [isActive, setIsActive] = useState("verification");

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
      {!isAdmin && account !== "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" && (
        <div className="fixed inset-0 z-1 h-screen loader-glassmorphism flex items-center justify-center flex-col">
          <p className="mt-[20px] font-epilogue font-bold text-[20px] text-blue-gray-900 text-center">You Are Not Admin</p>
          <p className=" font-epilogue font-bold text-[20px] text-blue-gray-900 text-center">Please change your wallet address.</p>
          <button onClick={() => navigate("/")} className="mt-[20px] inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Back to Home
          </button>
        </div>
      )}
      <div className="relative sm:-8 p-4 gradient-bg-admin  min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar verif={handleVerif} admin={handleAdmin} campaignList={handleCampaign} />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          {isActive === "verification" && <UserVerification />}
          {isActive === "admin" && <AddAdmin />}
          {isActive === "campaign" && <CampaignList />}
        </div>
        {/* <div className="flex items-center w-full justify-center">
          <div className="flex flex-col items-center w-5/6 py-3">
            {isAdmin && <UserVerification />}
            {/* ADD ADMIN FORM 
            {account === "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" && <AddAdmin />}
            <p className="text-center text-gray-500 text-xs">&copy;2023 CryptoCare Foundation. All rights reserved.</p>
          </div>
        </div> */}
      </div>
    </>
  );
}
