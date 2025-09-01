"use client";

import { useTheme } from "@/app/layout";
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Moon as DarkIcon, Sun as LightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Topbar() {
  const { darkMode, setDarkMode } = useTheme();
  return (
    <nav className="topbar">
      {/*//! Logo */}
      <Link href="/" className="flex items-center gap-4 max-xs:gap-3">
        <Image
          src="/assets/logo.svg"
          alt="logo"
          width={32}
          height={32}
          className="max-xs:w-[28px] max-xs:h-[28px]"
        />
        <h1 className="text-light-1 text-heading2-bold max-sm:text-heading3-bold">
          Dir-Thr
        </h1>
      </Link>

      {/*//! Theme Mode */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 cursor-pointer"
          onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("theme", darkMode ? "light" : "dark");
          }}
        >
          {darkMode ? (
            <LightIcon className="text-secondary-500" />
          ) : (
            <DarkIcon className="text-primary-500" />
          )}
        </button>
      </div>

      {/*//! Auth */}
      <ClerkLoading>
        <p className="animate-pulse bg-skeleton w-16 h-7"></p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center gap-1">
            <div className="md:hidden">
              <SignOutButton redirectUrl="/sign-in">
                <Image
                  src="/assets/logout.svg"
                  className="cursor-pointer p-0.5 rounded-full bg-light-3 w-[28px] h-[28px] dark:w-[24px] dark:h-[24px] dark:bg-transparent dark:p-0"
                  alt="Logout"
                  width={24}
                  height={24}
                />
              </SignOutButton>
            </div>
            <OrganizationSwitcher />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="md:hidden">
            <SignInButton>
              <button className="text-light-2 cursor-pointer">Signin</button>
            </SignInButton>
          </div>
        </SignedOut>
      </ClerkLoaded>
    </nav>
  );
}
