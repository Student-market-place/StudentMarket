//"use client"

//import { useRouter } from "next/navigation";
//import { handleSignIn } from "@/app/server/authActions"; // Импортируем серверную функцию

import AuthCard from "@/components/custom-ui/AuthCard";


const SigninPage = () => {
  const router = useRouter();

  return (

    //<form className="flex flex-col gap-2" action={handleSignIn}>
      //<input
        //type="text"
        //name="email"
        //className="border-2"
        //id="email"
        //placeholder="thomas@gmail.com"
      ///>
      //<button
        //type="submit"
        //className="w-full"
        //onClick={() => router.push("/auth/verify-request")}
      //>
        //Connexion
      //</button>
    //</form>

    <div className="flex justify-center items-center h-screen">
      <AuthCard variant="login" />
    </div>

  );
};

export default SigninPage;
