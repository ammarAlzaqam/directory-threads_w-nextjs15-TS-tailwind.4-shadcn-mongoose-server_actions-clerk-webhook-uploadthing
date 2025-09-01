"use client";

import { sidebarLinks } from "@/constants";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftSidebar() {
  const pathname = usePathname();
  return (
    <aside className="custom-scrollbar leftsidebar">
      {/*//! Links */}
      <div className="flex flex-1 w-full flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${
                isActive && "!bg-primary-500"
              } bg-dark-4 dark:bg-transparent hover:bg-dark-3`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      {/*//! Auth */}
      <div className="max-md:hidden">
        <ClerkLoading>
          <p className="animate-pulse bg-skeleton w-16 h-7"></p>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <SignOutButton redirectUrl="/sign-in">
              <div className="flex items-center gap-4 p-4 cursor-pointer ">
                <Image
                  src="/assets/logout.svg"
                  className="p-0.5 rounded-full bg-light-3 w-[28px] h-[28px] dark:w-[24px] dark:h-[24px] dark:bg-transparent dark:p-0"
                  alt="Logout"
                  width={24}
                  height={24}
                />
                <p className="max-lg:hidden">Logout</p>
              </div>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="text-light-2 cursor-pointer ml-6">
                Signin
              </button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </aside>
  );
}
