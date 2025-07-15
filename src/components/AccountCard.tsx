import { FC } from "react";
import Link from "next/link";
import { Account } from "../types/account";
import { convertToShortText } from "@/helper/common";

interface Props {
  account: Account;
  onQuickView: (account: Account) => void;
}

const AccountCard: FC<Props> = ({ account, onQuickView }) => {
  const statusLabelMap = {
    sale: "Đang bán",
    pending: "Chờ duyệt",
    cancel: "Đã hủy",
  } as const;

  type SaleStatus = keyof typeof statusLabelMap;

  function isSaleStatus(status: string): status is SaleStatus {
    return status === "sale" || status === "pending" || status === "cancel";
  }

  function getStatusLabel(status: string): string {
    if (isSaleStatus(status)) {
      return statusLabelMap[status];
    }
    return "Không xác định";
  }

  const vesionMap = {
    gamota: "Gamota ⭐",
    japan: "Nhật Bản",
    global: "Quốc Tế 🌐",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all w-full max-w-sm card-hover-effect relative">
      <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full shadow">
        {getStatusLabel(account.saleStatus)}
      </span>
      <img
        src={"/images/default-account.jpg"}
        alt="Game Account"
        className="rounded-xl w-full aspect-video object-cover"
      />

      <div className="mt-3 space-y-1">
        <h2 className="font-semibold text-lg text-gray-800">
          {account.title}{" "}
          {account.keyRally && (
            <span className="text-red-500">🔒 Key rally/def</span>
          )}
        </h2>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
            {vesionMap[account.version]}
          </span>
          <span
            className={`bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full`}
          >
            {account.vipLevel === 20 ? (
              <span className="flex items-center font-bold">
                SVIP
                <img
                  src="/images/SVIP.webp"
                  alt="SVIP"
                  className="svip-inline-badge inline-block"
                />
              </span>
            ) : (
              <span
                className={`${account.vipLevel >= 18 ? "fire-effect" : ""}`}
              >
                {`VIP ${account.vipLevel}`}
              </span>
            )}
          </span>
          {account.keyRally && (
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Key Rally
            </span>
          )}
        </div>

        <ul className="text-sm text-gray-600 space-y-0.5 mt-1">
          <li>📅 {account.speed} days speed</li>
          <li>🎫 {account.tickets} vé</li>
          <li>🏰 {account.city_themes?.length} nhà HT</li>
        </ul>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-yellow-600">
            {convertToShortText(Number(account.price).toFixed(2))} (VND)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onQuickView(account)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              Xem nhanh
            </button>
            <Link href={`/account/${account.documentId}`} passHref>
              <button className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 cursor-pointer">
                Xem đầy đủ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
