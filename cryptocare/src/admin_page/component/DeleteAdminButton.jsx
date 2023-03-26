import React, { useState, useEffect } from "react";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

export default function DeleteAdminButton({ userAddress, myContract }) {
  const [isLoading, setIsLoading] = useState(false);
  const { state, send } = useContractFunction(myContract, "deleteAdmin", { transactionName: "Delete Admin" });
  const { status } = state;

  async function deleteAdmin(e) {
    e.preventDefault();

    setIsLoading(true);
    await send(userAddress);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading ? (
        <div className="mt-4 felx justify-center">
          <img src={loader} alt="Loader" className="w-7 h-7 onject-contain" />
        </div>
      ) : (
        <button onClick={deleteAdmin} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Delete Admin
        </button>
      )}
    </>
  );
}
