export type Locale = "hy" | "ru" | "en";

export type EventDetails = {
  dateLabel: string;
  dateISO: string;
  ceremonyTime: string;
  receptionTime: string;
  venue: string;
  address: string;
  mapsLink: string;
  mapsEmbedLink: string;
  mapsAction: string;
};

export type AgendaItem = {
  icon: string;
  title: string;
  subtitle: string;
  location: string;
  time: string;
};

export type LocationItem = {
  name: string;
  address: string;
  mapsLink: string;
  mapsEmbedLink: string;
  mapsAction: string;
};

export type RsvpLabels = {
  heading: string;
  name: string;
  surename: string;
  email: string;
  attending: string;
  yes: string;
  no: string;
  guestCount: string;
  guestCountHint: string;
  submit: string;
  sending: string;
  success: string;
  failure: string;
  validation: {
    nameRequired: string;
    surenameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    guestCountInvalid: string;
  };
};

export type InvitationContent = {
  localeLabel: string;
  brand: string;
  intro: {
    title: string;
    subtitle: string;
  };
  hero: {
    names: string;
    date: string;
    message: string;
  };
  gallery: {
    heading: string;
    caption: string;
  };
  details: {
    heading: string;
    agendaHeading: string;
    agenda: AgendaItem[];
    locationsHeading: string;
    locations: LocationItem[];
    event: EventDetails;
  };
  countdown: {
    heading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  rsvp: RsvpLabels;
};
