"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white hidden p-4 pl-6 md:flex items-center justify-between">
      <Image src="/icons/devlink-logo.svg" alt="logo" width={146} height={32} />
      <div className="flex">
        <Link
          href="/"
          className={`rounded-lg py-[11px] px-[27px] h-[46px] gap-2 text-gray font-semibold cursor-pointer flex items-center justify-center ${
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
          Links
        </Link>

        <Link
          href="/profile"
          className={`rounded-lg py-[11px] px-[27px] h-[46px] gap-2 text-gray font-semibold cursor-pointer flex items-center justify-center ${
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
          Profile Details
        </Link>
      </div>

      <Link href="/preview">
        <Button
          variant={"outline"}
          className={`border border-purple text-purple font-semibold hover:bg-lightpurple hover:text-purple py-[11px] h-[46px] px-[27px] ${
            pathname === "/preview" ? "bg-purple text-white" : ""
          }`}
        >
          Preview
        </Button>
      </Link>
    </div>
  );
};

export default Navbar;
