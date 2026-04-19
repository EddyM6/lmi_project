"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Section } from "@/components/ui/Section";
import type { InvitationContent } from "@/lib/content/types";
import { motionTokens } from "@/lib/animation/tokens";

type HeroSectionProps = {
  content: InvitationContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <Section className="section section-hero">
      <motion.div
        className="hero-media"
        initial={{ opacity: 0, filter: "blur(20px)", scale: 1.08 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        viewport={{ amount: 0.45, once: true }}
        transition={{ duration: 1.25, ease: motionTokens.ease }}
      >
        <Image
          src="/assets/images/couple-2.jpg"
          alt={content.hero.names}
          fill
          priority
          className="hero-image"
        />
      </motion.div>
      <div className="hero-overlay" />
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 1.1, ease: motionTokens.ease }}
      >
        <motion.p
          className="brand-mark"
          initial={{ opacity: 0, y: 18, letterSpacing: "0.4em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0.06em" }}
          viewport={{ amount: 0.3, once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          {content.brand}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3, once: true }}
          transition={{ delay: 0.3, duration: 0.85 }}
        >
          {content.hero.names}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3, once: true }}
          transition={{ delay: 0.5, duration: 0.75 }}
        >
          {content.hero.date}
        </motion.p>
        <motion.p
          className="hero-message"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3, once: true }}
          transition={{ delay: 0.68, duration: 0.75 }}
        >
          {content.hero.message}
        </motion.p>
      </motion.div>
    </Section>
  );
}
