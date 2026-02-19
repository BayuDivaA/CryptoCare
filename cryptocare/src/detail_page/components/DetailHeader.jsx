import dayjs from "dayjs";
import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import ReportRefundDropdown from "./ReportRefundDropdown";
import { checkIfDonor, checkIfReported } from "../../smart_contract/SmartcontractInteract";
import { useEthers } from "@usedapp/core";
import ReportConfirmation from "./ReportConfirmation";
import RefundConfirmation from "./RefundConfirmation";
import { UrgentTimeEnd } from "./TimerEnd";

export default function HeaderDetail({ timestamp, title, donatursCount, caddress, duration, type, status }) {
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
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="w-full min-w-0">
          <div className="flex break-words text-lg font-bold leading-tight sm:text-xl">{title}</div>
          <div className="flex text-sm text-blue-gray-300">{createDate}</div>
        </div>
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start">
          <div className="flex items-center sm:mr-4">
            <FiUsers className="mr-2" />
            {donatursCount}
          </div>
          {ifVoter && <ReportRefundDropdown handleReport={reportConfirmationHandle} handleRefund={refundConfirmationHandle} />}
        </div>
      </div>
      {/* 0 - Waiting Validation, 1 - Active Campaign, 2 - Invalid Campaign, 3 - Ended Campaign */}
      {type === 1 && !ended ? (
        <div className="flex flex-row items-center justify-between px-4 py-2 mt-2 text-white bg-blue-300 rounded-md">
          <div className="">Ends In</div>
          <UrgentTimeEnd countdownTimestampsMs={timestamp} durationCampaign={duration} />
        </div>
      ) : (
        ""
      )}
      {status === 3 || ended ? <div className="flex flex-row items-center justify-center px-4 py-2 mt-2 italic font-bold text-white bg-red-400 rounded-md">ENDED</div> : ""}
      {status === 0 ? <div className="flex flex-row items-center justify-center px-4 py-2 mt-2 italic font-bold text-white bg-blue-400 rounded-md">WAITING VALIDATION</div> : ""}
      {status === 2 ? <div className="flex flex-row items-center justify-center px-4 py-2 mt-2 italic font-bold text-white bg-red-400 rounded-md">INVALID CAMPAIGN</div> : ""}
    </>
  );
}
