"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { Section } from "@/components/ui/Section";
import type { InvitationContent } from "@/lib/content/types";
import { motionTokens } from "@/lib/animation/tokens";

type DetailsSectionProps = {
  content: InvitationContent;
};

type AgendaEntry = InvitationContent["details"]["agenda"][number];

function AgendaCard({ item, index }: { item: AgendaEntry; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, {
    once: true,
    amount: 0.35,
    margin: "0px 0px -12% 0px",
  });

  return (
    <motion.div
      ref={cardRef}
      className="agenda-item"
      initial={false}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, x: index % 2 === 0 ? -140 : 140, y: 14, filter: "blur(8px)" }
      }
      transition={{ duration: 0.76, ease: motionTokens.ease }}
    >
      <span className="agenda-index">{index + 1}</span>
      <motion.span
        className="agenda-icon"
        initial={false}
        animate={
          isInView
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 0.55, rotate: index % 2 === 0 ? -20 : 20 }
        }
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        {item.icon}
      </motion.span>
      <div className="agenda-content">
        <h4>{item.title}</h4>
        <p className="agenda-subtitle">{item.subtitle}</p>
        <div className="agenda-meta">
          <p className="agenda-location">{item.location}</p>
          <p className="agenda-time">{item.time}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function DetailsSection({ content }: DetailsSectionProps) {
  return (
    <Section className="section section-details">
      <motion.h2
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 0.8, ease: motionTokens.ease }}
      >
        {content.details.heading}
      </motion.h2>

      <motion.p
        className="date-label"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 0.72, delay: 0.15 }}
      >
        {content.details.event.dateLabel}
      </motion.p>

      <motion.div
        className="agenda-panel"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.05, once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3>{content.details.agendaHeading}</h3>
        {content.details.agenda.map((item, index) => (
          <AgendaCard key={item.title} item={item} index={index} />
        ))}
      </motion.div>

      <motion.div
        className="location-block"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: motionTokens.ease }}
      >
        <h3 className="location-heading">{content.details.locationsHeading}</h3>
        <div className="location-grid">
          {content.details.locations.map((location) => (
            <article key={location.name} className="location-card">
              <p className="venue-title">{location.name}</p>
              <p>{location.address}</p>
              <div className="map-preview-wrap">
                <iframe
                  title={`${location.name} map preview`}
                  src={location.mapsEmbedLink}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a className="maps-link" href={location.mapsLink} target="_blank" rel="noreferrer">
                {location.mapsAction}
              </a>
            </article>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
