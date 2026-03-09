export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number, decimals = 2): string => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
  }).format(num);
};
