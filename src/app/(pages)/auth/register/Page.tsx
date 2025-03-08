"use client";

import AuthCard from "@/components/custom-ui/AuthCard";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          role: formData.get("role"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/auth/verify-request");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const goToVerifyRequest = () => {
    router.push("/auth/verify-request");
  };

  return (
    <div className="flex justify-center items-center h-screen">

          <AuthCard 
            variant="student" 
            handleAction={handleSignUp}
            handleRoute={goToVerifyRequest}
          />
    </div>
  );
};

export default RegisterPage;
