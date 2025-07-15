// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Account } from "@/types/account";
import { Button } from "@/components/ui/button";
import { SellAccountForm } from "@/components/SellAccountForm";
import { FiSearch } from "react-icons/fi";
import AccountCard from "@/components/AccountCard";
import AccountQuickViewModal from "@/components/AccountQuickViewModal";
import VipFilter from "@/components/VipFilter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type CityThemes = {
  id: number;
  name: string;
  type: "infantry" | "archer" | "cavalry" | "mix" | "ultility";
  buff: string;
  image: {
    url: string;
  };
}[];
interface CertificationsProps {
  account: Account[];
  cityThemes: CityThemes;
}

const HomePage = ({ account, cityThemes }: CertificationsProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(""); // Removed setError, as it's unused
  const [searchTerm, setSearchTerm] = useState("");
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedVips, setSelectedVips] = useState<number[]>([]);
  const [selectedLegendary, setSelectedLegendary] = useState<string[]>([]);
  const [isLegendaryModalOpen, setIsLegendaryModalOpen] = useState(false);
  const [legendarySearchTerm, setLegendarySearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleOpenQuickView = (account: Account) => {
    setSelectedAccount(account);
    setIsQuickViewOpen(true);
  };

  useEffect(() => {
    setLoading(false);
    setAccounts(account ?? []);
  }, [account]);

  const handleVipChange = (vip: number) => {
    setSelectedVips((prev) =>
      prev.includes(vip) ? prev.filter((v) => v !== vip) : [...prev, vip]
    );
  };

  const handleLegendaryChange = (legendary: string) => {
    setSelectedLegendary((prev) =>
      prev.includes(legendary)
        ? prev.filter((l) => l !== legendary)
        : [...prev, legendary]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedVips([]);
    setSelectedLegendary([]);
  };

  const filteredAccounts = accounts.filter((account) => {
    const searchMatch =
      account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.commander.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.legendaryHouse.toLowerCase().includes(searchTerm.toLowerCase());

    const vipMatch =
      selectedVips.length === 0 || selectedVips.includes(account.vipLevel);

    const legendaryMatch =
      selectedLegendary.length === 0 ||
      account.city_themes.some((theme) =>
        selectedLegendary.includes(theme.name)
      );

    return searchMatch && vipMatch && legendaryMatch;
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
    <div className="bg-[#121421] min-h-screen">
      <div className="relative">
        <div className="background-video-container">
          <video
            className="background-video"
            src="/video/banner.mp4"
            autoPlay
            muted
            loop
          ></video>
        </div>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center header-content">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <h1 className="text-3xl font-bold text-white">
                SHOP TÀI KHOẢN GAME
              </h1>
              <Button onClick={() => setIsSellModalOpen(true)}>
                Đăng Bán Tài Khoản
              </Button>
            </div>
            <p className="text-gray-400">
              Uy tín - Chất lượng - Giá tốt nhất thị trường
            </p>
          </header>

          <SellAccountForm
            isOpen={isSellModalOpen}
            onOpenChange={setIsSellModalOpen}
            citiThemes={cityThemes}
          />

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 my-6">
            <div className="relative w-full md:w-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tài khoản, chỉ huy, nhà huyền thoại..."
                className="w-96 pl-10 pr-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white shadow-sm focus:ring-2 focus:ring-yellow-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex w-full md:w-auto gap-4">
              <VipFilter
                selectedVips={selectedVips}
                onVipChange={handleVipChange}
              />

              <Dialog
                open={isLegendaryModalOpen}
                onOpenChange={setIsLegendaryModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 justify-start text-white cursor-pointer"
                  >
                    {selectedLegendary.length > 0
                      ? selectedLegendary.join(", ")
                      : "Chọn nhà huyền thoại"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-gray-700">
                      Chọn nhà huyền thoại
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Tìm kiếm nhà..."
                      className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={legendarySearchTerm}
                      onChange={(e) => setLegendarySearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {cityThemes
                      .filter((theme) =>
                        theme.name
                          .toLowerCase()
                          .includes(legendarySearchTerm.toLowerCase())
                      )
                      .map((theme) => (
                        <label
                          key={theme.id}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLegendary.includes(theme.name)}
                            onChange={() => handleLegendaryChange(theme.name)}
                            className="h-4 w-4"
                          />
                          <span className="text-gray-700">{theme.name}</span>
                        </label>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Account List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account, index) => (
              <AccountCard
                account={account}
                key={index}
                onQuickView={handleOpenQuickView}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy tài khoản phù hợp</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          <AccountQuickViewModal
            account={selectedAccount}
            isOpen={isQuickViewOpen}
            onOpenChange={setIsQuickViewOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
