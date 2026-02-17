import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SiEthereum } from "react-icons/si";
import { contractABICampaign } from "../../smart_contract/constants";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import { formatEther, parseUnits } from "@ethersproject/units";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";
import { OPTIMISM_SEPOLIA_EXPLORER, OPTIMISM_SEPOLIA_RPC_URL } from "../../smart_contract/network";
import { useEthers } from "@usedapp/core";
const BALANCE_POLL_INTERVAL_MS = 30000;

export default function RequestWithdrawlModal({ isOpen, cancel, caddress, collectedFunds }) {
  const { account } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMinimal, setAlertMinimal] = useState(false);
  const [availableWei, setAvailableWei] = useState(BigNumber.from(0));
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    recipient: "",
  });
  const { description, value, recipient } = formData;
  const hasValidAddress = Boolean(caddress && caddress.startsWith("0x") && caddress.length === 42);

  const myContract = new Contract(hasValidAddress ? caddress : "0x0000000000000000000000000000000000000000", contractABICampaign);
  const { state, send } = useContractFunction(myContract, "createWithdrawl", { transactionName: "Create Request Withdrawl" });
  const { status, transaction, errorMessage, error } = state;
  const availableEth = Number(formatEther(availableWei));

  const mining = React.useRef(null);
  const submitTimeout = React.useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
      }
    };
  }, []);

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
    const timer = setInterval(loadAvailableBalance, BALANCE_POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [caddress, isOpen]);

  useEffect(() => {
    if (status === "Mining") {
      setIsLoading(true);
      if (mining.current) {
        toast.update(mining.current, { render: "Request transaction is being mined...", type: "loading", transition: Flip, autoClose: false, isLoading: true });
      } else {
        mining.current = toast.loading("Request transaction is being mined...", { autoClose: false, transition: Flip });
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
      const fallbackMessage = "Request failed before wallet confirmation. Check recipient address, wallet network, and campaign rules.";
      const readableError = errorMessage || error?.message || fallbackMessage;
      if (mining.current) {
        toast.update(mining.current, { render: readableError, type: "error", isLoading: false, draggable: true, autoClose: 7000, transition: Flip });
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
      const successContent = (
        <div className="flex flex-col gap-2">
          <span>Request withdrawl created successfully.</span>
          <a href={`${OPTIMISM_SEPOLIA_EXPLORER}/tx/${transaction?.hash}`} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
            View Transaction
          </a>
        </div>
      );
      if (mining.current) {
        toast.update(mining.current, {
          render: successContent,
          type: "success",
          isLoading: false,
          draggable: true,
          autoClose: 7000,
          transition: Flip,
        });
      } else {
        toast.success(successContent, { draggable: true, autoClose: 7000, transition: Flip });
      }
      setFormData({ description: "", value: "", recipient: "" });
      cancel();
    } else if (status === "Fail") {
      setIsLoading(false);
      setIsSubmitting(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }
      if (mining.current) {
        toast.update(mining.current, { render: "Failed request withdrawl. Please try again.", type: "error", isLoading: false, autoClose: 5000, draggable: true, transition: Flip });
      } else {
        toast.error("Failed request withdrawl. Please try again.", { autoClose: 5000, draggable: true, transition: Flip });
      }
    } else if (!isSubmitting) {
      setIsLoading(false);
    }
  }, [status, cancel, transaction, errorMessage, error, isSubmitting]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!hasValidAddress) {
      toast.error("Campaign address is not ready.");
      return;
    }

    const normalizedDescription = description.trim();
    const normalizedRecipient = recipient.trim();
    if (normalizedDescription === "" || value === "" || normalizedRecipient === "") {
      setShowAlert(true);
      return;
    }
    if (!isAddress(normalizedRecipient)) {
      toast.error("Recipient address is invalid.");
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
    setIsSubmitting(true);
    if (submitTimeout.current) {
      clearTimeout(submitTimeout.current);
    }
    submitTimeout.current = setTimeout(() => {
      setIsSubmitting(false);
      setIsLoading(false);
      toast.error("Wallet confirmation was not detected. Please retry and ensure wallet popup appears.");
    }, 20000);
    try {
      const tx = await send(normalizedDescription, requestWei, normalizedRecipient);
      if (!tx) {
        setIsSubmitting(false);
        setIsLoading(false);
        if (submitTimeout.current) {
          clearTimeout(submitTimeout.current);
          submitTimeout.current = null;
        }
        toast.error("Transaction was not submitted. Please confirm in wallet and try again.");
        return;
      }
      setShowAlert(false);
      setAlertMinimal(false);
    } catch (_err) {
      setIsSubmitting(false);
      setIsLoading(false);
      if (submitTimeout.current) {
        clearTimeout(submitTimeout.current);
        submitTimeout.current = null;
      }
      toast.error("Unable to submit request. Please try again.");
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
