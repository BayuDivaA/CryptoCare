import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";
import ReactPaginate from "react-paginate";
import { getDetail, fetchCampaign, getAnotherDetail, getAddresses } from "../../smart_contract/SmartcontractInteract";
import loader_2 from "../../assets/loader_2.svg";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

export default function PaginatedItems({ itemsPerPage, currentFilter }) {
  const campaignData = getDetail();
  const address = getAddresses();

  const [isLoading, setIsLoading] = useState();
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsAnother, setCampaignsAnother] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState();

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
            (campaign.status === 1 &&
              currentFilter === "all" &&
              dayjs().unix() <
                dayjs(campaign.timestamp * 1000)
                  .add(campaign.duration, "d")
                  .unix()) ||
            (campaign.status === 1 &&
              campaign.category === currentFilter &&
              dayjs().unix() <
                dayjs(campaign.timestamp * 1000)
                  .add(campaign.duration, "d")
                  .unix())
        );
      const pageC = Math.ceil(currentI.length / itemsPerPage);
      const campaignAddress = address?.[currentI?.daftar];
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
        <div className="flex flex-col items-center justify-center my-5">
          <img src={loader_2} alt="loader" className="flex w-[50px] h-[50px] object-contain mx-5 mb-2 justify-center" />
          <p className="flex text-base font-semibold text-blue-gray-900">Loading Campaigns ...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex justify-center w-full my-8 italic font-semibold text-blue-gray-900">No live campaings yet.</div>
      ) : (
        <div className="flex justify-center">
          <div className="grid gap-3 md:grid-cols-4">
            {currentItems.map((campaign, i) => (
              <div key={i} className="flex justify-center">
                <CampaignCard {...campaign} />
              </div>
            ))}
          </div>
        </div>
      )}
      {currentItems.length !== 0 && (
        <div className="flex flex-row items-center justify-between">
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
