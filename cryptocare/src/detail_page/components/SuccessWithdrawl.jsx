import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { formatEther } from "ethers/lib/utils";
import { shortenAddress } from "../../utils/shortenAddress";

export default function SuccessWithdrawl({ value, transactions, recipient }) {
  const [successAlert, setSuccessAlert] = useState(true);
  function dissmissAlert() {
    setSuccessAlert(false);
  }
  return (
    <>
      {successAlert && (
        <div className="flex flex-col fixed jusctify-center top-0 right-0 m-5">
          <div id="alert-additional-content-3" className="p-4 mb-4 text-green-700 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
            <div className="flex items-center">
              <FaCheckCircle className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-medium">Withdrawl Success</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
              You have successfully send {value && formatEther(value)} Ether to {shortenAddress(recipient)}.
            </div>
            <div className="flex">
              <a href={"https://goerli-optimism.etherscan.io/tx/" + transactions?.hash} target="_blank">
                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  <svg aria-hidden="true" className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  View Transaction
                </button>
              </a>
              <button type="button" onClick={dissmissAlert} className="text-green-700 bg-transparent border border-green-700 hover:bg-green-800 hover:text-white font-medium rounded-lg text-xs px-3 py-1.5 text-center">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
