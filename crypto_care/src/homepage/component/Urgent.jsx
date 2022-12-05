import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import React from "react";
import UrgentCampaignCard from "./UrgentCard";

// import { TransactionContext } from '';
import dummyData from "../../utils/dummyData";

const Urgent = () => {
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 300;
  };
  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 300;
  };

  return (
    <div className="flex flex-col items-center bg-[#EFF2F2] py-3">
      <div className="flex w-5/6 m-2">
        <h1 className="md:text-3xl font-bold">
          <span className="text-[#E04D4D]">Urgent</span> Fundraising
        </h1>
      </div>
      <div className="flex w-full items-center justify-around">
        <MdChevronLeft onClick={slideLeft} className="hidden md:flex cursor-pointer items-center md:text-5xl text-8xl hover:rounded-full hover:bg-blue-300" />
        <div className="flex w-5/6 items-center mt-2">
          <div className="flex overflow-x-scroll scroll scroll-smooth pb-5" id="slider">
            <div className="flex flex-nowrap">
              {dummyData.reverse().map((Campaign, i) => Campaign.campaignType == "urgent" && <UrgentCampaignCard key={i} {...Campaign} />)}
              {/* Recently Urgent Campaign */}
            </div>
          </div>
        </div>
        <MdChevronRight onClick={slideRight} className="hidden md:flex cursor-pointer items-center md:text-5xl text-8xl hover:rounded-full hover:bg-blue-300" />
      </div>
    </div>
  );
};

export default Urgent;
