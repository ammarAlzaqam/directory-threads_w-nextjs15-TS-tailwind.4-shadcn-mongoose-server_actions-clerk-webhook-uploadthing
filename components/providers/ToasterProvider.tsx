import React from "react";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--color-dark-1)",
            color: "var(--color-light-1)",
          },
        }}
      />
    </>
  );
}
