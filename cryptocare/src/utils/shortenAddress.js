function isStringAddress(value) {
  return typeof value === "string" && value.length > 0;
}

export const shortenAddress = (address) => {
  if (!isStringAddress(address)) return "-";
  if (address.length <= 10) return address;
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};

export const shortenAddress2 = (address) => {
  if (!isStringAddress(address)) return "-";
  if (address.length <= 14) return address;
  return `${address.slice(0, 7)}...${address.slice(address.length - 6)}`;
};
