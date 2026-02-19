import React, { useState, Fragment, useMemo } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { SiEthereum } from "react-icons/si";
import { MdKeyboardArrowUp } from "react-icons/md";
import { formatEther } from "@ethersproject/units";
import { getCampaignRequeset } from "../../smart_contract/SmartcontractInteract";
import { useEthers } from "@usedapp/core";
import dayjs from "dayjs";
import { shortenAddress } from "../../utils/shortenAddress";
import UrgentWithdrawlModal from "./UrgentWithdrawlModal";

function RequestList({ idReq, value, description, completedTimestamp, recipient }) {
  return (
    <>
      <Disclosure as="div" className="mt-4">
        {({ open }) => (
          <>
            <div className="w-full flex items-center">
              <div className="w-full">
                <Disclosure.Button className={`flex flex-col w-full ${open ? "bg-blue-50 rounded-t-lg" : "rounded-lg shadow-xl"} px-4 py-3 text-purple-900 hover:bg-blue-50 sm:px-6`}>
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="mr-2 flex-col">
                      <div className="flex items-center md:text-base text-sm font-medium text-left">
                        Withdrawl
                        <SiEthereum className="mx-1 text-base" /> {value ? formatEther(value.toString()) : "0"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <div className="flex items-center rounded-md bg-blue-600 px-2 text-xs text-white">
                        {completedTimestamp ? dayjs(Number(completedTimestamp.toString()) * 1000).format("DD MMMM YYYY") : "-"}
                      </div>
                      <MdKeyboardArrowUp className={`${open ? "rotate-180 transform" : ""} ml-2 h-5 w-5 text-purple-500`} />
                    </div>
                  </div>
                </Disclosure.Button>{" "}
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-300"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-200"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Disclosure.Panel className={`px-4 py-2 ${open ? "shadow-xl" : ""} text-sm text-blue-900 break-words`}>
                    <div className="flex-col">
                      <div className="flex flex-wrap text-sm font-thin mb-2">
                        Recipient :{" "}
                        <a href={"https://sepolia-optimism.etherscan.io/address/" + recipient} target="_blank" rel="noopener noreferrer" className="text-base indent-3 break-all hover:text-blue-600 hover:underline">
                          {" "}
                          {shortenAddress(recipient)}
                        </a>
                      </div>
                      <div className="flex text-sm font-thin">Description :</div>
                      <div className="flex text-base text-justify indent-4">{description}</div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default function UrgentWithdrawl({ address, creatorAddress, collectedFunds, status }) {
  const { account } = useEthers();
  const campaignRequest = getCampaignRequeset(address);
  const [isOpen, setIsOpen] = useState(false);

  const requestWd = useMemo(() => {
    return Array.isArray(campaignRequest) ? campaignRequest : [];
  }, [campaignRequest]);

  return (
    <>
      <div className="w-full ">
        <div className="mx-auto w-full rounded-2xl bg-white">
          <div className="flex flex-col gap-2 text-base sm:flex-row sm:items-end sm:justify-between">
            <div className="flex text-blue-gray-900">{requestWd?.length} Withdrawls</div>
            {account === creatorAddress && status !== 0 && (
              <button className="flex items-center justify-center text-white hover:bg-blue-600 bg-blue-300 p-2 rounded-md w-full sm:w-auto" onClick={() => setIsOpen(true)}>
                <SiEthereum className="mr-2" /> Withdrawl Ethers
              </button>
            )}
          </div>
          {requestWd.length === 0 && <div className="flex justify-center italic my-3">No Request Yet</div>}
          {requestWd?.map((request, i) => (
            <RequestList key={i} {...request} idReq={i} caddress={address} creator={creatorAddress} />
          ))}
        </div>
      </div>
      <UrgentWithdrawlModal isOpen={isOpen} cancel={() => setIsOpen(false)} caddress={address} collectedFunds={collectedFunds} />
    </>
  );
}
