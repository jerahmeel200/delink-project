"use client";

import { useEffect, useState } from "react";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getLoggedInUser, addLinksToUser } from "@/lib/actions/user.actions"; // Import the function
import { formSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser();
      if (!loggedInUser) {
        router.push("/sign-in");
      } else {
        setUser(loggedInUser);
      }
    };

    fetchUser();
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      links: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return; // Ensure user is available
    setIsLoading(true); // Start loading
    try {
      await addLinksToUser(user.$id, data.links);
      toast({
        description: "Links updated successfully",
        className: "bg-darkgray text-white h-[56px] rounded-[12px]",
      });
      // Force a page reload
      window.location.reload();
    } catch (error) {
      console.error("Error updating links:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <section className="bg-lightgray min-h-screen md:p-6 flex flex-col md:gap-6">
      <div>
        <Navbar />
        <MobileNav />
      </div>
      <div className="xl:flex gap-6 w-full">
        {/* DESKTOP ONLY */}
        <div className="hidden xl:flex xl:min-h-[744px] xl:max-h-[750px] w-[560px] bg-white rounded-[12px] items-center justify-center">
          {/* PHONE DIAGRAM */}
          <Phone user={user} />
        </div>

        {/* DESKTOP AND MOBILE */}
        <div className="p-4 md:p-0 w-full xl:w-2/3">
          <div className="bg-white w-full py-6 md:py-10 rounded-[12px] flex flex-col gap-10">
            <div className="flex flex-col gap-2 px-6 md:px-10">
              <h2 className="text-darkgray font-bold text-2xl md:text-[32px]">
                Customize your links
              </h2>
              <p className="text-gray font-normal">
                Add/edit/remove links below and then share all your profiles
                with the world!
              </p>
            </div>

            <div className="w-full flex flex-col gap-6 px-6 md:px-10">
              <Button
                variant={"outline"}
                className="text-purple w-full rounded-lg bg-white border hover:bg-lightpurple hover:text-purple font-semibold border-purple py-[11px] px-[27px] h-12"
                onClick={() => append({ platform: "", link: "" })}
              >
                + Add new Link
              </Button>

              {/* GET STARTED */}
              {fields.length === 0 && (
                <div className="bg-lightgray w-full rounded-[12px] min-h-[376px] p-5 flex flex-col items-center justify-center gap-6">
                  <Image
                    src="/icons/get-started.svg"
                    alt="icon"
                    width={248}
                    height={160}
                  />
                  <h2 className="text-darkgray font-bold text-2xl md:text-[32px] text-center">
                    Let&apos;s get you started
                  </h2>
                  <p className="text-center text-gray max-w-[488px]">
                    Use the “Add new link” button to get started. Once you have
                    more than one link, you can reorder and edit them.
                    We&apos;re here to help you share your profiles with
                    everyone!
                  </p>
                </div>
              )}

              {/* LINK DIVS */}
              {fields.length > 0 && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 w-full"
                  >
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-lightgray w-full rounded-lg flex flex-col gap-3 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex gap-2">
                            =
                            <p className="text-gray font-bold">
                              Link #{index + 1}
                            </p>
                          </span>
                          <p
                            className="cursor-pointer text-gray"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </p>
                        </div>

                        {/* SELECT FIELD */}
                        <FormField
                          control={form.control}
                          name={`links.${index}.platform`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="text-xs text-gray md:text-base">
                                Platform
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full rounded-lg py-3 px-4 h-12 ring-transparent focus:ring-purple focus-visible:ring-purple focus-visible:shadow-xl focus:shadow-xl bg-white ring-offset-0">
                                    <SelectValue
                                      placeholder="Select a platform"
                                      className="text-darkgray text-lg"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value="github"
                                      className="text-darkgray text-base border-b py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaGithub className="text-xl" />
                                        <p>GitHub</p>
                                      </div>
                                    </SelectItem>

                                    <SelectItem
                                      value="linkedin"
                                      className="text-darkgray text-base border-b py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaLinkedinIn className="text-xl" />
                                        <p>LinkedIn</p>
                                      </div>
                                    </SelectItem>

                                    <SelectItem
                                      value="twitter"
                                      className="text-darkgray text-base border-b py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaTwitter className="text-xl" />
                                        <p>Twitter</p>
                                      </div>
                                    </SelectItem>

                                    <SelectItem
                                      value="youtube"
                                      className="text-darkgray text-base border-b py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaYoutube className="text-xl" />
                                        <p>YouTube</p>
                                      </div>
                                    </SelectItem>

                                    <SelectItem
                                      value="facebook"
                                      className="text-darkgray text-base border-b py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaFacebook className="text-xl" />
                                        <p>Facebook</p>
                                      </div>
                                    </SelectItem>

                                    <SelectItem
                                      value="instagram"
                                      className="text-darkgray text-base py-4"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <FaInstagram className="text-xl" />
                                        <p>Instagram</p>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* LINK INPUT FIELD */}
                        <FormField
                          control={form.control}
                          name={`links.${index}.link`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="text-xs text-gray md:text-base">
                                Link
                              </FormLabel>
                              <div className="relative">
                                <Image
                                  src="/icons/link.svg"
                                  width={20}
                                  height={20}
                                  alt="link icon"
                                  className="absolute left-4 top-4"
                                />
                                <FormControl>
                                  <Input
                                    placeholder="e.g. https://www.github.com/johnappleseed"
                                    {...field}
                                    className="w-full rounded-lg py-3 px-4 pl-12 h-12 ring-transparent focus:ring-purple focus-visible:ring-purple focus-visible:shadow-xl focus:shadow-xl bg-white ring-offset-0"
                                  />
                                </FormControl>
                                <FormMessage className="absolute right-4 top-4 text-xs" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <div className="border-t p-4 md:px-10 flex justify-center md:justify-end">
                      <Button
                        type="submit"
                        className="text-white w-full md:w-24 rounded-lg bg-purple hover:bg-lightpurple hover:text-purple py-[11px] px-[27px] h-12"
                        disabled={!form.formState.isValid || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            &nbsp; Loading...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
            {fields.length === 0 && (
              <div className="border-t p-4 md:px-10 flex justify-center md:justify-end">
                <Button
                  className="text-white w-full md:w-24 rounded-lg bg-purple hover:bg-lightpurple hover:text-purple py-[11px] px-[27px] h-12"
                  disabled
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
