import dayjs from "dayjs";

export function getRemainingTimeUntilMsTimestamp(timestampMs, Duration) {
  const nowDay = dayjs();
  const endDay = dayjs(timestampMs * 1000).add(Duration, "d");
  if (endDay.isBefore(nowDay)) {
    return {
      minutes: "00",
      hours: "00",
      days: "00",
      second: "00",
    };
  }

  return {
    minutes: getRemainingMinutes(endDay, nowDay),
    hours: getRemainingHours(endDay, nowDay),
    days: getRemainingDays(endDay, nowDay),
    second: getRemainingSecond(endDay, nowDay),
  };
  second;
}

function getRemainingSecond(endDay, nowDay) {
  const seconds = endDay.diff(nowDay, "s") % 60;
  return padWithZeros(seconds, 2);
}
function getRemainingMinutes(endDay, nowDay) {
  const minutes = endDay.diff(nowDay, "m") % 60;
  return padWithZeros(minutes, 2);
}
function getRemainingHours(endDay, nowDay) {
  const hours = endDay.diff(nowDay, "h") % 24;
  return padWithZeros(hours, 2);
}
function getRemainingDays(endDay, nowDay) {
  const days = endDay.diff(nowDay, "d");
  return days;
}

function padWithZeros(number, minLength) {
  const numberString = number.toString();
  if (numberString.length >= minLength) return numberString;
  return "0".repeat(minLength - numberString.length) + numberString;
}
