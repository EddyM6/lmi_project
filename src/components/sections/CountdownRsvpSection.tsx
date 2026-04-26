"use client";

import { useEffect, useState } from "react";

import { Section } from "@/components/ui/Section";
import type { InvitationContent, Locale } from "@/lib/content/types";
import { validateRsvpPayload } from "@/lib/rsvp/validation";

function getRemaining(dateISO: string) {
  const target = new Date(dateISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function useCountdown(dateISO: string) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const id = window.setInterval(() => setLeft(getRemaining(dateISO)), 1000);
    return () => window.clearInterval(id);
  }, [dateISO]);

  return left;
}

type Props = {
  content: InvitationContent;
  locale: Locale;
};

const RSVP_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyFnTA94LL3TPzONfWYHD17nx4DTkpM7u5QEHSMZykamSb43iTgsKnYnUUJ67S-KBSY-Q/exec";

export function CountdownRsvpSection({ content, locale }: Props) {
  const [name, setName] = useState("");
  const [surename, setSurename] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  const left = useCountdown(content.details.event.dateISO);

  async function doPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const payload = {
      name,
      surename,
      guestCount: Number(guestCount),
      locale,
      website,
    };

    const parsed = validateRsvpPayload(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.path[0];
      if (issue === "name") setValidationError(content.rsvp.validation.nameRequired);
      else if (issue === "surename") setValidationError(content.rsvp.validation.surenameRequired);
      else setValidationError(content.rsvp.validation.guestCountInvalid);
      return;
    }

    setStatus("sending");
    try {
      const bodyPayload = {
        name: parsed.data.name,
        surename: parsed.data.surename,
        guestCount: parsed.data.guestCount,
      };

      await fetch(RSVP_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Keeps the request simple
        headers: {
          "Content-Type": "text/plain", // Keeps Google from triggering a CORS preflight
        },
        body: JSON.stringify(bodyPayload), // Send as a JSON string
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section className="section section-final" >
      <h2>{content.countdown.heading}</h2>
      <div className="countdown-grid" aria-live="polite">
        <div><strong>{left.days}</strong><span>{content.countdown.days}</span></div>
        <div><strong>{left.hours}</strong><span>{content.countdown.hours}</span></div>
        <div><strong>{left.minutes}</strong><span>{content.countdown.minutes}</span></div>
        <div><strong>{left.seconds}</strong><span>{content.countdown.seconds}</span></div>
      </div>

      <form className="rsvp-form" onSubmit={doPost}>
        <h3>{content.rsvp.heading}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={content.rsvp.name} aria-label={content.rsvp.name} required />
        <input value={surename} onChange={(e) => setSurename(e.target.value)} placeholder={content.rsvp.surename} aria-label={content.rsvp.surename} required />
        <input type="number" min={1} max={10} value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder={content.rsvp.guestCountHint} aria-label={content.rsvp.guestCount} required />

        <input
          className="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          aria-hidden="true"
        />

        {validationError ? <p className="form-message error">{validationError}</p> : null}
        {status === "success" ? <p className="form-message">{content.rsvp.success}</p> : null}
        {status === "error" ? <p className="form-message error">{content.rsvp.failure}</p> : null}

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? content.rsvp.sending : content.rsvp.submit}
        </button>
      </form>
    </Section>
  );
}
