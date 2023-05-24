import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { BiDownvote } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";
import { SiEthereum } from "react-icons/si";
import { formatEther } from "@ethersproject/units";
import { RequestCountdownTimer } from "./TimerEnd";
import { checkAddressVoted, checkIfVoter, voterCount, getCampaignRequeset } from "../../smart_contract/SmartcontractInteract";
import { useEthers, useContractFunction } from "@usedapp/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { shortenAddress } from "../../utils/shortenAddress";
import { Progress } from "@material-tailwind/react";
import RequestWithdrawlModal from "./RequestWithdrawlModal";
import { Contract } from "@ethersproject/contracts";
import { contractABICampaign } from "../../smart_contract/constants";
import loader_4 from "../../assets/loader_4.svg";
import FinalizeWithdrawl from "./FinalizeWithdrawlConfirmation";
import { toast, Flip } from "react-toastify";

function RequestList({ idReq, value, description, createTimestamp, caddress, approvalsCount, creator, voterAll, complete, completeTimestamp, recipient }) {
  const { account } = useEthers();
  const checkVoted = checkAddressVoted(caddress, account, idReq); // Check if already vote
  const ifVoter = checkIfVoter(caddress, account); // check if voter (donate more than minimum)
  const voterTotal = voterAll.toNumber();
  const voterPercent = voterTotal / 2;
  const nowDay = dayjs();
  const endDay = dayjs(createTimestamp.toNumber() * 1000).add("1", "d");
  const ended = nowDay.unix() > endDay.unix();

  dayjs.extend(relativeTime);
  const endFromNow = dayjs(endDay).fromNow();

  const myContract = new Contract(caddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "approvalWithdrawl", { transactionName: "Approve Withdrawl" });
  const { status } = state;

  const voteHandle = async (e) => {
    e.preventDefault();

    await send(idReq);
  };

  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, draggable: true, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "Success Vote.", type: "success", isLoading: false, draggable: true, autoClose: 5000, transition: Flip });
    } else if (status === "Fail") {
      toast.error("Fail Vote. Try again!", { type: "error", isLoading: false, autoClose: 5000, draggable: true, transition: Flip });
    } else {
    }
  }, [state]);

  const [openFinalize, setOpenFinalize] = useState(false);

  function openFinalizeModal() {
    setOpenFinalize(true);
  }

  return (
    <>
      <FinalizeWithdrawl isOpen={openFinalize} campaignAddress={caddress} closeHandle={() => setOpenFinalize(false)} value={value} recipient={recipient} idReq={idReq} />
      <Disclosure as="div" className=" flex mt-4 ">
        {({ open }) => (
          <>
            <div className="w-full flex items-center">
              <div className="w-full">
                <Disclosure.Button className={`flex flex-col w-full ${open ? "bg-blue-50 rounded-t-lg" : "rounded-lg shadow-xl"} px-6 py-3 text-purple-900 hover:bg-blue-50`}>
                  <div className="flex w-full justify-between items-start">
                    <div className="mr-2 flex-col">
                      <div className="flex items-center md:text-base text-sm font-medium text-left">
                        Request
                        <SiEthereum className="mx-1 text-base" /> {value && formatEther(value)}
                      </div>
                      {ended && <div className="flex text-xs font-thin pt-2 ">Ended {endFromNow}</div>}
                      {!ended && (
                        <div className="flex text-xs font-thin pt-2 ">
                          Approved by {approvalsCount.toNumber()} out of {voterTotal} Voter
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      {!ended && (
                        <div className="flex items-center rounded-md bg-blue-600 px-2 text-xs text-white">
                          <RequestCountdownTimer countdownTimestampsMs={createTimestamp.toNumber()} durationCampaign="1" />
                        </div>
                      )}
                      {ended && !complete && approvalsCount >= voterPercent && account !== creator && <div className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">Waiting</div>}
                      {ended && approvalsCount < voterPercent && <div className="rounded-md bg-[#eb0b0b] px-2 py-1 text-xs text-white">Disapproved</div>}
                      {ended && complete && approvalsCount >= voterPercent && <div className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">Approved</div>}
                      <MdKeyboardArrowUp className={`${open ? "rotate-180 transform" : ""} ml-2 h-5 w-5 text-purple-500`} />
                    </div>
                  </div>
                  <div className="flex w-full pt-2">{!ended && !complete && <Progress value={(approvalsCount / voterTotal) * 100} color="purple" variant="filled" />}</div>
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
                    <div className="flex pb-2">
                      {ended && !complete && approvalsCount >= voterPercent && (
                        <div className=" text-xs font-thin text-left">
                          Request <span className="font-bold">APPROVED</span>, waiting creator for withdrawl!
                        </div>
                      )}
                      {ended && approvalsCount < voterPercent && (
                        <div className=" text-xs font-thin text-left italic">
                          Request was <span className="font-bold">DISAPPROVED</span>, only approved by {voterTotal && (approvalsCount / voterTotal) * 100}% of the {voterTotal && voterTotal} voters
                        </div>
                      )}
                      {ended && complete && approvalsCount >= voterPercent && (
                        <div className=" text-xs font-thin text-left">
                          Funds has been received by <span className="font-bold">{shortenAddress(recipient)}</span> on {dayjs(completeTimestamp * 1000).format("DD MMMM YYYY")}
                        </div>
                      )}
                    </div>

                    <div className="flex-col">
                      <div className="flex text-sm font-thin">Description :</div>
                      <div className="flex text-base text-justify">{description}</div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
              <div className="items-center ml-2">
                {/* BUTTON VOTE */}
                {status === "PendingSignature" || status === "Mining" ? (
                  <img src={loader_4} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
                ) : (
                  ifVoter &&
                  !ended &&
                  !complete && (
                    <button
                      onClick={voteHandle}
                      className={` ${checkVoted ? "bg-[#6f9c15] rotate-180 hover:rotate-1 hover:bg-[#5719e9]" : "bg-[#5719e9] hover:rotate-180 hover:transform hover:bg-[#6f9c15]"} text-white font-bold py-2 px-2 rounded-full`}
                    >
                      <BiDownvote />
                    </button>
                  )
                )}

                {/* BUTTON WITHDRAWL IF SUCCESS */}
                {!ended && !complete && approvalsCount >= voterPercent && account === creator && (
                  <button onClick={() => setOpenFinalize(true)} className="bg-[#5719e9] hover:bg-[#622fd8] text-white font-bold py-2 px-2 rounded-full">
                    <RiSendPlaneFill />
                  </button>
                )}
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
            <div className="flex text-blue-gray-900">{requestWd?.length} Request</div>
            {account === creatorAddress && status !== 0 && (
              <button className="flex items-center text-blue-600 hover:text-blue-900" onClick={() => setIsOpen(true)}>
                <IoIosAddCircleOutline className="mr-2" /> Request Withdrawl
              </button>
            )}
          </div>
          {requestWd.length === 0 && <div className="flex justify-center italic my-3">No Request Yet</div>}
          {requestWd?.map((request, i) => (
            <RequestList key={i} {...request} idReq={i} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
          ))}
        </div>
      </div>
      <RequestWithdrawlModal isOpen={isOpen} cancel={() => setIsOpen(false)} caddress={address} collectedFunds={collectedFunds} />
    </>
  );
}
