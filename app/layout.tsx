"use client";

import "./globals.css";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

export default function RootLayout({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "dark");
      return;
    }
    setDarkMode(theme === "dark");
    setLoaded(true);
  }, []);

  if (!loaded)
    return (
      <html>
        <body></body>
      </html>
    );

  return (
    <html
      lang="en"
      className={`${inter.className} ${
        darkMode ? "dark" : ""
      } bg-dark-1 text-light-1`}
    >
      <body>
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
          <ClerkProvider
            appearance={{
              baseTheme: darkMode ? dark : undefined,
              variables: {
                colorPrimary: "var(--color-primary-500)",
                colorBackground: "var(--color-dark-2)",
                colorText: "var(--color-light-1)",
                colorTextSecondary: "var(--color-light-3)",
                colorInputBackground: "var(--color-dark-4)",
                colorInputText: "var(--color-light-1)",
              },
            }}
          >
            {children}
          </ClerkProvider>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
