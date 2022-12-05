import React, { useState } from "react";
import { BiFilter } from "react-icons/bi";
import PaginatedItems from "./CampaignPagination";

const FilterButton = ({ text }) => {
  return (
    <li>
      <input type="radio" id={text} name="filter" value={text} className="hidden peer" />
      <label
        htmlFor={text}
        className="capitalize inline-flex justify-between items-center mx-2 py-1 px-3 text-[#302CED] white-glassmorphism rounded-full border border-[#302CED] cursor-pointer hover:border-transparent hover:text-white hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]"
      >
        {text}
      </label>
    </li>
  );
};

const FilterButtonDropdown = ({ text }) => {
  return (
    <li>
      <div className="flex rounded items-center my-1">
        <input type="radio" id={text} name="filterDropdown" value={text} className=" text-blue-600 hidden peer" />
      </div>
      <label htmlFor={text} className="capitalize font-medium  mx-2 py-2 px-2 rounded-md  hover:text-white cursor-pointer hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]">
        {text}
      </label>
    </li>
  );
};

const Campaign = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="flex flex-col items-center py-3">
      <div className="flex w-5/6 m-5 items-center justify-between md:justify-start">
        <h1 className="md:text-3xl font-bold mr-10">Open Donations</h1>
        <ul className="text-black md:flex hidden flex-row list-none items-center flex-initial">
          {["all", "education", "childern", "health", "disaster", "homeless"].map((text, index) => (
            <FilterButton key={index} text={text} id={text} value={text} />
          ))}
        </ul>
        <div className="z-10 flex relative justify-end md:hidden">
          {toggleMenu ? (
            <button className="text-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button" onClick={() => setToggleMenu(false)}>
              Show only <BiFilter fontSize={28} className="text-blue-500 md:hidden cursor-pointer" />
            </button>
          ) : (
            <button className="text-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button" onClick={() => setToggleMenu(true)}>
              Show only <BiFilter fontSize={28} className="text-blue-500 md:hidden cursor-pointer" />
            </button>
          )}
          {toggleMenu && (
            <ul className="absolute z-10 white-glassmorphism rounded p-2 text-sm text-gray-700 translate-y-12">
              {["all", "education", "childern", "health", "disaster", "homeless"].map((text, i) => (
                <FilterButtonDropdown key={i} text={text} id={text} value={text} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-5/6">
        <PaginatedItems itemsPerPage={8} />
      </div>
    </div>
  );
};

export default Campaign;
