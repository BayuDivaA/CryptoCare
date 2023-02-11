import { useCalls, useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { myContract, contractABICampaign } from "./constants";
import { formatEther, parseEther } from "@ethersproject/units";

// GET ALL CAMPAIGN ADDRESS
export function getAddresses() {
  const { value } =
    useCall({
      contract: myContract,
      method: "getCampaigns",
      args: [],
    }) ?? {};
  return value?.[0];
}

// GET DETAIL FROM A CAMPAIGN ADDRESS
export function getSpecificCampaignDetail(address) {
  const { value } =
    useCall({
      contract: new Contract(address, contractABICampaign),
      method: "getCampaign",
      args: [],
    }) ?? {};
  return value;
}

// GET ALL CAMPAIGN DETAIL (12)
export function getDetail() {
  const addresses = getAddresses();

  const calls =
    addresses?.map((address) => ({
      contract: new Contract(address, contractABICampaign),
      method: "getCampaign",
      args: [],
    })) ?? [];
  const results = useCalls(calls) ?? [];

  return results;
}

// FETCH DATA FROM CAMPAIGN DETAIL ^
export function fetchCampaign(data) {
  const parsedCampaigns = data?.map((result, id) => ({
    daftar: id,
    title: result?.value?.[0],
    url: result?.value?.[1],
    story: result?.value?.[2],
    timestamp: (result?.value?.[3]).toNumber(),
    collectedFunds: formatEther((result?.value?.[4]).toString()),
    creator: result?.value?.[5],
    type: (result?.value?.[6]).toNumber(),
    category: result?.value?.[7],
    target: formatEther((result?.value?.[8]).toString()),
    donatursCount: (result?.value?.[9]).toNumber(),
    duration: (result?.value?.[10]).toNumber(),
    active: result?.value?.[11],
  }));

  return parsedCampaigns;
}

// FETCH DATA FROM CAMPAIGN DETAIL ^
export function fetchCampaignDetail(data) {
  const parsedSingleCampaigns = {
    title: data?.[0],
    url: data?.[1],
    story: data?.[2],
    timestamp: (data?.[3]).toNumber(),
    collectedFunds: formatEther((data?.[4]).toString()),
    creator: data?.[5],
    type: (data?.[6]).toNumber(),
    category: data?.[7],
    target: formatEther((data?.[8]).toString()),
    donatursCount: (data?.[9]).toNumber(),
    duration: (data?.[10]).toNumber(),
    active: data?.[11],
  };

  return parsedSingleCampaigns;
}

// CHECK ADDRESS VERIFIED
export function checkAddress(acc) {
  const { value, error } =
    useCall(
      acc && {
        contract: myContract,
        method: "getAddress",
        args: [acc],
      }
    ) ?? {};

  return value?.[0];
}
export function checkIfAdmin(acc) {
  const { value, error } =
    useCall(
      acc && {
        contract: myContract,
        method: "admin",
        args: [acc],
      }
    ) ?? {};

  return value?.[0];
}

// GET CAMPAIGN REQUEST LIST
export function getCampaignRequeset(address) {
  const { value } =
    useCall({
      contract: new Contract(address, contractABICampaign),
      method: "getRequestWithdrawl",
      args: [],
    }) ?? {};
  return value;
}

export function checkAddressVoted(campaign, user, request) {
  const { value } =
    useCall({
      contract: new Contract(campaign, contractABICampaign),
      method: "approvals",
      args: [user, request],
    }) ?? {};

  return value?.[0];
}

export function checkIfVoter(campaign, user) {
  const { value } =
    useCall({
      contract: new Contract(campaign, contractABICampaign),
      method: "voter",
      args: [user],
    }) ?? {};

  return value?.[0];
}

export function checkIfDonor(campaign, user) {
  const { value } =
    useCall({
      contract: new Contract(campaign, contractABICampaign),
      method: "donors",
      args: [user],
    }) ?? {};

  return value?.[0];
}

export function voterCount(campaign) {
  const { value } =
    useCall({
      contract: new Contract(campaign, contractABICampaign),
      method: "voterCount",
      args: [],
    }) ?? {};

  return value?.[0];
}

export function getAnotherDetail(campaignAddress) {
  const { value } =
    useCall({
      contract: new Contract(campaignAddress, contractABICampaign),
      method: "getDetailed",
      args: [],
    }) ?? {};

  return value;
}

export function fetchAnotherDetail(data) {
  const parsedAnotherDetail = {
    voterCount: (data?.[0]).toNumber(),
    campaignReport: (data?.[1]).toNumber(),
    contributors: data?.[2],
    donations: data?.[3],
    minimContribution: formatEther((data?.[4]).toString()),
  };

  return parsedAnotherDetail;
}

export function getUserDonateValue(userAddress) {
  const addresses = getAddresses();

  const calls =
    addresses?.map((address) => ({
      contract: new Contract(address, contractABICampaign),
      method: "donatedValue",
      args: [userAddress],
    })) ?? [];
  const results = useCalls(calls) ?? [];

  return results;
}

export function getSingleUserDonateValue(campaignAddress, userAddress) {
  const { value } =
    useCall({
      contract: new Contract(campaignAddress, contractABICampaign),
      method: "donatedValue",
      args: [userAddress],
    }) ?? {};

  return value?.[0];
}

export function getUsername(userAddress) {
  const { value } =
    useCall({
      contract: myContract,
      method: "userName",
      args: [userAddress],
    }) ?? {};

  return value?.[0];
}

export function getPhotoUrl(userAddress) {
  const { value } =
    useCall({
      contract: myContract,
      method: "photoUrl",
      args: [userAddress],
    }) ?? {};

  return value?.[0];
}

export function checkIfReported(campaign, user) {
  const { value } =
    useCall({
      contract: new Contract(campaign, contractABICampaign),
      method: "reported",
      args: [user],
    }) ?? {};

  return value?.[0];
}
