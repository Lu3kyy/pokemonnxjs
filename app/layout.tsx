import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Sora } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodyFont = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pokedex Companion",
  description:
    "Generation 1-5 Pokemon companion with favorites and animated backgrounds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
