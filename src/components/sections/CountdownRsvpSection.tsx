"use client";

import { memo, useEffect, useState } from "react";

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
  return (
    <Section className="section section-final" >
      <h2>{content.countdown.heading}</h2>
      <CountdownClock
        dateISO={content.details.event.dateISO}
        daysLabel={content.countdown.days}
        hoursLabel={content.countdown.hours}
        minutesLabel={content.countdown.minutes}
        secondsLabel={content.countdown.seconds}
      />
      <RsvpForm content={content.rsvp} locale={locale} />
    </Section>
  );
}

const CountdownClock = memo(function CountdownClock({
  dateISO,
  daysLabel,
  hoursLabel,
  minutesLabel,
  secondsLabel,
}: {
  dateISO: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
}) {
  const left = useCountdown(dateISO);

  return (
    <div className="countdown-grid" aria-live="polite">
      <div><strong>{left.days}</strong><span>{daysLabel}</span></div>
      <div><strong>{left.hours}</strong><span>{hoursLabel}</span></div>
      <div><strong>{left.minutes}</strong><span>{minutesLabel}</span></div>
      <div><strong>{left.seconds}</strong><span>{secondsLabel}</span></div>
    </div>
  );
});

const RsvpForm = memo(function RsvpForm({
  content,
  locale,
}: {
  content: InvitationContent["rsvp"];
  locale: Locale;
}) {
  const [name, setName] = useState("");
  const [surename, setSurename] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const isSubmitted = status === "success";

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
      if (issue === "name") setValidationError(content.validation.nameRequired);
      else if (issue === "surename") setValidationError(content.validation.surenameRequired);
      else setValidationError(content.validation.guestCountInvalid);
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
    <form className="rsvp-form" onSubmit={doPost}>
      <h3>{isSubmitted ? content.success : content.heading}</h3>
      {!isSubmitted ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={content.name} aria-label={content.name} required />
          <input value={surename} onChange={(e) => setSurename(e.target.value)} placeholder={content.surename} aria-label={content.surename} required />
          <input type="number" min={1} max={10} value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder={content.guestCountHint} aria-label={content.guestCount} required />

          <input
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden="true"
          />
        </>
      ) : null}

      {validationError ? <p className="form-message error">{validationError}</p> : null}
      {status === "error" ? <p className="form-message error">{content.failure}</p> : null}

      {!isSubmitted ? (
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? content.sending : content.submit}
        </button>
      ) : null}
    </form>
  );
});
