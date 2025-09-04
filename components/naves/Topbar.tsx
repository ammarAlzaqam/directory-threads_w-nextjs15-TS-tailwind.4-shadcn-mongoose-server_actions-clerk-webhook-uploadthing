"use client";

import { useTheme } from "@/app/layout";
import { fetchUser } from "@/lib/actions/user.action";
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Moon as DarkIcon, Sun as LightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [userImg, setUserImg] = useState<any>(null);
  const [isMount, setIsMount] = useState(false);
  const { user, isLoaded } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  useEffect(() => {
    async function getUserImg() {
      if (user) {
        const { image } = await fetchUser(user.id);
        setUserImg(image);
      }
    }
    getUserImg();
    setIsMount(true);
  }, [isLoaded, user]);

  if (!isLoaded || !isMount)
    return <div className="topbar h-16 w-full bg-skeleton animate-pulse" />;

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
            <div className="relative">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: "py-2 px-4",
                  },
                }}
              />
              <div className="absolute left-1.5 top-[50%] translate-y-[-50%] rounded-md overflow-hidden">
                <Image
                  src={userImg || "/assets/user.svg"}
                  alt="profile_image"
                  width={24}
                  height={24}
                  className="bg-dark-3 object-cover"
                />
              </div>
            </div>
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
