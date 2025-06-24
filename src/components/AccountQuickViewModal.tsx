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

interface AccountQuickViewModalProps {
  account: Account | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 text-white border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            {account.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Quick overview of account ID: {account.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image & Basic Info */}
          <div>
            {account.images && account.images.length > 0 ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 shadow-lg">
                <Image
                  src={account.images[0].url}
                  alt={account.images[0].name || "Account Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 mb-4">
                No image
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-green-400">
                ${account.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-400">Status:</span>
                {renderSaleStatusIcon()}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Version:{" "}
              <span className="font-semibold text-blue-400">
                {account.version}
              </span>
            </p>
          </div>

          {/* Right Column: Details */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Key Highlights
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center">
                <FiStar className="mr-2 text-blue-400" /> VIP Level:{" "}
                <span className="font-bold ml-1">{account.vipLevel}</span>
              </p>
              <p className="flex items-center">
                <FiTag className="mr-2 text-red-400" /> Kills:{" "}
                <span className="font-bold ml-1">
                  {account.kills.toLocaleString()}
                </span>
              </p>
              <p className="flex items-center">
                <FiZap className="mr-2 text-yellow-400" /> Speedups:{" "}
                <span className="font-bold ml-1">{account.speed} hrs</span>
              </p>
              <p className="flex items-center">
                <FiCpu className="mr-2 text-purple-400" /> Golden Heads:{" "}
                <span className="font-bold ml-1">{account.goldenHeads}</span>
              </p>
              <p className="flex items-center">
                <FiShield className="mr-2 text-indigo-400" /> Equipment Sets:{" "}
                <span className="font-bold ml-1">{account.equipment}</span>
              </p>
              <p className="flex items-center">
                <FiPaperclip className="mr-2 text-pink-400" /> Migration
                Tickets:{" "}
                <span className="font-bold ml-1">{account.tickets}</span>
              </p>
              {account.keyRally && (
                <p className="flex items-center">
                  <FiKey className="mr-2 text-teal-400" />{" "}
                  <span className="font-bold">Key Rally Available</span>
                </p>
              )}
            </div>

            <h3 className="text-lg font-semibold text-yellow-400 mt-4 mb-2">
              Other Details
            </h3>
            <ul className="space-y-1 text-sm text-gray-300 list-disc list-inside">
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

        <DialogFooter className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handlePurchase}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
            disabled={account.saleStatus !== "sale"} // Disable if not on sale
          >
            <FiShoppingCart className="mr-2" /> Purchase Now
          </Button>
          <Link href={`/account/${account.id}`} passHref>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              View Full Page <FiExternalLink className="ml-2" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountQuickViewModal;
