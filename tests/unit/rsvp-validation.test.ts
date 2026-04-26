import { validateRsvpPayload } from "@/lib/rsvp/validation";

describe("validateRsvpPayload", () => {
  it("accepts valid payload", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      guestCount: 2,
      locale: "hy",
    });

    expect(result.success).toBe(true);
  });

  it("rejects guest count out of range", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      guestCount: 0,
      locale: "hy",
    });

    expect(result.success).toBe(false);
  });

  it("accepts payload without email and attending", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      guestCount: 1,
      locale: "hy",
    });

    expect(result.success).toBe(true);
  });
});
