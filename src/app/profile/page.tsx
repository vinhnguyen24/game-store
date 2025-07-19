"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiShoppingCart, FiTag, FiList, FiEdit } from "react-icons/fi";
import { NegotiationModal } from "@/components/NegotiationModal";
import { apiFetch } from "@/lib/api";
import { convertToShortText } from "@/helper/common";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_DOMAIN || "http://localhost:1340";

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  currentValue?: string; // This prop is injected by TabsList/Tabs
  onClick?: () => void; // This prop is injected by TabsList/Tabs
}

const Tabs = ({
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  defaultValue: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode[];
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const handleTabChange = (value: string) => {
    setCurrentValue(value);
    onValueChange(value);
  };
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // @ts-expect-error: Cloned child will have these props
          return React.cloneElement(child, { currentValue, handleTabChange });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({
  className,
  children,
  currentValue,
  handleTabChange,
}: {
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
  handleTabChange?: (value: string) => void;
}) => (
  <div className={className}>
    {React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.type === "function" &&
        child.type.name === "TabsTrigger"
      ) {
        // More specific check for TabsTrigger and its props
        const childProps = child.props as {
          value: string;
          // Using a more specific type for other props if known, or keep unknown if truly variable
          [key: string]: unknown;
        };
        // Clone with extended props
        return React.cloneElement(
          child as React.ReactElement<TabsTriggerProps>,
          {
            // Cloned props must match TabsTriggerProps if it's to be used by TabsTrigger
            currentValue,
            onClick: () =>
              handleTabChange &&
              childProps.value &&
              handleTabChange(childProps.value),
          }
        );
      }
      return child;
    })}
  </div>
);

const TabsTrigger = (
  {
    value,
    className,
    children,
    currentValue, // Prop passed by TabsList
    onClick, // Prop passed by TabsList
  }: TabsTriggerProps // Using the defined interface
) => (
  <button
    onClick={onClick}
    className={`${className} ${
      currentValue === value
        ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        : ""
    }`} // Simplified active state
    data-state={currentValue === value ? "active" : "inactive"}
  >
    {children}
  </button>
);

const TabsContent = ({
  value,
  className,
  children,
  currentValue,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
}) =>
  currentValue === value ? <div className={className}>{children}</div> : null;

const mockPurchases = [
  {
    id: 1,
    title: "Account for game X",
    price: 75,
    date: "2023-10-01T12:00:00Z",
  },
];

interface Negotiation {
  id: number;
  buyerZalo: string;
  offeredPrice: number;
  statusTransaction:
    | "pending"
    | "countered"
    | "accepted"
    | "rejected"
    | "waiting_for_seller";
  message: string;
  messageFromSeller: string;
  createdAt: string;
}

interface NegotiationResponse {
  data: Negotiation[];
}

interface Account {
  id: number;
  title: string;
  price: number;
  status: string;
  views: number;
  saleStatus: "sale" | "sold";
  negotiations?: NegotiationResponse;
}

