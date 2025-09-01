import Bottombar from "@/components/naves/Bottombar";
import LeftSidebar from "@/components/naves/LeftSidebar";
import RightSidebar from "@/components/naves/RightSidebar";
import Topbar from "@/components/naves/Topbar";
import { ReactNode } from "react";

export const metadata = {
  title: "directory-threads",
  description:
    "A simple space to share your thoughts, connect with people, and build meaningful conversations in real time.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Topbar />

      <main className="flex">
        <LeftSidebar />

        <section className="main-container">
          <div className="max-w-4xl">{children}</div>
        </section>

        <RightSidebar />
      </main>

      <Bottombar />
    </>
  );
}
