import React, { useEffect, useRef, useState } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { toast, Flip } from "react-toastify";
import { myContract } from "../smart_contract/constants";
import { checkAddress, checkIfAdmin } from "../smart_contract/SmartcontractInteract";
import UserUnverificationButton from "./component/UserUnverificationButton";
import UserVerificationButton from "./component/UserVerificationButton";

export default function UserVerification() {
  const { account } = useEthers();
  const [userAddress, setUserAddress] = useState("");
  const isVerified = checkAddress(userAddress);
  const isCurrentAdmin = checkIfAdmin(account);
  const mining = useRef(null);
  const { state: grantState, send: grantAdminSend } = useContractFunction(
    myContract,
    "setToAdmin",
    { transactionName: "Grant Admin to Self" }
  );

  useEffect(() => {
    if (grantState.status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (grantState.status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, autoClose: false });
    } else if (grantState.status === "Success") {
      toast.update(mining.current, { render: "Wallet berhasil dijadikan admin", type: "success", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (grantState.status === "Exception" || grantState.status === "Fail") {
      toast.update(mining.current, { render: "Gagal set wallet sebagai admin", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (grantState.status === "None" && mining.current) {
      mining.current = null;
    }
  }, [grantState.status]);

  function grantSelfAdminHandle(e) {
    e.preventDefault();
    if (!account) return;
    grantAdminSend(account);
  }

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-lg">
          <form className="admin-glassmorphism shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="flex font-bold text-xl p-4 text-blue-gray-900 justify-center">User Verification</h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Input Address
              </label>
              {isVerified !== undefined && (
                <div className={`mb-2 text-sm ${isVerified ? "text-blue-600" : "text-red-900 "} text-center `} role="alertz">
                  <span className="font-medium">{isVerified ? "User Verified" : "User Not Verified"}</span>
                </div>
              )}
              <input
                onChange={(e) => {
                  setUserAddress(e.target.value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                id="address"
                type="text"
                placeholder="0x000"
              />
            </div>
            {isCurrentAdmin === false && (
              <div className="mb-4 text-center">
                <p className="text-sm text-red-900 mb-2">
                  Wallet ini belum terdaftar sebagai admin pada kontrak saat ini.
                </p>
                <button
                  onClick={grantSelfAdminHandle}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                >
                  {grantState.status === "Mining" ||
                  grantState.status === "PendingSignature"
                    ? "Granting Admin..."
                    : "Set Wallet Ini Jadi Admin"}
                </button>
              </div>
            )}
            <div className="flex items-center justify-end">
              {isCurrentAdmin &&
                isVerified !== undefined &&
                (isVerified ? (
                  <UserUnverificationButton
                    myContract={myContract}
                    userAddress={userAddress}
                  />
                ) : (
                  <UserVerificationButton
                    myContract={myContract}
                    userAddress={userAddress}
                  />
                ))}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
