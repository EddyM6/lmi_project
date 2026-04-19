import type { RsvpRequest, RsvpResponse } from "@/lib/rsvp/validation";

export async function submitToAppsScript(
  payload: Omit<RsvpRequest, "website">,
  fetchImpl: typeof fetch,
): Promise<RsvpResponse> {
  const endpoint = process.env.RSVP_APPS_SCRIPT_URL;
  const sharedSecret = process.env.RSVP_SHARED_SECRET;

  if (!endpoint || !sharedSecret) {
    return {
      ok: false,
      message: "RSVP backend is not configured.",
    };
  }

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rsvp-secret": sharedSecret,
      },
      body: JSON.stringify({
        name: payload.name,
        surename: payload.surename,
        email: payload.email,
        attending: payload.attending,
        guestCount: payload.guestCount,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "Could not submit RSVP right now.",
      };
    }

    return {
      ok: true,
      message: "RSVP submitted",
    };
  } catch {
    return {
      ok: false,
      message: "Network error while submitting RSVP.",
    };
  }
}
