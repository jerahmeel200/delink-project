"use client";

import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { Client, Storage } from "node-appwrite";
import { defaultLinks, platformColors } from "@/lib/utils";

const Preview = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
          router.push("/sign-in");
        } else {
          setUser(loggedInUser);

          // Fetch the profile image only after user data is fetched
          const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

          const storage = new Storage(client);

          const response = await storage.getFileDownload(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
            loggedInUser.$id
          );

          // Convert the response (ArrayBuffer) to a Blob
          const blob = new Blob([response], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setProfileImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [router]);

  const links = [
    { platform: "GitHub", url: user?.github, icon: <FaGithub /> },
    { platform: "LinkedIn", url: user?.linkedin, icon: <FaLinkedin /> },
    { platform: "Twitter", url: user?.twitter, icon: <FaTwitter /> },
    { platform: "YouTube", url: user?.youtube, icon: <FaYoutube /> },
    { platform: "Facebook", url: user?.facebook, icon: <FaFacebook /> },
    { platform: "Instagram", url: user?.instagram, icon: <FaInstagram /> },
  ];

  return (
    <section className="relative md:p-6 w-full">
      {/* BLUE BACKGROUND */}
      <div className="hidden md:flex bg-purple absolute w-full h-[357px] top-0 left-0 -z-10 rounded-b-[32px]"></div>

      {/* NAVBAR */}
      <div className="bg-white p-4 pl-6 flex items-center justify-between md:rounded-[12px]">
        <Link href="/">
          <Button
            className="py-[11px] px-[27px] rounded-lg h-[46px] text-purple font-semibold border-purple hover:bg-lightpurple hover:text-purple"
            variant="outline"
          >
            Back to Editor
          </Button>
        </Link>
        <Link href="/">
          <Button className="py-[11px] px-[27px] rounded-lg h-[46px] bg-purple font-semibold hover:bg-lightpurple hover:text-purple">
            Share Link
          </Button>
        </Link>
      </div>

      {/* USER CARD */}
      <div className="max-w-[348px] rounded-[24px] py-12 px-14 mx-auto md:my-32 md:shadow-lg flex items-start flex-col justify-center gap-[56px] z-20 bg-white">
        <div className="flex flex-col gap-[25px] w-full items-center justify-center">
          {/* PROFILE CIRCLE */}
          <div className="bg-[#EEEEEE] w-[96px] h-[96px] rounded-full overflow-hidden flex items-center justify-center">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={96}
                height={96}
                alt="profile picture"
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <div className="bg-[#EEEEEE] w-full h-full"></div>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-3">
            {/* USER NAME */}
            {user && user.firstName && user.lastName ? (
              <p className="text-darkgray font-bold text-[32px] text-center">{`${user.firstName} ${user.lastName}`}</p>
            ) : (
              <div className="bg-[#EEEEEE] h-4 rounded-[104px] w-[160px]"></div>
            )}

            {/* EMAIL */}
            {user && user.email ? (
              <p className="text-gray text-center font-normal text-base">
                {user.email}
              </p>
            ) : (
              <div className="bg-[#EEEEEE] h-2 w-[72px] rounded-[104px]"></div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          {links.every((link) => !link.url)
            ? defaultLinks.map((platform, index) => (
                <div
                  key={index}
                  className="bg-[#EEEEEE] w-full h-11 rounded-lg flex items-center justify-center"
                ></div>
              ))
            : links.map(
                (link, index) =>
                  link.url && (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[56px] text-white rounded-lg flex items-center justify-between px-4 py-3"
                      style={{
                        backgroundColor: platformColors[link.platform],
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {link.icon}
                        <p className="font-xs">{link.platform}</p>
                      </span>
                      <Image
                        src="/icons/arrow-right.svg"
                        alt="arrow right"
                        width={16}
                        height={16}
                        loading="eager"
                      />
                    </a>
                  )
              )}
        </div>
      </div>
    </section>
  );
};

export default Preview;
