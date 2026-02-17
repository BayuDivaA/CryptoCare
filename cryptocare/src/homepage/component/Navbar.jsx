import React, { useState, useEffect } from "react";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineDisconnect, AiOutlineUserSwitch } from "react-icons/ai";
import { FaWallet, FaUserEdit } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";

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

const Navbar = ({ showList }) => {
  const { account, chainId, deactivate } = useEthers();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const etherBalance = useEtherBalance(account);
  const isAdmin = checkIfAdmin(account);

  function handleOnClose() {
    setShowWallet(false);
  }

  useEffect(() => {
    if (account && chainId && chainId !== OPTIMISM_SEPOLIA_CHAIN_ID) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [account, chainId]);

  const navigate = useNavigate();
  const reloadPage = () => {
    navigate("/");
  };

  return (
    // Akan melakukan md selama ukuran layar besar dari 768px
    <nav className="flex p-4 mx-4">
      <div className="flex justify-center w-full">
        <div className="flex items-center flex-1 cursor-pointer" onClick={reloadPage}>
          <img src={logo} alt="logo" className="w-10 mr-4 max-w-14" />
          <h1 className="text-2xl font-semibold">Crypto Charity</h1>
          <div className="flex items-start justify-start px-2 py-1 ml-2 bg-red-700 rounded-md">
            <p className="text-xs font-thin text-white ">on Testnet</p>
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
              <button type="button" onClick={() => setShowWallet(true)} className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 hidden font-medium rounded-lg text-sm px-5 py-2.5 text-center md:inline-flex items-center mr-2 mb-2">
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
        {/* <NotificationDropdown /> */}
        {!toggleMenu ? <HiMenuAlt4 fontSize={28} className="text-black cursor-pointer md:hidden" onClick={() => setToggleMenu(true)} /> : ""}
        {toggleMenu && (
          <ul className="fixed top-0 flex flex-col items-center justify-start w-screen h-screen py-2 text-black list-none bg-white rounded-md z-1 -right-2 md:hidden bg-opacity-20 backdrop-blur-md animate-slide-in">
            <li className="flex justify-between w-full px-8 my-2 text-xl">
              <div className="flex items-center flex-initial">
                <img src={logo} alt="logo" className="w-10 mr-4 cursor-pointer" />
                <h1 className="text-2xl font-bold">Crypto Charity</h1>
              </div>
              <AiOutlineClose onClick={() => setToggleMenu(false)} className="font-bold cursor-pointer" />
            </li>
            <li className="mx-4 my-2 text-lg text-black cursor-pointer">
              {" "}
              <Link to="/">Home</Link>{" "}
            </li>
            <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>Tutorials</li>
            <li>
              <a href="https://app.optimism.io/bridge" target={"_blank"} className="mx-4 my-2 text-lg text-black cursor-pointer">
                Bridge
              </a>
            </li>
            <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>
              <Link to="/about">About</Link>
            </li>
            {!account ? (
              <li onClick={() => setShowWallet(true)} className=" text-white font-bold bg-[#2557D6] py-2 px-7 mt-5 rounded-lg cursor-pointer hover:bg-[#2546bd] justify-center items-center inline-flex w-2/4">
                <FaWallet className="mr-2" />
                Connect
              </li>
            ) : (
              <li className="items-center justify-center w-full text-black">
                <hr className="h-px my-8 bg-black border-0" />
                <div className="flex flex-col items-center justify-center gap-2 px-5">
                  <div className="flex  items-center cursor-pointer text-[#2557D6] hover:bg-[#2557D6] hover:text-white rounded-md py-1 px-2 w-full">
                    <FaWallet className="mr-2 text-lg" /> {shortenAddress(account)}
                  </div>
                  <div className="flex  cursor-pointer text-[#2557D6] hover:bg-[#2557D6] hover:text-white rounded-md py-1 px-2 w-full">
                    <SiEthereum className="mr-2 text-lg " />
                    {etherBalance && <p>{formatEther(etherBalance)}</p>}
                  </div>
                  <button onClick={() => navigate(`/profile/${account}`)} className="flex  cursor-pointer text-[#2557D6] hover:bg-[#2557D6] hover:text-white rounded-md py-1 px-2 w-full">
                    <FaUserEdit className="mr-2 text-lg " />
                    Profile
                  </button>
                  {isAdmin && (
                    <button onClick={() => navigate("/admin")} className="flex  cursor-pointer text-[#2557D6] hover:bg-[#2557D6] hover:text-white rounded-md py-1 px-2 w-full">
                      <AiOutlineUserSwitch className="mr-2 text-lg" />
                      Admin Page
                    </button>
                  )}
                  <button onClick={deactivate} className="flex cursor-pointer text-[#c53131] hover:bg-[#2557D6] hover:text-white rounded-md py-1 px-2 w-full">
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
