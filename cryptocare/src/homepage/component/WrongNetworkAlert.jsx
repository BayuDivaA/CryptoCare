import React, { useState, useEffect } from "react";
import { useEthers } from "@usedapp/core";
import { OPTIMISM_SEPOLIA_CHAIN_ID } from "../../smart_contract/network";

export default function WrongNetworkAlert({ isWrong, setIsWrong }) {
  const [isLoading, setIsLoading] = useState(true);
  const { chainId, switchNetwork } = useEthers();

  useEffect(() => {
    if (isWrong) {
      handleOnChange();
    } else {
      setIsWrong(false);
      setIsLoading(false);
    }
  }, [chainId]);

  const handleOnChange = async () => {
    setIsLoading(true);
    await switchNetwork(OPTIMISM_SEPOLIA_CHAIN_ID);
    if (chainId == OPTIMISM_SEPOLIA_CHAIN_ID) {
      setIsLoading(false);
    }
    setIsWrong(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-md justify-center items-center py-5 px-7 max-w-sm">
        <div className="flex justify-center items-center">
          <svg aria-hidden="true" className="flex-shrink-0 w-10 h-10 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <div className="ml-3 text-sm font-medium text-red-700">
            Network does not match! Please change your network wallet to <span className="font-bold">Optimism Sepolia!</span>
          </div>
        </div>
        <div className="items-center mt-2">
          {!isLoading && (
            <div className="flex justify-center">
              <button onClick={handleOnChange} className="hover:text-blue-300">
                Click Here to Change
              </button>
            </div>
          )}
          {isLoading && (
            <>
              <p className="flex justify-center text-xs font-thin">Please click "Switch Network"</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
