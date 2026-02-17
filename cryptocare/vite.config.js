import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    middlewareMode: false,
  },
  plugins: [
    react(),
    {
      name: "eth-fiat-endpoint",
      configureServer(server) {
        let cachedRates = { USD: "0", IDR: "0" };

        async function tryCoinbase() {
          const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH");
          if (!response.ok) throw new Error("coinbase failed");
          const data = await response.json();
          const usd = Number(data?.data?.rates?.USD || 0);
          const idr = Number(data?.data?.rates?.IDR || 0);
          if (!Number.isFinite(usd) || usd <= 0) throw new Error("invalid usd");
          return { USD: String(usd), IDR: String(Number.isFinite(idr) && idr > 0 ? idr : 0) };
        }

        async function tryCoingecko() {
          const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,idr");
          if (!response.ok) throw new Error("coingecko failed");
          const data = await response.json();
          const usd = Number(data?.ethereum?.usd || 0);
          const idr = Number(data?.ethereum?.idr || 0);
          if (!Number.isFinite(usd) || usd <= 0) throw new Error("invalid usd");
          return { USD: String(usd), IDR: String(Number.isFinite(idr) && idr > 0 ? idr : 0) };
        }

        server.middlewares.use("/api/eth-fiat", async (_req, res) => {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "public, max-age=30");

          try {
            let rates;
            try {
              rates = await tryCoinbase();
            } catch (_err) {
              rates = await tryCoingecko();
            }
            cachedRates = rates;
            res.statusCode = 200;
            res.end(JSON.stringify({ data: { rates } }));
          } catch (_err) {
            // Never fail hard in dev UI; return last known rates (or zeroes).
            res.statusCode = 200;
            res.end(JSON.stringify({ data: { rates: cachedRates } }));
          }
        });
      },
    },
  ],
  esbuild: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
