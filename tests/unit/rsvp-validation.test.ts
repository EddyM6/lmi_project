import { validateRsvpPayload } from "@/lib/rsvp/validation";

describe("validateRsvpPayload", () => {
  it("accepts valid payload", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      email: "anna@example.com",
      attending: "yes",
      guestCount: 2,
      locale: "hy",
    });

    expect(result.success).toBe(true);
  });

  it("rejects guest count out of range", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      email: "anna@example.com",
      attending: "yes",
      guestCount: 0,
      locale: "hy",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = validateRsvpPayload({
      name: "Anna",
      surename: "Petrosyan",
      email: "not-email",
      attending: "yes",
      guestCount: 1,
      locale: "hy",
    });

    expect(result.success).toBe(false);
  });
});
