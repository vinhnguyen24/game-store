"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  // FiUser, // Removed
  // FiSettings, // Removed
  FiShoppingCart,
  FiTag,
  FiList,
  // FiBarChart2, // Removed
  FiEdit3,
} from "react-icons/fi";

// --- Mock Tabs Implementation (Placeholder) ---
// Replace this with actual shadcn/ui Tabs import once added to the project

// Define Props for TabsTrigger, including injected props
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
// --- End Mock Tabs Implementation ---

// Mock user data - replace with actual data fetching later
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "/images/default-account.jpg", // Using existing default image
  joinedDate: "2023-01-15",
  bio: "Loves gaming and finding the best deals!",
  isSeller: true, // Example flag
  stats: {
    listingsActive: 5,
    totalSold: 12,
    totalPurchased: 3,
  },
};

// Mock data for listings and purchases - replace with actual data
const mockListings = [
  {
    id: "l1",
    title: "ROK VIP 15 Account",
    price: 50,
    status: "Active",
    views: 120,
  },
  {
    id: "l2",
    title: "COC TH14 Maxed",
    price: 120,
    status: "Active",
    views: 300,
  },
  {
    id: "l3",
    title: "Genshin AR60 Whale",
    price: 250,
    status: "Sold",
    views: 500,
  },
];

const mockPurchases = [
  { id: "p1", title: "Clash Royale Max Lvl", price: 30, date: "2024-05-20" },
  {
    id: "p2",
    title: "Brawl Stars Full Brawlers",
    price: 75,
    date: "2024-04-10",
  },
];

const ProfilePage = () => {
  const [user] = useState(mockUser); // Removed setUser
  const [activeTab, setActiveTab] = useState(
    user.isSeller ? "myListings" : "purchaseHistory"
  );

  // Placeholder functions for actions
  const handleEditProfile = () => alert("Edit profile clicked!");
  const handleCreateListing = () => alert("Create new listing clicked!");

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      {/* Profile Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500 mb-4 md:mb-0 md:mr-6">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {user.name}
            </h1>
            <p className="text-md text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 mt-2 max-w-md">{user.bio}</p>
            <Button
              onClick={handleEditProfile}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <FiEdit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Section - Placeholder */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => user.isSeller && setActiveTab("myListings")}
        >
          <FiList className="text-3xl text-blue-500" />
          <div>
            <p className="text-2xl font-semibold">
              {user.stats.listingsActive}
            </p>
            <p className="text-gray-500">Active Listings</p>
          </div>
        </div>
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => user.isSeller && setActiveTab("myListings")} // Or a dedicated "sold items" tab if created
        >
          <FiTag className="text-3xl text-green-500" />
          <div>
            <p className="text-2xl font-semibold">{user.stats.totalSold}</p>
            <p className="text-gray-500">Items Sold</p>
          </div>
        </div>
        <div
          className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveTab("purchaseHistory")}
        >
          <FiShoppingCart className="text-3xl text-purple-500" />
          <div>
            <p className="text-2xl font-semibold">
              {user.stats.totalPurchased}
            </p>
            <p className="text-gray-500">Items Purchased</p>
          </div>
        </div>
      </section>

      {/* Tabs for Listings, Purchases, Settings */}
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-gray-200 p-1 rounded-lg mb-6">
          {user.isSeller && (
            <TabsTrigger
              value="myListings"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              My Listings
            </TabsTrigger>
          )}
          <TabsTrigger
            value="purchaseHistory"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Purchase History
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Account Settings
          </TabsTrigger>
        </TabsList>

        {user.isSeller && (
          <TabsContent
            value="myListings"
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                My Game Accounts for Sale
              </h2>
              <Button onClick={handleCreateListing}>
                <FiEdit3 className="mr-2 h-4 w-4" /> Create New Listing
              </Button>
            </div>
            {mockListings.length > 0 ? (
              <div className="space-y-4">
                {mockListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border p-4 rounded-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-medium text-blue-600">
                      {listing.title}
                    </h3>
                    <p>Price: ${listing.price}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          listing.status === "Active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </p>
                    <p>Views: {listing.views}</p>
                    {/* Add edit/delete buttons here */}
                  </div>
                ))}
              </div>
            ) : (
              <p>You have no active listings.</p>
            )}
          </TabsContent>
        )}

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
            <p>You haven't purchased any accounts yet.</p>
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
              <Button variant="outline" className="mt-2">
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
    </div>
  );
};

export default ProfilePage;
