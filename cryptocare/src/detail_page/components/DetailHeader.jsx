import dayjs from "dayjs";
import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import ReportRefundDropdown from "./ReportRefundDropdown";
import { checkIfDonor, checkIfReported } from "../../smart_contract/SmartcontractInteract";
import { useEthers } from "@usedapp/core";
import ReportConfirmation from "./ReportConfirmation";
import RefundConfirmation from "./RefundConfirmation";
import { UrgentTimeEnd } from "./TimerEnd";

export default function HeaderDetail({ timestamp, title, donatursCount, caddress, duration, type, active }) {
  const { account } = useEthers();
  const ifVoter = checkIfDonor(caddress, account);
  const alreadyReported = checkIfReported(caddress, account);

  const createDate = dayjs(timestamp * 1000).format("D MMM YYYY");
  const nowDay = dayjs();
  const endDay = dayjs(timestamp * 1000).add(duration, "d");
  const ended = nowDay.unix() > endDay.unix();

  const [isReport, setIsReport] = useState(false);
  const [isRefund, setIsRefund] = useState(false);

  function reportConfirmationHandle() {
    setIsReport(true);
  }
  function refundConfirmationHandle() {
    setIsRefund(true);
  }

  return (
    <>
      <ReportConfirmation isOpen={isReport} closeHandle={() => setIsReport(false)} campaignAddress={caddress} alreadyReported={alreadyReported} />
      <RefundConfirmation isOpen={isRefund} closeHandle={() => setIsRefund(false)} campaignAddress={caddress} />
      <div className="flex flex-row justify-between items-center">
        <div className="">
          <div className="flex text-xl font-bold">{title}</div>
          <div className="flex text-sm text-blue-gray-300">{createDate}</div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <FiUsers className="mr-2" />
            {donatursCount}
          </div>
          {ifVoter && <ReportRefundDropdown handleReport={reportConfirmationHandle} handleRefund={refundConfirmationHandle} />}
        </div>
      </div>
      {type === 1 && !ended && active && (
        <div className="flex flex-row mt-2 bg-blue-300 justify-between items-center py-2 px-4 rounded-md text-white">
          <div className="">Ends In</div>
          <UrgentTimeEnd countdownTimestampsMs={timestamp} durationCampaign={duration} />
        </div>
      )}
      {!active || ended ? <div className="flex flex-row mt-2 bg-red-400 justify-center italic font-bold items-center py-2 px-4 rounded-md text-white">ENDED</div> : ""}
    </>
  );
}
