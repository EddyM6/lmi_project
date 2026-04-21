"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type OpeningVideoOverlayProps = {
  mp4Src: string;
  webmSrc?: string;
  posterSrc?: string;
  onRevealStart?: () => void;
  onComplete: () => void;
};

const FADE_OUT_MS = 560;
const FAILSAFE_MS = 9000;
const BLOOM_IN_MS = 420;
const TRANSITION_TRIGGER_BEFORE_END_SEC = 1.1;

export function OpeningVideoOverlay({ mp4Src, webmSrc, posterSrc, onRevealStart, onComplete }: OpeningVideoOverlayProps) {
  const [isBlooming, setIsBlooming] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const finishedRef = useRef(false);
  const transitionStartedRef = useRef(false);
  const bloomTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startFadeOut = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onRevealStart?.();
    setIsFading(true);
  }, [onRevealStart]);

  const startLightTransition = useCallback(() => {
    if (transitionStartedRef.current) return;
    transitionStartedRef.current = true;
    setIsBlooming(true);

    bloomTimerRef.current = window.setTimeout(() => {
      startFadeOut();
    }, BLOOM_IN_MS);
  }, [startFadeOut]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startLightTransition();
    }, FAILSAFE_MS);

    return () => window.clearTimeout(timer);
  }, [startLightTransition]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const promise = video.play();
    if (promise) {
      void promise.catch(() => {
        // Autoplay can fail on some devices; reveal page instead of getting stuck.
        startLightTransition();
      });
    }
  }, [startLightTransition]);

  useEffect(() => {
    return () => {
      if (bloomTimerRef.current) {
        window.clearTimeout(bloomTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFading) return;

    const timer = window.setTimeout(() => {
      onComplete();
    }, FADE_OUT_MS);

    return () => window.clearTimeout(timer);
  }, [isFading, onComplete]);

  return (
    <div
      className={`opening-overlay ${isBlooming ? "opening-overlay--blooming" : ""} ${isFading ? "opening-overlay--fading" : ""}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="opening-video"
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={(event) => {
          const element = event.currentTarget;
          const duration = element.duration;
          if (!Number.isFinite(duration) || duration <= 0) return;

          const timeLeft = duration - element.currentTime;
          if (timeLeft <= TRANSITION_TRIGGER_BEFORE_END_SEC) {
            startLightTransition();
          }
        }}
        onEnded={startLightTransition}
        onError={startLightTransition}
        onStalled={startLightTransition}
        onAbort={startLightTransition}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
      <div className="opening-light-core" />
      <div className="opening-light-veil" />
    </div>
  );
}
