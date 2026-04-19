import type { Locale } from "@/lib/content/types";

export const DEFAULT_LOCALE: Locale = "hy";

export function resolveLocale(input?: string | null): Locale {
  if (input === "hy" || input === "ru" || input === "en") {
    return input;
  }

  return DEFAULT_LOCALE;
}

export const localeOrder: Locale[] = ["hy", "ru", "en"];
