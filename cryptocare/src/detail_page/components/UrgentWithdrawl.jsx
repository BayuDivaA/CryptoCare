import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { BiDownvote } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { SiEthereum } from "react-icons/si";
import { MdKeyboardArrowUp } from "react-icons/md";
import { formatEther } from "@ethersproject/units";
import { RequestCountdownTimer } from "./TimerEnd";
import { checkAddressVoted, checkIfVoter, voterCount, getCampaignRequeset } from "../../smart_contract/SmartcontractInteract";
import { useEthers, useContractFunction } from "@usedapp/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { shortenAddress } from "../../utils/shortenAddress";
import { Progress } from "@material-tailwind/react";
import UrgentWithdrawlModal from "./UrgentWithdrawlModal";
import { Contract } from "@ethersproject/contracts";
import { contractABICampaign } from "../../smart_contract/constants";
import loader_4 from "../../assets/loader_4.svg";
import FinalizeWithdrawl from "./FinalizeWithdrawlConfirmation";

function RequestList({ idReq, value, description, completedTimestamp, recipient }) {
  const { account } = useEthers();

  return (
    <>
      <Disclosure as="div" className=" flex mt-4 ">
        {({ open }) => (
          <>
            <div className="w-full flex items-center">
              <div className="w-full">
                <Disclosure.Button className={`flex flex-col w-full ${open ? "bg-blue-50 rounded-t-lg" : "rounded-lg shadow-xl"} px-6 py-3 text-purple-900 hover:bg-blue-50`}>
                  <div className="flex w-full justify-between items-start">
                    <div className="mr-2 flex-col">
                      <div className="flex items-center md:text-base text-sm font-medium text-left">
                        Withdrawl
                        <SiEthereum className="mx-1 text-base" /> {value && formatEther(value)}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex items-center rounded-md bg-blue-600 px-2 text-xs text-white">{dayjs(completedTimestamp * 1000).format("DD MMMM YYYY")}</div>
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
                  <Disclosure.Panel className={`px-4 py-2 ${open ? "shadow-xl" : ""} text-sm text-blue-900`}>
                    <div className="flex-col">
                      <div className="flex text-sm font-thin mb-2">
                        Recipient :{" "}
                        <a href={"https://goerli-optimism.etherscan.io/address/" + recipient} target="_blank" rel="noopener noreferrer" className="text-base indent-3 hover:text-blue-600 hover:underline">
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

export default function RequestDisclosure({ address, creatorAddress, collectedFunds, status }) {
  const { account } = useEthers();
  const campaignRequest = getCampaignRequeset(address);
  const voterCounter = voterCount(address);
  const [requestWd, setRequestWd] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (campaignRequest || campaignRequest !== undefined) {
      setRequestWd(campaignRequest?.[0]);
    }
  }, [campaignRequest, requestWd]);

  return (
    <>
      <div className="w-full ">
        <div className="mx-auto w-full rounded-2xl bg-white">
          <div className="flex items-end justify-between text-base">
            <div className="flex text-blue-gray-900">{requestWd?.length} Withdrawls</div>
            {account === creatorAddress && status !== 0 && (
              <button className="flex items-center text-white hover:bg-blue-600 bg-blue-300 p-2 rounded-md" onClick={() => setIsOpen(true)}>
                <SiEthereum className="mr-2" /> Withdrawl Ethers
              </button>
            )}
          </div>
          {requestWd.length === 0 && <div className="flex justify-center italic my-3">No Request Yet</div>}
          {requestWd?.map((request, i) => (
            <RequestList key={i} {...request} idReq={i} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
          ))}
        </div>
      </div>
      <UrgentWithdrawlModal isOpen={isOpen} cancel={() => setIsOpen(false)} caddress={address} collectedFunds={collectedFunds} />
    </>
  );
}
