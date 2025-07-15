import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

type NegotiatePriceDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (price: number, message: string, phone: string) => void;
};

export default function NegotiatePriceDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: NegotiatePriceDialogProps) {
  const [priceInput, setPriceInput] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Format the price for display when priceInput changes
    if (priceInput) {
      const numericValue = priceInput.replace(/\D/g, "");
      const formattedValue = numericValue
        ? new Intl.NumberFormat("vi-VN").format(parseInt(numericValue))
        : "";
      setDisplayPrice(formattedValue);
    } else {
      setDisplayPrice("");
    }
  }, [priceInput]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Store the raw numeric value without formatting
    setPriceInput(value.replace(/\D/g, ""));
  };

  const handleSubmit = async () => {
    const numericPrice = parseFloat(priceInput);
    if (isNaN(numericPrice)) return;

    try {
      await onSubmit(numericPrice, message, phone);

      setPriceInput("");
      setDisplayPrice("");
      setMessage("");
      setPhone("");
      onOpenChange(false);
    } catch (err) {
      console.error("Submit negotiation failed:", err);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-600">
              Thương lượng giá
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-red-500 cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá bạn muốn đề nghị
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                value={displayPrice}
                onChange={handlePriceChange}
                placeholder="VND"
              />
              <input type="hidden" value={priceInput} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại (Zalo)
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lời nhắn (tuỳ chọn)
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ví dụ: Mình mua sớm có được giảm thêm không ạ?"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 cursor-pointer"
            >
              Gửi đề nghị
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
