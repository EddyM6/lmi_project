"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type OpeningVideoOverlayProps = {
  mp4Src: string;
  webmSrc?: string;
  posterSrc?: string;
  onVideoInteraction?: () => void;
  onRevealStart?: () => void;
  onComplete: () => void;
};

const FADE_OUT_MS = 560;
const BLOOM_IN_MS = 420;
const TRANSITION_TRIGGER_BEFORE_END_SEC = 1.1;
const START_HINT_TEXT = "Click to reveal";

export function OpeningVideoOverlay({
  mp4Src,
  webmSrc,
  posterSrc,
  onVideoInteraction,
  onRevealStart,
  onComplete,
}: OpeningVideoOverlayProps) {
  const [hasGestureStarted, setHasGestureStarted] = useState(false);
  const [isBlooming, setIsBlooming] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const finishedRef = useRef(false);
  const transitionStartedRef = useRef(false);
  const playbackStartedRef = useRef(false);
  const bloomTimerRef = useRef<number | null>(null);
  const playbackCheckTimerRef = useRef<number | null>(null);
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
    const video = videoRef.current;
    if (!video) return;
    // Load and hold the first frame until the user starts playback.
    video.muted = true;
    video.defaultMuted = true;
    video.pause();
  }, []);

  useEffect(() => {
    return () => {
      if (bloomTimerRef.current) {
        window.clearTimeout(bloomTimerRef.current);
      }
      if (playbackCheckTimerRef.current) {
        window.clearTimeout(playbackCheckTimerRef.current);
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

  const startPlayback = useCallback(() => {
    // Always retry audio start on user gestures until it succeeds.
    onVideoInteraction?.();

    if (playbackStartedRef.current || transitionStartedRef.current || finishedRef.current) return;
    playbackStartedRef.current = true;
    setHasGestureStarted(true);

    const video = videoRef.current;
    if (!video) {
      startLightTransition();
      return;
    }

    // Keep intro video muted; background song is the audible track users control.
    video.muted = true;
    video.defaultMuted = true;

    if (playbackCheckTimerRef.current) {
      window.clearTimeout(playbackCheckTimerRef.current);
    }
    playbackCheckTimerRef.current = window.setTimeout(() => {
      if (finishedRef.current || transitionStartedRef.current) return;
      if (video.paused) {
        playbackStartedRef.current = false;
        setHasGestureStarted(false);
      }
    }, 1200);

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {
        // Retry and allow another gesture if playback start is blocked.
        video.muted = true;
        video.defaultMuted = true;
        const mutedRetry = video.play();
        if (mutedRetry) {
          void mutedRetry.catch(() => {
            playbackStartedRef.current = false;
            setHasGestureStarted(false);
          });
          return;
        }
        playbackStartedRef.current = false;
        setHasGestureStarted(false);
      });
    }
  }, [onVideoInteraction, startLightTransition]);

  return (
    <div
      className={`opening-overlay ${isBlooming ? "opening-overlay--blooming" : ""} ${isFading ? "opening-overlay--fading" : ""}`}
      aria-hidden="true"
      onTouchStart={startPlayback}
      onPointerUp={startPlayback}
      onTouchEnd={startPlayback}
      onClick={startPlayback}
    >
      <video
        ref={videoRef}
        className="opening-video"
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
        onLoadedData={(event) => {
          // Keep the first frame visible and paused before user gesture only.
          if (playbackStartedRef.current) return;
          const element = event.currentTarget;
          element.pause();
          if (element.currentTime !== 0) {
            element.currentTime = 0;
          }
        }}
        onPlaying={() => {
          if (playbackCheckTimerRef.current) {
            window.clearTimeout(playbackCheckTimerRef.current);
            playbackCheckTimerRef.current = null;
          }
        }}
        onTimeUpdate={(event) => {
          if (playbackCheckTimerRef.current) {
            window.clearTimeout(playbackCheckTimerRef.current);
            playbackCheckTimerRef.current = null;
          }
          const element = event.currentTarget;
          const duration = element.duration;
          if (!Number.isFinite(duration) || duration <= 0) return;

          const timeLeft = duration - element.currentTime;
          if (timeLeft <= TRANSITION_TRIGGER_BEFORE_END_SEC) {
            startLightTransition();
          }
        }}
        onEnded={startLightTransition}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
      {posterSrc ? (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          className={`opening-video-poster ${hasGestureStarted ? "opening-video-poster--hidden" : ""}`}
        />
      ) : null}
      <div className={`opening-start-hint ${hasGestureStarted ? "opening-start-hint--hidden" : ""}`} aria-hidden="true">
        {Array.from(START_HINT_TEXT).map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="opening-start-hint-letter"
            style={{ "--char-index": index } as CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <div className="opening-light-core" />
      <div className="opening-light-veil" />
    </div>
  );
}
