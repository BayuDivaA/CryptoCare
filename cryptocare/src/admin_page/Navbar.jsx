import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEthers, OptimismGoerli, useEtherBalance, shortenAddress } from "@usedapp/core";
import { RiShutDownFill, RiShutDownLine } from "react-icons/ri";
import ConnectModal from "../homepage/component/WalletConnectModal";
import logout from "../../images/logout.svg";

function SplitIconButton({ onClick, label, icon }) {
  return (
    <Fragment>
      <button onClick={onClick} className="inline-flex items-center justify-center px-4 py-1 rounded-md text-base font-medium text-white ">
        {label}
      </button>
      <button onClick={onClick} className="inline-flex items-center justify-center ml-2 p-2 rounded-md text-white hover:text-indigo-100 bg-indigo-300">
        {icon}
      </button>
    </Fragment>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const { account, deactivate } = useEthers();
  const [showWallet, setShowWallet] = useState(false);

  function handleOnClose() {
    setShowWallet(false);
  }

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse justify-end mb-[35px] gap-6 relative">
        <div className="md:inline-flex hidden flex-row justify-end items-center drop-shadow-xl ">
          {!account ? (
            <button
              type="button"
              className="bg-[#7d37ec] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[35px] px-4 rounded-[10px] "
              onClick={() => {
                setShowWallet(true);
              }}
            >
              Connect
            </button>
          ) : (
            <SplitIconButton onClick={() => deactivate()} label={shortenAddress(account)} icon={<RiShutDownLine className="h-5 w-5" aria-hidden="true" />} />
          )}
        </div>
      </div>
      <ConnectModal onClose={handleOnClose} visible={showWallet} />
    </>
  );
};

export default Navbar;
