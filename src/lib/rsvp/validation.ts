import { z } from "zod";

import type { Locale } from "@/lib/content/types";

export type RsvpRequest = {
  name: string;
  surename: string;
  email?: string;
  attending?: "yes" | "no";
  guestCount: number;
  locale: Locale;
  website?: string;
};

export type RsvpResponse = {
  ok: boolean;
  message: string;
};

export const rsvpSchema = z.object({
  name: z.string().trim().min(1),
  surename: z.string().trim().min(1),
  email: z.string().optional(),
  attending: z.enum(["yes", "no"]).optional(),
  guestCount: z.coerce.number().int().min(1).max(10),
  locale: z.enum(["hy", "ru", "en"]),
  website: z.string().optional(),
});

export function validateRsvpPayload(input: unknown) {
  return rsvpSchema.safeParse(input);
}
