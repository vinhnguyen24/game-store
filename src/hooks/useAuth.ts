// hooks/useAuth.ts
"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (user: User, token: string) => {
    const userData = {
      email: user.email,
      username: user.username,
      id: user.id,
      createdAt: user.createdAt,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("jwtToken", token);
    setUser(user);

    try {
      const res = await fetch(`${BASE_URL}/users/me?populate=avatar`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch full user info");
      const fullUser = await res.json();
      const userData = {
        email: fullUser.email,
        username: fullUser.username,
        id: fullUser.id,
        createdAt: fullUser.createdAt,
        avatar: fullUser.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error fetching full user info:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  return {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  };
};
