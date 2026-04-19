import { submitToAppsScript } from "@/lib/rsvp/submit";

describe("submitToAppsScript", () => {
  const payload = {
    name: "Test User",
    surename: "Guest",
    email: "guest@example.com",
    attending: "yes" as const,
    guestCount: 2,
    locale: "en" as const,
  };

  it("returns success when upstream accepts", async () => {
    process.env.RSVP_APPS_SCRIPT_URL = "https://example.com/script";
    process.env.RSVP_SHARED_SECRET = "topsecret";

    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));

    const result = await submitToAppsScript(payload, fetchMock as unknown as typeof fetch);
    expect(result.ok).toBe(true);
  });

  it("returns failure when upstream returns non-200", async () => {
    process.env.RSVP_APPS_SCRIPT_URL = "https://example.com/script";
    process.env.RSVP_SHARED_SECRET = "topsecret";

    const fetchMock = vi.fn(async () => new Response("bad", { status: 500 }));

    const result = await submitToAppsScript(payload, fetchMock as unknown as typeof fetch);
    expect(result.ok).toBe(false);
  });
});
