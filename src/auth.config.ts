// src/auth.config.ts

import { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const prisma = new PrismaClient();

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        },
      },
    }),
    Resend({
      apiKey: process.env.NEXT_PUBLIC_AUTH_RESEND_KEY,
      from: "onboarding@resend.dev",
      async sendVerificationRequest({ identifier, url, provider }) {
        console.log("📧 Envoi de l'email de vérification", { identifier, url });
        try {
          const response = await fetch(`${baseUrl}/api/resend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${provider.apiKey}`,
            },
            body: JSON.stringify({
              from: provider.from,
              to: identifier,
              subject: "Connexion à Student Market",
              url,
            }),
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          console.log("✅ Email de vérification envoyé avec succès");
        } catch (error) {
          console.error("❌ Erreur lors de l'envoi de l'email:", error);
          throw error;
        }
      },
    }),
  ],
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
      console.log("🔄 Redirection URL:", url);
      
      // Vérifier si l'utilisateur existe déjà
      const token = url.split('token=')[1]?.split('&')[0];
      const email = url.split('email=')[1]?.split('&')[0];
      
      // Si c'est un callback de vérification d'email
      if (url.includes('/api/auth/callback/resend')) {
        try {
          if (email) {
            const decodedEmail = decodeURIComponent(email);
            const user = await prisma.user.findUnique({
              where: { email: decodedEmail },
              include: { student: true, company: true }
            });

            // Si l'utilisateur a déjà un profil, rediriger vers home
            if (user?.student || user?.company) {
              return `${baseUrl}/home`;
            }
          }
          return `${baseUrl}/auth/create-account`;
        } catch (error) {
          console.error("Erreur lors de la vérification de l'utilisateur:", error);
          return `${baseUrl}/auth/create-account`;
        }
      }
      
      // Après la connexion Google
      if (url.includes('/api/auth/callback/google')) {
        try {
          if (email) {
            const decodedEmail = decodeURIComponent(email);
            const user = await prisma.user.findUnique({
              where: { email: decodedEmail },
              include: { student: true, company: true }
            });

            if (user?.student || user?.company) {
              return `${baseUrl}/home`;
            }
          }
          return `${baseUrl}/auth/create-account`;
        } catch (error) {
          return `${baseUrl}/auth/create-account`;
        }
      }

      // Si l'URL est la page de connexion ou l'accueil
      if (url.includes('/auth/signin') || url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/home`;
      }

      return url;
    },
  },
} satisfies NextAuthConfig;
