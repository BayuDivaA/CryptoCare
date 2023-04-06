import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { myContract } from "../../smart_contract/constants";
import { useContractFunction, useEthers } from "@usedapp/core";
import loader from "../../assets/loader_4.svg";
import { toast, Flip } from "react-toastify";

export default function UserNameModal({ isOpen, cancel }) {
  const { account } = useEthers();
  const [isLoading, setIsLoading] = useState();
  const [showAlert, setShowAlert] = useState();
  const [userName, setUserName] = useState("");

  const { state, send } = useContractFunction(myContract, "setUsername", { transactionName: "Set Username" });
  const { status } = state;
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", transition: Flip });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "Success change name.", type: "success", isLoading: false, autoClose: 5000, transition: Flip, delay: 2000 });
    } else if (status === "Fail") {
      toast.error("Error change name.", { delay: 2000 });
    } else {
    }
  }, [state]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (userName === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setIsLoading(true);
      send(account, userName);
      setIsLoading(false);
      setUserName("");
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Set Username</Dialog.Title>
                  <div className="my-4">
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
                          setUserName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {!isLoading ? (
                    <div className="flex justify-between">
                      <button onClick={handleCreateRequest} type="button" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-9000 ">
                        <div className="inline-flex">Change</div>
                      </button>
                      <button onClick={cancel} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 ">
                        Cancel
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
