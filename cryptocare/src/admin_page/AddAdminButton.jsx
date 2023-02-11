import React, { useState } from "react";
import { useContractFunction } from "@usedapp/core";
import loader from "../assets/loader_4.svg";

export default function AddAdminButton({ userAddress, myContract }) {
  const { state, send } = useContractFunction(myContract, "setToAdmin", { transactionName: "Add New Admin" });
  const { status } = state;
  const [isLoading, setIsLoading] = useState(false);

  async function addAdmin(e) {
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
        <button onClick={addAdmin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Add Admin
        </button>
      )}
    </>
  );
}
