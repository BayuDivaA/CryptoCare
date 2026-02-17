import React, { useState, useEffect } from "react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

function AcceptButton({ address, status: campaignStatus }) {
  const [isLoading, setIsLoading] = useState(false);
  const myContract = new Contract(address || "0x0000000000000000000000000000000000000000", contractABICampaign);
  const { state, send } = useContractFunction(myContract, "accCampaign", { transactionName: "Accept Campaign" });
  const { status: txStatus } = state;
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(txStatus);
    if (txStatus === "PendingSignature") {
      setIsLoading(true);
      mining.current = toast.loading("Waiting for Signature", { autoClose: false, theme: "colored" });
    } else if (txStatus === "Mining") {
      setIsLoading(true);
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, theme: "colored" });
    } else if (txStatus === "Exception") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (txStatus === "Success") {
      setIsLoading(false);
      toast.update(mining.current, { render: "New Campaign Has been Published", type: "success", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else if (txStatus === "Fail") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Error Accept Campaign.", type: "error", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else {
      setIsLoading(false);
    }
  }, [txStatus]);

  const accCampaignHandle = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error("Campaign address invalid.");
      return;
    }
    send();
  };

  if (campaignStatus !== 0) {
    return (
      <button disabled className="bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-tr-[16px] cursor-not-allowed">
        Accept
      </button>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <img src={loader} alt="loader" className="w-7 h-7 object-contain" />
        </div>
      ) : (
        <button onClick={accCampaignHandle} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-tr-[16px]">
          Accept
        </button>
      )}
    </>
  );
}

export default AcceptButton;
