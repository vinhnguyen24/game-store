// app/page.tsx
"use client";

import { useState, useEffect } from "react"; // Removed JSX
// import { apiFetch } from "@/lib/api"; // Removed apiFetch
import { Account } from "@/types/account"; // Removed Media, Version, SaleStatus
import { Button } from "@/components/ui/button";
import { SellAccountForm } from "@/components/SellAccountForm";
import {
  FiSearch,
  // FiStar, // Removed FiStar
  // FiShoppingCart, // Removed FiShoppingCart
  // FiClock, // Removed FiClock
  // FiCheckCircle, // Removed FiCheckCircle
  // FiXCircle, // Removed FiXCircle
  // FiImage, // Removed FiImage
} from "react-icons/fi";
// import Link from "next/link"; // Removed Link
// import Image from "next/image"; // Removed Image
import AccountCard from "@/components/AccountCard";
import accountData from "@/fakeData";

// const versionLabels: Record<Version, string> = { // Removed versionLabels
//   gamota: "Gamota",
//   japan: "Nhật Bản",
//   global: "Global",
// };

// const isSupportedImage = (mimeType: string) => { // Removing unused isSupportedImage function
//   const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
//   return supportedTypes.includes(mimeType);
// };

// const AccountImage = ({ image }: { image: Media }) => { // Removing unused AccountImage component
//   // Restoring AccountImage component
//   if (!isSupportedImage(image.mime)) {
//     return (
//       <div className="h-48 bg-gray-200 flex flex-col items-center justify-center text-gray-500">
//         <FiImage className="text-3xl mb-2" />
//         <span>Định dạng ảnh không hỗ trợ</span>
//         <span className="text-xs">{image.name}</span>
//       </div>
//     );
//   }
//
//   return (
//     <div className="h-48 relative">
//       <Image
//         src={image.url}
//         alt={image.alternativeText || image.caption || "Ảnh tài khoản game"}
//         fill
//         className="object-cover"
//         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         onError={(e) => {
//           // Fallback nếu ảnh load lỗi
//           const target = e.target as HTMLImageElement;
//           target.onerror = null;
//           target.src = "/images/default-account.jpg"; // Using existing placeholder
//         }}
//       />
//     </div>
//   );
// };

// Removed duplicated isSupportedImage and the first HomePage declaration
// const isSupportedImage = (mimeType: string) => { ... };
// const HomePage = () => { ... };
// Also removing the stray JSX/HTML that was outside a component from line 75 to 100

// const StatusIcon = ({ status }: { status: SaleStatus }) => { ... }; // Already commented
// const statusLabels: Record<SaleStatus, string> = { ... }; // Already commented
// interface Pagination { ... }; // Already commented
// interface Meta { ... }; // Already commented
// interface AccountsResponse { ... }; // Already commented

const HomePage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(""); // Removed setError, as it's unused
  const [searchTerm, setSearchTerm] = useState("");
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  useEffect(() => {
    // const fetchAccounts = async () => {
    //   try {
    //     const res = await apiFetch<AccountsResponse>("/accounts?populate=*");

    //     setAccounts((res.data as Account[]) ?? []);
    //   } catch (err) {
    //     setError((err as Error).message || "Không thể tải danh sách tài khoản");
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchAccounts();
    setLoading(false);
    setAccounts(accountData);
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
        <div className="flex justify-between items-center mb-4">
          <div></div> {/* Placeholder for alignment */}
          <h1 className="text-3xl font-bold">SHOP TÀI KHOẢN GAME</h1>
          <Button onClick={() => setIsSellModalOpen(true)}>
            Đăng Bán Tài Khoản
          </Button>
        </div>
        <p className="text-gray-600">
          Uy tín - Chất lượng - Giá tốt nhất thị trường
        </p>
      </header>

      <SellAccountForm
        isOpen={isSellModalOpen}
        onOpenChange={setIsSellModalOpen}
      />

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAccounts.map((account, index) => (
          <AccountCard account={account} key={index} />
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
