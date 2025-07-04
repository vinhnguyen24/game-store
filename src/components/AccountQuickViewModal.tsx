"use client";

import React from "react";
import Image from "next/image";
import { Account } from "@/types/account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FiShoppingCart, // Added back
  FiTag,
  FiShield,
  FiZap,
  FiStar,
  FiCpu,
  FiPaperclip,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiKey,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";
import { convertToShortText } from "@/helper/common";
import AccountCarousel from "./Account/AccountCarousel";
const vesionMap = {
  gamota: "Gamota ⭐",
  japan: "Nhật Bản",
  global: "Quốc Tế 🌐",
};
interface AccountQuickViewModalProps {
  account: Account | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_DOMAIN || "http://localhost:1340";
const AccountQuickViewModal: React.FC<AccountQuickViewModalProps> = ({
  account,
  isOpen,
  onOpenChange,
}) => {
  if (!account) return null;
  const handlePurchase = () => {
    // Placeholder for purchase logic
    console.log(
      `Attempting to purchase account ID: ${account.id}, Title: ${account.title}`
    );
    alert(`Purchase initiated for ${account.title}! (Check console)`);
    // Potentially close modal or redirect after purchase attempt
    // onOpenChange(false);
  };

  const renderSaleStatusIcon = () => {
    switch (account.saleStatus) {
      case "sale":
        return <FiCheckCircle className="text-green-500" title="Đang bán" />;
      case "pending":
        return <FiClock className="text-yellow-500" title="Đang chờ" />;
      case "cancel":
        return <FiXCircle className="text-red-500" title="Đã hủy" />;
      default:
        return <FiCheckCircle className="text-green-500" title="Đang bán" />;
    }
  };
  const commanderLines = (account.commander ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 text-white border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            {account.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Xem nhanh account ID: {account.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image & Basic Info */}
          <div>
            {account.images?.length ? (
              <div className="bg-white shadow-xl rounded-lg p-6">
                <AccountCarousel
                  images={account.images.map((img) => `${BASE_URL}${img.url}`)}
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 mb-4">
                No image
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-green-400">
                Giá: {convertToShortText(Number(account.price).toFixed(2))}
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Phiên bản:{" "}
              <span className="font-semibold text-blue-400">
                {vesionMap[account.version]}
              </span>
            </p>
            <div className="flex justify-between">
              <Button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white "
                // disabled={account.saleStatus !== "sale"} // Disable if not on sale
              >
                <FiShoppingCart className="mr-2" /> Mua ngay
              </Button>
              <Link href={`/account/${account.documentId}`} passHref>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Xem đầy đủ <FiExternalLink className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Details */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Điểm nổi bật
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center">
                <FiStar className="mr-2 text-blue-400" /> VIP :{" "}
                <span className="font-bold ml-1">{account.vipLevel}</span>
              </p>
              <p className="flex items-center">
                <FiTag className="mr-2 text-red-400" /> Kills:{" "}
                <span className="font-bold ml-1">
                  {account.kills.toLocaleString()}
                </span>
              </p>
              <p className="flex items-center">
                <FiZap className="mr-2 text-yellow-400" /> Tăng tốc:{" "}
                <span className="font-bold ml-1">{account.speed} giờ</span>
              </p>
              <p className="flex items-center">
                <FiCpu className="mr-2 text-purple-400" /> Trọc vàng:{" "}
                <span className="font-bold ml-1">{account.goldenHeads}</span>
              </p>
              <p className="flex items-center">
                <FiShield className="mr-2 text-indigo-400" />
                Trang bị cam:{" "}
                <span className="font-bold ml-1">{account.equipment}</span>
              </p>
              <p className="flex items-center">
                <FiPaperclip className="mr-2 text-pink-400" /> Vé bay:{" "}
                <span className="font-bold ml-1">{account.tickets}</span>
              </p>
              {account.keyRally && (
                <p className="flex items-center">
                  <FiKey className="mr-2 text-teal-400" />{" "}
                  <span className="font-bold">Key rally/ def</span>
                </p>
              )}
            </div>

            <h3 className="text-lg font-semibold text-yellow-400 mt-4 mb-2">
              Các thông tin khác
            </h3>
            <ul className="space-y-1 text-sm text-gray-300 list-disc list-inside">
              <li>
                <strong>Vũ trang:</strong> {account.emblem || "N/A"}
              </li>
              <li>
                <strong>Minh văn:</strong> {account.tattoo || "N/A"}
              </li>
              <li>
                <strong>Tài nguyên:</strong> {account.resources || "N/A"}
              </li>
              <li>
                <strong>Điểm hành động:</strong>{" "}
                {account.actionPoints?.toLocaleString() || "N/A"}
              </li>
              <li>
                <strong>Chỉ huy:</strong>
                <div className="space-y-1 mt-1">
                  {commanderLines.map((line, idx) => (
                    <div key={idx}>- {line}</div>
                  ))}
                </div>
              </li>
              <li>
                <strong>Nhà huyền thoại:</strong>{" "}
                <div className="space-y-1 mt-1">
                  {account.city_themes.map((theme, idx) => (
                    <div key={idx}>- {theme.name}</div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountQuickViewModal;
