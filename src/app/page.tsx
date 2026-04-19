import { InvitationPage } from "@/components/invitation/InvitationPage";
import { getAllContent } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const language = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const initialLocale = resolveLocale(language);

  return <InvitationPage initialLocale={initialLocale} contentByLocale={getAllContent()} />;
}
