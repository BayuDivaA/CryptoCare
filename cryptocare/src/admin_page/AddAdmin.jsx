import React, { useState } from "react";
import { myContract } from "../smart_contract/constants";
import { checkIfAdmin } from "../smart_contract/SmartcontractInteract";
import AddAdminButton from "./AddAdminButton";
import DeleteAdminButton from "./DeleteAdminButton";

export default function AddAdmin() {
  const [userAddress, setUserAddress] = useState("");
  const isAddressAdmin = checkIfAdmin(userAddress);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-lg">
          <form className="admin-glassmorphism shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
            <h1 className="flex font-bold text-xl p-4 text-blue-gray-900 justify-center">Add Admin</h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Input Address
              </label>
              {isAddressAdmin !== undefined && (
                <div className={`mb-2 text-sm ${isAddressAdmin ? "text-blue-600" : "text-red-900 "} text-center `} role="alertz">
                  <span className="font-medium">{isAddressAdmin ? "Is Admin" : "Not Admin"}</span>
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

            <div className="flex items-center justify-end">
              {isAddressAdmin !== undefined && (isAddressAdmin ? <DeleteAdminButton myContract={myContract} userAddress={userAddress} /> : <AddAdminButton myContract={myContract} userAddress={userAddress} />)}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
