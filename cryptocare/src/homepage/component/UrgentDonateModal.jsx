import React, { useState, useEffect, Fragment } from "react";
import { BiDonateHeart } from "react-icons/bi";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useEthers, useEtherBalance } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { formatEther, parseEther } from "ethers/lib/utils";
import { toast, Flip } from "react-toastify";

export default function UrgentDonateModal({ isOpen, cancel, campaignAddress, title }) {
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [isLoading, setIsLoading] = useState();
  const [showAlert, setShowAlert] = useState();
  const [showAlert2, setShowAlert2] = useState();
  const [donatedValue, setDonatedValue] = useState("");

  const myContract = new Contract(campaignAddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "contribute", { transactionName: "Donate Urgent Campaign" });
  const { status, transaction } = state;

  const MsgSuccess = ({ closeToast, toastProps, transactions }) => (
    <div className="flex flex-col">
      <span>Donation Success</span>
      <div className="flex mt-2">
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
      toast.update(mining.current, { render: "Failed Donation. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
    } else {
    }
  }, [state]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (donatedValue <= 0 || donatedValue === "") {
      setShowAlert(true);
    } else if (etherBalance && donatedValue >= formatEther(etherBalance)) {
      setShowAlert2(true);
    } else {
      setIsLoading(true);
      send({ value: parseEther(donatedValue) });
      setDonatedValue("");
      setIsLoading(false);
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Donate to "{title}" campaign</Dialog.Title>
                  <div className="my-4">
                    {showAlert2 && (
                      <div className="mb-2 text-sm text-red-700 rounded-lg" role="alert">
                        <span className="font-medium">Warning!</span> The balance in your wallet is insufficient.
                      </div>
                    )}
                    {showAlert && (
                      <div className="mb-2 text-sm text-red-700 rounded-lg" role="alert">
                        <span className="font-medium">Alert!</span> Please input empty fill.
                      </div>
                    )}
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <input
                        className="appearance-none block w-full bg-gray-50 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="campaign-name"
                        type="text"
                        onChange={(e) => {
                          setDonatedValue(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-2 text-sm text-gray-blue-900 rounded-lg text-end">
                    Balance : <span className="font-medium">{etherBalance && (formatEther(etherBalance) - 0).toFixed(2)}</span>
                  </div>
                  {!isLoading ? (
                    <div className="flex justify-between">
                      <button onClick={cancel} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                        Cancel
                      </button>
                      <button onClick={handleDonate} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                        <div className="inline-flex">
                          <BiDonateHeart className="w-5 h-5 mr-2" />
                          Donate
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-center items-center">
                      <img src={loader} alt="loader" className="w-7 h-7 object-contain mr-2" />
                      <p className="text-base text-blue-gray-900">Waiting for Signature ...</p>
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
