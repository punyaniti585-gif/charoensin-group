"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { foundationLinks } from "@/data/foundation-data";
import { useFoundationCopy } from "@/i18n";
import { Reveal, fadeUp } from "@/components/home/motion";

/* Leaf shapes echoing the foundation logo, drifting slowly behind the copy */
const LEAVES = [
  { x: "8%", y: "18%", s: 1.2, r: -18, d: 9 },
  { x: "86%", y: "12%", s: 0.8, r: 22, d: 11 },
  { x: "78%", y: "70%", s: 1.5, r: -8, d: 13 },
  { x: "14%", y: "74%", s: 0.7, r: 30, d: 10 },
];

/**
 * Contact & CTA (option A) — a centred navy card.
 * Big title with a gold italic accent, two magnetic buttons (they lean
 * toward the pointer on a spring) and gold leaf outlines drifting on loops.
 * Channels come from the group (the foundation export lists none of its own).
 */
export default function FoundationContact() {
  const c = useFoundationCopy().contact;
  const reduce = useReducedMotion();

  return (
    <section id="contact" aria-labelledby="foundation-contact-title" className="relative isolate overflow-hidden bg-[#111e46] py-20 sm:py-28 lg:py-32 text-white">
      {LEAVES.map((l, i) => (
        <motion.svg
          key={i}
          aria-hidden
          viewBox="0 0 40 70"
          className="absolute -z-10 h-28 w-16 text-[#C8A96A]/25"
          style={{ left: l.x, top: l.y, scale: l.s, rotate: l.r }}
          animate={reduce ? undefined : { y: [0, -18, 0], rotate: [l.r, l.r + 8, l.r] }}
          transition={{ duration: l.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M20 2 C34 20 34 50 20 68 C6 50 6 20 20 2 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M20 10 V62" stroke="currentColor" strokeWidth="0.8" />
        </motion.svg>
      ))}

      <Reveal className="home-shell flex flex-col items-center text-center">
        <motion.p variants={fadeUp} className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#C8A96A]">
          <span aria-hidden className="h-px w-8 bg-[#C8A96A]" />
          {c.eyebrow}
          <span aria-hidden className="h-px w-8 bg-[#C8A96A]" />
        </motion.p>
        <motion.h2 variants={fadeUp} id="foundation-contact-title" className="mt-6 font-kanit font-normal leading-[1.08] tracking-tight text-[clamp(2.5rem,7vw,6rem)]">
          {c.title} <span className="font-playfair italic text-[#C8A96A]">{c.accent}</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-6 max-w-xl font-sarabun text-base sm:text-lg leading-relaxed text-white/70">
          {c.lead}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic href={foundationLinks.contact} primary>
            {c.support}
          </Magnetic>
          <Magnetic href={foundationLinks.facebook}>{c.facebook}</Magnetic>
        </motion.div>
        <motion.p variants={fadeUp} className="mt-12 font-sarabun text-sm text-white/45">
          {c.under}
        </motion.p>
      </Reveal>
    </section>
  );
}

function Magnetic({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16 });
  const y = useSpring(my, { stiffness: 220, damping: 16 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={reduce ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.45);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 font-kanit text-base transition-colors ${
        primary ? "bg-[#C8A96A] text-[#111e46] hover:bg-[#d8bd85]" : "border border-white/25 text-white hover:border-[#C8A96A] hover:text-[#C8A96A]"
      }`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
    </motion.a>
  );
}
