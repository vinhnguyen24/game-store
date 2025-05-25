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

export default function AuthModal() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
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

    try {
      const endpoint = isLogin ? "/auth/local" : "/auth/local/register";
      const data = isLogin
        ? { identifier: form.email, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
          };

      const res = await apiFetch<{ jwt: string; user: any }>(endpoint, {
        method: "POST",
        data,
      });

      login(res.user, res.jwt);
      setOpen(false);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <FiUser className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
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

          <div className="text-center text-sm">
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
      </DialogContent>
    </Dialog>
  );
}
