import React, { useState } from "react";
import Navbar from "../homepage/component/Navbar";
import { useEthers } from "@usedapp/core";
import { checkIfAdmin } from "../smart_contract/SmartcontractInteract";
import { useNavigate } from "react-router";
import AddAdmin from "./AddAdmin";
import UserVerification from "./UserVerification";

export default function AdminPage() {
  const { account } = useEthers();
  const navigate = useNavigate();
  const isAdmin = checkIfAdmin(account);

  const handleVerifiedUser = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await send(account);
    setIsLoading(false);
  };

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
      <div className="gradient-bg-admin min-h-screen ">
        <Navbar showList={false} />
        <div className="flex items-center w-full justify-center">
          <div className="flex flex-col items-center w-5/6 py-3">
            {isAdmin && <UserVerification />}
            {/* ADD ADMIN FORM */}
            {account === "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" && <AddAdmin />}
            <p className="text-center text-gray-500 text-xs">&copy;2023 CryptoCare Foundation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}
