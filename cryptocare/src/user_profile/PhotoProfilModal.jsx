import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { myContract } from "../smart_contract/constants";
import { useContractFunction, useEthers } from "@usedapp/core";
import loader from "../assets/loader_4.svg";
import { toast } from "react-toastify";

import { create, CID } from "ipfs-http-client";
import { Buffer } from "buffer";
import { CiImport } from "react-icons/ci";

const projectId = "2J7fbfBVkAAJZK4WgZXuAiyZaVk";
const projectSecret = "9711aec7170f5329f319681b5430602b";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});

export default function PhotoProfilModal({ isOpen, cancel }) {
  const { account } = useEthers();
  const [isLoading, setIsLoading] = useState();
  const [showAlert, setShowAlert] = useState();
  const [photoUrl, setPhotoUrl] = useState("");

  const { state, send } = useContractFunction(myContract, "setPhoto", { transactionName: "Set Photo" });
  const { status } = state;
  const mining = React.useRef(null);

  useEffect(() => {
    console.log(status);
    if (status === "Mining") {
      toast.update(mining.current, { render: "Mining Transaction", type: "loading", className: "rotateY animated" });
    } else if (status === "PendingSignature") {
      mining.current = toast.loading("Waiting for Signature", { autoClose: false });
    } else if (status === "Exception") {
      toast.update(mining.current, { render: "Transaction signature rejected", type: "error", isLoading: false, autoClose: 5000, className: "rotateY animated", delay: 2000 });
    } else if (status === "Success") {
      toast.update(mining.current, { render: "Success change photo.", type: "success", isLoading: false, autoClose: 5000, className: "rotateY animated", delay: 2000 });
    } else if (status === "Fail") {
      toast.error("Error change photo.", { delay: 2000 });
    } else {
    }
  }, [state]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (photoUrl === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setIsLoading(true);
      send(account, photoUrl);
      setPhotoUrl("");
      setIsLoading(false);
      cancel();
    }
  };

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const retrieveFile = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files);

    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    setPhotoUrl("");

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await ipfs.add(file);
      const url = `https://crypto-care.infura-ipfs.io/ipfs/${created.path}`;
      console.log(url);
      setPhotoUrl(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={() => {}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-x-0 top-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Upload Photo Profile</Dialog.Title>
                  <div className="my-4">
                    {showAlert && (
                      <div className="mb-2 text-sm text-red-700 rounded-lg" role="alert">
                        <span className="font-medium">Alert!</span> Make sure you have "Import" and "Upload" the photo.
                      </div>
                    )}
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <form className="form" onSubmit={handleSubmit}>
                        <label htmlFor="photo-campaign" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100">
                          {preview ? (
                            <div className="flex h-full justify-center p-2">
                              {" "}
                              <img src={preview} />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <CiImport className="w-10 h-10 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to import</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG</p>
                            </div>
                          )}
                        </label>
                        <input id="photo-campaign" type="file" accept="image/png, image/jpeg, image/jpg" name="data" hidden onChange={retrieveFile} />
                        <div className="relative my-3">
                          <input
                            type="text"
                            id="campaign-banner-link"
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Blick 'Upload' button to generate your link image."
                            value={photoUrl}
                            required
                            readOnly
                            disabled
                          />
                          <button
                            type="submit"
                            disabled={file === null}
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 disabled:cursor-not-allowed disabled:bg-red-200"
                          >
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {!isLoading ? (
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
