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

import { Account, Version } from "@/types/account";

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
  talent: 0,
  emblem: "",
  tattoo: "",
  tickets: 0,
  resources: "",
  actionPoints: 0,
  commander: "",
  legendaryHouse: "",
  keyRally: false,
};
type CityThemes = {
  id: number;
  name: string;
  type: string;
  buff: string;
  image: {
    url: string;
  };
}[];
interface SellAccountFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  citiThemes: CityThemes;
}

export function SellAccountForm({
  isOpen,
  onOpenChange,
  citiThemes,
}: SellAccountFormProps) {
  const [formData, setFormData] =
    useState<SellAccountFormData>(initialFormData);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [value, setValue] = useState<string[]>([]);
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

  const legendaryHouseData = citiThemes.map((item) => item.name);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[1200px] max-h-[90vh] overflow-y-auto text-xl text-[#2c2f4b]">
        <DialogHeader>
          <DialogTitle>Đăng bán tài khoản</DialogTitle>
          <DialogDescription>
            Vui lòng điền toàn bộ thông tin account của bạn
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price === 0 ? "" : formData.price}
                onChange={handleChange}
                required
                min="0"
                step="100000"
                placeholder="Giá tiền mong muốn"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="version">Phiên bản</Label>
              <select
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                required
              >
                <option value="global">Quốc tế</option>
                <option value="gamota">Gamota</option>
                <option value="japan">Nhật bản</option>
              </select>
            </div>
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="vipLevel">VIP</Label>
              <Input
                id="vipLevel"
                name="vipLevel"
                type="number"
                value={formData.vipLevel === 0 ? "" : formData.vipLevel}
                onChange={handleChange}
                required
                placeholder="Cấp VIP hiện tại"
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <Label htmlFor="kills">Kills</Label>
              <Input
                id="kills"
                name="kills"
                type="text"
                value={formData.kills === 0 ? "" : formData.kills}
                onChange={handleChange}
                placeholder="Số điểm giết hiện tại"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="speed">Tăng tốc (ngày)</Label>
              <Input
                id="speed"
                name="speed"
                type="number"
                value={formData.speed === 0 ? "" : formData.speed}
                onChange={handleChange}
                min="0"
                placeholder="Số ngày tăng tốc"
              />
            </div>

            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="goldenHeads">Trọc vàng</Label>
              <Input
                id="goldenHeads"
                name="goldenHeads"
                type="number"
                value={formData.goldenHeads === 0 ? "" : formData.goldenHeads}
                onChange={handleChange}
                placeholder="Số trọc vàng hiện tại"
                min="0"
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <Label htmlFor="tickets">Vé bay (bao gồm tín dụng)</Label>
              <Input
                id="tickets"
                name="tickets"
                type="number"
                onChange={handleChange}
                placeholder="Số vé bay (bao gồm tín dụng)"
                value={formData.tickets === 0 ? "" : formData.tickets}
                min="0"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="equipment">Trang bị cam</Label>
              <Input
                id="equipment"
                name="equipment"
                type="number"
                value={formData.equipment === 0 ? "" : formData.equipment}
                onChange={handleChange}
                min="0"
                placeholder="Số trang bị cam"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="talent">Talent</Label>
              <Input
                id="talent"
                name="talent"
                type="number"
                onChange={handleChange}
                min="0"
                value={formData.talent === 0 ? "" : formData.talent}
                placeholder="Số talent"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="emblem">
                Vũ trang (vd: 5 set vũ trang 30% chỉ số)
              </Label>
              <Input
                id="emblem"
                name="emblem"
                value={formData.emblem}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="tattoo">
                Minh văn đặc biệt (vd: 4mv chung đội hình)
              </Label>
              <Input
                id="tattoo"
                name="tattoo"
                value={formData.tattoo}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="resources">Tài nguyên (B)</Label>
              <Input
                id="resources"
                name="resources"
                type="number"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 md:col-span-2">
              <Label htmlFor="actionPoints">Điểm hành động</Label>
              <Input
                id="actionPoints"
                name="actionPoints"
                type="number"
                value={formData.actionPoints === 0 ? "" : formData.actionPoints}
                onChange={handleChange}
                placeholder="Số điểm hành động"
                min="0"
              />
            </div>
            <div className="col-span-8 md:col-span-10">
              <Label htmlFor="commander">Tướng (cách nhau dấu ,)</Label>
              <Input
                id="commander"
                name="commander"
                value={formData.commander}
                onChange={handleChange}
                placeholder="VD: HKB, Lưu Triệt, ..."
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="legendaryHouse">Nhà huyền thoại</Label>
                <Input
                id="legendaryHouse"
                name="legendaryHouse"
                value={formData.legendaryHouse}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6 flex items-center space-x-2">
              <Input
                type="checkbox"
                id="keyRally"
                name="keyRally"
                checked={formData.keyRally}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="keyRally" className="font-normal">
                Key Rally ?
              </Label>
            </div>
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
