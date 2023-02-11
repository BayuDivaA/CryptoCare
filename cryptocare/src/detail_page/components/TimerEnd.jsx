import React, { useState, useEffect } from "react";
import { getRemainingTimeUntilMsTimestamp } from "../../utils/CountdownTimerUtils";

const defaultRemainingTime = {
  hours: "00",
  minutes: "00",
  days: "00",
  second: "00",
};

export const RequestCountdownTimer = ({ countdownTimestampsMs, durationCampaign }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampsMs, durationCampaign);
    }, 1000);
    return () => clearTimeout(intervalId);
  }, [countdownTimestampsMs, durationCampaign]);

  function updateRemainingTime(countdown, duration) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown, duration));
  }

  return (
    <div className="flex flex-row gap-1 text-xs text-white">
      <div className="flex">{remainingTime.hours}h</div>
      <span>:</span>
      <div className="flex">{remainingTime.minutes}m</div>
      <span>:</span>
      <div className="flex">{remainingTime.second}s</div>
    </div>
  );
};

export const UrgentTimeEnd = ({ countdownTimestampsMs, durationCampaign }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampsMs, durationCampaign);
    }, 1000);
    return () => clearTimeout(intervalId);
  }, [countdownTimestampsMs, durationCampaign]);

  function updateRemainingTime(countdown, duration) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown, duration));
  }

  return (
    <div className="flex flex-row gap-2 text-base text-bold text-white">
      <div className="flex">{remainingTime.days}d</div>
      {/* <span>:</span> */}
      <div className="flex">{remainingTime.hours}h</div>
      {/* <span>:</span> */}
      <div className="flex">{remainingTime.minutes}m</div>
      {/* <span>:</span> */}
      <div className="flex">{remainingTime.second}s</div>
    </div>
  );
};
