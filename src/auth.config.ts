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
        
        // Stocker l'information que c'est un nouvel utilisateur
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
      console.log("🔄 Redirection URL:", url);
      
      // Pour le suivi de débogage
      console.log("🔑 Base URL:", baseUrl);
      
      try {
        // Récupérer l'email depuis les paramètres de l'URL s'il existe déjà
        let email = url.split('email=')[1]?.split('&')[0];
        
        // Si on redirige vers la page de création de compte, on s'assure d'avoir l'email
        if (url.includes('/auth/create-account')) {
          // Si on vient d'un callback Google
          if (url.includes('/api/auth/callback/google')) {
            // Remarque: Nous n'avons pas accès au token ici directement,
            // L'email sera ajouté via le middleware ou directement dans les routes spécifiques
            console.log("⚠️ Callback Google détecté, l'email sera ajouté ultérieurement");
          }
          
          // Vérifier si l'utilisateur existe déjà (si email est disponible)
          if (email) {
            const decodedEmail = decodeURIComponent(email);
            try {
              const user = await prisma.user.findUnique({
                where: { email: decodedEmail },
                include: { student: true, company: true }
              });
              
              // Si l'utilisateur a déjà un profil, rediriger vers home
              if (user?.student || user?.company) {
                return `${baseUrl}/home?email=${email}`;
              }
            } catch (error) {
              console.error("❌ Erreur lors de la vérification de l'utilisateur:", error);
            }
          }
          
          // Ajout de l'email à l'URL de création de compte si disponible
          return email ? `${baseUrl}/auth/create-account?email=${email}` : `${baseUrl}/auth/create-account`;
        }
        
        // Si l'URL est la page de connexion ou l'accueil
        if (url.includes('/auth/signin') || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/home`;
        }
        
        // Pour les autres URLs, on ne modifie rien
        return url;
      } catch (error) {
        console.error("❌ Erreur dans le callback redirect:", error);
        return url;
      }
    },
  },
} satisfies NextAuthConfig;
