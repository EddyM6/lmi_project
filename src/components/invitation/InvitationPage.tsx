"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { OpeningVideoOverlay } from "@/components/invitation/OpeningVideoOverlay";
import { CountdownRsvpSection } from "@/components/sections/CountdownRsvpSection";
import { DetailsSection } from "@/components/sections/DetailsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import type { InvitationContent, Locale } from "@/lib/content/types";
import { localeOrder } from "@/lib/locale";

type Props = {
  initialLocale: Locale;
  contentByLocale: Record<Locale, InvitationContent>;
};

export function InvitationPage({ initialLocale, contentByLocale }: Props) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [showOpening, setShowOpening] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const content = useMemo(() => contentByLocale[locale], [contentByLocale, locale]);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    router.replace(`/?lang=${nextLocale}`);
  }

  return (
    <main className="app-shell">
      {showOpening ? (
        <OpeningVideoOverlay
          mp4Src="/assets/video/opening-custom-v2.mp4"
          posterSrc="/assets/video/opening-poster.jpg"
          onRevealStart={() => setShowContent(true)}
          onComplete={() => setShowOpening(false)}
        />
      ) : null}
      {showContent ? (
        <>
          <div className="ambient-bg" aria-hidden="true" />
          <nav className="locale-switcher" aria-label="language switcher">
            {localeOrder.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLocale(item)}
                data-active={item === locale}
              >
                {contentByLocale[item].localeLabel}
              </button>
            ))}
          </nav>

          <HeroSection content={content} />
          <GallerySection content={content} />
          <DetailsSection content={content} />
          <CountdownRsvpSection content={content} locale={locale} />
        </>
      ) : null}
    </main>
  );
}
