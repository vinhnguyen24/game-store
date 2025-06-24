"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Upload, Trash2 } from "lucide-react";
import { useState } from "react";

interface ImageManagerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  images: File[];
  onUpdateImages: (images: File[]) => void;
}

export function ImageManagerModal({
  isOpen,
  onOpenChange,
  images,
  onUpdateImages,
}: ImageManagerModalProps) {
  const [localImages, setLocalImages] = useState<File[]>(images);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setLocalImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemove = (index: number) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdateImages(localImages);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed z-60 top-1/2 left-1/2 max-h-[90vh] w-[95vw] md:w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg overflow-y-auto space-y-4 text-[#2c2f4b]">
          <div className="flex items-center justify-between mb-2">
            <Dialog.Title className="text-xl font-semibold">
              Quản lý ảnh
            </Dialog.Title>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit text-blue-600 text-sm font-medium">
            <Upload className="w-4 h-4" />
            Thêm ảnh mới
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {localImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-32 object-contain rounded bg-gray-100 p-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
