"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { Section } from "@/components/ui/Section";
import type { InvitationContent } from "@/lib/content/types";
import { motionTokens } from "@/lib/animation/tokens";

type GallerySectionProps = {
  content: InvitationContent;
};

export function GallerySection({ content }: GallerySectionProps) {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const galleryInView = useInView(stackRef, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -12% 0px",
  });

  return (
    <Section className="section section-gallery">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 55, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.35, once: true }}
        transition={{ duration: 1.05, ease: motionTokens.ease }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {content.gallery.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: true }}
          transition={{ delay: 0.35, duration: 0.75 }}
        >
          {content.gallery.caption}
        </motion.p>
      </motion.div>
      <div ref={stackRef} className="gallery-stack">
        <motion.div
          className="photo card-left"
          initial={false}
          animate={
            galleryInView
              ? { opacity: 1, x: 0, rotate: -2, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, x: -420, rotate: -8, scale: 0.86, filter: "blur(18px)" }
          }
          transition={{ duration: 1.25, ease: motionTokens.ease }}
        >
          <Image src="/assets/images/couple-1.jpg" alt="couple portrait" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </motion.div>
        <motion.div
          className="photo card-right focus-top"
          initial={false}
          animate={
            galleryInView
              ? { opacity: 1, x: 0, rotate: 2, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, x: 430, rotate: 9, scale: 0.86, filter: "blur(18px)" }
          }
          transition={{ duration: 1.25, delay: 0.12, ease: motionTokens.ease }}
        >
          <Image src="/assets/images/couple-3.jpg" alt="couple dance" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </motion.div>
      </div>
    </Section>
  );
}
