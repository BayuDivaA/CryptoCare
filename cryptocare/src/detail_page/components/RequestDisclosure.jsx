import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";
import { SiEthereum } from "react-icons/si";
import { HiCheckCircle, HiOutlineCheckBadge } from "react-icons/hi2";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import { JsonRpcProvider } from "@ethersproject/providers";
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
import { OPTIMISM_SEPOLIA_EXPLORER, OPTIMISM_SEPOLIA_RPC_URL } from "../../smart_contract/network";
import loader_4 from "../../assets/loader_4.svg";
import FinalizeWithdrawl from "./FinalizeWithdrawlConfirmation";
import { toast, Flip } from "react-toastify";

function normalizeRequest(raw) {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    return {
      description: raw[0],
      value: raw[1],
      recipient: raw[2],
      complete: raw[3],
      createTimestamp: raw[4],
      completedTimestamp: raw[5],
      approvalsCount: raw[6],
    };
  }

  return {
    description: raw.description ?? raw[0],
    value: raw.value ?? raw[1],
    recipient: raw.recipient ?? raw[2],
    complete: raw.complete ?? raw[3],
    createTimestamp: raw.createTimestamp ?? raw[4],
    completedTimestamp: raw.completedTimestamp ?? raw.completeTimestamp ?? raw[5],
    approvalsCount: raw.approvalsCount ?? raw[6],
  };
}

function toNum(value) {
  return Number(value?.toString?.() ?? value ?? 0);
}

