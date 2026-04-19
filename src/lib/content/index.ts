import en from "@/lib/content/locales/en.json";
import hy from "@/lib/content/locales/hy.json";
import ru from "@/lib/content/locales/ru.json";
import { parseLocalizedContent } from "@/lib/content/schema";
import type { InvitationContent, Locale } from "@/lib/content/types";

const content = parseLocalizedContent({ hy, ru, en });

export function getInvitationContent(locale: Locale): InvitationContent {
  return content[locale];
}

export function getAllContent() {
  return content;
}
