import React, { useState, useEffect, Fragment } from "react";
import { SiEthereum } from "react-icons/si";
import { BiDonateHeart } from "react-icons/bi";
import { useContractFunction, useEthers } from "@usedapp/core";
import { parseEther } from "@ethersproject/units";
import { Dialog, Transition } from "@headlessui/react";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

export default function DonateCampaign({ caddress, minimContribution, daftar }) {
  const { account } = useEthers();
  const [isOpen, setIsOpen] = useState(false);
  const [donatedValue, setdonatedValue] = useState("");
  const [showAlert, setShowAlert] = useState();
  const [isLoading, setIsLoading] = useState();

  const myContract = new Contract(caddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "contribute", { transactionName: "Donate" });
  const { status, transaction } = state;

  function openModal() {
    if (donatedValue <= 0 || donatedValue === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setIsOpen(true);
    }
  }

  function setValue(e) {
    setdonatedValue(e.target.value);
  }

  const MsgSuccess = ({ closeToast, toastProps, transactions }) => (
    <div className="flex flex-col">
      <span>Donation Success</span>
      <div className="flex">
        <a href={"https://goerli-optimism.etherscan.io/tx/" + transactions?.hash} target="_blank" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center">
          View Transaction
        </a>
      </div>
    </div>
  );
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip, autoClose: false });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip });
    } else if (status === "None") {
      toast.update(mining.current, { render: <MsgSuccess transactions={transaction} />, type: "success", closeButton: true, draggable: true, autoClose: false, isLoading: false, transition: Flip, theme: "colored" });
    } else if (status === "Fail") {
      toast.update(mining.current, { render: "Failed Donation. Try Again!", type: "error", isLoading: false, autoClose: 5000, transition: Flip, theme: "colored", draggable: true });
    } else {
    }
  }, [state]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    send({ value: parseEther(donatedValue) });
    setdonatedValue("");
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="w-full px-6 py-4 bg-blue-600 shadow-xl rounded-md my-2 ">
        {showAlert && (
          <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-medium">Alert!</span> Please input the donation amount.
          </div>
        )}

        {!account ? (
          <div className="p-2 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-medium">Please connect to your wallet to be able to donate!</span>
          </div>
        ) : (
          <div className="">
            <div className="flex items-center">
              <div className="flex ">
                <span className="inline-flex items-center px-3 text-base text-white bg-gray-50 rounded-l-md ">
                  <SiEthereum className="text-blue-300" />
                </span>
                <input
                  onChange={setValue}
                  value={donatedValue}
                  type="number"
                  id="donate-value"
                  className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900  block flex-1 min-w-0 w-full text-base p-2.5 "
                  min="0.01"
                  step="0.01"
                  placeholder="0,05"
                />
              </div>
              <button
                onClick={openModal}
                disabled={account ? false : true}
                type="button"
                className="flex disabled:bg-red-600 disabled:cursor-not-allowed disabled:text-white text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-300  font-medium rounded-full text-base px-5 py-2.5 text-center ml-2"
              >
                Donate
              </button>
            </div>
            <p className="text-red-100 text-xs mt-2 italic">
              Donate more than <span className="font-semibold"> {minimContribution} Ether </span> to be able to vote
            </p>
          </div>
        )}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Donate Confirmation</Dialog.Title>
                  <div className="mt-2">
                    {!isLoading ? (
                      <p className="text-base text-blue-gray-900">
                        Are you sure you want to donate <span className="font-semibold">{donatedValue}</span> Ether ?
                      </p>
                    ) : (
                      <p className="text-base text-blue-gray-900">Waiting for Signature ...</p>
                    )}
                  </div>

                  {!isLoading ? (
                    <div className="mt-4 flex justify-between">
                      <button onClick={() => setIsOpen(false)} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                        Cancel
                      </button>
                      <button onClick={handleDonate} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                        <div className="inline-flex">
                          <BiDonateHeart className="w-5 h-5 mr-2" />
                          Donate Now
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
