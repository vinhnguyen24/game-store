"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { convertToShortText } from "@/helper/common";

interface Negotiation {
  id: number;
  buyerZalo: string;
  offeredPrice: number;
  statusTransaction:
    | "pending"
    | "waiting_for_seller"
    | "accepted"
    | "rejected"
    | "countered";
  message: string;
  messageFromSeller: string;
}

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  negotiations: Negotiation[];
  accountTitle: string;
}

export const NegotiationModal = ({
  isOpen,
  onClose,
  negotiations,
  accountTitle,
}: NegotiationModalProps) => {
  const [message, setMessage] = useState("");

  const statusMapping = {
    accepted: "Chấp nhận",
    rejected: "Từ chối",
    waiting_for_seller: "Đang chờ phản hồi",
    pending: "Đang chờ người mua phản hồi",
  };

  const handleAction = async (
    negotiationId: number,
    status: "accepted" | "rejected" | "waiting_for_seller"
  ) => {
    try {
      await apiFetch(`/negotiations/${negotiationId}`, {
        method: "PUT",
        data: {
          data: {
            statusTransaction: status,
            messageFromSeller: message,
          },
        },
      });
      // Optionally, refresh the data on the parent component
      onClose();
    } catch (error) {
      console.error("Failed to update negotiation", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] text-gray-500">
        <DialogHeader>
          <DialogTitle>Negotiations for {accountTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
          {negotiations.length > 0 ? (
            negotiations.map((neg) => (
              <div key={neg.id} className="border p-4 rounded-lg">
                <p>
                  <strong>Giá đề nghị:</strong>{" "}
                  <span className="text-xl font-bold text-yellow-600">
                    {convertToShortText(Number(neg.offeredPrice).toFixed(2))}{" "}
                    (VND)
                  </span>
                </p>
                <p>
                  <strong>Tin nhắn:</strong> {neg.message}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {statusMapping[neg.statusTransaction] ||
                    neg.statusTransaction}
                </p>
                {neg.statusTransaction === "waiting_for_seller" && (
                  <div className="mt-4">
                    <Textarea
                      placeholder="Tin nhắn phản hồi tới người mua..."
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setMessage(e.target.value)
                      }
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleAction(neg.id, "rejected")}
                      >
                        Từ chối
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={() => handleAction(neg.id, "accepted")}
                      >
                        Đồng ý
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Không có đề nghị thương lượng nào cho account này.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
