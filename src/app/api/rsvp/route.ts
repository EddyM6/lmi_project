import { NextResponse } from "next/server";

import { submitToAppsScript } from "@/lib/rsvp/submit";
import { validateRsvpPayload } from "@/lib/rsvp/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validateRsvpPayload(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid RSVP payload",
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json(
      {
        ok: true,
        message: "Submission received",
      },
      { status: 200 },
    );
  }

  const result = await submitToAppsScript(
    {
      name: parsed.data.name,
      surename: parsed.data.surename,
      email: parsed.data.email,
      attending: parsed.data.attending,
      guestCount: parsed.data.guestCount,
      locale: parsed.data.locale,
    },
    fetch,
  );

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
