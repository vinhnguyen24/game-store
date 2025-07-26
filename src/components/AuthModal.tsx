"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { FiUser } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface FormState {
  identifier: string;
  password: string;
  username?: string;
  email?: string;
}

type AuthModalProps = {
  children?: React.ReactNode;
};

export default function AuthModal({ children }: AuthModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ identifier: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          identifier: form.identifier,
          password: form.password,
        });

        if (res?.error) {
          setError("Sai tên tài khoản hoặc mật khẩu.");
        } else {
          setOpen(false);
          router.push("/profile");
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res || !res.ok) {
          throw new Error(data.error || "Đăng ký thất bại");
        }

        toast.success("Tạo tài khoản thành công!");
        setPendingEmail(data.user.email);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã có lỗi xảy ra.");
      }
    }

    setLoading(false);
  };

  const handleInputChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full transition-colors">
            {children ?? <FiUser className="w-5 h-5" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Trang cá nhân
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/negotiations")}>
            Thương lượng
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 👉 Nếu chưa đăng nhập thì show modal đăng nhập/đăng ký
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-full transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {children ?? <FiUser className="w-5 h-5" />}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogTitle />
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={(val: string) => setIsLogin(val === "login")}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Input
              placeholder="Email hoặc Tên người dùng"
              value={form.identifier}
              onChange={(e) => handleInputChange("identifier", e.target.value)}
              className="mb-3 text-gray-500"
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="mb-4 text-gray-500"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </TabsContent>

          <TabsContent value="register">
            <Input
              placeholder="Tên người dùng"
              value={form.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="mb-3 text-gray-500"
            />
            <Input
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mb-3 text-gray-500"
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="mb-4 text-gray-500"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {pendingEmail && (
              <p className="text-green-500 text-sm mb-2">
                Tạo tài khoản thành công, vui lòng kiểm tra hộp thư để xác nhận
                email
              </p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
