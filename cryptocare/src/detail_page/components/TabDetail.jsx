import React, { useState, Fragment } from "react";
import { Tab, Transition } from "@headlessui/react";
import RequestDisclosure from "./RequestDisclosure";
import { shortenAddress2 } from "../../utils/shortenAddress";
import UrgentWithdrawl from "./UrgentWithdrawl";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabDetail({ title, creator, caddress, story, collectedFunds, type }) {
  return (
    <div className="w-full pb-16 pt-4">
      <Tab.Group>
        <Tab.List className="flex space-x-1 border-b-2 border-b-blue-600">
          <Tab key="Request" className={({ selected }) => classNames("w-full  py-2.5 text-sm font-medium", selected ? "text-blue-600 bg-blue-gray-50" : "text-blue-200 hover:bg-white/[0.12] hover:text-blue-600")}>
            {type === 0 ? "Request" : "Withdrawl"}
          </Tab>

          <Tab key="About" className={({ selected }) => classNames("w-full py-2.5 text-sm font-medium leading-5", selected ? "text-blue-600 bg-blue-gray-50" : "text-blue-200 hover:bg-white/[0.12] hover:text-blue-600")}>
            About
          </Tab>
        </Tab.List>
        <Tab.Panels className="">
          <Tab.Panel key="Request" className={classNames("rounded-xl mt-4")}>
            {type === 0 ? <RequestDisclosure address={caddress} creatorAddress={creator} collectedFunds={collectedFunds} /> : <UrgentWithdrawl address={caddress} creatorAddress={creator} collectedFunds={collectedFunds} />}
          </Tab.Panel>

          {/* PANEL ABOUT */}
          <Tab.Panel key="About" className={classNames("rounded-xl  mt-4")}>
            <div className="flex flex-col">
              <div className="flex text-sm text-blue-300 md:text-sm">Title</div>
              <div className="flex font-bold text-sm text-blue-gray-900 md:text-base">{title}</div>
              <div className="flex text-sm text-blue-300 mt-2 md:text-sm">Creator Address</div>
              <div className="flex font-bold text-sm text-blue-gray-900 md:text-base">
                <a href={"https://goerli-optimism.etherscan.io/address/" + creator} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-blue-300">
                  {creator && shortenAddress2(creator)}
                </a>
              </div>
              <div className="flex text-sm text-blue-300 mt-2 md:text-sm">Campaign Address</div>
              <div className="flex font-bold text-sm text-blue-gray-900 md:text-base">
                <a href={"https://goerli-optimism.etherscan.io/address/" + caddress} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-blue-300">
                  {caddress && shortenAddress2(caddress)}
                </a>
              </div>
              <div className="flex text-sm text-blue-300 mt-2 md:text-sm">Description</div>
              <div className="flex font-bold text-sm text-blue-gray-900 md:text-base indent-7 text-justify">{story?.[0]}</div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
