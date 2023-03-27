import React, { useState, Fragment } from "react";
import { Tab, Transition } from "@headlessui/react";
import UserHistory from "./UserHistory";
import UserCampaign from "./UserCampaign";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabDetail({ title, creator, caddress, story, collectedFunds, type, status }) {
  return (
    <div className="pb-16 pt-4">
      <Tab.Group>
        <Tab.List className="flex space-x-1 border-b-2 border-b-blue-600">
          <Tab key="Campaign" className={({ selected }) => classNames("w-full  py-2.5 text-sm font-medium", selected ? "text-blue-600 bg-blue-gray-50" : "text-blue-200 hover:bg-white/[0.12] hover:text-blue-600")}>
            User Campaign
          </Tab>

          <Tab key="History" className={({ selected }) => classNames("w-full py-2.5 text-sm font-medium", selected ? "text-blue-600 bg-blue-gray-50" : "text-blue-200 hover:bg-white/[0.12] hover:text-blue-600")}>
            Transaction History
          </Tab>
        </Tab.List>
        <Tab.Panels className="">
          <Tab.Panel key="Campaign" className={classNames("rounded-xl mt-4")}>
            <UserCampaign />
          </Tab.Panel>

          {/* PANEL ABOUT */}
          <Tab.Panel key="History" className={classNames("rounded-xl  mt-4")}>
            <UserHistory />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
