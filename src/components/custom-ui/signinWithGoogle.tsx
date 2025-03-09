"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SigninWithGoogle = () => {
  const pathname = usePathname();
  const role = pathname.includes("student") ? "student" : "company";

  const handleGoogleSignIn = () => {
    signIn("google", { 
      callbackUrl: `/api/auth/callback/google?role=${role}`
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="flex items-center gap-2 bg-white text-black hover:bg-gray-100"
    >
      <Image
        src="/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      Se connecter avec Google
    </Button>
  );
};

export default SigninWithGoogle;