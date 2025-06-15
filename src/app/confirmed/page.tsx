"use client";

import { CheckCircle } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        Xác minh email thành công!
      </h1>
      <p className="text-gray-600 mb-6">
        Tài khoản của bạn đã được xác nhận. Vui lòng đăng nhập để tiếp tục.
      </p>
      <AuthModal>Đăng nhập ngay</AuthModal>
    </div>
  );
}
