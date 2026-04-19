import { DEFAULT_LOCALE, resolveLocale } from "@/lib/locale";

describe("resolveLocale", () => {
  it("returns the same locale when supported", () => {
    expect(resolveLocale("ru")).toBe("ru");
  });

  it("falls back to Armenian for unsupported values", () => {
    expect(resolveLocale("de")).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE);
  });
});
