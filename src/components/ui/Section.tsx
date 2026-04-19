"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { motionTokens } from "@/lib/animation/tokens";

type SectionProps = PropsWithChildren<{
  className?: string;
}>;

export function Section({ className, children }: SectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: motionTokens.sectionOffset }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: motionTokens.duration.medium,
          ease: motionTokens.ease,
        },
      }}
      viewport={{ amount: 0.25, once: true }}
    >
      {children}
    </motion.section>
  );
}
