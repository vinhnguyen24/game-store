"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Account, Version } from "@/types/account"; // Assuming Version is exported from account types

// Define the initial state shape based on a subset of Account fields
// Excluding id, saleStatus, images (for now), createdAt, updatedAt, publishedAt
type SellAccountFormData = Omit<
  Account,
  "id" | "saleStatus" | "images" | "createdAt" | "updatedAt" | "publishedAt"
>;

const initialFormData: SellAccountFormData = {
  title: "",
  version: "global" as Version,
  price: 0,
  vipLevel: 0,
  kills: 0,
  speed: 0,
  goldenHeads: 0,
  equipment: 0,
  emblem: "",
  tattoo: "",
  tickets: 0,
  resources: "",
  actionPoints: 0,
  commander: "",
  legendaryHouse: "",
  keyRally: false,
};

interface SellAccountFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SellAccountForm({
  isOpen,
  onOpenChange,
}: SellAccountFormProps) {
  const [formData, setFormData] =
    useState<SellAccountFormData>(initialFormData);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement actual submission logic (e.g., API call)
    console.log("Form Data:", formData);
    console.log("Image Files:", imageFiles);
    // Reset form or close modal after submission
    setFormData(initialFormData);
    setImageFiles(null);
    onOpenChange(false);
    alert("Account submitted for sale (check console for data)!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sell Your Account</DialogTitle>
          <DialogDescription>
            Fill in the details of the account you want to sell.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="version">Version</Label>
            <select
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="global">Global</option>
              <option value="gamota">Gamota</option>
              <option value="japan">Japan</option>
            </select>
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="vipLevel">VIP Level</Label>
            <Input
              id="vipLevel"
              name="vipLevel"
              type="number"
              value={formData.vipLevel}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="kills">Kills</Label>
            <Input
              id="kills"
              name="kills"
              type="number"
              value={formData.kills}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="speed">Speedups (hours)</Label>
            <Input
              id="speed"
              name="speed"
              type="number"
              value={formData.speed}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="goldenHeads">Golden Heads</Label>
            <Input
              id="goldenHeads"
              name="goldenHeads"
              type="number"
              value={formData.goldenHeads}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="equipment">Equipment Sets</Label>
            <Input
              id="equipment"
              name="equipment"
              type="number"
              value={formData.equipment}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="emblem">Emblem</Label>
            <Input
              id="emblem"
              name="emblem"
              value={formData.emblem}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="tattoo">Tattoo</Label>
            <Input
              id="tattoo"
              name="tattoo"
              value={formData.tattoo}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="tickets">Migration Tickets</Label>
            <Input
              id="tickets"
              name="tickets"
              type="number"
              value={formData.tickets}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="resources">
              Resources (e.g., 100M Wood, 100M Food)
            </Label>
            <Input
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="actionPoints">Action Points</Label>
            <Input
              id="actionPoints"
              name="actionPoints"
              type="number"
              value={formData.actionPoints}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="commander">Commanders (comma-separated)</Label>
            <Input
              id="commander"
              name="commander"
              value={formData.commander}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="legendaryHouse">Legendary House Info</Label>
            <Input
              id="legendaryHouse"
              name="legendaryHouse"
              value={formData.legendaryHouse}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="keyRally"
              name="keyRally"
              checked={formData.keyRally}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <Label htmlFor="keyRally" className="font-normal">
              Key Rally Available?
            </Label>
          </div>

          <div>
            <Label htmlFor="images">Images (select multiple)</Label>
            <Input
              id="images"
              name="images"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit for Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
