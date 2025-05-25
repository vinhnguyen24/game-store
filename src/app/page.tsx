// app/page.tsx
"use client";

import { useState, useEffect, JSX } from "react";
import { apiFetch } from "@/lib/api";
import { Account, Version, SaleStatus } from "@/types/account";
import {
  FiSearch,
  FiStar,
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiImage,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const versionLabels: Record<Version, string> = {
  gamota: "Gamota",
  japan: "Nhật Bản",
  global: "Global",
};

const isSupportedImage = (mimeType: string) => {
  const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return supportedTypes.includes(mimeType);
};

const AccountImage = ({ image }: { image: Media }) => {
  if (!isSupportedImage(image.mime)) {
    return (
      <div className="h-48 bg-gray-200 flex flex-col items-center justify-center text-gray-500">
        <FiImage className="text-3xl mb-2" />
        <span>Định dạng ảnh không hỗ trợ</span>
        <span className="text-xs">{image.name}</span>
      </div>
    );
  }

  return (
    <div className="h-48 relative">
      <Image
        src={image.url}
        alt={image.alternativeText || image.caption || "Ảnh tài khoản game"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          // Fallback nếu ảnh load lỗi
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/placeholder-account.jpg";
        }}
      />
    </div>
  );
};

const StatusIcon = ({ status }: { status: SaleStatus }) => {
  switch (status) {
    case "pending":
      return <FiClock className="text-yellow-500" />;
    case "sale":
      return <FiCheckCircle className="text-green-500" />;
    case "cancel":
      return <FiXCircle className="text-red-500" />;
    default:
      return null;
  }
};

const statusLabels: Record<SaleStatus, string> = {
  pending: "Đang chờ",
  sale: "Đang bán",
  cancel: "Đã hủy",
};

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface Meta {
  pagination: Pagination;
}

interface AccountsResponse {
  meta: Meta;
  data?: unknown[]; // optional nếu bạn không dùng
}

const HomePage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await apiFetch<AccountsResponse>("/accounts?populate=*");

        setAccounts((res.data as Account[]) ?? []);
      } catch (err) {
        setError((err as Error).message || "Không thể tải danh sách tài khoản");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    return (
      account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.commander.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.legendaryHouse.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Đang tải danh sách tài khoản...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">SHOP TÀI KHOẢN GAME</h1>
        <p className="text-gray-600">
          Uy tín - Chất lượng - Giá tốt nhất thị trường
        </p>
      </header>

      {/* Search */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên tài khoản, chỉ huy, nhà huyền thoại..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Account List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
          >
            {/* Status Badge */}
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded flex items-center text-sm">
              <StatusIcon status={account.saleStatus} />
              <span className="ml-1">{statusLabels[account.saleStatus]}</span>
            </div>

            {/* Image Gallery */}
            {account.images?.length > 0 ? (
              <AccountImage image={account.images[0]} />
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                <FiImage className="text-3xl mr-2" />
                <span>Chưa có ảnh</span>
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg truncate">{account.title}</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {versionLabels[account.version]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">VIP</p>
                  <p className="font-semibold">{account.vipLevel}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-gray-500 text-sm">Giá</p>
                  <p className="text-red-600 font-bold text-xl">
                    {account.price.toLocaleString()} VND
                  </p>
                </div>
                <Link
                  href={`/account/${account.id}`}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    account.saleStatus === "sale"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  aria-disabled={account.saleStatus !== "sale"}
                >
                  <FiShoppingCart className="mr-2" />
                  {account.saleStatus === "sale"
                    ? "Mua ngay"
                    : "Không khả dụng"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy tài khoản phù hợp</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
