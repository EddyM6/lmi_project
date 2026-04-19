import en from "@/lib/content/locales/en.json";
import hy from "@/lib/content/locales/hy.json";
import ru from "@/lib/content/locales/ru.json";
import { parseLocalizedContent } from "@/lib/content/schema";

describe("localized content schema", () => {
  it("accepts all locale JSON files", () => {
    const parsed = parseLocalizedContent({ hy, ru, en });
    expect(parsed.hy.hero.names.length).toBeGreaterThan(2);
    expect(parsed.ru.details.event.mapsLink).toMatch("yandex.com/maps");
    expect(parsed.en.rsvp.validation.nameRequired).toContain("name");
  });
});
