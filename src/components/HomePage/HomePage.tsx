// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Account } from "@/types/account";
import { Button } from "@/components/ui/button";
import { SellAccountForm } from "@/components/SellAccountForm";
import { FiSearch } from "react-icons/fi";
import AccountCard from "@/components/AccountCard";
import accountData from "@/fakeData";

type CityThemes = {
  id: number;
  name: string;
  type: string;
  buff: string;
  image: {
    url: string;
  };
}[];
interface CertificationsProps {
  account: Account;
  cityThemes: CityThemes;
}

const HomePage = ({ account, cityThemes }: CertificationsProps) => {
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
    setAccounts(account);
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
        citiThemes={cityThemes}
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
