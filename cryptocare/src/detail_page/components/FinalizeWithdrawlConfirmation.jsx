import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { getSingleUserDonateValue } from "../../smart_contract/SmartcontractInteract";
import { formatEther } from "ethers/lib/utils";
import { shortenAddress } from "../../utils/shortenAddress";
import { toast, Flip } from "react-toastify";

export default function FinalizeWithdrawl({ isOpen, campaignAddress, closeHandle, value, recipient, idReq }) {
  const [isLoading, setIsLoading] = useState();
  const { account } = useEthers();
  const refundAmount = getSingleUserDonateValue(campaignAddress, account);

  const myContract = new Contract(campaignAddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "finalizeWd", { transactionName: "Finalize Withdrawl" });
  const { status, transaction } = state;

  const MsgSuccess = ({ closeToast, toastProps, transactions }) => (
    <div className="flex flex-col">
      <span>Success Withdrawl</span>
      <div className="flex mt-4">
        <a href={"https://goerli-optimism.etherscan.io/tx/" + transactions?.hash} target="_blank" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center">
          View Transaction
        </a>
      </div>
    </div>
  );
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, autoClose: false });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      toast.update(mining.current, { render: <MsgSuccess transactions={transaction} />, type: "success", closeButton: true, draggable: true, autoClose: false, isLoading: false, transition: Flip, theme: "colored" });
    } else if (status === "Fail") {
      toast.update(mining.current, { render: "Failed Withdrawl. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
    } else {
    }
  }, [state]);

  const withdrawlHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    send(idReq);
    setIsLoading(false);
    closeHandle();
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
                      <p className="text-base text-blue-gray-900">
                        Will send <span className="font-bold">{value && formatEther(value)}</span> Ethers to <span className="font-bold">{shortenAddress(recipient)}</span> ?
                      </p>
                    ) : (
                      <p className="text-base text-blue-gray-900">Waiting for Signature ...</p>
                    )}
                  </div>

                  {!isLoading ? (
                    <div className="mt-4 flex justify-between">
                      <button onClick={closeHandle} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                        Cancel
                      </button>
                      <button onClick={withdrawlHandle} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                        <div className="inline-flex">
                          {/* <BiDonateHeart className="w-5 h-5 mr-2" /> */}
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
