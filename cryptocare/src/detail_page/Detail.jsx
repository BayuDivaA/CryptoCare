import React, { useMemo } from "react";
import dayjs from "dayjs";
import Loader from "../components/CampaignDetailLoader";
import Navbar from "../homepage/component/Navbar";
import HeaderDetail from "./components/DetailHeader";
import BannerDetail from "./components/BannerDetail";
import TabDetail from "./components/TabDetail";
import CampaignAmount from "./components/CampaignAmount";
import DonateCampaign from "./components/DonateCampaign";
import DonationsHistory from "./components/DonationsHistory";
import { FiChevronLeft } from "react-icons/fi";
import { getSpecificCampaignDetail, getAnotherDetail, fetchCampaignDetail, fetchAnotherDetail } from "../smart_contract/SmartcontractInteract";
import { useNavigate, useParams } from "react-router";

export default function DetailPage() {
  const navigate = useNavigate();
  const { campaign_address } = useParams();
  const detail = getSpecificCampaignDetail(campaign_address);
  const another = getAnotherDetail(campaign_address);

  const detailData = useMemo(() => {
    if (!Array.isArray(detail) || detail.length < 12) {
      return null;
    }
    return fetchCampaignDetail(detail);
  }, [detail]);

  const anotherDetails = useMemo(() => {
    if (!Array.isArray(another) || another.length < 6) {
      return null;
    }
    return fetchAnotherDetail(another);
  }, [another]);

  const ended = useMemo(() => {
    if (!detailData) {
      return false;
    }

    const nowDay = dayjs();
    const endDay = dayjs(detailData.timestamp * 1000).add(detailData.duration, "d");
    return nowDay.unix() > endDay.unix();
  }, [detailData]);

  const isLoading = !detailData || !anotherDetails;

  if (isLoading) {
    return (
      <>
        <Loader />
        <div className="min-h-screen">
          <div className="gradient-bg-form">
            <Navbar showList={false} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-form">
          <Navbar showList={false} />
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 md:py-6">
            <div className="flex items-center justify-center">
              <div className="flex w-full flex-col gap-3 lg:flex-row">
                <div className="flex w-full flex-col rounded-md bg-white px-4 py-4 shadow-2xl sm:px-6 lg:w-2/3">
                  <div className="flex items-center mb-2 text-black cursor-pointer hover:font-medium" onClick={() => navigate(-1)}>
                    <FiChevronLeft className="mr-2" />
                    Back
                  </div>
                  <HeaderDetail {...detailData} caddress={campaign_address} />
                  <BannerDetail {...detailData} />
                  <TabDetail {...detailData} caddress={campaign_address} />
                </div>
                <div className="flex w-full flex-col gap-3 lg:w-1/3">
                  <CampaignAmount {...detailData} caddress={campaign_address} />
                  {!ended ? <DonateCampaign {...detailData} {...anotherDetails} caddress={campaign_address} /> : ""}
                  <DonationsHistory {...anotherDetails} caddress={campaign_address} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
