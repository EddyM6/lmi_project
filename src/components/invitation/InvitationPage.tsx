"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showAudioButton, setShowAudioButton] = useState(true);
  const [glowAudioButton, setGlowAudioButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollYRef = useRef(0);

  const content = useMemo(() => contentByLocale[locale], [contentByLocale, locale]);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    router.replace(`/?lang=${nextLocale}`);
  }

  const startThemeSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      setIsMusicPlaying(true);
      return;
    }

    audio.muted = false;
    audio.volume = 1;
    const attempt = audio.play();
    if (!attempt) return;

    void attempt
      .then(() => {
        setIsMusicPlaying(true);
      })
      .catch(() => {
        // If blocked by policy, user can use the visible audio button.
      });
  }, []);

  const stopThemeSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsMusicPlaying(false);
  }, []);

  const toggleThemeSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      stopThemeSong();
      return;
    }

    startThemeSong();
  }, [startThemeSong, stopThemeSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlaybackState = () => {
      setIsMusicPlaying(!audio.paused);
    };

    audio.addEventListener("play", syncPlaybackState);
    audio.addEventListener("pause", syncPlaybackState);
    audio.addEventListener("ended", syncPlaybackState);

    syncPlaybackState();

    return () => {
      audio.removeEventListener("play", syncPlaybackState);
      audio.removeEventListener("pause", syncPlaybackState);
      audio.removeEventListener("ended", syncPlaybackState);
    };
  }, []);

  useEffect(() => {
    if (!showContent) return;

    setGlowAudioButton(true);
    const timer = window.setTimeout(() => {
      setGlowAudioButton(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [showContent]);

  useEffect(() => {
    if (!showContent) return;

    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (currentY < 8) {
        setShowAudioButton(true);
      } else if (delta > 6) {
        setShowAudioButton(false);
      } else if (delta < -6) {
        setShowAudioButton(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [showContent]);

  return (
    <main className="app-shell">
      <audio ref={audioRef} src="/assets/audio/theme-song.mp3" loop preload="auto" />
      {showOpening ? (
        <OpeningVideoOverlay
          mp4Src="/assets/video/IMG_8210.websafe.mp4?v=20260507"
          posterSrc="/assets/video/opening-poster.jpg"
          onVideoInteraction={() => {
            startThemeSong();
          }}
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

          <button
            type="button"
            aria-label={isMusicPlaying ? "Mute music" : "Unmute music"}
            aria-pressed={isMusicPlaying}
            className={`audio-toggle ${showAudioButton ? "audio-toggle--visible" : "audio-toggle--hidden"} ${
              glowAudioButton ? "audio-toggle--glow" : ""
            }`}
            onClick={toggleThemeSong}
          >
            {isMusicPlaying ? (
              <img src="/assets/icons/audio-unmute.svg" alt="" aria-hidden="true" className="audio-toggle-icon" />
            ) : (
              <img src="/assets/icons/audio-mute.svg" alt="" aria-hidden="true" className="audio-toggle-icon" />
            )}
          </button>
        </>
      ) : null}
    </main>
  );
}
