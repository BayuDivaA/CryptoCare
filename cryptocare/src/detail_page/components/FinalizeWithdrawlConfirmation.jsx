import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { formatEther } from "ethers/lib/utils";
import { shortenAddress } from "../../utils/shortenAddress";
import { toast, Flip } from "react-toastify";
import { OPTIMISM_SEPOLIA_EXPLORER } from "../../smart_contract/network";

export default function FinalizeWithdrawl({ isOpen, campaignAddress, closeHandle, value, recipient, idReq, approvalCount = 0, voterTotal = 0, requiredVotes = 0, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { library } = useEthers();

  const hasValidAddress = Boolean(campaignAddress && campaignAddress.startsWith("0x") && campaignAddress.length === 42);
  const myContract = new Contract(hasValidAddress ? campaignAddress : "0x0000000000000000000000000000000000000000", contractABICampaign);
  const { state, send } = useContractFunction(myContract, "finalizeWd", { transactionName: "Finalize Withdrawl" });
  const { status, transaction, errorMessage, error } = state;
  const MsgSuccess = ({ transactions }) => (
    <div className="flex flex-col">
      <span>Withdrawal finalized on-chain.</span>
      <span className="mt-1 text-xs">Tx: {transactions?.hash ? shortenAddress(transactions.hash) : "-"}</span>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`${OPTIMISM_SEPOLIA_EXPLORER}/tx/${transactions?.hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800">
          View Recipient Proof (Tx)
        </a>
      </div>
    </div>
  );
  const mining = React.useRef(null);
  const submitTimeout = React.useRef(null);
  const submittedTxHash = React.useRef("");

  useEffect(() => {
    return () => {
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      submittedTxHash.current = "";
    }
  }, [isOpen, idReq, campaignAddress]);

  useEffect(() => {
    if (status === "Mining") {
      setIsLoading(true);
      if (mining.current) {
        toast.update(mining.current, { render: "Finalize transaction is being mined...", type: "loading", transition: Flip, autoClose: false, isLoading: true });
      } else {
        mining.current = toast.loading("Finalize transaction is being mined...", { autoClose: false, transition: Flip });
      }
    } else if (status === "PendingSignature") {
      setIsLoading(true);
      if (mining.current) {
        toast.update(mining.current, { render: "Waiting for wallet signature...", type: "loading", transition: Flip, autoClose: false, isLoading: true });
      } else {
        mining.current = toast.loading("Waiting for wallet signature...", { autoClose: false, transition: Flip });
      }
    } else if (status === "Exception") {
      setIsLoading(false);
      setIsSubmitting(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }
      const readableError = errorMessage || error?.message || "Finalize canceled/rejected or blocked by RPC rate-limit.";
      if (mining.current) {
        toast.update(mining.current, { render: readableError, type: "error", isLoading: false, autoClose: 7000, transition: Flip });
      } else {
        toast.error(readableError, { autoClose: 7000, transition: Flip });
      }
    } else if (status === "Success") {
      setIsLoading(false);
      setIsSubmitting(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }

      const resolvedTxHash = transaction?.hash || submittedTxHash.current || "";
      const successContent = <MsgSuccess transactions={{ ...transaction, hash: resolvedTxHash }} />;
      if (mining.current) {
        toast.update(mining.current, {
          render: successContent,
          type: "success",
          closeButton: true,
          draggable: true,
          autoClose: false,
          isLoading: false,
          transition: Flip,
          theme: "colored",
        });
      } else {
        toast.success(successContent, { autoClose: false, transition: Flip });
      }

      if (onSuccess) {
        onSuccess({
          transaction: { ...transaction, hash: resolvedTxHash },
        });
      }
      closeHandle();
    } else if (status === "Fail") {
      setIsLoading(false);
      setIsSubmitting(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }
      if (mining.current) {
        toast.update(mining.current, { render: "Failed Withdrawl. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
      } else {
        toast.error("Failed Withdrawl. Try Again!", { autoClose: 5000, transition: Flip, draggable: true });
      }
    } else if (!isSubmitting) {
      setIsLoading(false);
    }
  }, [status, transaction, closeHandle, onSuccess, isSubmitting, errorMessage, error]);

  const withdrawlHandle = async (e) => {
    e.preventDefault();
    if (!hasValidAddress) {
      toast.error("Campaign address is not ready.");
      return;
    }
    if (!recipient || !library) {
      toast.error("Recipient or provider is not ready.");
      return;
    }
    if (!voterTotal || approvalCount < requiredVotes) {
      toast.error(`Finalize requires at least 60% approval (${approvalCount}/${voterTotal} votes, need ${requiredVotes}).`);
      return;
    }
    setIsLoading(true);
    setIsSubmitting(true);
    if (submitTimeout.current) {
      clearTimeout(submitTimeout.current);
    }
    submitTimeout.current = setTimeout(() => {
      setIsSubmitting(false);
      setIsLoading(false);
      toast.error("Finalize timeout due to RPC rate-limit. Retry after a moment or switch to private RPC.");
    }, 90000);
    try {
      const tx = await send(idReq);
      if (tx?.hash) {
        submittedTxHash.current = tx.hash;
      }
    } catch (_err) {
      setIsSubmitting(false);
      setIsLoading(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }
      toast.error("Unable to start finalize transaction.");
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeHandle}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Finalize Confirmation</Dialog.Title>
                  <div className="mt-2">
                    {!isLoading ? (
                      <div className="text-base text-blue-gray-900">
                        <p>
                          Will send <span className="font-bold">{value ? formatEther(value.toString()) : "0"}</span> Ethers to <span className="font-bold">{recipient ? shortenAddress(recipient) : "-"}</span> ?
                        </p>
                        <p className="mt-1 text-xs text-blue-gray-700">
                          Approval progress: {approvalCount}/{voterTotal} voters (need {requiredVotes} votes, minimum 60%).
                        </p>
                      </div>
                    ) : (
                      <p className="text-base text-blue-gray-900">{status === "Mining" ? "Transaction is being mined..." : "Waiting for wallet signature..."}</p>
                    )}
                  </div>

                  {!isLoading ? (
                    <div className="mt-4 flex justify-between">
                      <button onClick={closeHandle} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                      <button onClick={withdrawlHandle} type="button" className="inline-flex items-center justify-center rounded-full border border-[#0f766e] bg-[#0f766e] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#115e59]">
                        <div className="inline-flex">
                          Finalize
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-center">
                      <img src={loader} alt="loader" className="w-7 h-7 object-contain" />
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
