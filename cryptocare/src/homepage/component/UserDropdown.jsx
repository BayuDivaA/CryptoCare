import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { GoChevronDown } from "react-icons/go";
import { AiOutlineDisconnect, AiOutlineUserSwitch, AiOutlineUser } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { shortenAddress } from "../../utils/shortenAddress";
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { useNavigate } from "react-router";
import { getUsername, getPhotoUrl, checkIfAdmin } from "../../smart_contract/SmartcontractInteract";
import logo from "../../../images/Logo.png";

export default function UserDropdown() {
  const { account, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const navigate = useNavigate();
  const photoUrl = getPhotoUrl(account);
  const userName = getUsername(account);
  const isAdmin = checkIfAdmin(account);

  return (
    <div className=" top-16 text-right ">
      <Menu as="div" className="relative inline-block  text-left">
        <Menu.Button className="inline-flex w-full bg-[#2557D6] text-white px-4 py-1 rounded-md items-center ">
          <img src={photoUrl ? photoUrl : logo} alt="" className="mr-2 -ml-1 w-6 h-6 object-cover bg-gray-300 rounded-full" />
          <div className="flex flex-col items-start">
            <h1 className="text-sm font-bold">{userName ? userName : shortenAddress(account)}</h1>
            <h1 className="text-xs italic font">{shortenAddress(account)}</h1>
            {/*  */}
          </div>
          <GoChevronDown className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100 " aria-hidden="true" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute  right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <div className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm">
                  <SiEthereum className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />
                  {etherBalance && <p>{formatEther(etherBalance)}</p>}
                </div>
              </Menu.Item>
              <hr className="my-1 h-px bg-[#2557D6] border-0" />
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => navigate(`/profile/${account}`)} className={`${active ? "bg-[#2557D6] text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    {active ? <AiOutlineUser className="mr-2 h-5 w-5" aria-hidden="true" /> : <AiOutlineUser className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />}
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/admin")}
                    className={`${active ? "bg-[#2557D6] text-white" : "text-gray-900"} ${isAdmin || account === "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" ? "flex" : "hidden"} group w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? <AiOutlineUserSwitch className="mr-2 h-5 w-5" aria-hidden="true" /> : <AiOutlineUserSwitch className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />}
                    Admin Page
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={deactivate} className={`${active ? "bg-[#2557D6] text-white" : "text-[#d62525]"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    {active ? <AiOutlineDisconnect className="mr-2 h-5 w-5" aria-hidden="true" /> : <AiOutlineDisconnect className="mr-2 h-5 w-5 text-[#d62525]" aria-hidden="true" />}
                    Disconnect
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
