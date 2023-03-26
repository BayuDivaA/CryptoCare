import React, { useState } from "react";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";

export default function UserUnverificationButton({ userAddress, myContract }) {
  const { state, send } = useContractFunction(myContract, "setAddressUnverified", { transactionName: "Unverified User" });
  const [isLoading, setIsLoading] = useState(false);
  const { status } = state;

  async function unverificationUserHandle(e) {
    e.preventDefault();

    setIsLoading(true);
    await send(userAddress);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading ? (
        <div className="mt-4 flex justify-center">
          <img src={loader} alt="loader" className="w-7 h-7 object-contain" />
        </div>
      ) : (
        <button onClick={unverificationUserHandle} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Unverified
        </button>
      )}
    </>
  );
}
