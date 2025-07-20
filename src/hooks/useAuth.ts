// hooks/useAuth.ts
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user = session?.user || null;
  const jwt = session?.user?.jwt || null;

  return {
    user,
    jwt,
    isLoggedIn: !!user,
    loading: status === "loading",
    login: signIn,
    logout: signOut,
  };
};
