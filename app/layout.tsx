import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ClerkThemeProvider from "@/components/providers/ClerkProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} bg-dark-1 text-light-1`}>
      <body>
        <ThemeProvider>
          <ClerkThemeProvider>
            <ToasterProvider>{children}</ToasterProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
