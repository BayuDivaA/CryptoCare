import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { createThirdwebClient, getContract, readContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { contractABICampaign, contractABI, contractAddress } from "./constants";
import {
  OPTIMISM_SEPOLIA_CHAIN_ID,
  OPTIMISM_SEPOLIA_RPC_URL,
} from "./network";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "local-dev-client",
});

const chain = defineChain({
  id: OPTIMISM_SEPOLIA_CHAIN_ID,
  rpc: OPTIMISM_SEPOLIA_RPC_URL,
});

const factoryContract = getContract({
  client,
  chain,
  address: contractAddress,
  abi: contractABI,
});

function normalizeValue(value) {
  if (typeof value === "bigint") {
    return BigNumber.from(value.toString());
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, normalizeValue(inner)])
    );
  }

  return value;
}

function useThirdwebRead(contract, method, params = [], enabled = true) {
  const [value, setValue] = useState();

  const paramsKey = useMemo(() => {
    try {
      return JSON.stringify(params ?? []);
    } catch (_err) {
      return String(params ?? "");
    }
  }, [params]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!enabled || !contract) {
        if (mounted) setValue(undefined);
        return;
      }

      try {
        const result = await readContract({
          contract,
          method,
          params: params ?? [],
        });

        if (mounted) {
          setValue(normalizeValue(result));
        }
      } catch (_err) {
        if (mounted) {
          setValue(undefined);
        }
      }
    }

    load();
    const timer = setInterval(load, 10000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [contract, method, enabled, paramsKey]);

  return value;
}

function useThirdwebBatchRead(calls = []) {
  const [results, setResults] = useState([]);

  const callsKey = useMemo(() => {
    try {
      return JSON.stringify(
        calls.map((c) => ({
          address: c?.contract?.address,
          method: c?.method,
          params: c?.params ?? [],
        }))
      );
    } catch (_err) {
      return String(calls?.length ?? 0);
    }
  }, [calls]);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      if (!calls?.length) {
        if (mounted) setResults([]);
        return;
      }

      const data = await Promise.all(
        calls.map(async ({ contract, method, params }) => {
          try {
            const value = await readContract({
              contract,
              method,
              params: params ?? [],
            });
            return { value: normalizeValue(value) };
          } catch (_err) {
            return { value: undefined, error: true };
          }
        })
      );

      if (mounted) {
        setResults(data);
      }
    }

    loadAll();
    const timer = setInterval(loadAll, 10000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [callsKey]);

  return results;
}

function getCampaignContract(address) {
  return getContract({
    client,
    chain,
    address,
    abi: contractABICampaign,
  });
}

function toSafeNumber(value) {
  if (!value) return 0;
  if (BigNumber.isBigNumber(value)) return value.toNumber();
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return Number(value) || 0;
}

function toSafeEther(value) {
  if (!value) return "0.0";
  return formatEther(value.toString());
}

// GET ALL CAMPAIGN ADDRESS
export function getAddresses() {
  return useThirdwebRead(factoryContract, "function getCampaigns() view returns (address[])");
}

// GET ALL CAMPAIGN DETAIL (12)
export function getDetail() {
  const addresses = getAddresses();

  const calls =
    addresses?.map((address) => ({
      contract: getCampaignContract(address),
      method:
        "function getCampaign() view returns (string,string,string[],uint256,uint256,address,uint256,string,uint256,uint256,uint256,uint256)",
      params: [],
    })) ?? [];
  const results = useThirdwebBatchRead(calls) ?? [];

  return results;
}

// FETCH DATA FROM ALL CAMPAIGN DETAIL ^ (12)
export function fetchCampaign(data) {
  const parsedCampaigns = data
    ?.map((result, id) => ({
      daftar: id,
      title: result?.value?.[0],
      url: result?.value?.[1],
      story: result?.value?.[2],
      timestamp: toSafeNumber(result?.value?.[3]),
      collectedFunds: toSafeEther(result?.value?.[4]),
      creator: result?.value?.[5],
      type: toSafeNumber(result?.value?.[6]),
      category: result?.value?.[7],
      target: toSafeEther(result?.value?.[8]),
      donatursCount: toSafeNumber(result?.value?.[9]),
      duration: toSafeNumber(result?.value?.[10]),
      status: toSafeNumber(result?.value?.[11]),
    }))
    .filter((campaign) => campaign.title && campaign.creator);

  return parsedCampaigns;
}

// GET DETAIL FROM A CAMPAIGN ADDRESS (one)
export function getSpecificCampaignDetail(address) {
  const campaignContract = useMemo(
    () => (address ? getCampaignContract(address) : undefined),
    [address]
  );
  return useThirdwebRead(
    campaignContract,
    "function getCampaign() view returns (string,string,string[],uint256,uint256,address,uint256,string,uint256,uint256,uint256,uint256)",
    [],
    Boolean(address)
  );
}

