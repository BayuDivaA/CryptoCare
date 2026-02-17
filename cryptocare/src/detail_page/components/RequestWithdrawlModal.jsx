import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SiEthereum } from "react-icons/si";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import { formatEther, parseUnits } from "@ethersproject/units";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";
import { OPTIMISM_SEPOLIA_EXPLORER, OPTIMISM_SEPOLIA_RPC_URL } from "../../smart_contract/network";

export default function RequestWithdrawlModal({ isOpen, cancel, caddress, collectedFunds }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMinimal, setAlertMinimal] = useState(false);
  const [availableWei, setAvailableWei] = useState(BigNumber.from(0));
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    recipient: "",
  });
  const { description, value, recipient } = formData;

  const myContract = new Contract(caddress, contractABICampaign);
  const { state, send } = useContractFunction(myContract, "createWithdrawl", { transactionName: "Create Request Withdrawl" });
  const { status, transaction } = state;
  const availableEth = Number(formatEther(availableWei));

  const mining = React.useRef(null);

  useEffect(() => {
    let mounted = true;
    const provider = new JsonRpcProvider(OPTIMISM_SEPOLIA_RPC_URL);

    async function loadAvailableBalance() {
      if (!caddress) return;
      try {
        const balance = await provider.getBalance(caddress);
        if (mounted) {
          setAvailableWei(balance);
        }
      } catch (_err) {
        // keep the previous balance if RPC fails temporarily
      }
    }

    loadAvailableBalance();
    const timer = setInterval(loadAvailableBalance, 10000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [caddress, isOpen]);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      setIsLoading(true);
      toast.update(mining.current, { render: "Request transaction is being mined...", type: "loading", transition: Flip, autoClose: false });
    } else if (status === "PendingSignature") {
      setIsLoading(true);
      mining.current = toast.loading("Waiting for wallet signature...", { autoClose: false });
    } else if (status === "Exception") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Request canceled or rejected from wallet.", type: "error", isLoading: false, draggable: true, autoClose: 5000, transition: Flip });
    } else if (status === "Success") {
      setIsLoading(false);
      toast.update(mining.current, {
        render: (
          <div className="flex flex-col gap-2">
            <span>Request withdrawl created successfully.</span>
            <a href={`${OPTIMISM_SEPOLIA_EXPLORER}/tx/${transaction?.hash}`} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
              View Transaction
            </a>
          </div>
        ),
        type: "success",
        isLoading: false,
        draggable: true,
        autoClose: 7000,
        transition: Flip,
      });
      setFormData({ description: "", value: "", recipient: "" });
      cancel();
    } else if (status === "Fail") {
      setIsLoading(false);
      toast.update(mining.current, { render: "Failed request withdrawl. Please try again.", type: "error", isLoading: false, autoClose: 5000, draggable: true, transition: Flip });
    } else {
      setIsLoading(false);
    }
  }, [status, cancel, transaction]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (description === "" || value === "" || recipient === "") {
      setShowAlert(true);
      return;
    }

    let requestWei;
    try {
      requestWei = parseUnits(value, 18);
    } catch (_err) {
      toast.error("Invalid amount format.");
      return;
    }

    if (requestWei.lte(0)) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    if (requestWei.gt(availableWei)) {
      setAlertMinimal(true);
      return;
    }

    setIsLoading(true);
    send(description, requestWei, recipient);
    setShowAlert(false);
    setAlertMinimal(false);
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Create Request Withdrawl</Dialog.Title>
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
                      <div className="mb-2 text-xs text-blue-gray-700">
                        Available donation balance: <span className="font-semibold">{availableEth.toFixed(6)} ETH</span>
                      </div>

                      {alertMinimal && (
                        <div className="mb-2 text-sm text-red-700 rounded-lg italic" role="alert">
                          Request exceeds available donation balance.
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
                              value: e.target.value,
                            });
                          }}
                          type="number"
                          id="donate-value"
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900  block flex-1 min-w-0 w-full text-base p-2.5 "
                          min="0.01"
                          step="0.0001"
                          max={availableEth > 0 ? availableEth : undefined}
                          placeholder="0,05"
                        />
                      </div>
                    </div>
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <label className="block text-base mb-2" htmlFor="campaign-name">
                        Set recipient address
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-50 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="campaign-name"
                        type="text"
                        placeholder="0x000.."
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            recipient: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {!isLoading ? (
                    <div className="flex justify-between">
                      <button onClick={handleCreateRequest} type="button" disabled={isLoading} className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-blue-9000 ">
                        <div className="inline-flex">
                          {/* <BiDonateHeart className="w-5 h-5 mr-2" /> */}
                          Request
                        </div>
                      </button>
                      <button onClick={cancel} disabled={isLoading} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 disabled:text-gray-300 hover:text-red-900 ">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-center items-center">
                      <img src={loader} alt="loader" className="w-7 h-7 object-contain mr-2" />
                      <p className="text-base text-blue-gray-900">{status === "Mining" ? "Transaction is being mined..." : "Waiting for wallet signature..."}</p>
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
