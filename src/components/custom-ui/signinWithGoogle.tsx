"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

const SigninWithGoogle = () => {
  const pathname = usePathname();
  const role = pathname.includes("student") ? "student" : "company";
  
  console.log("SigninWithGoogle - Current pathname:", pathname);
  console.log("SigninWithGoogle - Selected role:", role);

  const handleGoogleSignIn = () => {
    console.log("SigninWithGoogle - Initiating sign in with role:", role);
    signIn("google", { 
      callbackUrl: `/api/auth/callback/google?role=${role}`
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="inline-flex items-center rounded-md bg-white text-sm font-medium text-neutral-500 shadow-sm transition-colors hover:bg-[#357AE8] focus:outline-none focus:ring-2 focus:ring-[#4285F4] hover:text-white focus:ring-offset-2 h-auto px-4 py-2"
    >
      <img
        width={20}
        height={20}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
        alt=""
      />
      <span className="ml-2">Connexion avec google</span>
    </Button>
  );
};

export default SigninWithGoogle;