"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Account } from "@/types/account";
import accountData from "@/fakeData"; // Using fakeData for now
import {
  FiArrowLeft,
  FiShoppingCart,
  FiTag,
  FiShield,
  FiZap,
  FiStar,
  FiCpu,
  FiPaperclip,
  // FiCalendar, // Removed
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiKey,
} from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AccountDetailPage = () => {
  const params = useParams();
  const accountId = params?.id ? parseInt(params.id as string, 10) : null;

  // Find account from fakeData - replace with API call in a real app
  const account: Account | undefined = accountData.find(
    (acc) => acc.id === accountId
  );

  if (!accountId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Account ID</h1>
        <Link href="/" passHref>
          <Button variant="link" className="mt-4 text-blue-500">
            <FiArrowLeft className="mr-2" /> Go back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Account Not Found</h1>
        <p className="text-gray-600">
          Could not find an account with ID: {accountId}
        </p>
        <Link href="/" passHref>
          <Button variant="link" className="mt-4 text-blue-500">
            <FiArrowLeft className="mr-2" /> Go back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const renderSaleStatusIcon = () => {
    switch (account.saleStatus) {
      case "sale":
        return <FiCheckCircle className="text-green-500" title="On Sale" />;
      case "pending":
        return <FiClock className="text-yellow-500" title="Pending" />;
      case "cancel":
        return <FiXCircle className="text-red-500" title="Cancelled" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <FiArrowLeft className="mr-2" /> Back to Listings
          </Button>
        </Link>
      </div>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Image Gallery - Basic for now */}
        {account.images && account.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 bg-gray-100">
            {account.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-video rounded overflow-hidden shadow"
              >
                <Image
                  src={img.url}
                  alt={img.name || "Account Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
        {(!account.images || account.images.length === 0) && (
          <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {account.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <span>ID: {account.id}</span>
                <span>&bull;</span>
                <span>
                  Version:{" "}
                  <span className="font-semibold text-blue-600">
                    {account.version}
                  </span>
                </span>
                <span className="ml-2">{renderSaleStatusIcon()}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mt-4 md:mt-0">
              ${account.price.toFixed(2)}
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Account Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center bg-blue-50 p-3 rounded-md">
                <FiStar className="text-blue-500 mr-2 text-lg" />
                <span>
                  VIP Level:{" "}
                  <span className="font-bold">{account.vipLevel}</span>
                </span>
              </div>
              <div className="flex items-center bg-red-50 p-3 rounded-md">
                <FiTag className="text-red-500 mr-2 text-lg" />
                <span>
                  Kills:{" "}
                  <span className="font-bold">
                    {account.kills.toLocaleString()}
                  </span>
                </span>
              </div>
              <div className="flex items-center bg-yellow-50 p-3 rounded-md">
                <FiZap className="text-yellow-500 mr-2 text-lg" />
                <span>
                  Speedups:{" "}
                  <span className="font-bold">{account.speed} hrs</span>
                </span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-md">
                <FiCpu className="text-purple-500 mr-2 text-lg" />
                <span>
                  Golden Heads:{" "}
                  <span className="font-bold">{account.goldenHeads}</span>
                </span>
              </div>
              <div className="flex items-center bg-indigo-50 p-3 rounded-md">
                <FiShield className="text-indigo-500 mr-2 text-lg" />
                <span>
                  Equipment Sets:{" "}
                  <span className="font-bold">{account.equipment}</span>
                </span>
              </div>
              <div className="flex items-center bg-pink-50 p-3 rounded-md">
                <FiPaperclip className="text-pink-500 mr-2 text-lg" />
                <span>
                  Migration Tickets:{" "}
                  <span className="font-bold">{account.tickets}</span>
                </span>
              </div>
              {account.keyRally && (
                <div className="flex items-center bg-teal-50 p-3 rounded-md">
                  <FiKey className="text-teal-500 mr-2 text-lg" />
                  <span className="font-bold">Key Rally Available</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Details
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>
                  <strong>Emblem:</strong> {account.emblem || "N/A"}
                </li>
                <li>
                  <strong>Tattoo:</strong> {account.tattoo || "N/A"}
                </li>
                <li>
                  <strong>Resources:</strong> {account.resources || "N/A"}
                </li>
                <li>
                  <strong>Action Points:</strong>{" "}
                  {account.actionPoints?.toLocaleString() || "N/A"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Commander & House
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>
                  <strong>Commanders:</strong> {account.commander || "N/A"}
                </li>
                <li>
                  <strong>Legendary House:</strong>{" "}
                  {account.legendaryHouse || "N/A"}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 text-center">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <FiShoppingCart className="mr-2" /> Purchase This Account
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Created: {new Date(account.createdAt).toLocaleDateString()} &bull;
              Last Updated: {new Date(account.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailPage;