interface UserApiResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  isSeller: boolean;
  stats?: {
    listingsActive: number;
    totalSold: number;
    totalPurchased: number;
  };
  avatar: {
    url: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
    };
  } | null;
  accounts: Account[];
}

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  isSeller: boolean;
  stats?: {
    listingsActive: number;
    totalSold: number;
    totalPurchased: number;
  };
  accounts: Account[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("myListings");
  const [listListing, setListListing] = useState<Account[]>([]);
  const [listSold, setListSold] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = (await apiFetch(
          `/users/me?populate=avatar&populate=accounts`
        )) as UserApiResponse;

        if (data && data.accounts) {
          const listings = data.accounts.filter(
            (item) => item.saleStatus === "sale"
          );
          const sold = data.accounts.filter(
            (item) => item.saleStatus === "sold"
          );

          const listingsWithNegotiations = await Promise.all(
            listings.map(async (listing) => {
              const negotiations = (await apiFetch(
                `/negotiations?filters[account][id][$eq]=${listing.id}`
              )) as NegotiationResponse;

              return { ...listing, negotiations };
            })
          );
          console.log(listingsWithNegotiations);
          setListListing(listingsWithNegotiations);
          setListSold(sold);
        }

        const imageUrl =
          data.avatar?.formats?.thumbnail?.url || data.avatar?.url;
        const fullUrl = imageUrl
          ? imageUrl.startsWith("http")
            ? imageUrl
            : `${BASE_URL}${imageUrl}`
          : "/images/default-account.jpg";
        const userWithAvatar = { ...data, avatar: fullUrl };
        setUser(userWithAvatar);
        localStorage.setItem("user", JSON.stringify(userWithAvatar));
      } catch (error) {
        console.error("Failed to fetch user data, trying localStorage", error);
        const userJson = localStorage.getItem("user");
        if (userJson) {
          const userStorage = JSON.parse(userJson);
          // Ensure avatar URL is still processed even from localStorage
          const imageUrl =
            userStorage?.avatar?.formats?.thumbnail?.url ||
            userStorage?.avatar?.url;
          const fullUrl = imageUrl
            ? imageUrl.startsWith("http")
              ? imageUrl
              : `${BASE_URL}${imageUrl}`
            : "/images/default-account.jpg";
          userStorage.avatar = fullUrl;
          setUser(userStorage);
        }
      }
    };

    fetchUserData();
  }, []);

  // Placeholder functions for actions
  const handleEditProfile = () => alert("Edit profile clicked!");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 text-gray-500">
      {/* Profile Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500 mb-4 md:mb-0 md:mr-6">
            <Image
              src={user.avatar ?? "/images/default-account.jpg"}
              alt={user.username ?? "User avatar"}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {user.username}
            </h1>
            <p className="text-md text-gray-600">{user.email}</p>
            {user.createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                Tham gia: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Stats Section - Placeholder */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab("myListings")}
        >
          <FiList className="text-3xl text-blue-500" />
          <div>
            <p className="text-gray-500">Account đang bán </p>
            <p className="text-2xl font-semibold text-gray-500">
              {listListing?.length}
            </p>
          </div>
        </div>
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab("soldItems")}
        >
          <FiTag className="text-3xl text-green-500" />
          <div>
            <p className="text-gray-500">Account đã bán</p>
            <p className="text-2xl font-semibold text-gray-500">
              {listSold?.length}
            </p>
          </div>
        </div>
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab("purchaseHistory")}
        >
          <FiShoppingCart className="text-3xl text-purple-500" />
          <div>
            <p className="text-2xl font-semibold">
              {user.stats?.totalPurchased}
            </p>
            <p className="text-gray-500">Items Purchased</p>
          </div>
        </div>
      </section>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-gray-200 p-1 rounded-lg mb-6">
          <TabsTrigger
            value="myListings"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer"
          >
            Account Đang bán
          </TabsTrigger>
          <TabsTrigger
            value="soldItems"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white cursor-pointer"
          >
            Account đã bán
          </TabsTrigger>
          <TabsTrigger
            value="purchaseHistory"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white cursor-pointer"
          >
            Purchase History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="myListings"
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-2xl font-semibold">
              Danh sách account đang bán của bạn
            </h2>
          </div>
          {listListing.length > 0 ? (
            <div className="space-y-4">
              {listListing.map((listing) => (
                <div
                  key={listing.id}
                  className="border p-4 rounded-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-medium text-blue-600">
                    {listing.title}
                  </h3>
                  <p>
                    Giá:{" "}
                    <span className="text-xl font-bold text-yellow-600">
                      {convertToShortText(Number(listing.price).toFixed(2))}{" "}
                      (VND)
                    </span>
                  </p>
                  <p>
                    Trạng thái:{" "}
                    <span className="font-semibold text-green-600">
                      Đang bán
                    </span>
                  </p>
                  <p>
                    Số lượt thương lượng:{" "}
                    {listing.negotiations?.data?.length ?? 0}
                  </p>
                  <Button
                    className="mt-2  cursor-pointer"
                    onClick={() => handleOpenModal(listing)}
                  >
                    <FiEdit className="mr-2 h-4 w-4" /> Xem
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>You have no active listings.</p>
          )}
        </TabsContent>
        <TabsContent
          value="soldItems"
          className="bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold">Danh sách account đã bán</h2>
          {listSold.length > 0 ? (
            <div className="space-y-4">
              {listSold.map((item) => (
                <div key={item.id} className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.title}
                  </h3>
                  <p>
                    Giá:{" "}
                    <span className="text-xl font-bold text-yellow-600">
                      {convertToShortText(Number(item.price).toFixed(2))} (VND)
                    </span>
                  </p>
                  <p>
                    Trạng thái:{" "}
                    <span className="font-semibold text-red-600">Đã bán</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven&apos;t sold any accounts yet.</p>
          )}
        </TabsContent>

        <TabsContent
          value="purchaseHistory"
          className="bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">My Purchased Accounts</h2>
          {mockPurchases.length > 0 ? (
            <div className="space-y-4">
              {mockPurchases.map((purchase) => (
                <div key={purchase.id} className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium">{purchase.title}</h3>
                  <p>Price: ${purchase.price}</p>
                  <p>
                    Purchased on: {new Date(purchase.date).toLocaleDateString()}
                  </p>
                  {/* Add view details/receipt button here */}
                </div>
              ))}
            </div>
          ) : (
            <p>You haven&apos;t purchased any accounts yet.</p>
          )}
        </TabsContent>

        <TabsContent
          value="settings"
          className="bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-sm text-gray-600">
                Update your name, email, and bio.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleEditProfile}
              >
                Edit Profile Info
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-gray-600">Keep your account secure.</p>
              <Button variant="outline" className="mt-2">
                Set New Password
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <p className="text-sm text-gray-600">
                Manage how you receive updates.
              </p>
              <Button variant="outline" className="mt-2">
                Manage Notifications
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-600">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="mt-2">
                Delete My Account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {selectedAccount && (
        <NegotiationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          negotiations={selectedAccount.negotiations?.data ?? []}
          accountTitle={selectedAccount.title}
        />
      )}
    </div>
  );
};

export default ProfilePage;
