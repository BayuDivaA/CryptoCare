import React from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const Page3 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">Next, tell us about your fundraiser</h1>
        <form className="w-full py-5">
          <div class="flex -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="photo-campaign">
                Upload your campaign banner.
              </label>
              <label className="block text-xs mb-2" htmlFor="photo-campaign">
                Banners may contain invitations related to your campaign, they may not contain elements of sound, taste, and politics.
              </label>

              <label
                for="photo-campaign"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="photo-campaign" type="file" class="hidden" />
              </label>
            </div>
          </div>
          <div className="flex -mx-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="story-campaign">
                Make a story related to the campaign.
              </label>
              <label className="block text-xs mb-2" htmlFor="story-campaign">
                Stories are better if they contain an introduction to the creator, about the problems he wants to solve, and the benefits of the campaign.
              </label>
              <textarea className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-52" id="story-campaign" type="text" />
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

export default Page3;
