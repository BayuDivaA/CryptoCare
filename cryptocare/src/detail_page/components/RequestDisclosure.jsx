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

function clampToPercent(value) {
  return Math.min(100, Math.max(0, value));
}

const REQUESTS_PER_PAGE = 8;

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
  const approvalProgress = voterTotal > 0 ? clampToPercent((approvalCount / voterTotal) * 100) : 0;
  const approvalRate = voterTotal > 0 ? Math.round((approvalCount / voterTotal) * 100) : 0;
  const txBusy = status === "PendingSignature" || status === "Mining";
  const isCreator = isSameAddress(account, creator);
  const canVote = Boolean(ifVoter) && !ended && !isCompleted && !checkVoted && !txBusy;
  const canFinalize = !isCompleted && approvalCount >= minApprovalsRequired && isCreator;
  const readyToFinalize = !isCompleted && approvalCount >= minApprovalsRequired;
  const requestIndexLabel = Number(idReq) + 1;
  const statusPill = isCompleted ? "bg-emerald-100 text-emerald-700" : ended && !readyToFinalize ? "bg-red-100 text-red-700" : readyToFinalize ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700";
  const statusLabel = isCompleted ? "Finalized" : ended && !readyToFinalize ? "Disapproved" : readyToFinalize ? "Ready" : "Voting";
  const compactDescription = String(description || "").trim();
  const briefDescription = compactDescription.length > 96 ? `${compactDescription.slice(0, 96)}...` : compactDescription;
  const createdDateLabel = createdAt > 0 ? dayjs(createdAt * 1000).format("DD MMM YYYY") : "-";
  const voteSummary = `${approvalCount}/${voterTotal} votes`;

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
      <Disclosure as="div" className="mt-3">
        {({ open }) => (
          <>
            <div className={`w-full rounded-xl bg-white px-3 py-3 shadow-sm transition-shadow ${open ? "shadow-md" : ""}`}>
              <Disclosure.Button className="flex w-full items-start justify-between gap-3 text-left text-slate-800">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-blue-gray-500">
                    <span className="font-semibold text-blue-gray-700">Request #{requestIndexLabel}</span>
                    <span>{createdDateLabel}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm font-semibold sm:text-base">
                    <SiEthereum className="mr-1 text-sm text-blue-700" />
                    {value ? formatEther(value.toString()) : "0"} ETH
                  </div>
                  <div className="mt-1 text-xs text-blue-gray-500">
                    {voteSummary} · need {Number.isFinite(minApprovalsRequired) ? minApprovalsRequired : 0} · {approvalRate}%
                  </div>
                  <p className="mt-1 text-xs text-blue-gray-500 break-words">{briefDescription || "-"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${statusPill}`}>{statusLabel}</div>
                  <MdKeyboardArrowUp className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-blue-500`} />
                </div>
              </Disclosure.Button>

              {!ended && !isCompleted && (
                <div className="mt-2">
                  <Progress value={approvalProgress} color="purple" variant="filled" />
                </div>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {!ended && createdAt > 0 && !isCompleted && (
                  <div className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-[11px] text-white">
                    <RequestCountdownTimer countdownTimestampsMs={createdAt} durationCampaign="1" />
                  </div>
                )}
                {!isCompleted && approvalCount >= minApprovalsRequired && !isCreator && <div className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">Waiting Creator</div>}
                {!ended && !isCompleted && (
                  <button
                    onClick={voteHandle}
                    disabled={!canVote}
                    className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      canVote ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-blue-gray-100 text-blue-gray-500"
                    }`}
                  >
                    {txBusy ? <img src={loader_4} alt="loader" className="h-3.5 w-3.5 object-contain" /> : <HiCheckCircle className="h-3.5 w-3.5" />}
                    {checkVoted ? "Voted" : "Vote"}
                  </button>
                )}
                {canFinalize && (
                  <button onClick={openFinalizeModal} className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-700">
                    <HiOutlineCheckBadge className="h-3.5 w-3.5" />
                    Finalize
                  </button>
                )}
                {isCompleted && (
                  <div className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <HiOutlineCheckBadge className="h-3.5 w-3.5" />
                    Finalized
                  </div>
                )}
              </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-300"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-200"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Disclosure.Panel className="pt-2 text-sm text-blue-900 break-words">
                    <div className="flex pb-1">
                      {!isCompleted && approvalCount >= minApprovalsRequired && (
                        <div className="text-xs text-left text-blue-gray-600">
                          Request approved ({Number.isFinite(minApprovalsRequired) ? `>=${60}% votes` : "vote threshold met"}), waiting creator withdrawal.
                        </div>
                      )}
                      {ended && !isCompleted && approvalCount < minApprovalsRequired && (
                        <div className="text-xs text-left italic text-blue-gray-600">
                          Request disapproved, approved by {voterTotal ? ((approvalCount / voterTotal) * 100).toFixed(1) : 0}% of {voterTotal} voters.
                        </div>
                      )}
                      {isCompleted && approvalCount >= minApprovalsRequired && (
                        <div className="text-xs text-left text-blue-gray-600">
                          Funds received by <span className="font-semibold">{shortenAddress(recipient)}</span> on {finalizedTimestamp ? dayjs(finalizedTimestamp * 1000).format("DD MMM YYYY") : "-"}
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

                    <div className="mt-2">
                      <div className="flex text-xs font-semibold uppercase tracking-wide text-blue-gray-500">Description</div>
                      <div className="mt-1 text-sm leading-relaxed text-blue-gray-800">{compactDescription || "-"}</div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
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
  const [sectionPage, setSectionPage] = useState({ ongoing: 0, approved: 0, disapproved: 0 });
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

  useEffect(() => {
    setSectionPage((prev) => {
      const next = { ...prev };
      ["ongoing", "approved", "disapproved"].forEach((key) => {
        const total = groupedRequest[key]?.length || 0;
        const maxIndex = Math.max(0, Math.ceil(total / REQUESTS_PER_PAGE) - 1);
        next[key] = Math.min(prev[key], maxIndex);
      });
      return next;
    });
  }, [groupedRequest]);

  function changePage(section, step, maxPageIndex) {
    setSectionPage((prev) => ({
      ...prev,
      [section]: Math.min(maxPageIndex, Math.max(0, prev[section] + step)),
    }));
  }

  function renderSection(sectionKey, title, titleClass) {
    const sectionItems = groupedRequest[sectionKey] || [];
    if (sectionItems.length === 0) return null;

    const maxPage = Math.max(1, Math.ceil(sectionItems.length / REQUESTS_PER_PAGE));
    const page = Math.min(sectionPage[sectionKey], maxPage - 1);
    const startIndex = page * REQUESTS_PER_PAGE;
    const endIndex = Math.min(startIndex + REQUESTS_PER_PAGE, sectionItems.length);
    const visibleItems = sectionItems.slice(startIndex, endIndex);

    return (
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className={`text-xs font-semibold uppercase tracking-wide ${titleClass}`}>
            {title} ({sectionItems.length})
          </div>
          {sectionItems.length > REQUESTS_PER_PAGE && (
            <div className="text-[11px] text-blue-gray-500">
              {startIndex + 1}-{endIndex} of {sectionItems.length}
            </div>
          )}
        </div>

        {visibleItems.map((request) => (
          <RequestList key={`${sectionKey}-${request._index}`} {...request} idReq={request._index} caddress={address} creator={creatorAddress} voterAll={voterCounter} />
        ))}

        {sectionItems.length > REQUESTS_PER_PAGE && (
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => changePage(sectionKey, -1, maxPage - 1)}
              disabled={page === 0}
              className="rounded-md bg-blue-gray-50 px-2.5 py-1 text-xs font-medium text-blue-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-xs text-blue-gray-500">
              Page {page + 1}/{maxPage}
            </div>
            <button
              type="button"
              onClick={() => changePage(sectionKey, 1, maxPage - 1)}
              disabled={page >= maxPage - 1}
              className="rounded-md bg-blue-gray-50 px-2.5 py-1 text-xs font-medium text-blue-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-full ">
        <div className="mx-auto w-full rounded-2xl bg-white">
          <div className="flex flex-col gap-2 text-base sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2 text-blue-gray-900">
              <span className="text-base font-semibold">{requestWd?.length} Requests</span>
              <span className="text-xs text-blue-gray-500">(compact mode)</span>
            </div>
            {account === creatorAddress && status !== 0 && (
              <button className="flex items-center text-blue-600 hover:text-blue-900 text-sm sm:text-base" onClick={() => setIsOpen(true)}>
                <IoIosAddCircleOutline className="mr-2" /> Request Withdrawl
              </button>
            )}
          </div>
          {requestWd.length === 0 && <div className="flex justify-center italic my-3">No requests yet.</div>}

          {renderSection("ongoing", "Ongoing", "text-blue-700")}
          {renderSection("approved", "Approved", "text-emerald-700")}
          {renderSection("disapproved", "Disapproved", "text-red-700")}
        </div>
      </div>
      <RequestWithdrawlModal isOpen={isOpen} cancel={() => setIsOpen(false)} caddress={address} collectedFunds={collectedFunds} />
    </>
  );
}
