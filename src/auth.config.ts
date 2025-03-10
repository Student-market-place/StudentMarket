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
      from: "no-reply@1ucas1eveque.fr",
      async sendVerificationRequest({ identifier, url, provider }) {
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
            console.error("❌ Échec de l'envoi d'email. Status:", response.status);
            const errorData = await response.json();
            console.error("📛 Détails de l'erreur:", errorData);
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const responseData = await response.json();

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
        token.isNewUser = account.isNewUser;
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
      
      try {
        let email;
        
        // Cas spécial pour le callback Resend
        if (url.includes('/api/auth/callback/resend')) {
          const params = new URLSearchParams(url.split('?')[1]);
          email = params.get('email');
          return `${baseUrl}/auth/create-account?email=${email}`;
        }
        
        // Pour les autres cas
        const urlParams = new URLSearchParams(url.split('?')[1]);
        email = urlParams.get('email');
        
        if (url.includes('/auth/create-account')) {
          
          if (url.includes('/api/auth/callback/google')) {
          }
          
          if (email) {
            const decodedEmail = decodeURIComponent(email);
            try {
              const user = await prisma.user.findUnique({
                where: { email: decodedEmail },
                include: { student: true, company: true }
              })
              
              if (user?.student || user?.company) {
                return `${baseUrl}/home?email=${email}`;
              }
            } catch (error) {
              console.error("❌ Erreur vérification utilisateur:", error);
            }
          }
          
          const redirectUrl = email ? `${baseUrl}/auth/create-account?email=${email}` : `${baseUrl}/auth/create-account`;
          return redirectUrl;
        }
        
        if (url.includes('/auth/signin') || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/home`;
        }
        
        // Si l'URL contient un email, le préserver dans la redirection
        if (email) {
          const finalUrl = url.includes('?') ? `${url}&email=${email}` : `${url}?email=${email}`;
          return finalUrl;
        }
        
        return url;
      } catch (error) {
        console.error("❌ Erreur dans redirect:", error);
        return url;
      }
    },
  },
} satisfies NextAuthConfig;
