import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { DAppProvider, MetamaskConnector, CoinbaseWalletConnector } from "@usedapp/core";
import {
  OPTIMISM_SEPOLIA_CHAIN_ID,
  OPTIMISM_SEPOLIA_RPC_URL,
} from "./smart_contract/network";

import App from "./App";
import "./index.css";

const config = {
  readOnlyChainId: OPTIMISM_SEPOLIA_CHAIN_ID,
  readOnlyUrls: {
    [OPTIMISM_SEPOLIA_CHAIN_ID]: OPTIMISM_SEPOLIA_RPC_URL,
  },
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),
  },
  refresh: "everyBlock",
  notifications: {
    expirationPeriod: 0,
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DAppProvider config={config}>
    <Router>
      <App />
    </Router>
  </DAppProvider>
);
