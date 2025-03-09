// src/auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
    } & User
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    verifyRequest: `http://localhost:3000/auth/verify-request`,
  },
  events: {
    async signIn({ user, account }) {
      console.log("SignIn Event - User:", user);
      console.log("SignIn Event - Account:", account);
    },
    async signOut() {
      console.log("User signed out");
    },
  },
  ...authConfig,
});
