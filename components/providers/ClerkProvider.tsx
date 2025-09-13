"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { useTheme } from "./ThemeProvider";
import { dark } from "@clerk/themes";

export default function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: darkMode ? dark : undefined,
        variables: {
          colorPrimary: "var(--color-primary-500)",
          colorBackground: "var(--color-dark-2)",
          colorText: "var(--color-light-1)",
          colorTextSecondary: "var(--color-light-2)",
          colorInputBackground: "var(--color-dark-4)",
          colorInputText: "var(--color-light-1)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
