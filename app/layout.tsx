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
  title: {
    default: "FFCS Planner - Plan Your VIT Schedule with Ease",
    template: "%s | FFCS Planner",
  },
  description:
    "Plan your FFCS schedule with ease. Create, manage, and optimize your VIT University timetable with advanced clash detection and visual scheduling tools.",
  applicationName: "FFCS Planner",
  keywords: [
    "FFCS",
    "VIT",
    "timetable planner",
    "schedule planner",
    "VIT University",
    "course planner",
    "slot booking",
    "timetable management",
    "academic planner",
    "VIT Vellore",
  ],
  authors: [{ name: "Praveen Kumar", url: "https://praveen-2006.is-a.dev/" }],
  creator: "Praveen Kumar",
  publisher: "Praveen Kumar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ffcs-planner-v2.vercel.app",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FFCS Planner - Plan Your VIT Schedule with Ease",
    description:
      "Plan your FFCS schedule with ease. Create, manage, and optimize your VIT University timetable with advanced clash detection and visual scheduling tools.",
    siteName: "FFCS Planner",
    images: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ffcs-planner-v2.vercel.app"}/opengraph-image.png`,
  },
  twitter: {
    card: "summary_large_image",
    title: "FFCS Planner - Plan Your VIT Schedule with Ease",
    description:
      "Plan your FFCS schedule with ease. Create, manage, and optimize your VIT University timetable with advanced clash detection and visual scheduling tools.",
    creator: "@InfiniteCoder06",
    images: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ffcs-planner-v2.vercel.app"}/twitter-image.png`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
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
