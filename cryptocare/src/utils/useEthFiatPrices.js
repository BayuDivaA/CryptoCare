import { useEffect, useMemo, useState } from "react";
import { useCoingeckoPrice } from "@usedapp/coingecko";

function toSafeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export default function useEthFiatPrices() {
  const hookUsd = useCoingeckoPrice("ethereum", "usd");
  const hookIdr = useCoingeckoPrice("ethereum", "idr");
  const [apiPrice, setApiPrice] = useState({ usd: 0, idr: 0 });

  useEffect(() => {
    let mounted = true;

    async function fetchPrices() {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,idr");
        const data = await response.json();
        const usd = toSafeNumber(data?.ethereum?.usd);
        const idr = toSafeNumber(data?.ethereum?.idr);
        if (mounted && (usd > 0 || idr > 0)) {
          setApiPrice({ usd, idr });
        }
      } catch (_err) {
        // Keep hook values as fallback.
      }
    }

    fetchPrices();
    const timer = setInterval(fetchPrices, 60000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return useMemo(() => {
    const usd = toSafeNumber(apiPrice.usd) || toSafeNumber(hookUsd);
    const idr = toSafeNumber(apiPrice.idr) || toSafeNumber(hookIdr);
    return {
      usd,
      idr,
      ready: usd > 0 || idr > 0,
    };
  }, [apiPrice.usd, apiPrice.idr, hookUsd, hookIdr]);
}
