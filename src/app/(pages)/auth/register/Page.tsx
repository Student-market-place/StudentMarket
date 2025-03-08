"use client";

import AuthCard from "@/components/custom-ui/AuthCard";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    try {
      const email = formData.get("email") as string;
      const role = formData.get("role") as string;
      console.log("📧 Tentative d'inscription avec:", { email, role });

      // Appeler l'API pour créer l'utilisateur
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Si l'utilisateur existe déjà ou vient d'être créé, envoyer l'email
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/auth/create-account"
      });

      if (result?.ok) {
        console.log("✅ Email de vérification envoyé");
        router.push("/auth/verify-request");
      } else {
        console.error("❌ Erreur lors de l'envoi de l'email:", result?.error);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <AuthCard 
        variant="student" 
        handleAction={handleSignUp}
        handleRoute={() => {}}
      />
    </div>
  );
};

export default RegisterPage;
