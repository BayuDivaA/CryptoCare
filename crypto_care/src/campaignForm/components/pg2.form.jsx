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

const Page2 = ({ formData, setFormData }) => {
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
                value={formData.title}
                defaultValue="My default value"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  });
                }}
              />
              {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" /> */}
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
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
              <textarea
                className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-52"
                id="story-campaign"
                type="text"
                value={formData.story}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    story: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3">
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
                  <input
                    id={item.name}
                    type="radio"
                    value={item.name}
                    name="category"
                    className="hidden peer"
                    checked={formData.category == item.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      });
                    }}
                  />
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
          {/* <div className="flex -mx-3 mb-3">
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
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Page2;
