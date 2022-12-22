import React from "react";
import { SiEthereum } from "react-icons/si";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const RadioDuration = ({ duration }) => {
  return (
    <div class="flex col-span-2 items-center pl-4 rounded-lg border border-gray-200 bg-gray-200 ">
      <input id={duration} type="radio" value={duration} name="duration-radio" className="w-5 h-5  bg-gray-100 border-gray-300  peer-checked:text-[#302CED] cursor-pointer text-[#302CED]" />
      <label for={duration} className="py-2 ml-2 w-full text-base font-medium cursor-pointer">
        {duration} Days
      </label>
    </div>
  );
};

const Page4 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">
          Next, set the target and deadline <br />
          for the fundraising
        </h1>
        <form className="w-full py-5">
          <div className="flex -mx-3 pb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="fund-campaign">
                How much is needed for fundraising?
              </label>
              <label className="block text-xs mb-2" htmlFor="fund-campaign">
                Determine the amount of funds needed in Ether, and it will automatically display the conversion in USD and IDR
              </label>
              <div className="grid grid-cols-12 gap-2">
                <div class="flex col-span-6 relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SiEthereum className=" text-base font-bold text-[#302CED]" />
                  </div>
                  <input
                    type="number"
                    id="input-group-1"
                    className="bg-gray-200 border border-gray-200 text-gray-900 text-base rounded-lg focus:ring-blue-500 block w-full pl-10 p-2.5 focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="0.005"
                  />
                </div>
                <div class="flex col-span-3 text-sm justify-between text-[#302CED] italic border border-[#302CED] rounded-lg w-full items-center p-2.5">
                  <h1>USD</h1>
                  <h1>9999</h1>
                </div>
                <div class="flex col-span-3 text-sm justify-between text-[#302CED] italic border border-[#302CED] rounded-lg w-full items-center p-2.5">
                  <h1>IDR</h1>
                  <h1>9999</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex -mx-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="fund-campaign">
                How long will your campaign run?
              </label>
              <label className="block text-xs mb-2" htmlFor="fund-campaign">
                Choose the time that suits you and you need for your donation activity.
              </label>
              <div className="md:grid md:grid-cols-8 grid grid-cols-4 gap-2">
                {[3, 7, 30, 60].map((text, index) => (
                  <RadioDuration key={index} duration={text} />
                ))}
              </div>
            </div>
          </div>
        </form>
        <div className="flex w-full justify-end mt-5 mb-10">
          <button type="button" className="text-black border border-black hover:bg-blue-100 hover:border-blue-800 rounded-lg p-2.5 text-center inline-flex items-center mr-5">
            <AiOutlineArrowLeft className="text-xl" />
            <span className="sr-only">Icon description</span>
          </button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800  rounded-lg p-2.5 text-center inline-flex items-center">
            <AiOutlineArrowRight className="text-xl" />
            <span className="sr-only">Icon description</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page4;
