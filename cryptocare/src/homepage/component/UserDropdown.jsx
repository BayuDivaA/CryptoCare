import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { GoChevronDown } from "react-icons/go";
import { AiOutlineDisconnect, AiOutlineUserSwitch, AiOutlineUser } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { RiQuestionLine } from "react-icons/ri";
import { shortenAddress } from "../../utils/shortenAddress";
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { useNavigate } from "react-router";
import { getUsername, getPhotoUrl, checkIfAdmin } from "../../smart_contract/SmartcontractInteract";
import { OPTIMISM_SEPOLIA_CHAIN_ID } from "../../smart_contract/network";
import logo from "../../../images/Logo.png";

function OpNetworkIcon({ className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-[#ff0420] text-white font-bold text-[9px] ${className}`}>
      OP
    </span>
  );
}

function normalizeChainId(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    if (value.startsWith("0x") || value.startsWith("0X")) {
      const parsedHex = Number.parseInt(value, 16);
      return Number.isNaN(parsedHex) ? null : parsedHex;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function resolveChainId(primaryChainId, library) {
  const direct = normalizeChainId(primaryChainId);
  if (direct) return direct;

  const fromLibraryNetwork = normalizeChainId(library?.network?.chainId);
  if (fromLibraryNetwork) return fromLibraryNetwork;

  const fromProviderChainId = normalizeChainId(library?.provider?.chainId);
  if (fromProviderChainId) return fromProviderChainId;

  const fromProviderNetworkVersion = normalizeChainId(library?.provider?.networkVersion);
  if (fromProviderNetworkVersion) return fromProviderNetworkVersion;

  const fromWindowNetworkVersion = normalizeChainId(typeof window !== "undefined" ? window?.ethereum?.networkVersion : null);
  if (fromWindowNetworkVersion) return fromWindowNetworkVersion;

  return null;
}

export default function UserDropdown() {
  const { account, chainId, library, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [providerBalance, setProviderBalance] = useState();
  const navigate = useNavigate();
  const photoUrl = getPhotoUrl(account);
  const userName = getUsername(account);
  const isAdmin = checkIfAdmin(account);
  const normalizedChainId = resolveChainId(chainId, library);
  const isOpSepolia = normalizedChainId === OPTIMISM_SEPOLIA_CHAIN_ID;
  const networkName = isOpSepolia ? "OP Sepolia" : normalizedChainId ? `Chain ${normalizedChainId}` : "Network N/A";

  useEffect(() => {
    let mounted = true;

    async function loadProviderBalance() {
      if (!account || !library) {
        if (mounted) setProviderBalance(undefined);
        return;
      }

      try {
        const balance = await library.getBalance(account);
        if (mounted) {
          setProviderBalance(balance);
        }
      } catch (_err) {
        if (mounted) {
          setProviderBalance(undefined);
        }
      }
    }

    loadProviderBalance();
    const timer = setInterval(loadProviderBalance, 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [account, library, normalizedChainId]);

  const effectiveBalance = etherBalance ?? providerBalance;
  const formattedBalance = effectiveBalance
    ? Number(formatEther(effectiveBalance)).toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : null;

  return (
    <div className="top-16 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full items-center rounded-2xl border border-white/20 bg-gradient-to-r from-[#1849c6] to-[#2f67f2] px-3 py-2 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5">
          <img src={photoUrl ? photoUrl : logo} alt="" className="mr-2 h-8 w-8 rounded-full border border-white/30 bg-gray-300 object-cover" />
          <div className="flex flex-col items-start">
            <h1 className="text-sm font-semibold leading-tight">{userName ? userName : shortenAddress(account)}</h1>
            <h1 className="text-[11px] text-blue-100">{shortenAddress(account)}</h1>
          </div>
          <div className="ml-2 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
            {isOpSepolia ? <OpNetworkIcon className="mr-1 h-3.5 w-3.5" /> : <RiQuestionLine className="mr-1 h-3.5 w-3.5 text-yellow-300" />}
            {networkName}
          </div>
          <GoChevronDown className="ml-2 -mr-1 h-5 w-5 text-blue-100" aria-hidden="true" />
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
          <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-[#dbe5ff] bg-white/95 p-2 shadow-2xl shadow-blue-200/40 ring-1 ring-black/5 backdrop-blur focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                <div className="group flex w-full items-center rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-gray-900">
                  <SiEthereum className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />
                  <div className="flex flex-col items-start">
                    <p className="text-[11px] text-gray-500">Wallet Balance</p>
                    <p className="text-sm font-semibold tracking-wide">{formattedBalance ? `${formattedBalance} ETH` : "Loading balance..."}</p>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="mt-1 flex w-full items-center rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-900">
                  {isOpSepolia ? <OpNetworkIcon className="mr-2 h-4 w-4" /> : <RiQuestionLine className="mr-2 h-4 w-4 text-yellow-500" aria-hidden="true" />}
                  <p className={`${isOpSepolia ? "text-green-600" : "text-red-600"} font-medium`}>{networkName}</p>
                </div>
              </Menu.Item>
              <hr className="my-2 h-px border-0 bg-[#dbe5ff]" />
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => navigate(`/profile/${account}`)} className={`${active ? "bg-[#2557D6] text-white shadow-md shadow-blue-500/30" : "text-gray-900 hover:bg-blue-50"} group flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150`}>
                    {active ? <AiOutlineUser className="mr-2 h-5 w-5" aria-hidden="true" /> : <AiOutlineUser className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />}
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/admin")}
                    className={`${active ? "bg-[#2557D6] text-white shadow-md shadow-blue-500/30" : "text-gray-900 hover:bg-blue-50"} ${isAdmin || account === "0xf872Dc10b653f2c5f40aCb9Bc38E725EFafeD092" ? "flex" : "hidden"} group w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150`}
                  >
                    {active ? <AiOutlineUserSwitch className="mr-2 h-5 w-5" aria-hidden="true" /> : <AiOutlineUserSwitch className="mr-2 h-5 w-5 text-[#2557D6]" aria-hidden="true" />}
                    Admin Page
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={deactivate} className={`${active ? "bg-red-600 text-white shadow-md shadow-red-400/30" : "text-[#d62525] hover:bg-red-50"} group flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150`}>
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
