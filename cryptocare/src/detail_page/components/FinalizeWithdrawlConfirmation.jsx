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
  const { library } = useEthers();
  const recipientBalanceBefore = React.useRef(null);

  const hasValidAddress = Boolean(campaignAddress && campaignAddress.startsWith("0x") && campaignAddress.length === 42);
  const myContract = new Contract(hasValidAddress ? campaignAddress : "0x0000000000000000000000000000000000000000", contractABICampaign);
  const { state, send } = useContractFunction(myContract, "finalizeWd", { transactionName: "Finalize Withdrawl" });
  const { status, transaction } = state;
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

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      setIsLoading(true);
      toast.update(mining.current, { render: "Finalize transaction is being mined...", type: "loading", transition: Flip, autoClose: false });
    } else if (status === "PendingSignature") {
      setIsLoading(true);
      mining.current = toast.loading("Waiting for wallet signature...", { autoClose: false });
    } else if (status === "Exception") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Finalize canceled or rejected from wallet.", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      const verifyFinalizeResult = async () => {
        try {
          const readContract = new Contract(campaignAddress, contractABICampaign, library);
          const finalizedRequest = await readContract.withdrawls(idReq);
          const requestComplete = Boolean(finalizedRequest?.complete ?? finalizedRequest?.[3]);
          const requestCompletedTimestamp = Number(finalizedRequest?.completedTimestamp ?? finalizedRequest?.[5] ?? 0);
          let recipientBalanceIncreased = false;

          if (library && recipient) {
            try {
              const afterBalance = await library.getBalance(recipient);
              if (recipientBalanceBefore.current && afterBalance) {
                recipientBalanceIncreased = afterBalance.gt(recipientBalanceBefore.current);
              }
            } catch (_balanceErr) {
              recipientBalanceIncreased = false;
            }
          }
          const transferConfirmed = requestComplete || recipientBalanceIncreased;

          setIsLoading(false);
          if (!transferConfirmed) {
            toast.update(mining.current, {
              render: (
                <div className="flex flex-col gap-2">
                  <span>Finalize mined, but transfer to recipient is not confirmed yet.</span>
                  <a href={`${OPTIMISM_SEPOLIA_EXPLORER}/tx/${transaction?.hash}`} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center rounded-lg bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800">
                    Check Transaction
                  </a>
                </div>
              ),
              type: "error",
              closeButton: true,
              draggable: true,
              autoClose: false,
              isLoading: false,
              transition: Flip,
              theme: "colored",
            });
            return;
          }

          toast.update(mining.current, {
            render: <MsgSuccess transactions={transaction} />,
            type: "success",
            closeButton: true,
            draggable: true,
            autoClose: false,
            isLoading: false,
            transition: Flip,
            theme: "colored",
          });
          if (onSuccess) {
            onSuccess({
              transaction,
              completedTimestamp: requestCompletedTimestamp,
            });
          }
          closeHandle();
        } catch (_err) {
          setIsLoading(false);
          toast.update(mining.current, {
            render: "Finalize transaction succeeded, but verification failed. Please check explorer.",
            type: "warning",
            closeButton: true,
            draggable: true,
            autoClose: 8000,
            isLoading: false,
            transition: Flip,
          });
        }
      };
      verifyFinalizeResult();
    } else if (status === "Fail") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Failed Withdrawl. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
    } else {
      setIsLoading(false);
    }
  }, [status, transaction, closeHandle, onSuccess, campaignAddress, idReq, library, recipient]);

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
      toast.error(`Finalize requires >60% approval (${approvalCount}/${voterTotal} votes, need ${requiredVotes}).`);
      return;
    }
    try {
      recipientBalanceBefore.current = await library.getBalance(recipient);
    } catch (_err) {
      recipientBalanceBefore.current = null;
    }
    setIsLoading(true);
    send(idReq);
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
                          Approval progress: {approvalCount}/{voterTotal} voters (need {requiredVotes} votes, strictly &gt;60%).
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
