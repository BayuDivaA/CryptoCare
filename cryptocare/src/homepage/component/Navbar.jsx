import React, { useState, useContext, useEffect } from "react";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineDisconnect, AiOutlineUserSwitch } from "react-icons/ai";
import { FaWallet, FaUserEdit } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";

import { shortenAddress } from "../../utils/shortenAddress";

import { useEthers, OptimismGoerli, useEtherBalance } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { formatEther } from "@ethersproject/units";
import { checkIfAdmin } from "../../smart_contract/SmartcontractInteract";
import WrongNetworkAlert from "./WrongNetworkAlert";
import ConnectModal from "./WalletConnectModal";
import UserDropdown from "./UserDropdown";
import logo from "../../../images/LogoCC-black.png";

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
    if (chainId !== OptimismGoerli.chainId) {
      setIsWrongNetwork(true);
    }
  }, [chainId]);

  const navigate = useNavigate();
  const reloadPage = () => {
    navigate("/");
    // window.location.reload();
  };

  return (
    // Akan melakukan md selama ukuran layar besar dari 768px
    <nav className="flex justify-between items-center p-4 mx-4">
      <div className="items-center flex-initial cursor-pointer" onClick={reloadPage}>
        <img src={logo} alt="logo" className="w-40 " />
      </div>
      {showList && (
        <ul className="text-black md:flex flex-row hidden list-none items-center flex-initial">
          <li className="mx-4 cursor-pointer text-black my-2 text-lg"> Home </li>
          <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>Tutorials</li>
          <li>
            <a href="https://app.optimism.io/bridge" target={"_blank"} className="mx-4 cursor-pointer text-black my-2 text-lg">
              Bridge
            </a>
          </li>
          <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>Abouts</li>
        </ul>
      )}
      {!account ? (
        <div className="flex">
          <button type="button" onClick={() => setShowWallet(true)} className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 hidden font-medium rounded-lg text-sm px-5 py-2.5 text-center md:inline-flex items-center mr-2 mb-2">
            <FaWallet className="mr-2" />
            Connect
          </button>
        </div>
      ) : (
        <div className="md:inline-flex hidden" onChange={(showWallet) => setShowWallet(false)}>
          <UserDropdown />
        </div>
      )}
      {/* FOR MOBILE */}
      <div className="flex relative md:hidden">
        {!toggleMenu ? <HiMenuAlt4 fontSize={28} className="text-black md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} /> : ""}
        {toggleMenu && (
          <ul className="z-1 fixed top-0 -right-2 py-2 w-screen h-screen md:hidden list-none flex flex-col justify-start items-center rounded-md bg-white bg-opacity-20 backdrop-blur-md text-black animate-slide-in">
            <li className="text-xl w-full my-2 justify-between flex px-8">
              <div className="items-center flex-initial">
                <img src={logo} alt="logo" className="w-40 cursor-pointer" />
              </div>
              <AiOutlineClose onClick={() => setToggleMenu(false)} className="cursor-pointer font-bold" />
            </li>
            <li className="mx-4 cursor-pointer text-black my-2 text-lg"> Home </li>
            <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>Tutorials</li>
            <li>
              <a href="https://app.optimism.io/bridge" target={"_blank"} className="mx-4 cursor-pointer text-black my-2 text-lg">
                Bridge
              </a>
            </li>
            <li className={`mx-4 cursor-pointer text-black my-2 text-lg`}>Abouts</li>
            {!account ? (
              <li onClick={() => setShowWallet(true)} className=" text-white font-bold bg-[#2557D6] py-2 px-7 mt-5 rounded-lg cursor-pointer hover:bg-[#2546bd] justify-center items-center inline-flex w-2/4">
                <FaWallet className="mr-2" />
                Connect
              </li>
            ) : (
              <li className="text-black w-full justify-center items-center">
                <hr className="my-8 h-px bg-black border-0" />
                <div className="flex flex-col justify-center items-center gap-2 px-5">
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
