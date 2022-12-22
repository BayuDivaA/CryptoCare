import React from "react";
import { SiEthereum } from "react-icons/si";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import banner from "../../../images/banner.png";

const Page5 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">
          Nearly done, <br /> let's check that things look right.
        </h1>

        <div className="flex flex-col w-full gap-2 pb-12 text-black">
          <div className="flex md:flex-row flex-col w-full gap-2">
            <div className="flex flex-col gap-2 w-full">
              <div className="summary-grid">
                <span className="flex italic text-sm pb-2">Title</span>
                <span className="flex font-bold text-sm">Banjir bandang wakanda</span>
              </div>
              <div className="summary-grid">
                <span className="flex italic text-sm pb-2">Target</span>
                <span className="flex font-bold text-sm items-center">
                  <SiEthereum className=" text-sm font-bold text-[#302CED] mr-2" />
                  999999<span className="italic text-xs ml-2"> ( Rp.900000 )</span>
                </span>
              </div>
              <div className="summary-grid flex justify-between">
                <div className="flex flex-col">
                  <span className="flex italic text-sm pb-2">Category</span>
                  <span className="flex font-bold text-sm">Disaster</span>
                </div>
                <div className="flex flex-col pr-12">
                  <span className="flex italic text-sm pb-2">Type</span>
                  <span className="flex font-bold text-sm">Normal</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full summary-grid">
              <span className="flex italic text-sm pb-2">Banner</span>
              <img src={banner} alt="banner" className="w-full" />
            </div>
          </div>
          <div className="summary-grid flex flex-col">
            <span className="flex italic text-sm pb-2">Description</span>
            <span className="flex font-bold text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nulla similique, ducimus fuga blanditiis voluptatibus, placeat quis consequatur, ut vel et tenetur! Totam vitae ipsa cupiditate quo adipisci pariatur consectetur!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam tenetur rerum quo nulla quaerat, provident fuga? Magnam eligendi unde repellat. Dolore velit officia optio doloremque, sapiente id? Eum, blanditiis dicta.
            </span>
          </div>
          <div className="summary-grid flex flex-col">
            <span className="flex italic text-sm pb-2">Story</span>
            <span className="flex font-bold text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam provident officia earum! Sit fugiat porro reprehenderit in hic magni! Voluptas odit in vero, dolor ipsa placeat laudantium accusamus omnis laborum.
            </span>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 pb-12 text-black">
          <div className="flex  flex-col md:flex-row w-full gap-2">
            <div className="summary-grid gap-2">
              <span className="flex italic text-sm pb-2">Recipient Name</span>
              <span className="flex font-bold text-sm">Sudin</span>
            </div>
            <div className="summary-grid gap-2">
              <span className="flex italic text-sm pb-2">Recipient Location</span>
              <span className="flex font-bold text-sm">Bengkalis</span>
            </div>
          </div>
          <div className="flex md:flex-row flex-col w-full gap-2 mt-4">
            <div className="summary-grid">
              <span className="flex italic text-sm pb-2">Creator Name</span>
              <span className="flex font-bold text-sm">Sudin</span>
            </div>
            <div className="summary-grid ">
              <span className="flex italic text-sm pb-2">Creator E-Mail</span>
              <span className="flex font-bold text-sm">Sudin</span>
            </div>
            <div className="summary-grid ">
              <span className="flex italic text-sm pb-2">Creator Social Media</span>
              <span className="flex font-bold text-sm">Sudin</span>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end mt-5 mb-10">
          <button type="button" className="text-black border border-black hover:bg-blue-100 hover:border-blue-800 rounded-lg p-2.5 text-center inline-flex items-center mr-5">
            <AiOutlineArrowLeft className="text-xl" />
            <span className="sr-only">Icon description</span>
          </button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800  rounded-lg p-2.5 px-4 text-center inline-flex items-center">
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page5;
