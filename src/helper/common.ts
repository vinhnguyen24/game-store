export const convertToShortText = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return "0tr";

  const million = numericPrice / 1_000_000;

  const rounded = Number.isInteger(million)
    ? million.toString()
    : million.toFixed(1);

  return `${rounded}tr`;
};

// Map version game
export const versionColorMap = {
  gamota: "bg-orange-600",
  japan: "bg-red-500",
  global: "bg-green-600",
};

export const versionMap = {
  gamota: "Gamota ⭐",
  japan: "Nhật Bản",
  global: "Quốc Tế 🌐",
};

// Convert status đàm phán sang UI hiển thị
export type NegotiationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"
  | "completed";

type StatusUI = {
  label: string;
  color: string;
};

export const getNegotiationStatusUI = (status: NegotiationStatus): StatusUI => {
  switch (status) {
    case "pending":
      return {
        label: "Đang thương lượng",
        color: "text-yellow-600",
      };
    case "accepted":
      return {
        label: "Đã chốt giá",
        color: "text-green-600",
      };
    case "rejected":
      return {
        label: "Bị từ chối",
        color: "text-red-600",
      };
    case "expired":
      return {
        label: "Hết thời gian",
        color: "text-gray-500",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        color: "text-gray-400",
      };
    case "completed":
      return {
        label: "Hoàn tất giao dịch",
        color: "text-blue-600",
      };
  }
};
