import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";

export default function ReportConfirmation({ isOpen, campaignAddress, closeHandle, alreadyReported }) {
  const [isLoading, setIsLoading] = useState();

  const myContract = new Contract(campaignAddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "reportCampaign", { transactionName: "Report Campaign" });
  const { status } = state;

  const ReportCampaignHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await send();
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Report Confirmation</Dialog.Title>
                  <div className="mt-2">
                    {!isLoading ? (
                      <p className="text-base text-blue-gray-900">{alreadyReported ? "You have already reported this campaign." : "Are you sure want to report this campaign?"}</p>
                    ) : (
                      <p className="text-base text-blue-gray-900">Waiting for Signature ...</p>
                    )}
                  </div>

                  {!isLoading ? (
                    <div className="mt-4 flex justify-between">
                      {!alreadyReported && (
                        <button onClick={ReportCampaignHandle} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                          <div className="inline-flex">Report</div>
                        </button>
                      )}

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
