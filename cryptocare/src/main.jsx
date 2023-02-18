import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { DAppProvider, OptimismGoerli, MetamaskConnector, CoinbaseWalletConnector } from "@usedapp/core";

import App from "./App";
import "./index.css";

const config = {
  readOnlyChainId: OptimismGoerli.chainId,
  readOnlyUrls: {
    [OptimismGoerli.chainId]: "https://optimism-goerli.infura.io/v3/3d1947cbec5a45488fd1d5d0162fae38",
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
