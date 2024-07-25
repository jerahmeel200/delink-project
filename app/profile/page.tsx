"use client";

import { useState, useRef, useEffect } from "react";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import Phone from "@/components/Phone";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getLoggedInUser, updateUserProfile } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Client, Storage } from "node-appwrite";

export default function Profile() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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

  const formRef = useRef<HTMLFormElement | null>(null);
  const [isFormValid, setFormValid] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    if (user) {
      try {
        toast({
          description: `Updating user profile: ${user.$id}`,
          className: "bg-darkgray text-white h-[56px] rounded-[12px]",
        });

        const updatedUser = await updateUserProfile(user.$id, values);

        if (updatedUser) {
          toast({
            description: "Your changes have been successfully saved!",
            className: "bg-darkgray text-white h-[56px] rounded-[12px]",
          });

          window.location.reload();
        } else {
          toast({
            description: "Profile update failed",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating profile", error);
        toast({
          description: "Error updating profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const storage = new Storage(client);

      // Get the input element and ensure it's of type HTMLInputElement
      const uploader = document.getElementById(
        "uploader"
      ) as HTMLInputElement | null;

      if (uploader && uploader.files && uploader.files[0]) {
        try {
          if (user) {
            const promise = storage.createFile(
              process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
              user.$id,
              uploader.files[0]
            );

            const response = await promise;
            console.log(response); // Success

            // Optional: Toast notifications for success
            toast({
              description: "Your changes have been successfully saved!",
              className: "bg-darkgray text-white h-[56px] rounded-[12px]",
            });
            // Force a page reload
            window.location.reload();
          } else {
            console.error("User not found");
            toast({
              description: "User not found",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error uploading file", error);
          toast({
            description: "Error uploading file",
            variant: "destructive",
          });
        }
      } else {
        console.error("Uploader element or file not found");
      }
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        const client = new Client()
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const storage = new Storage(client);

        try {
          const response = await storage.getFileDownload(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
            user.$id
          );

          // Convert the response (ArrayBuffer) to a Blob
          const blob = new Blob([response], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } catch (error) {
          console.error("Error downloading profile image", error);
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  return (
    <section className="bg-lightgray min-h-screen md:p-6 flex flex-col md:gap-6">
      <div>
        <Navbar />
        <MobileNav />
      </div>
      <div className="xl:flex gap-6 w-full">
        <div className="hidden xl:flex w-[560px] bg-white rounded-[12px] items-center justify-center">
          <Phone user={user} />
        </div>
        <div className="p-4 md:p-0 w-full xl:w-2/3">
          <div className="bg-white w-full py-6 md:py-10 rounded-[12px] flex flex-col gap-10">
            <div className="flex flex-col gap-2 px-6 md:px-10">
              <h2 className="text-darkgray font-bold text-2xl md:text-[32px]">
                Profile Details
              </h2>
              <p className="text-gray font-normal">
                Add your details to create a personal touch to your profile.
              </p>
            </div>
            <div className="w-full flex flex-col gap-6 px-6 md:px-10">
              <div className="bg-lightgray w-full rounded-[12px] min-h-[230px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <p className="text-gray">Profile Picture</p>
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div
                    className="bg-lightpurple w-[193px] h-[193px] relative overflow-hidden rounded-[12px]"
                    style={{
                      backgroundImage: imageUrl
                        ? `url(${imageUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <input
                      type="file"
                      name="uploader"
                      id="uploader"
                      className="absolute h-full w-full z-10 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="w-full h-full flex flex-col cursor-pointer items-center justify-center">
                      {!imageUrl && (
                        <>
                          <Image
                            src="/icons/upload.svg"
                            width={40}
                            height={40}
                            alt="upload icon"
                          />
                          <p className="text-purple font-semibold">
                            + Upload image
                          </p>
                        </>
                      )}
                      {imageUrl && (
                        <>
                          <Image
                            src="/icons/white-upload.svg"
                            width={40}
                            height={40}
                            alt="upload icon"
                          />
                          <p className="text-white font-semibold">
                            Change image
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray md:max-w-[215px]">
                    Image must be below 1024x1024px. Use PNG or JPG format.
                  </p>
                </div>
              </div>
              <div className="bg-lightgray w-full rounded-[12px] min-h-[230px] p-5 flex items-start justify-start gap-6">
                {user && (
                  <ProfileForm
                    onSubmit={handleSubmit}
                    formRef={formRef}
                    setFormValid={setFormValid}
                    initialValues={{
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="border-t p-4 md:px-10 flex justify-center md:justify-end">
              <Button
                className="text-white w-full md:w-24 rounded-lg bg-purple hover:bg-lightpurple hover:text-purple py-[11px] px-[27px] h-12"
                onClick={triggerSubmit}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
