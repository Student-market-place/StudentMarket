"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

interface AuthCardProps {
  variant?: "login" | "student" | "company";
}

interface FormValues {
  email: string;
}

const AuthCard = ({ variant = "student" }: AuthCardProps) => {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    router.push("/auth/create-account");
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {variant === "login"
            ? "Welcome Back!"
            : `Welcome to our New ${variant}!`}
        </CardTitle>
        <CardDescription>
          {variant === "login"
            ? "Enter your email to access your account."
            : `Sign up by entering your email to access your ${variant} account.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="space-y-4 flex flex-col items-center w-full">
              <div className="flex items-center space-x-2 w-full">
                <hr className="flex-grow border-gray-300" />
                <Label className="text-sm text-gray-400">
                  {variant === "login"
                    ? "Or log in with"
                    : "Or create one with"}
                </Label>
                <hr className="flex-grow border-gray-300" />
              </div>
              <Button variant="outline" className="flex items-center">
                <img src="/google.svg" alt="Google" width={20} height={20} />
                <span>{variant === "login" ? "Sign In" : "Sign Up"}</span>
              </Button>
            </div>
            <p className="text-center text-gray-400">
              {variant === "login"
                ? "You don't have an account? "
                : "You already have an account? "}
              <Link
                href={variant === "login" ? "/auth/register" : "/auth/signin"}
              >
                <span className="text-blue-400">
                  {variant === "login" ? "Sign Up!" : "Log In!"}
                </span>
              </Link>
            </p>
            <div className="w-full flex justify-end">
              <Button type="submit">
                {variant === "login" ? "Login" : "Sign Up"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
