import { signIn } from "@/auth";

const SigninPage = () => {
  return (
    <form
      className="flex flex-col gap-2"
      action={async (formData) => {
        "use server";
        console.log("formData", formData);
        try {
          await signIn("resend", formData, {
            callbackUrl: "http://localhost:3000",
          });
        } catch (error) {
          console.error("Failed to sign in", error);
        }
      }}
    >
      <input
        type="text"
        name="email"
        className="border-2"
        id="email"
        placeholder="thomas@gmail.com"
      />
      <button type="submit" className="w-full">
        Connexion
      </button>
    </form>
  );
};

export default SigninPage;
