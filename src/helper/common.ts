export const convertToShortText = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return "0tr";

  const million = numericPrice / 1_000_000;

  const rounded = Number.isInteger(million)
    ? million.toString()
    : million.toFixed(1);

  return `${rounded}tr`;
};

export const versionColorMap = {
  gamota: "bg-orange-600",
  japan: "bg-red-500",
  global: "bg-green-600",
};

export const vesionMap = {
  gamota: "Gamota ⭐",
  japan: "Nhật Bản",
  global: "Quốc Tế 🌐",
};
