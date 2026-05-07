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

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return `https://${raw}`;
}

const siteUrl = getSiteUrl();
const shareImagePath = "/assets/images/share-preview.png";
const shareTitle = "Levon & Mari Invitation";
const shareDescription = "Wedding invitation with multilingual support and RSVP";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: shareTitle,
  description: shareDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: shareImagePath,
        width: 1024,
        height: 1536,
        alt: "Levon and Mari invitation wax seal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImagePath],
  },
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
