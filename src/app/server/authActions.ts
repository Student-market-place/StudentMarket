"use server";

import { signIn } from "@/auth";

export async function handleSignIn(formData: FormData) {
  console.log("formData", formData);
  try {
    await signIn("resend", formData, {
      callbackUrl: "http://localhost:3000",
    });
  } catch (error) {
    console.error("Failed to sign in", error);
  }
}
