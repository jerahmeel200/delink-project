"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import CustomInput from "./CustomInput";
import { z } from "zod";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" && { confirmPassword: "" }),
    },
  });

  // Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const { confirmPassword, ...userData } = data;

        const newUser = await signUp(userData);

        setUser(newUser);
        if (newUser) router.push("/sign-in");
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-8 flex flex-col gap-16 md:items-center md:justify-center">
      <Link href="/" className="cursor-pointer flex items-center">
        <Image
          src="/icons/devlink-logo.svg"
          width={182}
          height={40}
          alt="devlink logo"
        />
      </Link>
      <div className="flex flex-col gap-10 md:bg-white md:min-w-[476px] md:rounded-[12px] md:p-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-[32px] leading-[36px] md:leading-[48px] font-bold text-darkgray">
            {type === "sign-in" ? "Login" : "Create account"}
          </h1>
          <p className="font-normal text-gray">
            {type === "sign-in"
              ? "Add your details below to get back into the app"
              : "Let's get you started sharing your links!"}
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomInput
                icon="/icons/envelope.svg"
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="e.g. alex@email.com"
              />

              {type === "sign-in" && (
                <CustomInput
                  icon="/icons/lock.svg"
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              )}

              {type === "sign-up" && (
                <>
                  <CustomInput
                    icon="/icons/lock.svg"
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="At least 8 characters"
                  />
                  <CustomInput
                    icon="/icons/lock.svg"
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="At least 8 characters"
                  />

                  <p className="text-xs text-gray">
                    Password must contain at least 8 characters
                  </p>
                </>
              )}

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple hover:bg-lightpurple rounded-lg h-[46px] flex font-semibold items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Login"
                  ) : (
                    "Create new account"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex flex-col md:flex-row items-center justify-center gap-1">
            <p className="text-14 font-normal text-gray">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="text-purple"
            >
              {type === "sign-in" ? "Create an account" : "Login"}
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
