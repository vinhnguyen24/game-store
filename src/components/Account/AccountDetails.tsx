"use client";

import React, { useState } from "react";
import {
  FiTag,
  FiShield,
  FiZap,
  FiStar,
  FiCpu,
  FiPaperclip,
  FiKey,
} from "react-icons/fi";

import { Account } from "@/types/account";
import { convertToShortText } from "@/helper/common";
import { Button } from "@/components/ui/button";
import AccountCarousel from "./AccountCarousel";
import InfoBadge from "./InfoBadge";
import TitleHeader from "./TitleHeader";
import NegotiatePriceDialog from "./NegotiatePriceDialog";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "../AuthModal";
import { toast } from "sonner";

interface AccountProps {
  account: Account;
}

const AccountDetailPage = ({ account }: AccountProps) => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  /** Split commanders string thành các dòng */
  const commanderLines = (account.commander ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleNegotiate = async (
    price: number,
    message: string,
    phone: string
  ) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("User not found!");
        return;
      }
      await fetch("/api/negotiate", {
        method: "POST",
        body: JSON.stringify({
          accountId: account.id,
          price,
          message,
          buyerZalo: phone,
        }),
      });
      toast.success(
        "Tạo thương lượng thành công, vui lòng chờ phản hồi từ người bán."
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(
        `Tạo thương lượng thất bại: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 bg-gray-50">
      {/* ——— Title header ——— */}
      <TitleHeader
        id={account.id}
        title={account.title}
        version={account.version}
      />

      {/* ——— Main white card ——— */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ——— Left 2/3 ——— */}
          <div className="md:col-span-2">
            <div className="p-6 md:p-8">
              {/* Thông tin nổi bật */}
              <section className="mb-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  Thông tin nổi bật
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <InfoBadge
                    icon={<FiStar className="text-blue-500" />}
                    label="VIP:"
                    value={
                      account.vipLevel === 20 ? (
                        <span className="relative font-cinzel inline-flex items-center px-2 py-1  text-black ">
                          SVIP
                          <img
                            src={"/images/SVIP.webp"}
                            alt={"SVIP"}
                            style={{ width: "20px", height: "auto" }}
                          />
                        </span>
                      ) : (
                        account.vipLevel >= 17 && (
                          <span className="relative font-cinzel inline-flex items-center px-2 py-1  text-xs font-semibold ">
                            {account.vipLevel} 🔥
                          </span>
                        )
                      )
                    }
                    color="bg-blue-50"
                  />
                  <InfoBadge
                    icon={<FiTag className="text-red-500" />}
                    label="Kills:"
                    value={`${account.kills.toLocaleString()}B`}
                    color="bg-red-50"
                  />
                  <InfoBadge
                    icon={<FiZap className="text-yellow-500" />}
                    label="Tăng tốc:"
                    value={`${account.speed} ngày`}
                    color="bg-yellow-50"
                  />
                  <InfoBadge
                    icon={<FiCpu className="text-purple-500" />}
                    label="Trọc vàng:"
                    value={account.goldenHeads}
                    color="bg-purple-50"
                  />
                  <InfoBadge
                    icon={<FiShield className="text-indigo-500" />}
                    label="Trang bị cam:"
                    value={account.equipment}
                    color="bg-indigo-50"
                  />
                  <InfoBadge
                    icon={<FiPaperclip className="text-pink-500" />}
                    label="Vé bay:"
                    value={account.tickets}
                    color="bg-pink-50"
                  />
                  {account.keyRally && (
                    <InfoBadge
                      icon={<FiKey className="text-teal-500" />}
                      label="Key Rally/Def"
                      color="bg-teal-50"
                    />
                  )}
                </div>
              </section>

              {/* Chỉ huy & Nhà huyền thoại + Thông tin thêm */}
              <section className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {/* — Left column — */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Chỉ Huy &amp; Nhà huyền thoại
                  </h3>

                  <div className="space-y-1 text-gray-700 text-sm">
                    <strong>Chỉ Huy:</strong>
                    <div className="space-y-1 mt-1">
                      {commanderLines.map((line, idx) => (
                        <div key={idx}>- {line}</div>
                      ))}
                    </div>

                    {account.city_themes?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-1">
                          Nhà huyền thoại:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {account.city_themes.map((theme) => (
                            <span
                              key={theme.id}
                              className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full hover:bg-blue-200 transition"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* — Right column — */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Thông tin thêm
                  </h3>
                  <ul className="space-y-1 text-gray-600 text-sm">
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
                  </ul>
                </div>
              </section>
            </div>
          </div>

          {/* ——— Right 1/3 ——— */}
          <aside className="md:col-span-1 space-y-4">
            {/* Card giá / CTA */}
            <div className="bg-white shadow-xl rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-4">
                {convertToShortText(Number(account.price).toFixed(2))} (VNĐ)
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-3 cursor-pointer">
                Mua ngay
              </Button>

              <div className="border-t pt-4 flex justify-between text-sm text-gray-600">
                <span className="font-medium text-gray-700">
                  {account.sellerName}
                </span>
                {user ? (
                  <span
                    className="italic text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setOpenDialog(true)}
                  >
                    Thương lượng
                  </span>
                ) : (
                  <AuthModal>
                    <span className="italic text-blue-500 hover:underline cursor-pointer">
                      Thương lượng
                    </span>
                  </AuthModal>
                )}
              </div>
            </div>

            {account.images?.length ? (
              <div className="bg-white shadow-xl rounded-lg p-6">
                <AccountCarousel
                  images={account.images.map((img) => `${img.url}`)}
                />
              </div>
            ) : null}
          </aside>
        </div>
      </div>
      <NegotiatePriceDialog
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleNegotiate}
      />
    </div>
  );
};

export default AccountDetailPage;
