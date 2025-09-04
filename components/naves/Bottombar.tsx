"use client";

import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TipTitle from "../ui/tooltip";

export default function Bottombar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <footer className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const linkRoute =
            link.route === "/profile" ? `${link.route}/${userId}` : link.route;
          return (
            <TipTitle key={link.label} message={link.label}>
              <Link
                href={linkRoute}
               
                className={`bottombar_link ${
                  isActive && "!bg-primary-500"
                } bg-dark-4 dark:bg-transparent hover:bg-dark-3`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="text-subtle-medium text-light-2 max-sm:hidden">
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            </TipTitle>
          );
        })}
      </div>
    </footer>
  );
}
