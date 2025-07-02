"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, X } from "lucide-react";
import { Account } from "@/types/account";
import { ImageManagerModal } from "./ImageManagerModal";
import { apiFetch } from "@/lib/api";
import { getSuggestedPrice } from "./priceSuggestor";

interface UploadResponse {
  id: number;
  [key: string]: unknown; // For other properties that might exist
}

type SellAccountFormData = Omit<
  Account,
  "id" | "saleStatus" | "images" | "createdAt" | "updatedAt" | "publishedAt"
>;

type CityThemes = {
  id: number;
  name: string;
  type: "infantry" | "archer" | "cavalry" | "mix" | "ultility";
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

const types = ["infantry", "archer", "cavalry", "mix", "ultility"] as const;
const houseTypeMap = {
  infantry: "Bộ binh",
  archer: "Cung thủ",
  cavalry: "Kỵ binh",
  mix: "Mix",
  ultility: "OL",
};
export function SellAccountForm({
  isOpen,
  onOpenChange,
  citiThemes,
}: SellAccountFormProps) {
  const initialFormData: SellAccountFormData = {
    title: "",
    version: "global",
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
    equipment_emblems: "",
    keyRally: false,
    legendaryHouse: "",
  };
  const [formData, setFormData] =
    useState<SellAccountFormData>(initialFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [legendaryModalOpen, setLegendaryModalOpen] = useState(false);
  const [selectedLegendary, setSelectedLegendary] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [manualPrice, setManualPrice] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const price = getSuggestedPrice(formData);
    setSuggestedPrice(price);
  }, [formData]);

  useEffect(() => {
    if (manualPrice !== null) return; // nếu đang chỉnh tay thì không animate
    let current = displayedPrice;
    const target = suggestedPrice;
    const step = Math.max(Math.floor((target - current) / 10), 1000);

    if (current < target) {
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setDisplayedPrice(current);
      }, 30);
      return () => clearInterval(timer);
    } else {
      setDisplayedPrice(target);
    }
  }, [suggestedPrice]);

  const priceToShow = manualPrice !== null ? manualPrice : displayedPrice;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("User not found!");
      return;
    }

    try {
      const user = JSON.parse(userData) as { id: number };

      // 1. Upload images if any
      const uploadedImageIds = await uploadImages();

      // 2. Prepare city_themes connections
      const connectThemes = selectedLegendary.map((id) => ({ id }));

      const params = {
        data: {
          ...formData,
          city_themes: {
            connect: connectThemes,
          },
          user: {
            connect: [{ id: user.id }],
            disconnect: [],
          },
          saleStatus: "pending",
          price: priceToShow,
          ...(uploadedImageIds.length > 0 && { images: uploadedImageIds }),
        },
      };

      // Remove unwanted field
      delete (params.data as any).legendaryHouse;
      // 4. Create account
      const res = await apiFetch<{ data: SellAccountFormData }>("/accounts", {
        method: "POST",
        data: params,
      });

      console.log("Account created successfully:", res);

      // 5. Reset form (uncomment when ready)
      // resetForm();

      alert("Account submitted for sale successfully!");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(
        `Submission failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Helper function for image upload
  const uploadImages = async (): Promise<number[]> => {
    if (imageFiles.length === 0) return [];

    try {
      const imageForm = new FormData();
      imageFiles.forEach((file) => {
        imageForm.append("files", file);
      });

      // Debug FormData contents (optional)
      for (const entry of imageForm.entries()) {
        console.log("FormData entry:", entry[0], entry[1]);
      }

      const uploadRes = await apiFetch<UploadResponse[]>("/upload", {
        method: "POST",
        data: imageForm,
      });

      return uploadRes.map((file) => file.id);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload images");
    }
  };
  const filteredHouses = useMemo(() => {
    let data = citiThemes;
    if (filterType) data = data.filter((h) => h.type === filterType);
    if (search)
      data = data.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
      );
    return data;
  }, [citiThemes, filterType, search]);

  const toggleLegendary = (id: number) => {
    setSelectedLegendary((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRenderHouse = () => {
    return selectedLegendary.map((item) => {
      const index = citiThemes.findIndex(
        (itemThemes) => itemThemes.id === item
      );
      if (index !== -1) return citiThemes[index].name;
    });
  };

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
              <Label htmlFor="price">{`Giá ${
                editing ? "mong muốn" : "gợi ý"
              }  (VNĐ)`}</Label>

              <div className="flex items-center gap-2">
                {editing ? (
                  <Input
                    type="number"
                    value={manualPrice ?? priceToShow}
                    onChange={(e) => setManualPrice(Number(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  <div className="text-green-600 ">
                    {priceToShow.toLocaleString()} đ
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editing) {
                      if (manualPrice === suggestedPrice) setManualPrice(null);
                      else setIsManual(true);
                    }
                    setEditing(!editing);
                  }}
                >
                  {editing ? "Lưu" : "Sửa"}
                </Button>
                {isManual ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setManualPrice(null);
                      setIsManual(false);
                    }}
                  >
                    Reset
                  </Button>
                ) : null}
              </div>

              {/* Warning nếu giá nhập tay thấp hơn gợi ý */}
              {manualPrice !== null && manualPrice < suggestedPrice && (
                <p className="text-sm text-yellow-600 mt-1">
                  Giá bạn nhập thấp hơn gợi ý khoảng{" "}
                  {(suggestedPrice - manualPrice).toLocaleString()}đ
                </p>
              )}
              {manualPrice !== null && manualPrice > suggestedPrice && (
                <p className="text-sm text-yellow-600 mt-1">
                  Giá bạn nhập cao hơn gợi ý khoảng{" "}
                  {(manualPrice - suggestedPrice).toLocaleString()}đ
                </p>
              )}
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
            <div className="col-span-6 md:col-span-2">
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
            <div className="col-span-6 md:col-span-2">
              <Label htmlFor="equipment_emblems">
                Biểu trưng (vd: 8/8 món V)
              </Label>
              <Input
                id="equipment_emblems"
                name="equipment_emblems"
                value={formData.equipment_emblems}
                onChange={handleChange}
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
                Minh văn đặc biệt (vd: 10mv cam, 4mv chung đội hình)
              </Label>
              <Input
                id="tattoo"
                name="tattoo"
                value={formData.tattoo}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-4 md:col-span-4">
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
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="resources">Tài nguyên (B)</Label>
              <Input id="resources" name="resources" onChange={handleChange} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Label>Nhà huyền thoại đã chọn</Label>
              <div className="flex flex-wrap gap-1 text-sm">
                {selectedLegendary.length > 0 ? (
                  handleRenderHouse().map((item) => (
                    <span
                      key={item}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">
                    Chưa chọn nhà nào
                  </span>
                )}
              </div>
              <Button
                type="button"
                onClick={() => setLegendaryModalOpen(true)}
                className="mt-2"
              >
                Chọn Nhà Huyền Thoại
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 md:col-span-6">
              <Label htmlFor="commander">Tướng (cách nhau dấu ,)</Label>
              <Input
                id="commander"
                name="commander"
                value={formData.commander}
                onChange={handleChange}
                placeholder="VD: HKB, Lưu Triệt, ..."
              />
            </div>
            <div className="col-span-12 md:col-span-2 flex items-center space-x-2">
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
            <div className="col-span-6 md:col-span-4">
              <Button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="mt-2"
              >
                Quản lý ảnh ({imageFiles.length})
              </Button>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit">Đăng bán account</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Modal Legendary Selector */}
      <DialogPrimitive.Root
        open={legendaryModalOpen}
        onOpenChange={setLegendaryModalOpen}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
          <DialogPrimitive.Content className="fixed z-[60] top-1/2 left-1/2 max-h-[90vh] w-[95vw] md:w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <DialogPrimitive.Title className="text-lg font-semibold text-[#2c2f4b]">
                Chọn Nhà Huyền Thoại
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm nhà huyền thoại..."
              className="w-full mb-3 rounded border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 text-[#2c2f4b]"
            />

            <div className="flex gap-2 mb-4 text-sm">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t === filterType ? null : t)}
                  className={`px-3 py-1 rounded-full capitalize ${
                    filterType === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {houseTypeMap[t]}
                </button>
              ))}
              {filterType && (
                <button
                  onClick={() => setFilterType(null)}
                  className="text-xs text-gray-600 underline ml-2"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredHouses.map((house) => (
                <label
                  key={house.id}
                  className={`relative rounded-lg border  ${
                    selectedLegendary.includes(house.id)
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-gray-300"
                  } p-2 flex flex-col items-center cursor-pointer`}
                >
                  <img
                    src={`http://localhost:1340${house.image.url}`}
                    alt={house.name}
                    style={{ width: "auto", height: "160px" }}
                    className="rounded"
                  />
                  <div className="mt-2 text-center text-[#2c2f4b]">
                    <div className="font-medium text-sm">{house.name}</div>
                    <div className="text-xs text-gray-500">{house.buff}</div>
                    <span
                      className={`mt-1 inline-block text-xs px-2 py-0.5 rounded ${
                        house.type === "infantry"
                          ? "bg-blue-100 text-blue-800"
                          : house.type === "archer"
                          ? "bg-red-100 text-red-800"
                          : house.type === "cavalry"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {houseTypeMap[house.type]}
                    </span>
                  </div>

                  <Checkbox.Root
                    checked={selectedLegendary.includes(house.id)}
                    onCheckedChange={() => toggleLegendary(house.id)}
                    className="absolute top-2 right-2 w-5 h-5 rounded border border-gray-400 bg-white data-[state=checked]:bg-blue-600"
                  >
                    <Checkbox.Indicator className="text-white">
                      <Check className="w-4 h-4" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </label>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-700">
              Đã chọn: {selectedLegendary.length} / {citiThemes.length}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogPrimitive.Close>
              <DialogPrimitive.Close asChild>
                <Button type="button">Xác nhận</Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      <ImageManagerModal
        isOpen={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        images={imageFiles}
        onUpdateImages={setImageFiles}
      />
    </Dialog>
  );
}
