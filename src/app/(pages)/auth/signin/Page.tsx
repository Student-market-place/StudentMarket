"use client";

import { useRouter } from "next/navigation";
import { handleSignIn } from "@/app/server/authActions"; // Импортируем серверную функцию

const SigninPage = () => {
  const router = useRouter();

  return (
    <form className="flex flex-col gap-2" action={handleSignIn}>
      <input
        type="text"
        name="email"
        className="border-2"
        id="email"
        placeholder="thomas@gmail.com"
      />
      <button
        type="submit"
        className="w-full"
        onClick={() => router.push("/auth/verify-request")}
      >
        Connexion
      </button>
    </form>
  );
};

export default SigninPage;
