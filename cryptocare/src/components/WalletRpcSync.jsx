import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import {
  OPTIMISM_SEPOLIA_CHAIN_ID,
  OPTIMISM_SEPOLIA_RPC_URL,
  OPTIMISM_SEPOLIA_EXPLORER,
} from "../smart_contract/network";

const SESSION_KEY = "wallet-rpc-sync:op-sepolia";

export default function WalletRpcSync() {
  const { account, chainId } = useEthers();
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!account || chainId !== OPTIMISM_SEPOLIA_CHAIN_ID) return;
    if (isSyncing.current) return;

    const alreadySynced = sessionStorage.getItem(SESSION_KEY) === "done";
    if (alreadySynced) return;

    const ethereum = window?.ethereum;
    if (!ethereum?.request) return;

    isSyncing.current = true;
    (async () => {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${OPTIMISM_SEPOLIA_CHAIN_ID.toString(16)}`,
              chainName: "Optimism Sepolia",
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [OPTIMISM_SEPOLIA_RPC_URL],
              blockExplorerUrls: [OPTIMISM_SEPOLIA_EXPLORER],
            },
          ],
        });
        sessionStorage.setItem(SESSION_KEY, "done");
      } catch (_err) {
        // ignore rejection; app can still continue with existing wallet RPC settings
      } finally {
        isSyncing.current = false;
      }
    })();
  }, [account, chainId]);

  return null;
}
