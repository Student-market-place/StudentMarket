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
  pages: {
    verifyRequest: `http://localhost:3000/auth/verify-request`,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.email = (token.email as string) ?? null;
      session.user.name = (token.name as string) ?? null;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/api/auth/callback/google')) {
        return `${baseUrl}/auth/create-account`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
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
