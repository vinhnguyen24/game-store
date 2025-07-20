// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      jwt: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    jwt: string;
  }
}
