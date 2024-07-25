"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Can't be empty",
  }),
  lastName: z.string().min(2, {
    message: "Can't be empty",
  }),
  email: z.string().email(),
});

interface ProfileFormProps {
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
  formRef: React.RefObject<HTMLFormElement>;
  setFormValid: (isValid: boolean) => void;
  initialValues?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function ProfileForm({
  onSubmit,
  formRef,
  setFormValid,
  initialValues,
}: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      firstName: "",
      lastName: "",
      email: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 w-full"
        ref={formRef}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row w-full md:justify-between md:items-center">
              <FormLabel className="text-xs text-gray md:text-base">
                First Name *
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="w-full rounded-lg py-3 px-4 h-12 md:w-[344px] ring-transparent focus:ring-purple focus-visible:ring-purple focus-visible:shadow-xl focus:shadow-xl bg-white ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="absolute right-4 top-4" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row w-full md:justify-between md:items-center">
              <FormLabel className="text-xs text-gray md:text-base">
                Last Name *
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Wright"
                    {...field}
                    className="w-full rounded-lg py-3 px-4 h-12 md:w-[344px] ring-transparent focus:ring-purple focus-visible:ring-purple focus-visible:shadow-xl focus:shadow-xl bg-white ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="absolute right-4 top-4" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row w-full md:justify-between md:items-center">
              <FormLabel className="text-xs text-gray md:text-base">
                Email
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="ben@example.com"
                    {...field}
                    className="w-full rounded-lg py-3 px-4 h-12 md:w-[344px] ring-transparent focus:ring-purple focus-visible:ring-purple focus-visible:shadow-xl focus:shadow-xl bg-white ring-offset-0"
                  />
                </FormControl>
                <FormMessage className="absolute right-4 top-4" />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
