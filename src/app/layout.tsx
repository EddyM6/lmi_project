import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Cinzel } from "next/font/google";

import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

const handwriting = Caveat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-handwrite",
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
      <body className={`${cinzel.variable} ${cormorant.variable} ${handwriting.variable}`}>{children}</body>
    </html>
  );
}
