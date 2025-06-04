import { FC, useState } from "react"; // Added useState
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiExternalLink, FiEye } from "react-icons/fi"; // Added FiEye
import AccountQuickViewModal from "./AccountQuickViewModal"; // Added
import { Account } from "../types/account";
import { Flashlight } from "lucide-react";
import { RiSpeedFill, RiTicket2Line } from "react-icons/ri";
import { LuCastle } from "react-icons/lu";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Props {
  account: Account;
}

const AccountCard: FC<Props> = ({ account }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  // const img = account.images?.[0]?.url || "/placeholder.jpg"; // Removed unused img variable

  const versionColorMap = {
    gamota: "bg-orange-600",
    japan: "bg-red-500",
    global: "bg-green-600",
  } as const;

  type VersionKey = keyof typeof versionColorMap;

  const version = account.version as VersionKey;
  const versionColor = versionColorMap[version] ?? "bg-gray-400";

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

  function convertToShortText(priceString: string): string {
    // Expects a string like "11.50"
    if (priceString.includes(".")) {
      const [integerPart, decimalPart] = priceString.split(".");
      // Ensure decimalPart has at least one digit before trying to access charAt(0)
      const decimalChar = decimalPart.length > 0 ? decimalPart.charAt(0) : "0";
      return `${integerPart}tr${decimalChar}`;
    } else {
      return `${priceString}tr`; // Should ideally not happen if toFixed(2) is used
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={clsx(
        "bg-[#1c1e2f] text-white rounded-xl p-4 shadow-md w-full max-w-xs relative cursor-pointer",
        account.vipLevel === 20 && "border-glow"
      )}
    >
      <div className="relative">
        <img
          src={"/images/default-account.jpg"}
          alt={account.title}
          className={clsx(
            "rounded-lg h-40 w-full object-cover",
            account.vipLevel === 20 && "ring-2 ring-yellow-400"
          )}
        />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-semibold leading-snug line-clamp-3">
          {account.title}
        </h3>

        <div className="flex flex-wrap gap-2 text-xs mt-1">
          <span className={clsx("px-2 py-1 rounded-full", versionColor)}>
            {vesionMap[account.version]}
          </span>
          {account.vipLevel === 20 ? (
            <span className="relative font-cinzel inline-flex items-center px-2 py-1 bg-black text-yellow-400 rounded-full animate-glow">
              SVIP⭐
            </span>
          ) : (
            account.vipLevel >= 17 && (
              <span className="relative font-cinzel inline-flex items-center px-2 py-1 bg-red-600 text-xs font-semibold rounded-full animate-fire">
                VIP {account.vipLevel} 🔥
              </span>
            )
          )}

          {account.keyRally && (
            <span className="relative inline-flex items-center px-2 py-1 bg-red-600 text-xs font-semibold rounded-full animate-fire inline-flex items-center gap-x-1">
              Key Rally/ Def 🎯
            </span>
          )}
          {account.vipLevel < 17 && (
            <span className="px-2 py-1 rounded-full inline-flex items-center gap-x-1 border border-white/20">
              VIP {account.vipLevel}
            </span>
          )}
          <span className=" px-2 py-1 rounded-full inline-flex items-center gap-x-1 border border-white/20">
            <RiSpeedFill />
            {account.speed} days Speed
          </span>
          <span className=" px-2 py-1 rounded-full inline-flex items-center gap-x-1 border border-white/20">
            <RiTicket2Line />
            {account.tickets} Vé
          </span>
          <span className=" px-2 py-1 rounded-full inline-flex items-center gap-x-1 border border-white/20">
            <LuCastle />
            {account.legendaryHouse}
          </span>
        </div>

        <div className="text-lg font-bold text-yellow-400">
          {convertToShortText(account.price.toFixed(2))} (VNĐ)
        </div>

        <div className="text-xs text-gray-400 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Flashlight size={14} />
            {new Date(account.createdAt).toLocaleDateString()}
          </span>
          <span className="italic">{getStatusLabel(account.saleStatus)}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-yellow-400 hover:bg-gray-700"
            onClick={() => setIsQuickViewOpen(true)}
          >
            <FiEye className="mr-1.5 h-3 w-3" /> Quick View
          </Button>
          <Link href={`/account/${account.id}`} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent hover:bg-gray-700"
              >
                Full Details <FiExternalLink className="ml-1.5 h-3 w-3" />
              </Button>
            </a>
          </Link>
        </div>
      </div>
      {isQuickViewOpen && (
        <AccountQuickViewModal
          account={account}
          isOpen={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />
      )}
    </motion.div>
  );
};

export default AccountCard;
