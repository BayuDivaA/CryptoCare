import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";
import ReactPaginate from "react-paginate";
import { getDetail, fetchCampaign } from "../../smart_contract/SmartcontractInteract";
import loader_2 from "../../assets/loader_2.svg";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

export default function PaginatedItems({ itemsPerPage, currentFilter }) {
  const campaignData = getDetail();

  const [isLoading, setIsLoading] = useState();
  const [campaigns, setCampaigns] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState();

  function handleOnFilter(e) {
    setFilter(e);
  }

  const endOffset = itemOffset + itemsPerPage;

  useEffect(() => {
    setIsLoading(true);
    campaignData.map((result) => {
      if (!result || result?.value === "undefined") {
        setIsLoading(true);
        setCampaigns([]);
      } else {
        setIsLoading(true);
        setCampaigns(campaignData);
      }
    });

    if (campaigns.length !== 0) {
      const parsedCampaigns = fetchCampaign(campaigns);
      const currentI = parsedCampaigns
        .reverse()
        .slice(itemOffset, endOffset)
        .filter(
          (campaign) =>
            (campaign.active === true &&
              currentFilter === "all" &&
              dayjs().unix() <
                dayjs(campaign.timestamp * 1000)
                  .add(campaign.duration, "d")
                  .unix()) ||
            (campaign.active === true &&
              campaign.category === currentFilter &&
              dayjs().unix() <
                dayjs(campaign.timestamp * 1000)
                  .add(campaign.duration, "d")
                  .unix())
        );
      const pageC = Math.ceil(parsedCampaigns.length / itemsPerPage);
      setCurrentItems(currentI);
      setPageCount(pageC);

      setIsLoading(false);
    }
  }, [campaignData, campaigns, currentFilter]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % dummyData.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  const navigate = useNavigate();
  function allCampaignsHandle() {
    navigate("/campaigns");
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center flex-col my-5 justify-center">
          <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
          <p className="flex text-base text-blue-gray-900 font-semibold">Loading Campaigns ...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex justify-center italic font-semibold w-full my-8 text-blue-gray-900">No campaings yet.</div>
      ) : (
        <div className="flex justify-center">
          <div className="grid md:grid-cols-4 gap-3">
            {currentItems.map((campaign, i) => (
              <div key={i} className="flex justify-center">
                <CampaignCard {...campaign} />
              </div>
            ))}
          </div>
        </div>
      )}
      {currentItems.length !== 0 && (
        <div className="flex flex-row justify-between items-center">
          <ReactPaginate
            breakLaber="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="flex list-none justify-left gap-0.5 text-m my-5"
            pageLinkClassName="py-1 px-2 pointer-cursor rounded-md font-normal hover:bg-[#302CED] hover:text-white"
            previousLinkClassName="py-1 px-2 pointer-cursor rounded-md font-normal hover:bg-[#302CED] hover:text-white"
            nextLinkClassName="py-1 px-2 pointer-cursor rounded-md font-normal hover:bg-[#302CED] hover:text-white"
            activeLinkClassName="bg-[#302CED] text-white"
          />
          <button className="text-white hover:text-[#302CED] cursor-pointer" onClick={allCampaignsHandle}>
            See more...
          </button>
        </div>
      )}
    </>
  );
}
