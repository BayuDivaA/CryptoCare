import React, { useContext, useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import dummyData from "../../utils/dummyData";
import ReactPaginate from "react-paginate";

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((campaign, i) => (
          <div className="flex justify-center">
            <CampaignCard key={i} {...campaign} />
          </div>
        ))}
    </>
  );
}

export default function PaginatedItems({ itemsPerPage }) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = dummyData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(dummyData.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % dummyData.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
        <Items currentItems={currentItems} />
      </div>
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
        <button className="text-white hover:text-[#302CED] cursor-pointer" onClick={() => {}}>
          See more...
        </button>
      </div>
    </>
  );
}
