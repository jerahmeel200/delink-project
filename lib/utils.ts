import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const authFormSchema = (type: string) =>
  z
    .object({
      email: z.string().email().min(2, "Can't be empty"),
      password: z.string().min(8, {
        message: "Please check again",
      }),
      ...(type === "sign-up" && {
        confirmPassword: z.string().min(8, {
          message: "Please check again",
        }),
      }),
    })
    .refine(
      (data) => type !== "sign-up" || data.password === data.confirmPassword,
      {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }
    );

export const formSchema = z.object({
  links: z.array(
    z.object({
      platform: z.string().min(2, { message: "This field cannot be empty" }),
      link: z.string().min(2, { message: "This field cannot be empty" }),
    })
  ),
});

export const platformColors: { [key: string]: string } = {
  GitHub: "#181717",
  LinkedIn: "#0A66C2",
  Twitter: "#1DA1F2",
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  Instagram: "#E1306C",
};

export const defaultLinks = [
  "GitHub",
  "LinkedIn",
  "Twitter",
  "YouTube",
  "Facebook",
  "Instagram",
];
