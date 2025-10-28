import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ChangelogDialog } from "@/components/changelog-dialog";
import { ThemeProvider } from "@/components/nav-bar/theme-provider";
import { MotionDiv } from "@/components/ui/motion";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ToastWrapper } from "./toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FFCS Planner",
  description: "Plan your FFCS schedule with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <MotionDiv
              className="min-h-screen bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {children}
              <ToastWrapper />
              <ChangelogDialog currentAppVersion={version} />
            </MotionDiv>
          </TooltipProvider>
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === "production" && <Analytics />}
    </html>
  );
}
