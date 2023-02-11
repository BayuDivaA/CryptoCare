import React, { useEffect } from "react";
import { SiEthereum } from "react-icons/si";
import { RiErrorWarningLine } from "react-icons/ri";
import banner from "../../../images/banner.png";

import dayjs from "dayjs";

const Page5 = ({ formData }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">
          Nearly done, <br /> let's check that things look right.
        </h1>
        {formData.title == "" || formData.bannerUrl == "" || formData.category == "" || formData.duration == 0 || !formData.minimum || formData.story == "" || formData.target == 0 ? (
          <div className="flex text-red-400 italic items-center text-base font-medium">
            <RiErrorWarningLine className="mr-1 text-lg" />
            <span> Please complete the information about your campaign!</span>
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col w-full gap-2 pb-12 mt-3 text-black">
          <div className="flex md:flex-row flex-col w-full gap-2">
            <div className="flex flex-col gap-2 w-full">
              <button className={`summary-grid ${formData.title == "" ? "bg-red-400" : "bg-blue-400"}`}>
                <span className="flex italic text-sm pb-2">Title</span>
                <span className="flex font-bold text-sm">{formData.title}</span>
              </button>

              <div className={`summary-grid flex justify-between" ${formData.target == 0 || formData.minimum == "" ? "bg-red-400" : "bg-blue-400"}`}>
                <div className="flex-1 flex-col">
                  <span className="flex italic text-sm pb-2">Target</span>
                  <span className="flex font-bold text-sm items-center">
                    <SiEthereum className=" text-sm font-bold text-[#302CED] mr-2" />
                    <div className="flex md:flex-row flex-col ">
                      {formData.target}
                      <span className="italic text-xs font-thin md:ml-2"> ( Rp.900000 )</span>
                    </div>
                  </span>
                </div>
                <div className="flex-1 flex-col pr-12">
                  <span className="flex italic text-sm pb-2">Minimum for Vote</span>
                  <span className="flex font-bold text-sm items-center">
                    <SiEthereum className=" text-sm font-bold text-[#302CED] mr-2" />
                    {formData.minimum}
                  </span>
                </div>
              </div>
              <div className={`summary-grid flex justify-between ${formData.duration == 0 ? "bg-red-400" : "bg-blue-400"}`}>
                <div className="flex-1 flex-col">
                  <span className="flex italic text-sm pb-2">Duration</span>
                  <span className="flex font-bold text-sm">{formData.duration} Days</span>
                </div>
                <div className="flex-1 flex-col pr-12">
                  <span className="flex italic text-sm pb-2">Deadline</span>
                  <span className="flex font-bold text-sm">{dayjs().add(formData.duration, "day").format("DD MMM YYYY")}</span>
                </div>
              </div>
              <div className={`summary-grid flex justify-between ${formData.category == "" ? "bg-red-400" : "bg-blue-400"}`}>
                <div className="flex-1 flex-col">
                  <span className="flex italic text-sm pb-2">Category</span>
                  <span className="flex font-bold text-sm">{formData.category}</span>
                </div>
                <div className="flex-1 flex-col pr-12">
                  <span className="flex italic text-sm pb-2">Type</span>
                  <span className="flex font-bold text-sm">{formData.campaignType == 0 ? "Normal" : "Urgent"}</span>
                </div>
              </div>
            </div>
            <div className={`flex flex-col gap-2 w-full summary-grid ${formData.bannerUrl == "" ? "bg-red-400" : "bg-blue-400"}`}>
              <span className="flex italic text-sm pb-2">Banner</span>
              <img src={formData.bannerUrl} alt="banner" />
            </div>
          </div>
          <div className={`summary-grid flex flex-col ${formData.story == "" ? "bg-red-400" : "bg-blue-400"}`}>
            <span className="flex italic text-sm pb-2">Story</span>
            <span className="flex font-bold text-sm">{formData.story}</span>
          </div>
        </div>
        {/* <div className="flex flex-col w-full gap-2 text-black">
          <div className="flex  flex-col md:flex-row w-full gap-2 mt-4">
            <div className="summary-grid gap-2">
              <span className="flex italic text-sm pb-2">Recipient Name</span>
              <span className="flex font-bold text-sm">Sudin</span>
            </div>
            <div className="summary-grid gap-2">
              <span className="flex italic text-sm pb-2">Recipient Location</span>
              <span className="flex font-bold text-sm">Bengkalis</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Page5;
