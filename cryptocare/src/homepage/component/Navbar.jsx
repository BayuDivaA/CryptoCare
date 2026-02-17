import React, { useState, useEffect } from "react";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineDisconnect, AiOutlineUserSwitch } from "react-icons/ai";
import { FaWallet, FaUserEdit } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
import { RiQuestionLine } from "react-icons/ri";

import { shortenAddress } from "../../utils/shortenAddress";

import { useEthers, useEtherBalance } from "@usedapp/core";
import { useNavigate, Link } from "react-router-dom";
import { formatEther } from "@ethersproject/units";
import { checkIfAdmin } from "../../smart_contract/SmartcontractInteract";
import { OPTIMISM_SEPOLIA_CHAIN_ID } from "../../smart_contract/network";
import WrongNetworkAlert from "./WrongNetworkAlert";
import ConnectModal from "./WalletConnectModal";
import UserDropdown from "./UserDropdown";
import logo from "../../../images/cc.png";

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

const Navbar = ({ showList }) => {
  const { account, chainId, library, deactivate } = useEthers();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [providerBalance, setProviderBalance] = useState();
  const etherBalance = useEtherBalance(account);
  const isAdmin = checkIfAdmin(account);
  const normalizedChainId = resolveChainId(chainId, library);
  const isOpSepolia = normalizedChainId === OPTIMISM_SEPOLIA_CHAIN_ID;
  const networkName = isOpSepolia ? "OP Sepolia" : normalizedChainId ? `Chain ${normalizedChainId}` : "Network N/A";
  const effectiveBalance = etherBalance ?? providerBalance;
  const formattedBalance = effectiveBalance
    ? Number(formatEther(effectiveBalance)).toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : null;

  function handleOnClose() {
    setShowWallet(false);
  }

  useEffect(() => {
    if (account && normalizedChainId && normalizedChainId !== OPTIMISM_SEPOLIA_CHAIN_ID) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [account, normalizedChainId]);

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

  const navigate = useNavigate();
  const reloadPage = () => {
    navigate("/");
  };

  return (
    // Akan melakukan md selama ukuran layar besar dari 768px
    <nav className="flex p-3 md:p-4 mx-0 md:mx-4">
      <div className="flex justify-center w-full">
        <div className="flex items-center flex-1 cursor-pointer" onClick={reloadPage}>
          <img src={logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-4 max-w-14 object-contain" />
          <div className="flex flex-col md:flex-row md:items-center min-w-0">
            <h1 className="text-base md:text-2xl font-semibold truncate">Crypto Charity</h1>
            <div className="inline-flex items-center justify-start px-2 py-0.5 mt-0.5 md:mt-0 md:ml-2 bg-red-700 rounded-md w-fit">
              <p className="text-[10px] md:text-xs font-medium text-white">OP Sepolia Testnet</p>
            </div>
          </div>
        </div>
        {showList && (
          <div className="flex justify-center md:flex-1">
            <ul className="flex-row items-center flex-initial hidden text-black list-none md:flex">
              {/* <li className="mx-4 my-2 text-lg text-black transition ease-in-out cursor-pointer hover:scale-105">
                {" "}
                <Link to="/">Home</Link>{" "}
              </li> */}

              <li className={`mx-4 cursor-pointer text-black my-2 text-lg hover:scale-105 transition ease-in-out`}>
                <Link to="/about">About</Link>
              </li>
              <li className="transition ease-in-out hover:scale-105">
                <a href="https://app.optimism.io/bridge" target={"_blank"} className="mx-4 my-2 text-lg text-black cursor-pointer">
                  Bridge
                </a>
              </li>
              <li className={`mx-4 cursor-pointer text-black my-2 text-lg hover:scale-105 transition ease-in-out`}>
                <Link to="/faq">FAQ</Link>
              </li>
              <li className={`mx-4 cursor-pointer text-black my-2 text-lg hover:scale-105 transition ease-in-out`}>
                <Link to="/faq">Contact Us</Link>
              </li>
            </ul>
          </div>
        )}
        <div className="flex justify-end md:flex-1">
          {!account ? (
            <div className="flex">
              <button
                type="button"
                onClick={() => setShowWallet(true)}
                className="mr-2 mb-2 hidden items-center rounded-2xl border border-blue-200/40 bg-gradient-to-r from-[#1849c6] to-[#2f67f2] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 md:inline-flex"
              >
                <FaWallet className="mr-2" />
                Connect
              </button>
            </div>
          ) : (
            <div className="items-center justify-center hidden md:inline-flex" onChange={(showWallet) => setShowWallet(false)}>
              {/* <NotificationDropdown /> */}
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
      {/* FOR MOBILE */}
      <div className="relative flex md:hidden">
        {!toggleMenu ? (
          <button onClick={() => setToggleMenu(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-white/80 text-[#1f49c6] shadow-sm">
            <HiMenuAlt4 fontSize={22} className="cursor-pointer md:hidden" />
          </button>
        ) : (
          ""
        )}
        {toggleMenu && (
          <ul className="fixed inset-0 z-[999] flex w-full min-h-[100dvh] flex-col overflow-y-auto bg-white/95 backdrop-blur-xl px-4 py-4 pb-6 text-black list-none md:hidden animate-slide-in">
            <li className="flex items-center justify-between px-1 py-2">
              <div className="flex items-center">
                <img src={logo} alt="logo" className="w-8 h-8 mr-2 object-contain" />
                <div className="flex flex-col leading-tight">
                  <h1 className="text-base font-semibold">Crypto Charity</h1>
                  <span className="inline-flex items-center px-2 py-0.5 mt-1 text-[10px] font-medium text-white bg-red-700 rounded-md w-fit">OP Sepolia Testnet</span>
                </div>
              </div>
              <AiOutlineClose onClick={() => setToggleMenu(false)} className="text-xl cursor-pointer text-gray-700" />
            </li>
            <li className="mt-3">
              <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
                <Link to="/" onClick={() => setToggleMenu(false)} className="block px-4 py-3 text-[15px] font-medium text-gray-800 hover:bg-blue-50">
                  Home
                </Link>
                <Link to="/about" onClick={() => setToggleMenu(false)} className="block px-4 py-3 text-[15px] font-medium text-gray-800 border-t border-gray-100 hover:bg-blue-50">
                  About
                </Link>
                <Link to="/faq" onClick={() => setToggleMenu(false)} className="block px-4 py-3 text-[15px] font-medium text-gray-800 border-t border-gray-100 hover:bg-blue-50">
                  FAQ
                </Link>
                <a href="https://app.optimism.io/bridge" target={"_blank"} rel="noreferrer" className="block px-4 py-3 text-[15px] font-medium text-gray-800 border-t border-gray-100 hover:bg-blue-50">
                  Bridge
                </a>
              </div>
            </li>
            {!account ? (
              <li
                onClick={() => {
                  setShowWallet(true);
                  setToggleMenu(false);
                }}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#1849c6] to-[#2f67f2] px-7 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                <FaWallet className="mr-2" />
                Connect
              </li>
            ) : (
              <li className="mt-6 items-center justify-center w-full text-black">
                <hr className="h-px my-4 bg-blue-100 border-0" />
                <div className="flex flex-col items-center justify-center gap-2 px-5">
                  <div className="flex w-full items-center rounded-xl border border-blue-100 bg-white px-3 py-2 font-medium text-[#2557D6] shadow-sm transition-colors hover:bg-[#2557D6] hover:text-white">
                    <FaWallet className="mr-2 text-lg" /> {shortenAddress(account)}
                  </div>
                  <div className="flex w-full items-center rounded-xl border border-blue-100 bg-white px-3 py-2 text-[#2557D6] shadow-sm transition-colors hover:bg-[#2557D6] hover:text-white">
                    {isOpSepolia ? <OpNetworkIcon className="mr-2 h-5 w-5" /> : <RiQuestionLine className="mr-2 text-lg text-yellow-500" />}
                    {networkName}
                  </div>
                  <div className="flex w-full cursor-pointer items-center rounded-xl border border-blue-100 bg-white px-3 py-2 text-[#2557D6] shadow-sm transition-colors hover:bg-[#2557D6] hover:text-white">
                    <SiEthereum className="mr-2 text-lg " />
                    <p>{formattedBalance ? `${formattedBalance} ETH` : "Loading balance..."}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/profile/${account}`);
                      setToggleMenu(false);
                    }}
                    className="flex w-full cursor-pointer items-center rounded-xl border border-blue-100 bg-white px-3 py-2 font-medium text-[#2557D6] shadow-sm transition-colors hover:bg-[#2557D6] hover:text-white"
                  >
                    <FaUserEdit className="mr-2 text-lg " />
                    Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setToggleMenu(false);
                      }}
                      className="flex w-full cursor-pointer items-center rounded-xl border border-blue-100 bg-white px-3 py-2 font-medium text-[#2557D6] shadow-sm transition-colors hover:bg-[#2557D6] hover:text-white"
                    >
                      <AiOutlineUserSwitch className="mr-2 text-lg" />
                      Admin Page
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deactivate();
                      setToggleMenu(false);
                    }}
                    className="flex w-full cursor-pointer items-center rounded-xl border border-red-100 bg-white px-3 py-2 font-medium text-[#c53131] shadow-sm transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <AiOutlineDisconnect className="mr-2 text-lg" />
                    Disconnect
                  </button>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>
      {isWrongNetwork && <WrongNetworkAlert isWrong={isWrongNetwork} setIsWrong={setIsWrongNetwork} />}
      <ConnectModal onClose={handleOnClose} visible={showWallet} />
    </nav>
  );
};

export default Navbar;
