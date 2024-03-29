import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SiEthereum } from "react-icons/si";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
import { parseEther } from "@ethersproject/units";
import { toast, Flip } from "react-toastify";

export default function UrgentWithdrawlModal({ isOpen, cancel, caddress, collectedFunds }) {
  const { account } = useEthers();
  const [showAlert, setShowAlert] = useState();
  const [alertMinimal, setAlertMinimal] = useState();
  const [formData, setFormData] = useState({
    description: "",
    donatedValue: "",
    recipient: "",
  });
  const { description, donatedValue, recipient } = formData;

  const myContract = new Contract(caddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "urgentWd", { transactionName: "Urgent Withdrawl" });
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
      toast.update(mining.current, { render: <MsgSuccess transactions={transaction} />, type: "success", closeButton: true, autoClose: 20000, isLoading: false, transition: Flip, theme: "colored" });
    } else if (status === "Fail") {
      toast.update(mining.current, { render: "Failed Withdrawl. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
    } else {
    }
  }, [state]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (description === "" || donatedValue === "" || recipient === "") {
      setShowAlert(true);
    } else if (donatedValue > collectedFunds) {
      setAlertMinimal(true);
    } else {
      send(description, recipient, parseEther(donatedValue));
      setShowAlert(false);
      setAlertMinimal(false);
      cancel();
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-x-0 top-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Withdrawl Ether</Dialog.Title>
                  <div className="my-4">
                    {showAlert && (
                      <div className="mb-2 text-sm text-red-700 rounded-lg" role="alert">
                        <span className="font-medium">Alert!</span> Please input empty fill.
                      </div>
                    )}
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <label className="block text-base  mb-2">Description of use of funds</label>
                      <textarea
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          });
                        }}
                        className="appearance-none block w-full bg-gray-50 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="story-campaign"
                        type="text"
                      />
                    </div>
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <label className="block text-base font-semi-bold mb-2">The amount of funds required</label>

                      {alertMinimal && (
                        <div className="mb-2 text-sm text-red-700 rounded-lg italic" role="alert">
                          The amount of your request exceeds the funds collected.
                        </div>
                      )}
                      <div className="flex mb-3">
                        <span className="inline-flex items-center px-3 text-base text-white bg-blue-300 rounded-l-md ">
                          <SiEthereum className="text-white" />
                        </span>
                        <input
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              donatedValue: e.target.value,
                            });
                          }}
                          type="number"
                          id="donate-value"
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900  block flex-1 min-w-0 w-full text-base p-2.5 "
                          min="0.01"
                          step="0.01"
                          placeholder="0,05"
                        />
                      </div>
                    </div>
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <label className="flex flex-row justify-between text-base mb-2" htmlFor="campaign-name">
                        <div className="">Recipient address</div>
                        <div
                          onClick={(e) => {
                            setFormData({
                              ...formData,
                              recipient: account,
                            });
                          }}
                          className="text-sm text-blue-300 hover:text-blue-600 cursor-pointer underline"
                        >
                          My Address
                        </div>
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-50 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="campaign-name"
                        type="text"
                        placeholder="0x000.."
                        value={recipient}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            recipient: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={handleCreateRequest} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                      <div className="inline-flex">
                        {/* <BiDonateHeart className="w-5 h-5 mr-2" /> */}
                        Request
                      </div>
                    </button>
                    <button onClick={cancel} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
