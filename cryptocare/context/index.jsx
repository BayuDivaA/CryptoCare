import React, { useEffect, useContext, useState, createContext } from "react";
import { ethers } from "ethers";
import { useCall, useCalls } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { myContract, contractABICampaign } from "../src/smart_contract/constants";

const { ethereum } = window;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaignsTotal, setCampaignsTotal] = useState();
  const [campaignAddress, setCampaignAddress] = useState([]);
  const [campaigns, setCampaigns] = useState();

  function deployedCampaignAddress() {
    const { value, error } =
      useCall({
        contract: myContract,
        method: "getCampaigns",
        args: [],
      }) ?? {};

    if (error) {
      console.error(error.message);
      return undefined;
    }
    return value?.[0];
  }

  async function getCampaignDetail() {
    const data = deployedCampaignAddress();
    setCampaignAddress(data);

    const calls =
      campaignAddress?.map((address) => ({
        contract: new Contract(address, contractABICampaign),
        method: "campaignTitle",
        args: [],
      })) ?? [];

    const results = useCalls(calls) ?? [];

    results.forEach((result, idx) => {
      if (result && result.error) {
        console.error(`Error encountered calling 'totalSupply' on ${calls[idx]?.contract.address}: ${result.error.message}`);
      }
    });
    console.log(results.map((result) => result?.value?.[0]));
    return results.map((result) => result?.value?.[0]);
  }

  return (
    <StateContext.Provider
      value={{
        getCampaignDetail,
        myContract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
