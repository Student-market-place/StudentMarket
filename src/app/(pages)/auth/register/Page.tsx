"use client";

import AuthCard from "@/components/custom-ui/AuthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs defaultValue="student" className="w-[350px]">
        <TabsList className="w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <AuthCard 
            variant="student" 
            handleAction={handleSignUp}
            handleRoute={goToVerifyRequest}
          />
        </TabsContent>
        <TabsContent value="company">
          <AuthCard 
            variant="company" 
            handleAction={handleSignUp}
            handleRoute={goToVerifyRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterPage;
