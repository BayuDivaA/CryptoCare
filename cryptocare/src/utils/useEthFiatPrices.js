import { useEffect, useMemo, useState } from "react";

function toSafeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export default function useEthFiatPrices() {
  const [apiPrice, setApiPrice] = useState({ usd: 0, idr: 0, ready: false });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchPrices() {
      try {
        const response = await fetch("/api/eth-fiat", {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        const usd = toSafeNumber(data?.data?.rates?.USD);
        const idr = toSafeNumber(data?.data?.rates?.IDR);
        if (mounted && (usd > 0 || idr > 0)) {
          setApiPrice({ usd, idr, ready: true });
        }
      } catch (_err) {
        // keep latest successful values
      }
    }

    fetchPrices();
    const timer = setInterval(fetchPrices, 60000);

    return () => {
      mounted = false;
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  return useMemo(() => {
    const usd = toSafeNumber(apiPrice.usd);
    const idr = toSafeNumber(apiPrice.idr);
    return {
      usd,
      idr,
      ready: Boolean(apiPrice.ready && (usd > 0 || idr > 0)),
    };
  }, [apiPrice.usd, apiPrice.idr, apiPrice.ready]);
}
