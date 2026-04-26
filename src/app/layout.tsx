import type { Metadata } from "next";
import { Noto_Serif, Noto_Serif_Armenian } from "next/font/google";

import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ["armenian"],
  variable: "--font-armenian",
});

export const metadata: Metadata = {
  title: "Levon & Mari Invitation",
  description: "Wedding invitation with multilingual support and RSVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <body className={`${notoSerif.variable} ${notoSerifArmenian.variable}`}>{children}</body>
    </html>
  );
}
