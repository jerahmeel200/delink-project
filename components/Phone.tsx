"use client";

import { defaultLinks, platformColors } from "@/lib/utils";
import Image from "next/image";
import { Client, Storage } from "node-appwrite";
import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const Phone: React.FC<PhoneProps> = ({ user }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : null;
  const displayEmail = user?.email || null;

  const links = [
    { platform: "GitHub", url: user?.github, icon: <FaGithub /> },
    { platform: "LinkedIn", url: user?.linkedin, icon: <FaLinkedin /> },
    { platform: "Twitter", url: user?.twitter, icon: <FaTwitter /> },
    { platform: "YouTube", url: user?.youtube, icon: <FaYoutube /> },
    { platform: "Facebook", url: user?.facebook, icon: <FaFacebook /> },
    { platform: "Instagram", url: user?.instagram, icon: <FaInstagram /> },
  ];



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
          setProfileImageUrl(url);
        } catch (error) {
          console.error("Error downloading profile image", error);
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  return (
    <div className="border border-gray w-[307px] h-[640px] rounded-[56px] relative overflow-y-hidden">
      <div className="w-[285px] h-[600px] flex items-start justify-center p-5 mx-auto">
        <Image
          src="/icons/phone-line.svg"
          width={285}
          height={620}
          alt="line"
          className="absolute top-3"
        />

        <div className="w-[237px] mt-16 flex items-start flex-col justify-center gap-[56px] z-20">
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
              {displayName ? (
                <p className="text-darkgray font-bold whitespace-nowrap text-[32px] text-center">
                  {displayName}
                </p>
              ) : (
                <div className="bg-[#EEEEEE] h-4 rounded-[104px] w-[160px]"></div>
              )}

              {/* USER EMAIL */}
              {displayEmail ? (
                <p className="text-gray text-center font-normal text-base">
                  {displayEmail}
                </p>
              ) : (
                <div className="bg-[#EEEEEE] h-2 w-[72px] rounded-[104px]"></div>
              )}
            </div>
          </div>

          <div className="w-full h-[240px] overflow-y-scroll">
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
                          className="w-full h-11 text-white rounded-lg flex items-center justify-between px-4 py-3"
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
        </div>
      </div>
    </div>
  );
};

export default Phone;
