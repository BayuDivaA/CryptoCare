import React, { useEffect, useMemo, useState } from "react";
import { SiEthereum } from "react-icons/si";
import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@ethersproject/providers";
import { OPTIMISM_SEPOLIA_RPC_URL } from "../../smart_contract/network";
const BALANCE_POLL_INTERVAL_MS = 30000;

function toWeiFromEthString(value) {
  try {
    if (value === undefined || value === null || value === "") return BigNumber.from(0);
    return parseEther(String(value));
  } catch (_err) {
    return BigNumber.from(0);
  }
}

function formatEth(valueWei) {
  const asEth = Number(formatEther(valueWei));
  return Number.isFinite(asEth) ? asEth.toFixed(4) : "0.0000";
}

export default function CampaignAmount({ collectedFunds, caddress }) {
  const [currentBalanceWei, setCurrentBalanceWei] = useState(BigNumber.from(0));
  const collectedWei = useMemo(() => toWeiFromEthString(collectedFunds), [collectedFunds]);
  const usedWei = collectedWei.gt(currentBalanceWei) ? collectedWei.sub(currentBalanceWei) : BigNumber.from(0);

  useEffect(() => {
    let mounted = true;
    const provider = new JsonRpcProvider(OPTIMISM_SEPOLIA_RPC_URL);

    async function readBalance() {
      if (!caddress) return;
      try {
        const balance = await provider.getBalance(caddress);
        if (mounted) {
          setCurrentBalanceWei(balance);
        }
      } catch (_err) {
        // Keep last successful value if RPC fails temporarily.
      }
    }

    readBalance();
    const timer = setInterval(readBalance, BALANCE_POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [caddress]);

  return (
    <div className="rounded-md flex-col bg-white shadow-xl px-5 py-4">
      <div className=" font-semibold mb-2">Campaign Funds</div>
      <div className="bg-blue-gray-50 rounded-md py-2 px-4">
        <div className="flex flex-row justify-between items-center ">
          <span className="">Collected</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />
            {formatEth(collectedWei)}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mt-2 ">
          <span className="">Used</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />
            {formatEth(usedWei)}
          </div>
        </div>
        <hr className="h-px my-2 bg-blue-900 border-0"></hr>
        <div className="flex flex-row justify-between  items-center mt-2 ">
          <span className="">Amount</span>
          <div className="flex items-center text-purple-900">
            <SiEthereum className="mr-2" />
            {formatEth(currentBalanceWei)}
          </div>
        </div>
      </div>
    </div>
  );
}
