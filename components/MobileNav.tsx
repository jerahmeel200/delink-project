"use client";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setUserId(user.$id);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-white p-4 pl-6 flex md:hidden items-center justify-between">
      <Image src="/icons/mobile-logo.svg" alt="logo" width={52} height={52} />
      <div className="flex">
        <Link
          href="/"
          className={`rounded-lg py-[11px] w-[74px] px-[27px] h-[46px] gap-2 text-gray font-semibold cursor-pointer flex items-center justify-center ${
            pathname === "/"
              ? "bg-lightpurple text-purple"
              : "hover:text-purple"
          }`}
        >
          {pathname === "/" ? (
            <Image
              src="/icons/purple-link.svg"
              alt="logo"
              width={20}
              height={20}
            />
          ) : (
            <Image src="/icons/link.svg" alt="logo" width={20} height={20} />
          )}
        </Link>

        <Link
          href="/profile"
          className={`rounded-lg py-[11px] px-[27px] h-[46px] w-[74px] gap-2 text-gray font-semibold cursor-pointer flex items-center justify-center ${
            pathname === "/profile"
              ? "bg-lightpurple text-purple"
              : "hover:text-purple"
          }`}
        >
          {pathname === "/profile" ? (
            <Image
              src="/icons/purple-profile.svg"
              alt="logo"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src="/icons/user-circle.svg"
              alt="logo"
              width={20}
              height={20}
            />
          )}
        </Link>
      </div>
      <Link href={userId ? `/preview/${userId}` : "#"}>
        <Image src="/icons/eye.svg" alt="logo" width={52} height={52} />
      </Link>
    </div>
  );
};

export default MobileNav;
