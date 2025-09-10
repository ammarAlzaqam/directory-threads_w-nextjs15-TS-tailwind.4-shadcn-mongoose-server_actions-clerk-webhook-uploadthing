"use client";

import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ResetForm({
  route,
  query,
}: {
  route: string;
  query: string;
}) {
  const handelResetForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = document.querySelector(".searchbar") as HTMLFormElement;
    if (form) form.reset();

    const btn = e.currentTarget;
    btn?.setAttribute("data-state", "closed");
  };
  return (
    <button
      type="reset"
      data-state={query ? "open" : "closed"}
      className="animate-zoom transition bg-light-4 hover:bg-light-3 p-1 rounded-full"
      onClick={handelResetForm}
    >
      <Link href={route}>
        <X className="text-dark-1 size-5" />
      </Link>
    </button>
  );
}