// FETCH DATA FROM A CAMPAIGN DETAIL ^ (one)
export function fetchCampaignDetail(data) {
  const parsedSingleCampaigns = {
    title: data?.[0],
    url: data?.[1],
    story: data?.[2],
    timestamp: toSafeNumber(data?.[3]),
    collectedFunds: toSafeEther(data?.[4]),
    creator: data?.[5],
    type: toSafeNumber(data?.[6]),
    category: data?.[7],
    target: toSafeEther(data?.[8]),
    donatursCount: toSafeNumber(data?.[9]),
    duration: toSafeNumber(data?.[10]),
    status: toSafeNumber(data?.[11]),
  };

  return parsedSingleCampaigns;
}

// GET ANOTHER DETAIL FROM A CAMPAIGN ADDRESS (one)
export function getAnotherDetail(campaignAddress) {
  const campaignContract = useMemo(
    () => (campaignAddress ? getCampaignContract(campaignAddress) : undefined),
    [campaignAddress]
  );

  return useThirdwebRead(
    campaignContract,
    "function getDetailed() view returns (uint256,uint256,address[],uint256[],uint256,uint256[])",
    [],
    Boolean(campaignAddress)
  );
}

// FETCH ANOTHER DETAIL FROM CAMPAIGN ADDRESS (one)
export function fetchAnotherDetail(data) {
  const parsedAnotherDetail = {
    voterCount: toSafeNumber(data?.[0]),
    campaignReport: toSafeNumber(data?.[1]),
    contributors: data?.[2] || [],
    donations: data?.[3] || [],
    minimContribution: toSafeEther(data?.[4]),
    donateTime: data?.[5] || [],
    validation: data?.[6] || [],
  };
  return parsedAnotherDetail;
}

// CHECK ADDRESS VERIFIED
export function checkAddress(acc) {
  return useThirdwebRead(
    factoryContract,
    "function getAddress(address) view returns (bool)",
    [acc],
    Boolean(acc)
  );
}
export function checkIfAdmin(acc) {
  return useThirdwebRead(
    factoryContract,
    "function admin(address) view returns (bool)",
    [acc],
    Boolean(acc)
  );
}

// GET CAMPAIGN REQUEST LIST
export function getCampaignRequeset(address) {
  const campaignContract = useMemo(
    () => (address ? getCampaignContract(address) : undefined),
    [address]
  );
  return useThirdwebRead(
    campaignContract,
    "function getRequestWithdrawl() view returns ((string,uint256,address,bool,uint256,uint256,uint256)[])",
    [],
    Boolean(address)
  );
}

export function checkAddressVoted(campaign, user, request) {
  const campaignContract = useMemo(
    () => (campaign ? getCampaignContract(campaign) : undefined),
    [campaign]
  );
  return useThirdwebRead(
    campaignContract,
    "function approvals(address,uint256) view returns (bool)",
    [user, request],
    Boolean(campaign && user && request !== undefined)
  );
}

export function checkIfVoter(campaign, user) {
  const campaignContract = useMemo(
    () => (campaign ? getCampaignContract(campaign) : undefined),
    [campaign]
  );
  return useThirdwebRead(
    campaignContract,
    "function voter(address) view returns (bool)",
    [user],
    Boolean(campaign && user)
  );
}

export function checkIfDonor(campaign, user) {
  const campaignContract = useMemo(
    () => (campaign ? getCampaignContract(campaign) : undefined),
    [campaign]
  );
  return useThirdwebRead(
    campaignContract,
    "function donors(address) view returns (bool)",
    [user],
    Boolean(campaign && user)
  );
}

export function voterCount(campaign) {
  const campaignContract = useMemo(
    () => (campaign ? getCampaignContract(campaign) : undefined),
    [campaign]
  );
  return useThirdwebRead(
    campaignContract,
    "function voterCount() view returns (uint256)",
    [],
    Boolean(campaign)
  );
}

export function getUserDonateValue(userAddress) {
  const addresses = getAddresses();

  const calls =
    addresses?.map((address) => ({
      contract: getCampaignContract(address),
      method: "function donatedValue(address) view returns (uint256)",
      params: [userAddress],
    })) ?? [];
  const results = useThirdwebBatchRead(calls) ?? [];

  return results;
}

export function getSingleUserDonateValue(campaignAddress, userAddress) {
  const campaignContract = useMemo(
    () => (campaignAddress ? getCampaignContract(campaignAddress) : undefined),
    [campaignAddress]
  );
  return useThirdwebRead(
    campaignContract,
    "function donatedValue(address) view returns (uint256)",
    [userAddress],
    Boolean(campaignAddress && userAddress)
  );
}

export function getUsername(userAddress) {
  return useThirdwebRead(
    factoryContract,
    "function userName(address) view returns (string)",
    [userAddress],
    Boolean(userAddress)
  );
}

export function getPhotoUrl(userAddress) {
  return useThirdwebRead(
    factoryContract,
    "function photoUrl(address) view returns (string)",
    [userAddress],
    Boolean(userAddress)
  );
}

export function checkIfReported(campaign, user) {
  const campaignContract = useMemo(
    () => (campaign ? getCampaignContract(campaign) : undefined),
    [campaign]
  );
  return useThirdwebRead(
    campaignContract,
    "function reported(address) view returns (bool)",
    [user],
    Boolean(campaign && user)
  );
}
