// src/auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


declare module "next-auth" {
  interface User {
    role?: "student" | "company";
  }
  
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
        
        // Récupérer le rôle depuis l'URL
        const callbackUrl = typeof account.callback_url === 'string' ? account.callback_url : '';
        const searchParams = new URLSearchParams(callbackUrl.split('?')[1] || '');
        const role = searchParams.get('role');
        
        if (role) {
          // Mettre à jour le rôle dans la base de données
          await prisma.user.update({
            where: { id: user.id },
            data: { role: role as "student" | "company" }
          });
          token.role = role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.role = token.role as "student" | "company";
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Rediriger vers la page de création de compte après l'authentification
      if (url.includes('/api/auth/callback/google')) {
        return `${baseUrl}/auth/create-account`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log("SignIn Event - User:", message.user);
      console.log("SignIn Event - Account:", message.account);

      try {
        // Rechercher l'utilisateur temporaire le plus récent
        const tempUser = await prisma.user.findFirst({
          where: {
            email: { startsWith: 'temp_' }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        if (tempUser) {
          // Mettre à jour le rôle de l'utilisateur actuel
          await prisma.user.update({
            where: { id: message.user.id },
            data: { role: tempUser.role }
          });

          // Supprimer l'utilisateur temporaire
          await prisma.user.delete({
            where: { id: tempUser.id }
          });

          const updatedUser = await prisma.user.findUnique({
            where: { id: message.user.id },
            select: {
              role: true,
              email: true,
              name: true,  
            },
          });

          localStorage.setItem("user", JSON.stringify(updatedUser));
          

          console.log("Rôle transféré et utilisateur temporaire supprimé");
        }
      } catch (error) {
        console.error("Erreur lors du transfert du rôle:", error);
      }
    },
    async signOut(message) {
      console.log("User signed out:", message);
    },
  },
  ...authConfig,
});
