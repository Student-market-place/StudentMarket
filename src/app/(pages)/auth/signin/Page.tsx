"use client";

import { useRouter } from "next/navigation";
import { handleSignIn } from "@/app/server/authActions"; // Import the server function
import AuthCard from "@/components/custom-ui/AuthCard";

const SigninPage = () => {
  const router = useRouter();

  const goToVerifyRequest = () => {
    router.push("/auth/verify-request");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <AuthCard
        variant="login"
        handleAction={handleSignIn}
        handleRoute={goToVerifyRequest}
      />
    </div>
  );
};

export default SigninPage;
