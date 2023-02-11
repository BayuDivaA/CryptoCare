import React, { useState, useEffect } from "react";
import Navbar from "../homepage/component/Navbar";
import CampaignCard from "./CampaignCard";
import { getDetail, fetchCampaign } from "../smart_contract/SmartcontractInteract";
import { BiFilter } from "react-icons/bi";
import loader_2 from "../assets/loader_2.svg";

const FilterButtonDropdown = ({ text, handle }) => {
  return (
    <li>
      <div className="flex rounded items-center my-1 mx-5">
        <input type="radio" onClick={handle} id={text} name="filterDropdown" value={text} className=" text-blue-600 hidden peer" />
      </div>
      <label htmlFor={text} className="capitalize font-medium  mx-2 py-2 px-2 rounded-md  hover:text-white cursor-pointer hover:bg-[#302CED] peer-checked:text-white peer-checked:bg-[#302CED]">
        {text}
      </label>
    </li>
  );
};

export default function AllCampaigns() {
  const campaignData = getDetail();

  const [isLoading, setIsLoading] = useState();
  const [campaigns, setCampaigns] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    campaignData.map((result) => {
      if (!result || result?.value === "undefined") {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setCampaigns(campaignData);
        setIsLoading(false);
      }
    });

    if (campaigns.length !== 0) {
      const parsedCampaigns = fetchCampaign(campaigns);
      const currentI = parsedCampaigns
        .reverse()
        .filter(
          (campaign) =>
            (currentFilter === "all" && searchValue === "") ||
            (campaign.category === currentFilter && campaign.title.toLowerCase().includes(searchValue.toLowerCase())) ||
            (currentFilter === "all" && campaign.title.toLowerCase().includes(searchValue.toLowerCase()))
        );
      setCurrentItems(currentI);
      setIsLoading(false);
    }

    console.log(campaigns);
  }, [campaignData, campaigns, currentFilter, searchValue]);

  function handleFilter(e) {
    setCurrentFilter(e.target.value);
    setToggleMenu(false);
  }

  function toggleMenuHandle() {
    if (toggleMenu) {
      setToggleMenu(false);
    } else {
      setToggleMenu(true);
    }
  }

  return (
    <div className="gradient-bg-welcome min-h-screen ">
      <Navbar showList={true} />{" "}
      <div className="flex flex-col items-center py-3 justify-center">
        <div className="flex w-5/6 m-5 items-center justify-between ">
          <h1 className="flex w-2/6  md:text-3xl text-lg font-bold ">Open Donations</h1>
          <div className=" flex mx-auto w-4/6 shadow-lg">
            <div className="flex rounded w-full">
              <div className="z-10 flex ">
                <button className="flex font-medium px-5 h-10 text-sm bg-blue-300 text-white rounded-l-lg text-center items-center" type="button" onClick={toggleMenuHandle}>
                  <BiFilter className="text-base md:mr-2" /> <span className="hidden md:flex capitalize">{currentFilter}</span>
                </button>

                {toggleMenu && (
                  <ul className="absolute z-10 white-glassmorphism rounded text-sm text-gray-700 translate-y-12">
                    {["all", "education", "disaster", "childern", "health", "animal", "pandemic", "food crisis", "war crisis"].map((text, i) => (
                      <FilterButtonDropdown key={i} text={text} handle={handleFilter} />
                    ))}
                  </ul>
                )}
              </div>
              <input onChange={(e) => setSearchValue(e.target.value)} type="search" className="px-4 py-2 w-full rounded-r-md" placeholder="Search..." />
            </div>
          </div>
        </div>
        <div className="w-5/6" id="cek">
          {isLoading ? (
            <div className="flex items-center flex-col my-5 justify-center">
              <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
              <p className="flex text-base text-blue-gray-900 font-semibold">Loading Campaigns ...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="flex justify-center italic text-semibold w-full mt-8">Campaign Not Found</div>
          ) : (
            <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
              {currentItems.map((campaign, i) => (
                <div key={i} className="flex justify-center">
                  <CampaignCard {...campaign} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
