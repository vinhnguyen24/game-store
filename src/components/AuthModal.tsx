"use client";

import { useState } from "react";
import { FiUser, FiLogIn, FiUserPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";

type AuthModalProps = {
  children?: React.ReactNode;
};

export default function AuthModal({ children }: AuthModalProps) {
  const { user, login } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    identifier: "",
    password: "",
  });

  const handleClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      setOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPendingEmail(null); // reset nếu trước đó đã có email pending

    try {
      const endpoint = isLogin ? "/auth/local" : "/auth/local/register";
      const data = isLogin
        ? { identifier: form.identifier, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
          };

      const res = await apiFetch<{ jwt: string; user: any }>(endpoint, {
        method: "POST",
        data,
      });

      if (isLogin) {
        login(res.user, res.jwt);
        setOpen(false);
        router.push("/profile");
      } else {
        setPendingEmail(form.email);
      }
    } catch (err: any) {
      console.log(err);
      if (err?.message === "Your account email is not confirmed") {
        setError(
          "Tài khoản của bạn chưa xác minh email. Vui lòng kiểm tra hòm thư."
        );
      } else if (err?.message === "Invalid identifier or password") {
        setError("Sai tên tài khoản hoặc mật khẩu!");
      } else {
        setError(err?.message || "Đã xảy ra lỗi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-full transition-colors"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {children ?? <FiUser className="w-5 h-5" />}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl text-[#2c2f4b]">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </DialogTitle>
        </DialogHeader>
        {pendingEmail ? (
          <div className="text-center space-y-4 py-6">
            <h2 className="text-xl font-semibold text-[#2c2f4b]">
              Vui lòng xác minh email
            </h2>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi một email xác minh đến{" "}
              <strong>{pendingEmail}</strong>.
              <br />
              Hãy kiểm tra hộp thư đến của bạn và xác nhận để hoàn tất đăng ký.
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                setForm({
                  username: "",
                  email: "",
                  identifier: "",
                  password: "",
                });
              }}
            >
              Đóng
            </Button>
          </div>
        ) : (
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2 text-[#2c2f4b]">
                <Label htmlFor="username">Tên người dùng</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên người dùng"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
            )}

            {isLogin ? (
              <div className="space-y-2 text-[#2c2f4b]">
                <Label htmlFor="identifier">Email hoặc tên người dùng</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Nhập email hoặc tên người dùng của bạn"
                  value={form.identifier}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="space-y-2 text-[#2c2f4b]">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2 text-[#2c2f4b]">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Đang xử lý..."
              ) : isLogin ? (
                <div className="flex items-center gap-2">
                  <FiLogIn className="w-4 h-4" />
                  Đăng nhập
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FiUserPlus className="w-4 h-4" />
                  Đăng ký
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-[#2c2f4b]">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? "Tạo tài khoản mới" : "Đăng nhập ngay"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
