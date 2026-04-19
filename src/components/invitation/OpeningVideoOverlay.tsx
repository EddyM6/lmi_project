"use client";

import { useEffect, useRef, useState } from "react";

type OpeningVideoOverlayProps = {
  mp4Src: string;
  webmSrc?: string;
  posterSrc?: string;
  onComplete: () => void;
};

const FADE_OUT_MS = 750;
const FAILSAFE_MS = 9000;

export function OpeningVideoOverlay({ mp4Src, webmSrc, posterSrc, onComplete }: OpeningVideoOverlayProps) {
  const [isFading, setIsFading] = useState(false);
  const finishedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  function startFadeOut() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFading(true);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startFadeOut();
    }, FAILSAFE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const promise = video.play();
    if (promise) {
      void promise.catch(() => {
        // Autoplay can fail on some devices; reveal page instead of getting stuck.
        startFadeOut();
      });
    }
  }, []);

  useEffect(() => {
    if (!isFading) return;

    const timer = window.setTimeout(() => {
      onComplete();
    }, FADE_OUT_MS);

    return () => window.clearTimeout(timer);
  }, [isFading, onComplete]);

  return (
    <div className={`opening-overlay ${isFading ? "opening-overlay--fading" : ""}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="opening-video"
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={startFadeOut}
        onError={startFadeOut}
        onStalled={startFadeOut}
        onAbort={startFadeOut}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
}