function minVotesForFinalize(voterTotal) {
  if (!voterTotal || voterTotal <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil(voterTotal * 0.6); // minimum 60%
}

function isSameAddress(a, b) {
  if (!a || !b) return false;
  return String(a).toLowerCase() === String(b).toLowerCase();
}

const finalizeInterface = new Interface(["function finalizeWd(uint256)"]);
const finalizeSighash = finalizeInterface.getSighash("finalizeWd");

function getFinalizeTxStorageKey(campaignAddress, requestId) {
  return `finalize-tx:${String(campaignAddress || "").toLowerCase()}:${requestId}`;
}

async function findBlockByTimestamp(provider, targetTimestamp) {
  const latestBlockNumber = await provider.getBlockNumber();
  const latestBlock = await provider.getBlock(latestBlockNumber);
  if (!latestBlock) return null;

  if (targetTimestamp >= latestBlock.timestamp) {
    return latestBlockNumber;
  }

  let low = 0;
  let high = latestBlockNumber;
  let closest = latestBlockNumber;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const block = await provider.getBlock(mid);
    if (!block) break;

    closest = mid;
    if (block.timestamp === targetTimestamp) {
      return mid;
    }

    if (block.timestamp < targetTimestamp) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return closest;
}

async function findFinalizeTxHash({ provider, campaignAddress, requestId, completedTimestamp }) {
  if (!provider || !campaignAddress) return "";

  const campaignLower = String(campaignAddress).toLowerCase();
  const targetRequestId = BigNumber.from(requestId);
  const latest = await provider.getBlockNumber();
  let fromBlock;
  let toBlock;

  if (completedTimestamp) {
    const pivot = await findBlockByTimestamp(provider, completedTimestamp);
    if (pivot === null || pivot === undefined) return "";
    fromBlock = Math.max(0, pivot - 450);
    toBlock = Math.min(latest, pivot + 450);
  } else {
    // Fallback for cases where completed timestamp is not indexed yet in UI.
    fromBlock = Math.max(0, latest - 1600);
    toBlock = latest;
  }

  for (let blockNumber = toBlock; blockNumber >= fromBlock; blockNumber -= 1) {
    const block = await provider.getBlockWithTransactions(blockNumber);
    if (!block?.transactions?.length) continue;

    for (const tx of block.transactions) {
      if (!tx?.to || String(tx.to).toLowerCase() !== campaignLower) continue;
      if (!tx?.data || !tx.data.startsWith(finalizeSighash)) continue;

      try {
        const decoded = finalizeInterface.decodeFunctionData("finalizeWd", tx.data);
        if (!decoded?.[0] || !BigNumber.from(decoded[0]).eq(targetRequestId)) continue;

        const receipt = await provider.getTransactionReceipt(tx.hash);
        if (receipt?.status === 1) {
          return tx.hash;
        }
      } catch (_decodeErr) {
        // ignore non-matching tx data
      }
    }
  }

  return "";
}

function RequestList({ idReq, value, description, createTimestamp, caddress, approvalsCount, creator, voterAll, complete, completedTimestamp, recipient }) {
  const { account } = useEthers();
  const provider = useMemo(() => new JsonRpcProvider(OPTIMISM_SEPOLIA_RPC_URL), []);
  const checkVoted = checkAddressVoted(caddress, account, idReq); // Check if already vote
  const ifVoter = checkIfVoter(caddress, account); // check if voter (donate more than minimum)
  const voterTotal = Number(voterAll?.toString?.() ?? voterAll ?? 0);
  const approvalCount = Number(approvalsCount?.toString?.() ?? approvalsCount ?? 0);
  const minApprovalsRequired = minVotesForFinalize(voterTotal);
  const createdAt = Number(createTimestamp?.toString?.() ?? createTimestamp ?? 0);
  const completedAt = Number(completedTimestamp?.toString?.() ?? completedTimestamp ?? 0);
  const [localComplete, setLocalComplete] = useState(Boolean(complete));
  const [localCompletedAt, setLocalCompletedAt] = useState(completedAt);
  const [localFinalizeTxHash, setLocalFinalizeTxHash] = useState("");
  const nowDay = dayjs();
  const endDay = dayjs(createdAt > 0 ? createdAt * 1000 : undefined).add("1", "d");
  const ended = createdAt > 0 ? nowDay.unix() > endDay.unix() : false;
  const isCompleted = localComplete || Boolean(complete);
  const finalizedTimestamp = localCompletedAt || completedAt;
  const recipientProofUrl = localFinalizeTxHash ? `${OPTIMISM_SEPOLIA_EXPLORER}/tx/${localFinalizeTxHash}` : null;

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
  }, [status]);

  const [openFinalize, setOpenFinalize] = useState(false);
  const approvalProgress = voterTotal > 0 ? (approvalCount / voterTotal) * 100 : 0;
  const txBusy = status === "PendingSignature" || status === "Mining";
  const isCreator = isSameAddress(account, creator);
  const canVote = Boolean(ifVoter) && !ended && !isCompleted && !checkVoted && !txBusy;
  const canFinalize = !isCompleted && approvalCount >= minApprovalsRequired && isCreator;

  useEffect(() => {
    setLocalComplete(Boolean(complete));
  }, [complete]);

  useEffect(() => {
    setLocalCompletedAt(completedAt);
  }, [completedAt]);

  useEffect(() => {
    try {
      const storedHash = localStorage.getItem(getFinalizeTxStorageKey(caddress, idReq));
      if (storedHash) {
        setLocalFinalizeTxHash(storedHash);
      }
    } catch (_err) {
      // ignore storage access issue
    }
  }, [caddress, idReq]);

  useEffect(() => {
    let cancelled = false;

    async function backfillFinalizeTxHash() {
      if (!isCompleted || localFinalizeTxHash || !caddress) return;

      const txHash = await findFinalizeTxHash({
        provider,
        campaignAddress: caddress,
        requestId: idReq,
        completedTimestamp: finalizedTimestamp,
      });

      if (cancelled || !txHash) return;
      setLocalFinalizeTxHash(txHash);
      try {
        localStorage.setItem(getFinalizeTxStorageKey(caddress, idReq), txHash);
      } catch (_err) {
        // ignore storage write issue
      }
    }

    backfillFinalizeTxHash();

    return () => {
      cancelled = true;
    };
  }, [isCompleted, localFinalizeTxHash, finalizedTimestamp, caddress, idReq, provider]);

  function openFinalizeModal() {
    setOpenFinalize(true);
  }

  function handleFinalizeSuccess(payload) {
    const txHash = payload?.transaction?.hash || "";
    setLocalComplete(true);
    setLocalCompletedAt(Number(payload?.completedTimestamp ?? dayjs().unix()));
    setLocalFinalizeTxHash(txHash);
    if (txHash) {
      try {
        localStorage.setItem(getFinalizeTxStorageKey(caddress, idReq), txHash);
      } catch (_err) {
        // ignore storage write issue
      }
    }
    setOpenFinalize(false);
  }

  return (
    <>
      <FinalizeWithdrawl
        isOpen={openFinalize}
        campaignAddress={caddress}
        closeHandle={() => setOpenFinalize(false)}
        value={value}
        recipient={recipient}
        idReq={idReq}
        approvalCount={approvalCount}
        voterTotal={voterTotal}
        requiredVotes={Number.isFinite(minApprovalsRequired) ? minApprovalsRequired : 0}
        onSuccess={handleFinalizeSuccess}
      />
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
                        <SiEthereum className="mx-1 text-base" /> {value ? formatEther(value.toString()) : "0"}
                      </div>
                      {ended && <div className="flex text-xs font-thin pt-2 ">Ended {endFromNow}</div>}
                      {!ended && (
                        <div className="flex text-xs font-thin pt-2 ">
                          Approved by {approvalCount}/{voterTotal} voters (need {Number.isFinite(minApprovalsRequired) ? minApprovalsRequired : 0} for finalize)
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      {!ended && createdAt > 0 && !isCompleted && (
                        <div className="flex items-center rounded-md bg-blue-600 px-2 text-xs text-white">
                          <RequestCountdownTimer countdownTimestampsMs={createdAt} durationCampaign="1" />
                        </div>
                      )}
                      {!isCompleted && approvalCount >= minApprovalsRequired && !isCreator && <div className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">Waiting</div>}
                      {ended && !isCompleted && approvalCount < minApprovalsRequired && <div className="rounded-md bg-[#eb0b0b] px-2 py-1 text-xs text-white">Disapproved</div>}
                      {isCompleted && approvalCount >= minApprovalsRequired && <div className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">Approved</div>}
                      <MdKeyboardArrowUp className={`${open ? "rotate-180 transform" : ""} ml-2 h-5 w-5 text-purple-500`} />
                    </div>
                  </div>
                  <div className="flex w-full pt-2">{!ended && !isCompleted && <Progress value={approvalProgress} color="purple" variant="filled" />}</div>
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
                      {!isCompleted && approvalCount >= minApprovalsRequired && (
                        <div className=" text-xs font-thin text-left">
                          Request <span className="font-bold">APPROVED</span> ({Number.isFinite(minApprovalsRequired) ? `>=${60}% vote` : "vote threshold met"}), waiting creator for withdrawl!
                        </div>
                      )}
                      {ended && !isCompleted && approvalCount < minApprovalsRequired && (
                        <div className=" text-xs font-thin text-left italic">
                          Request was <span className="font-bold">DISAPPROVED</span>, only approved by {voterTotal ? ((approvalCount / voterTotal) * 100).toFixed(1) : 0}% of the {voterTotal} voters
                        </div>
                      )}
                      {isCompleted && approvalCount >= minApprovalsRequired && (
                        <div className=" text-xs font-thin text-left">
                          Funds has been received by <span className="font-bold">{shortenAddress(recipient)}</span> on {finalizedTimestamp ? dayjs(finalizedTimestamp * 1000).format("DD MMMM YYYY") : "-"}
                          {recipientProofUrl && (
                            <span className="ml-2">
                              Tx:{" "}
                              <a href={recipientProofUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">
                                {shortenAddress(localFinalizeTxHash)}
                              </a>
                            </span>
                          )}
                          {!recipientProofUrl && <span className="ml-2 italic text-blue-gray-600">Tx hash is not available for this request yet.</span>}
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
                {!ended && !isCompleted && (
                  <button
                    onClick={voteHandle}
                    disabled={!canVote}
                    className={`mb-2 flex min-w-[108px] items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      canVote ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" : "cursor-not-allowed bg-blue-gray-100 text-blue-gray-500"
                    }`}
                  >
                    {txBusy ? <img src={loader_4} alt="loader" className="h-4 w-4 object-contain" /> : <HiCheckCircle className="h-4 w-4" />}
                    {checkVoted ? "Voted" : "Vote"}
                  </button>
                )}

                {canFinalize && (
                  <button
                    onClick={openFinalizeModal}
                    className="flex min-w-[116px] items-center justify-center gap-2 rounded-full border border-[#0f766e] bg-[#0f766e] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#115e59]"
                  >
                    <HiOutlineCheckBadge className="h-4 w-4" />
                    Finalize
                  </button>
                )}

                {isCompleted && (
                  <div className="flex min-w-[116px] items-center justify-center gap-2 rounded-full border border-[#115e59] bg-[#ccfbf1] px-4 py-2 text-xs font-semibold text-[#115e59]">
                    <HiOutlineCheckBadge className="h-4 w-4" />
                    Finalized
                  </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const voterTotal = toNum(voterCounter);
  const minApprovalsRequired = minVotesForFinalize(voterTotal);
  const nowUnix = dayjs().unix();

  const requestWd = useMemo(() => {
    if (!Array.isArray(campaignRequest)) return [];
    return campaignRequest.map(normalizeRequest).filter(Boolean);
  }, [campaignRequest]);

  const groupedRequest = useMemo(() => {
    const ongoing = [];
    const approved = [];
    const disapproved = [];

    requestWd.forEach((request, index) => {
      const approvalsCount = toNum(request?.approvalsCount);
      const complete = Boolean(request?.complete);
      const createdAt = toNum(request?.createTimestamp);
      const ended = createdAt > 0 ? nowUnix > dayjs(createdAt * 1000).add("1", "d").unix() : false;

      if (complete || approvalsCount >= minApprovalsRequired) {
        approved.push({ ...request, _index: index });
      } else if (ended && approvalsCount < minApprovalsRequired) {
        disapproved.push({ ...request, _index: index });
      } else {
        ongoing.push({ ...request, _index: index });
      }
    });

    return { ongoing, approved, disapproved };
  }, [requestWd, minApprovalsRequired, nowUnix]);

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
          {groupedRequest.ongoing.length > 0 && <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-700">Sedang Berlangsung ({groupedRequest.ongoing.length})</div>}
          {groupedRequest.ongoing.map((request) => (
            <RequestList key={`ongoing-${request._index}`} {...request} idReq={request._index} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
          ))}

          {groupedRequest.approved.length > 0 && <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700">Approved ({groupedRequest.approved.length})</div>}
          {groupedRequest.approved.map((request) => (
            <RequestList key={`approved-${request._index}`} {...request} idReq={request._index} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
          ))}

          {groupedRequest.disapproved.length > 0 && <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-red-700">Disapproved ({groupedRequest.disapproved.length})</div>}
          {groupedRequest.disapproved.map((request) => (
            <RequestList key={`disapproved-${request._index}`} {...request} idReq={request._index} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
          ))}
        </div>
      </div>
      <RequestWithdrawlModal isOpen={isOpen} cancel={() => setIsOpen(false)} caddress={address} collectedFunds={collectedFunds} />
    </>
  );
}
