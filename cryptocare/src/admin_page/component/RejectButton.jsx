import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

function RejectButton({ address }) {
  const [isLoading, setIsLoading] = useState(false);
  const myContract = new Contract(address, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "rejectCampaign", { transactionName: "Reject Campaign" });
  const { status } = state;
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, theme: "colored" });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false, theme: "colored" });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "Campaign Rejected", type: "success", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else if (status === "Fail") {
      toast.update(mining.current, { render: "Error Reject Campaign.", type: "error", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else {
    }
  }, [state]);

  const rejectCampaignHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    send();
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <img src={loader} alt="loader" className="w-7 h-7 object-contain" />
        </div>
      ) : (
        <button onClick={rejectCampaignHandle} className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4`}>
          Reject
        </button>
      )}
    </>
  );
}

export default RejectButton;
