"use client";

import React, { useCallback, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye } from "lucide-react";
import { aboutV2Data } from "@/data/about-data";
import type { AboutDict } from "@/i18n/about";
import { FIT, Reveal, SURFACE, SectionHeading } from "./ui";

/* ==========================================================================
   Mission — 6-segment donut wheel with progressive hover-to-reveal cards
   --------------------------------------------------------------------------
   • On entry only the wheel shows; the 6 cards are hidden (opacity 0,
     scale .92, no pointer events) so the focus is on the wheel.
   • Hover / focus / click / tap a segment → its gold connector draws out
     (scaleX 0→1 from the wheel side) and its card pops up in navy.
   • Revealed cards stay open: when another segment becomes active, earlier
     cards turn cream and stay readable; only the latest one is navy.
   • "Show all" opens the rest at once (staggered 0.05s).
   Desktop: 04–06 | wheel (440px; 380px on screens under 820px tall) | 01–03.
   Mobile: the wheel, then the revealed cards in number order.
   Motion: transform (scale, scaleX, translate) and opacity only; the
   navy ↔ cream swap is a CSS colour transition.
   ========================================================================== */

const S = 600; // viewBox size
const C = S / 2;
const R = 288;
const r = 122;
const GAP = 1.4; // degrees between segments

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (radius: number, deg: number) => [C + radius * Math.cos(rad(deg)), C + radius * Math.sin(rad(deg))] as const;

/** Segment i spans clockwise from -90° (top): 0 top-right … 5 top-left */
const SEGMENTS = Array.from({ length: 6 }, (_, i) => {
  const a0 = -90 + i * 60 + GAP / 2;
  const a1 = -90 + (i + 1) * 60 - GAP / 2;
  const mid = (a0 + a1) / 2;
  const [x0, y0] = pt(R, a0);
  const [x1, y1] = pt(R, a1);
  const [x2, y2] = pt(r, a1);
  const [x3, y3] = pt(r, a0);
  const d = `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z`;
  const [lx, ly] = pt((R + r) / 2, mid);
  return { d, lx, ly, dx: Math.cos(rad(mid)) * 14, dy: Math.sin(rad(mid)) * 14 };
});

const num = (i: number) => String(i + 1).padStart(2, "0");
const ALL = [0, 1, 2, 3, 4, 5];

function Wheel({
  active,
  open,
  onPick,
  items,
  centerLabel,
}: {
  active: number | null;
  open: number[];
  onPick: (i: number) => void;
  items: string[];
  centerLabel: string;
}) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  return (
    <svg viewBox={`-16 -16 ${S + 32} ${S + 32}`} className="h-full w-full overflow-visible" role="group" aria-label={centerLabel}>
      <defs>
        {SEGMENTS.map((s, i) => (
          <clipPath key={i} id={`${uid}-c${i}`}>
            <path d={s.d} />
          </clipPath>
        ))}
      </defs>
      <circle cx={C} cy={C} r={R + 12} fill="none" stroke="#C8A96A" strokeOpacity={0.3} strokeDasharray="2 6" aria-hidden />

      {SEGMENTS.map((s, i) => {
        const on = i === active;
        const seen = open.includes(i);
        return (
          <motion.g
            key={i}
            tabIndex={0}
            role="button"
            aria-pressed={on}
            aria-expanded={seen}
            aria-label={`${num(i)} ${items[i]}`}
            onMouseEnter={() => onPick(i)}
            onFocus={() => onPick(i)}
            onClick={() => onPick(i)}
            initial={false}
            animate={{ x: on && !reduce ? s.dx : 0, y: on && !reduce ? s.dy : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="cursor-pointer outline-none"
          >
            <g clipPath={`url(#${uid}-c${i})`}>
              <image href={aboutV2Data.missionImages[i]} x={C - R} y={C - R} width={2 * R} height={2 * R} preserveAspectRatio="xMidYMid slice" />
              <motion.path
                d={s.d}
                fill="#111e46"
                initial={false}
                animate={{ opacity: on ? 0.1 : seen ? 0.42 : 0.6 }}
                transition={{ duration: 0.35 }}
              />
            </g>
            <motion.path d={s.d} fill="none" stroke="#C8A96A" strokeWidth={3} initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.35 }} />
            <text
              x={s.lx}
              y={s.ly}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none font-playfair"
              fontSize={44}
              fill={on ? "#FFFFFF" : "#E4CC94"}
            >
              {num(i)}
            </text>
          </motion.g>
        );
      })}

      <circle cx={C} cy={C} r={r - 10} fill="#111e46" aria-hidden />
      <circle cx={C} cy={C} r={r - 20} fill="none" stroke="#C8A96A" strokeOpacity={0.5} aria-hidden />
      <text x={C} y={C - 14} textAnchor="middle" className="font-kanit" fontSize={28} fill="#FFFFFF" aria-hidden>
        {centerLabel}
      </text>
      <text x={C} y={C + 30} textAnchor="middle" className="font-playfair" fontSize={40} fill="#C8A96A" aria-hidden>
        {active === null ? "—" : num(active)}
      </text>
    </svg>
  );
}

