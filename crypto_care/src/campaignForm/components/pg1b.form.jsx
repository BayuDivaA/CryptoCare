import React from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const Page1b = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl font-bold py-5">
          Hi, <i>0x23j48d73ik998!</i>{" "}
        </h1>
        <form className="w-full py-5">
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-sm font-bold" htmlFor="full-name">
                What is your full name?
              </label>
              <label className="block text-xs mb-2" htmlFor="full-name">
                Name must match ID card.
              </label>
              <input className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="full-name" type="text" placeholder="Jane" />
              {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" /> */}
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-sm font-bold" htmlFor="email-address">
                Enter your email address?
              </label>
              <label className="block text-xs mb-2" htmlFor="email-address">
                Make sure your email address is accessible so you don't miss any notifications.
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email-address"
                type="text"
                placeholder="example@gmail.com"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-sm font-bold" htmlFor="social-media">
                What is your social media?
              </label>
              <label className="block text-xs mb-2" htmlFor="social-media">
                Make sure your social media can be found.
              </label>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <div className="block relative">
                <select className="appearance-none w-full bg-gray-200 border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="social-media">
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Texas</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
              <input className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="social-media" type="text" placeholder="90210" />
            </div>
          </div>
        </form>
        <div className="flex w-full justify-end mt-10">
          <button type="button" class="text-black border border-black hover:bg-blue-800 hover:text-white hover:border-blue-800 rounded-lg p-2.5 text-center inline-flex items-center mr-5 dark:bg-blue-600 ">
            <AiOutlineArrowLeft className="text-xl" />
            <span class="sr-only">Icon description</span>
          </button>
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800  rounded-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 ">
            <AiOutlineArrowRight className="text-xl" />
            <span class="sr-only">Icon description</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page1b;
