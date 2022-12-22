import React from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { RiFloodLine } from "react-icons/ri";
import { GiMissileSwarm } from "react-icons/gi";
import { MdOutlineSchool, MdOutlineChildCare, MdOutlineNoFood, MdOutlineMedication, MdOutlinePets, MdOutlineCoronavirus } from "react-icons/md";

const category = [
  { name: "eduction", Icon: <MdOutlineSchool /> },
  { name: "disaster", Icon: <RiFloodLine /> },
  { name: "childern", Icon: <MdOutlineChildCare /> },
  { name: "health", Icon: <MdOutlineMedication /> },
  { name: "animal", Icon: <MdOutlinePets /> },
  { name: "pandemic", Icon: <MdOutlineCoronavirus /> },
  { name: "food crisis", Icon: <MdOutlineNoFood /> },
  { name: "war crisis", Icon: <GiMissileSwarm /> },
];

const Page2 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-5/6">
        <h1 className="md:text-3xl text-xl font-bold py-5 italic">
          Create a title and describe <br /> your fundraising goal in detail
        </h1>
        <form className="w-full py-5">
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="campaign-name">
                What is the name of your campaign?
              </label>
              <label className="block text-xs mb-2" htmlFor="campaign-name">
                Its best to choose a title that can briefly describe the purpose of your campaign
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="campaign-name"
                type="text"
                placeholder="Help African Childern"
              />
              {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" /> */}
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="description-campaign">
                Describe the fundraising that you will do?
              </label>
              <label className="block text-xs mb-2" htmlFor="description-campaign">
                A clear and good description can attract the attention of donors.
              </label>
              <textarea id="description-campaign" type="text" className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-40" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-12">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-base font-bold" htmlFor="category-campaign">
                Choose a fundraising category?
              </label>
              <label className="block text-xs mb-2" htmlFor="category-campaign">
                It's best to choose the appropriate category, so that the campaign can be found easily.
              </label>
            </div>
            <div className="md:grid md:grid-cols-8 grid grid-cols-4">
              {category.map((item, i) => (
                <div key={i} className="col-span-2 pb-2">
                  <input id={item.name} type="radio" value={item.name} name="category" className="hidden peer" />
                  <label
                    htmlFor={item.name}
                    className="capitalize flex justify-around md:text-base text-xs items-center mx-2 py-2 px-5 text-white bg-[#c0bffa] rounded-full cursor-pointer hover:border-transparent  hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
                  >
                    {item.Icon}
                    <span className="ml-2">{item.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-sm font-bold" htmlFor="recipient-name">
                Who is the recipient of your campaign funds?
              </label>
              <label className="block text-xs mb-2" htmlFor="recipient-name">
                The recipient can be the name of a person or the name of an organization or the name of a project.
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="recipient-name"
                type="text"
                placeholder="Crypto Care Foundation"
              />
            </div>
          </div>
          <div className="flex -mx-3 mb-3">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-sm font-bold" htmlFor="recipient-location">
                Where is the location of the recipient?
              </label>
              <label className="block text-xs mb-2" htmlFor="recipient-location">
                Contains the full address of the recipient, such as street name, city, country.
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="recipient-location"
                type="text"
                placeholder="in Cianjur, west java, indonesia."
              />
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

export default Page2;
