// components/ConfirmDialog.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";

type ConfirmDialogProps = {
  open: boolean;
  onConfirm: () => Promise<void>; // lưu ý: giờ là Promise
  onCancel: () => void;
  message: string;
};

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  message,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(); // đợi promise
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) setLoading(false); // reset khi đóng
  }, [open]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg text-gray-700">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Xác nhận
          </Dialog.Title>
          <div className="text-sm mb-6">{message}</div>
          <div className="flex justify-end gap-3">
            <button
              disabled={loading}
              onClick={onCancel}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              disabled={loading}
              onClick={handleConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading && <Spinner size="3" />}
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
