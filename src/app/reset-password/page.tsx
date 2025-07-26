"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code, // lấy từ URL
            password,
            passwordConfirmation: confirm,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.error?.message || "Failed");
      }
    } catch (err) {
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p>Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.</p>;
  }

  return (
    <div>
      <h1>Đặt lại mật khẩu</h1>
      <input
        type="password"
        placeholder="Mật khẩu mới"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Nhập lại mật khẩu"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang xử lý..." : "Xác nhận"}
      </button>
    </div>
  );
}
