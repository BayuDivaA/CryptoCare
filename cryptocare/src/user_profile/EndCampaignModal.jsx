import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import loader from "../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

export default function EndCampaignModal({ isOpen, campaignAddress, closeHandle }) {
  const [isLoading, setIsLoading] = useState();

  const myContract = new Contract(campaignAddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "endCampaign", { transactionName: "End Campaign" });
  const { status } = state;
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, theme: "colored" });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false, theme: "colored" });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "Success End Campaign.", type: "success", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else if (status === "Fail") {
      toast.update(mining.current, { render: "Error End Campaign.", type: "error", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else {
    }
  }, [state]);

  const endCampaignHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    send();
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Deactive Confirmation</Dialog.Title>
                  <div className="mt-2">{!isLoading ? <p className="text-base text-blue-gray-900">Are you sure want to End your campaign ?</p> : <p className="text-base text-blue-gray-900">Waiting for Signature ...</p>}</div>

                  {!isLoading ? (
                    <div className="mt-4 flex justify-between">
                      <button onClick={endCampaignHandle} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                        <div className="inline-flex">
                          {/* <BiDonateHeart className="w-5 h-5 mr-2" /> */}
                          End Campaign
                        </div>
                      </button>
                      <button onClick={closeHandle} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                        Cancel
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
