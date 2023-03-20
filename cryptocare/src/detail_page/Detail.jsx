import React, { useState, useEffect } from "react";
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

  const [campaigns, setCampaigns] = useState([]);
  const [detail1, setDetail1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!detail || detail === "undefined") {
      setIsLoading(true);
    } else {
      setCampaigns(detail);
    }

    if (campaigns.length !== 0) {
      const parsedCampaigns = fetchCampaignDetail(campaigns);
      setDetail1(parsedCampaigns);
      setIsLoading(false);

      const nowDay = dayjs();
      const endDay = dayjs(detail1.timestamp * 1000).add(detail1.duration, "d");
      setEnded(nowDay.unix() > endDay.unix());
    }
  }, [detail, campaigns, campaign_address]);

  const another = getAnotherDetail(campaign_address);
  const [anotherDetails, setAnotherDetails] = useState();

  useEffect(() => {
    if (another === undefined) {
      setIsLoading(true);
    } else {
      if (another) {
        const parsed = fetchAnotherDetail(another);
        setAnotherDetails(parsed);
        setIsLoading(false);
      }
    }
  }, [another, campaign_address]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen">
        <div className="gradient-bg-form">
          <Navbar showList={false} />
          <div className="md:mx-40">
            <div className="flex justify-center items-center py-3">
              <div className="flex md:flex-row flex-col gap-2 md:w-full w-5/6">
                <div className="flex flex-col md:w-4/6 shadow-2xl bg-white rounded-md px-6 py-4">
                  <div className="flex text-black mb-2 items-center hover:font-medium cursor-pointer" onClick={() => navigate(-1)}>
                    <FiChevronLeft className="mr-2" />
                    Back
                  </div>
                  <HeaderDetail {...detail1} caddress={campaign_address} />
                  <BannerDetail {...detail1} />
                  <TabDetail {...detail1} caddress={campaign_address} />
                </div>
                <div className="flex md:w-2/6 flex-col gap-2">
                  <CampaignAmount {...detail1} caddress={campaign_address} />
                  {detail1.status === 1 && <DonateCampaign {...detail1} {...anotherDetails} caddress={campaign_address} />}
                  <DonationsHistory {...anotherDetails} caddress={campaign_address} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // <div className="flex bg-blue-200">{isLoading ? <Loader /> : <div className="">campaign address {detail1.story}</div>}</div>;
}
