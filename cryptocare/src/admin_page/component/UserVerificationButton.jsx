import React, { useEffect, useRef } from "react";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

export default function UserVerificationButton({ userAddress, myContract }) {
  const { state, send } = useContractFunction(myContract, "setAddressVerified", { transactionName: "Verified User" });
  const mining = useRef(null);
  const { status } = state;

  useEffect(() => {
    if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, autoClose: false });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "User verified successfully", type: "success", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "Exception" || status === "Fail") {
      toast.update(mining.current, { render: "Verify user failed", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "None" && mining.current) {
      mining.current = null;
    }
  }, [status]);

  function verificationUserHandle(e) {
    e.preventDefault();
    send(userAddress);
  }

  return (
    <>
      {status === "PendingSignature" || status === "Mining" ? (
        <div className="mt-4 flex justify-center">
          <img src={loader} alt="loader" className="w-7 h-7 object-contain" />
        </div>
      ) : (
        <button onClick={verificationUserHandle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Verified
        </button>
      )}
    </>
  );
}
