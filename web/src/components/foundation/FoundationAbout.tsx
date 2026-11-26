"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Accessibility, Building2, HandHeart, Sprout, type LucideIcon } from "lucide-react";
import { foundationAbout } from "@/data/foundation-data";
import { useFoundationCopy } from "@/i18n";
import { Reveal, fadeUp } from "@/components/home/motion";

const ICONS: Record<string, LucideIcon> = {
  founded: Building2,
  rooted: Sprout,
  sport: Accessibility,
  skills: HandHeart,
};

/* Cards share one cream→navy ramp, so the last card lands on navy */
const TONES = [
  "bg-[#FAF8F3] text-[#111e46] border-[#a28757]/20",
  "bg-[#F1EADC] text-[#111e46] border-[#a28757]/25",
  "bg-[#E6D9BF] text-[#111e46] border-[#a28757]/30",
  "bg-[#111e46] text-white border-[#111e46]",
];

/**
 * About & objectives (option A)
 *  Left (desktop): the founding story stays pinned while the reader scrolls.
 *  Right: the 4 objective cards are sticky at stepped offsets, so each new
 *    card slides up over the last one; covered cards shrink a little
 *    (scale only) to read as a deck.
 *  Bottom: supported organisations glide past in a slow marquee.
 */
export default function FoundationAbout() {
  const c = useFoundationCopy().about;
  const reduce = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: deckRef, offset: ["start 0.35", "end 0.65"] });
  const n = foundationAbout.objectives.length;

  return (
    <section id="about" aria-labelledby="foundation-about-title" className="scroll-mt-24 bg-white py-14 sm:py-20 lg:py-24">
      <div className="home-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Story */}
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <motion.p variants={fadeUp} className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">
                <span aria-hidden className="h-px w-8 bg-[#a28757]" />
                {c.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                id="foundation-about-title"
                className="mt-5 font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] tracking-tight text-[#111e46]"
              >
                {c.title}
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-6 max-w-lg font-sarabun text-base lg:text-lg leading-relaxed text-[#14171F]/65">
                {c.story}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex items-end gap-4">
                <span className="font-playfair text-7xl sm:text-8xl leading-none text-[#a28757] tabular-nums">{c.foundedValue}</span>
                <span className="mb-2 font-sarabun text-sm text-[#14171F]/55">{c.foundedLabel}</span>
              </motion.div>
            </Reveal>
          </div>

          {/* Objective deck */}
          <div className="lg:col-span-7">
            <p className="mb-5 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#14171F]/45">{c.objectivesLabel}</p>
            <div ref={deckRef} className="flex flex-col gap-4 sm:gap-6 lg:gap-[16vh] lg:pb-[6vh]">
              {foundationAbout.objectives.map((o, i) => (
                <ObjectiveCard
                  key={o.id}
                  index={i}
                  total={n}
                  title={c.objectives[i] ?? o.title}
                  Icon={ICONS[o.id]}
                  progress={scrollYProgress}
                  reduce={!!reduce}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Supported organisations */}
        <div className="mt-16 sm:mt-24 border-t border-[#a28757]/20 pt-8">
          <p className="font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">{c.partnersLabel}</p>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className={`flex w-max gap-12 ${reduce ? "flex-wrap" : "animate-[foundation-marquee_40s_linear_infinite] hover:[animation-play-state:paused]"}`}>
              {(reduce ? [c.partners] : [c.partners, c.partners]).map((list, k) =>
                list.map((p, i) => (
                  <span key={`${k}-${i}`} aria-hidden={k > 0} className="flex items-center gap-12 whitespace-nowrap font-kanit text-xl sm:text-2xl text-[#111e46]/80">
                    {p}
                    <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C8A96A]" />
                  </span>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ObjectiveCard({
  index,
  total,
  title,
  Icon,
  progress,
  reduce,
}: {
  index: number;
  total: number;
  title: string;
  Icon: LucideIcon;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Each card starts shrinking once the next one begins to cover it
  const start = (index + 1) / total;
  const scale = useTransform(progress, [start - 0.1, 1], [1, 1 - (total - index - 1) * 0.04]);

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ top: `calc(7rem + ${index * 1.5}rem)` }}
      className="lg:sticky"
    >
      <motion.div
        style={reduce || index === total - 1 ? undefined : { scale }}
        className={`group flex min-h-[9.5rem] origin-top items-center gap-6 rounded-[1.5rem] border p-6 sm:p-8 shadow-[0_18px_40px_-28px_rgba(17,30,70,0.45)] ${TONES[index]}`}
      >
        <span className={`font-playfair text-5xl sm:text-6xl leading-none tabular-nums ${index === total - 1 ? "text-[#C8A96A]" : "text-[#a28757]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="flex-1 font-kanit text-xl sm:text-2xl font-normal leading-snug">{title}</h3>
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110 ${
            index === total - 1 ? "bg-white/10 text-[#C8A96A]" : "bg-white text-[#a28757]"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </motion.div>
    </motion.article>
  );
}
