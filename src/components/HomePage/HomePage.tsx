// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  const accountsSectionRef = useRef<HTMLDivElement>(null);

  const handleOpenQuickView = (account: Account) => {
    setSelectedAccount(account);
    setIsQuickViewOpen(true);
  };

  const handleScrollToAccounts = () => {
    accountsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <>
      {/* Hero Section with Video BG */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/video/banner.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="relative z-20 text-center text-white p-4">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
            Caesar Shop
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-300">
            Nơi huyền thoại bắt đầu!
          </p>
          <Button
            onClick={handleScrollToAccounts}
            className="mt-8 bg-white hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 cursor-pointer"
          >
            Lựa chọn tài khoản ngay &rarr;
          </Button>
        </div>
      </div>

      {/* Account List Section */}
      <div ref={accountsSectionRef} className="bg-[#121421] py-12">
        <div className="container mx-auto px-4">
          <SellAccountForm
            isOpen={isSellModalOpen}
            onOpenChange={setIsSellModalOpen}
            citiThemes={cityThemes}
          />

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 my-6 bg-gray-800/50 p-6 rounded-xl">
            <div className="relative w-full md:flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tài khoản, chỉ huy, nhà huyền thoại..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-700 bg-gray-900 text-white shadow-sm focus:ring-2 focus:ring-yellow-400"
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
                    className="w-full md:w-48 justify-start text-white cursor-pointer bg-gray-900 border-gray-700 hover:bg-gray-800"
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
    </>
  );
};

export default HomePage;
