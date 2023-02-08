import React from "react";
import { useState } from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import Page1a from "./components/pg1a.form";
import Page1b from "./components/pg1b.form";
import Page2 from "./components/pg2.form";
import Page3 from "./components/pg3.form";
import Page4 from "./components/pg4.form";
import Page5 from "./components/pg5.summary";
import Navbar from "../homepage/component/Navbar";
import { MdFormatIndentDecrease } from "react-icons/md";

export default function Form() {
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState();
  const [formData, setFormData] = useState({
    title: "",
    bannerUrl: "",
    story: "",
    date: "",
    duration: 0,
    creatorAddress: "",
    target: 0,
    campaignType: 1,
    category: "",
    minimum: 0,
    preview: "",
  });

  var verified = true; //Check verified address

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        if (verified == true) {
          return <Page1a formData={formData} setFormData={setFormData} page={page} setPage={setPage} />;
        } else {
          return <Page1b />;
        }
      case 1:
        return <Page2 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Page3 formData={formData} setFormData={setFormData} preview={preview} setPreview={setPreview} />;
      case 3:
        return <Page4 formData={formData} setFormData={setFormData} />;
      case 4:
        return <Page5 formData={formData} setPage={setPage} />;
    }
  };

  function handleSubmit() {
    setPage(page + 1);
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="gradient-bg-form">
        <Navbar showList={false} />
        <div className="md:mx-40">
          <div className="flex justify-center items-center py-3">
            <div className="flex w-5/6">
              <p className="">
                <span className="text-[#302CED]">Create Campaign </span> : {page == 4 ? "Summary" : `${page + 1} of 4`}
              </p>
            </div>
          </div>
          {conditionalComponent()}

          <div className="flex justify-center my-5">
            <div className="flex w-5/6 justify-end">
              {page > 0 && (
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  className="text-black border border-black hover:bg-blue-800 hover:text-white hover:border-blue-800 rounded-lg p-2.5 text-center inline-flex items-center mr-5 dark:bg-blue-600 "
                >
                  <AiOutlineArrowLeft className="text-xl" />
                  <span className="sr-only">Icon description</span>
                </button>
              )}

              {page === 4 ? (
                <button
                  type="button"
                  disabled={formData.title == "" || formData.bannerUrl == "" || formData.category == "" || formData.duration == 0 || formData.minimum == 0 || formData.story == "" || formData.target == 0}
                  className="text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg p-2.5 px-4 text-center inline-flex items-center"
                >
                  Create Campaign
                </button>
              ) : page !== 0 || verified == false ? (
                <button type="button" onClick={handleSubmit} className="text-white bg-blue-700 hover:bg-blue-800  rounded-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600">
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
  );
}