/** Card body: navy when active, cream once revealed */
function Card({ i, text, on, align, onHover }: { i: number; text: string; on: boolean; align: "left" | "right"; onHover?: () => void }) {
  return (
    <div
      onMouseEnter={onHover}
      className={`w-full rounded-2xl border px-4 py-3 transition-colors duration-300 ${align === "right" ? "lg:text-right" : ""} ${
        on ? "border-transparent bg-[#111e46] text-white shadow-[0_18px_40px_-22px_rgba(17,30,70,0.7)]" : "border-[#C8A96A]/25 bg-[#FAF8F3] text-[#111e46]"
      }`}
    >
      <span className={`font-playfair text-xl ${on ? "text-[#C8A96A]" : "text-[#C8A96A]/90"}`}>{num(i)}</span>
      <span className={`mt-0.5 block font-sarabun text-[15px] leading-relaxed xl:text-base ${on ? "text-white/90" : "text-[#111e46]/75"}`}>
        {text}
      </span>
    </div>
  );
}

/** Desktop slot beside the wheel: connector toward the wheel + card */
function Slot({
  i,
  text,
  on,
  seen,
  side,
  delay,
  onHover,
}: {
  i: number;
  text: string;
  on: boolean;
  seen: boolean;
  side: "left" | "right";
  delay: number;
  onHover: () => void;
}) {
  const reduce = useReducedMotion();
  const left = side === "left";
  return (
    <div className={`flex items-center ${left ? "flex-row-reverse" : ""}`}>
      {/* Connector: draws out from the wheel side */}
      <span aria-hidden className="relative h-px w-7 shrink-0 xl:w-9">
        <motion.span
          className={`absolute inset-0 ${left ? "origin-right" : "origin-left"}`}
          initial={false}
          animate={{ scaleX: seen ? 1 : 0 }}
          transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute inset-0 bg-[#C8A96A]/40" />
          <motion.span
            className="absolute -inset-y-[3px] inset-x-0 rounded-full bg-[#C8A96A]/25"
            initial={false}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span className="absolute inset-0 bg-[#E4CC94]" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.3 }} />
        </motion.span>
      </span>
      <motion.div
        className={`flex-1 ${left ? "origin-right" : "origin-left"} ${seen ? "" : "pointer-events-none"}`}
        initial={false}
        animate={{ opacity: seen ? 1 : 0, scale: seen || reduce ? 1 : 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: seen ? delay + 0.12 : 0 }}
        aria-hidden={!seen}
      >
        <Card i={i} text={text} on={on} align={left ? "right" : "left"} onHover={seen ? onHover : undefined} />
      </motion.div>
    </div>
  );
}

const WHEEL_SIZE =
  "h-[440px] w-[440px] [@media(max-height:819px)]:h-[380px] [@media(max-height:819px)]:w-[380px]";

export default function MissionWheel({ copy }: { copy: AboutDict["mission"] }) {
  const reduce = useReducedMotion();
  const items = copy.items;
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [delays, setDelays] = useState<Record<number, number>>({});

  const pick = useCallback((i: number) => {
    setActive(i);
    setDelays({});
    setOpen((prev) => (prev.includes(i) ? prev : [...prev, i]));
  }, []);

  const showAll = () => {
    const rest = ALL.filter((i) => !open.includes(i));
    setDelays(Object.fromEntries(rest.map((i, k) => [i, reduce ? 0 : k * 0.05])));
    setOpen(ALL);
    setActive((a) => (a === null ? rest[0] ?? 0 : a));
  };

  const allOpen = open.length === ALL.length;
  const right = [0, 1, 2];
  const left = [5, 4, 3]; // top → bottom, matching the segments on the left

  return (
    <section id="sec-mission" className={`${SURFACE} ${FIT} flex flex-col justify-center bg-[#EFE7D7] px-6 pt-10 sm:px-10 lg:px-10 lg:pt-6 xl:px-16`}>
      <SectionHeading number={copy.number} kicker={copy.kicker} title={copy.title} align="center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <p className="text-sm text-[#111e46]/55">{copy.hint}</p>
          <AnimatePresence initial={false}>
            {!allOpen && (
              <motion.button
                type="button"
                onClick={showAll}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A96A]/60 bg-white/70 px-3.5 py-1.5 font-kanit text-[13px] text-[#111e46] transition-colors hover:bg-white"
              >
                <Eye className="h-3.5 w-3.5 text-[#C8A96A]" />
                {copy.showAll}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </SectionHeading>

      {/* Desktop: 04–06 | wheel | 01–03 */}
      <Reveal className="mt-5 hidden grid-cols-[1fr_auto_1fr] items-stretch gap-1 lg:grid">
        <div className="flex flex-col justify-between gap-3 py-2">
          {left.map((i) => (
            <Slot key={i} i={i} text={items[i]} on={i === active} seen={open.includes(i)} side="left" delay={delays[i] ?? 0} onHover={() => setActive(i)} />
          ))}
        </div>
        <div className={`${WHEEL_SIZE} shrink-0 self-center`}>
          <Wheel active={active} open={open} onPick={pick} items={items} centerLabel={copy.title} />
        </div>
        <div className="flex flex-col justify-between gap-3 py-2">
          {right.map((i) => (
            <Slot key={i} i={i} text={items[i]} on={i === active} seen={open.includes(i)} side="right" delay={delays[i] ?? 0} onHover={() => setActive(i)} />
          ))}
        </div>
      </Reveal>

      {/* Mobile / tablet: wheel, then the revealed cards in number order */}
      <div className="mt-6 lg:hidden">
        <div className="mx-auto aspect-square w-full max-w-[380px]">
          <Wheel active={active} open={open} onPick={pick} items={items} centerLabel={copy.title} />
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {[...open].sort((a, b) => a - b).map((i) => (
              <motion.div
                key={i}
                layout={!reduce}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, delay: delays[i] ?? 0 } }}
                exit={{ opacity: 0 }}
              >
                <Card i={i} text={items[i]} on={i === active} align="left" onHover={() => setActive(i)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
