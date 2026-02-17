import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import Page1a from "./components/pg1a.form";
import Page1b from "./components/pg1b.form";
import Page2 from "./components/pg2.form";
import Page3 from "./components/pg3.form";
import Page4 from "./components/pg4.form";
import Page5 from "./components/pg5.summary";
import Navbar from "../homepage/component/Navbar";
import CreateCampaignLoader from "../components/CreateCampaignLoader";
import { useNavigate } from "react-router";

import { useContractFunction, useEthers } from "@usedapp/core";
import { myContract } from "../smart_contract/constants";
import { parseUnits } from "@ethersproject/units";
import { checkAddress, getUsername } from "../smart_contract/SmartcontractInteract";
import { toast, Flip } from "react-toastify";

export default function Form() {
  const { account } = useEthers();
  const userName = getUsername(account);
  const verified = checkAddress(account); //Check verified address
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState();
  const [formData, setFormData] = useState({
    title: "",
    bannerUrl: "",
    story: "",
    duration: 180,
    target: "",
    campaignType: 0,
    category: "",
    minimum: "",
  });

  const { title, bannerUrl, story, duration, target, campaignType, category, minimum } = formData;

  const { state, send } = useContractFunction(myContract, "createCampaigns", { transactionName: "CreateCampaign" });
  const { status, transaction, receipt } = state;

  const MsgSuccess = ({ transaction }) => (
    <div className="flex flex-col">
      <span>Success Create New Campaign</span>
      <div className="flex mt-4">
        <a href={"https://sepolia-optimism.etherscan.io/tx/" + transaction?.hash} target="_blank" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center">
          View Transaction
        </a>
      </div>
    </div>
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log(receipt);
    console.log(transaction);
    if (status === "Exception") {
      toast.error("Transaction signature rejected", { autoClose: 5000, transition: Flip, draggable: true, theme: "colored" });
    } else if (status === "Success") {
      toast.success(<MsgSuccess transaction={transaction} />, { closeButton: true, draggable: true, autoClose: false, isLoading: false, transition: Flip, theme: "colored" });
      navigate("/");
    } else if (status === "Fail") {
      toast.error("Failed Create Campaign. Try Again!", { autoClose: 5000, transition: Flip, draggable: true, theme: "colored" });
    } else {
    }
  }, [state]);

  const handleCreate = async (e) => {
    e.preventDefault();

    send(title, bannerUrl, story, duration, parseUnits(target, 18), campaignType, category, parseUnits(minimum, 18));
  };

  useEffect(() => {
    setPage(0);
    setFormData({
      ...formData,
      campaignType: 0,
      duration: 180,
    });
  }, [account]);

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        if (verified) {
          return <Page1a formData={formData} setFormData={setFormData} page={page} setPage={setPage} userName={userName} />;
        } else {
          return <Page1b formData={formData} setFormData={setFormData} userName={userName} />;
        }
      case 1:
        return <Page2 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Page3 formData={formData} setFormData={setFormData} preview={preview} setPreview={setPreview} />;
      case 3:
        return <Page4 formData={formData} setFormData={setFormData} />;
      case 4:
        return <Page5 formData={formData} />;
    }
  };

  function handleNext() {
    setPage(page + 1);
  }

  return (
    <>
      <div className="min-h-screen overflow-hidden">
        <div className="gradient-bg-form">
          <Navbar showList={false} />

          {status === "PendingSignature" && <CreateCampaignLoader text="Waiting Signature ..." />}
          {status === "Mining" && <CreateCampaignLoader text="Mining ..." />}
          <div className="md:mx-40">
            <div className="flex justify-center items-center py-3">
              <div className="flex w-5/6">
                <p className="">
                  <span className="text-[#302CED]">Create Campaign </span> : {page == 4 ? "Summary" : `${page + 1} of 4`}
                </p>
              </div>
            </div>
            {conditionalComponent()}

            <div className="flex justify-center my-5 pb-8">
              <div className="flex w-5/6 justify-end">
                {page > 0 && (
                  <button type="button" onClick={() => setPage(page - 1)} className="text-black border border-black hover:bg-blue-800 hover:text-white hover:border-blue-800 rounded-lg p-2.5 text-center inline-flex items-center mr-5">
                    <AiOutlineArrowLeft className="text-xl" />
                    <span className="sr-only">Icon description</span>
                  </button>
                )}

                {page === 4 ? (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={formData.title == "" || formData.bannerUrl == "" || formData.category == "" || formData.duration == 0 || formData.minimum == "0" || formData.story == "" || formData.target == "0"}
                    className="text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg p-2.5 px-4 text-center inline-flex items-center"
                  >
                    Create Campaign
                  </button>
                ) : page !== 0 || verified === false ? (
                  <button type="button" onClick={handleNext} className="text-white bg-blue-700 hover:bg-blue-800  rounded-lg p-2.5 text-center inline-flex items-center">
                    <AiOutlineArrowRight className="text-xl" />
                    <span className="sr-only">Icon description</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
