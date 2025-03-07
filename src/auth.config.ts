// src/auth.config.ts

import { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";

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
      from: "Dev <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier, url, provider }) {
        console.log("sendVerificationRequest", identifier, url, provider);
        try {
          await fetch(`http://localhost:3000/api/resend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${provider.apiKey}`,
            },
            body: JSON.stringify({
              from: provider.from,
              to: identifier,
              subject: "Votre lien de connexion",
              url,
            }),
          });
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
