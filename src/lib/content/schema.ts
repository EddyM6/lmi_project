import { z } from "zod";

import type { InvitationContent, Locale } from "@/lib/content/types";

const eventDetailsSchema = z.object({
  dateLabel: z.string().min(1),
  dateISO: z.string().min(1),
  ceremonyTime: z.string().min(1),
  receptionTime: z.string().min(1),
  venue: z.string().min(1),
  address: z.string().min(1),
  mapsLink: z.url(),
  mapsEmbedLink: z.url(),
  mapsAction: z.string().min(1),
});

const agendaItemSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  location: z.string().min(1),
  time: z.string().min(1),
});

const locationItemSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  mapsLink: z.url(),
  mapsEmbedLink: z.url(),
  mapsAction: z.string().min(1),
});

const invitationContentSchema = z.object({
  localeLabel: z.string().min(1),
  brand: z.string().min(1),
  intro: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
  }),
  hero: z.object({
    names: z.string().min(1),
    date: z.string().min(1),
    message: z.string().min(1),
  }),
  gallery: z.object({
    heading: z.string().min(1),
    caption: z.string().min(1),
  }),
  details: z.object({
    heading: z.string().min(1),
    agendaHeading: z.string().min(1),
    agenda: z.array(agendaItemSchema).min(1),
    locationsHeading: z.string().min(1),
    locations: z.array(locationItemSchema).min(1),
    event: eventDetailsSchema,
  }),
  countdown: z.object({
    heading: z.string().min(1),
    days: z.string().min(1),
    hours: z.string().min(1),
    minutes: z.string().min(1),
    seconds: z.string().min(1),
  }),
  rsvp: z.object({
    heading: z.string().min(1),
    name: z.string().min(1),
    surename: z.string().min(1),
    email: z.string().min(1),
    attending: z.string().min(1),
    yes: z.string().min(1),
    no: z.string().min(1),
    guestCount: z.string().min(1),
    submit: z.string().min(1),
    sending: z.string().min(1),
    success: z.string().min(1),
    failure: z.string().min(1),
    validation: z.object({
      nameRequired: z.string().min(1),
      surenameRequired: z.string().min(1),
      emailRequired: z.string().min(1),
      emailInvalid: z.string().min(1),
      guestCountInvalid: z.string().min(1),
    }),
  }),
});

const localizedContentSchema = z.object({
  hy: invitationContentSchema,
  ru: invitationContentSchema,
  en: invitationContentSchema,
});

export type LocalizedContent = Record<Locale, InvitationContent>;

export function parseLocalizedContent(input: unknown): LocalizedContent {
  return localizedContentSchema.parse(input);
}
