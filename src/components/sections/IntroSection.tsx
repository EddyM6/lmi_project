"use client";

import { motion } from "framer-motion";

import type { InvitationContent } from "@/lib/content/types";

type IntroSectionProps = {
  content: InvitationContent;
};

export function IntroSection({ content }: IntroSectionProps) {
  const words = content.intro.subtitle.split(" ");

  return (
    <section className="section section-intro" aria-label="intro">
      <motion.div
        className="seal"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1 }}
      >
        <div className="seal-inner">{content.intro.title}</div>
      </motion.div>
      <motion.p
        className="intro-subtitle intro-handwrite"
        aria-label={content.intro.subtitle}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.35,
            },
          },
        }}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="intro-word"
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.55 },
              },
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.p>
    </section>
  );
}
