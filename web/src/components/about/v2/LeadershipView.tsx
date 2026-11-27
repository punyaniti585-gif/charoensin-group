"use client";

import React, { useId, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { leadershipData, visionAndMissionData } from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import type { AboutDict } from "@/i18n/about";
import { MaskedTitle, Reveal, SURFACE, STACK_GAP, SectionHeading, TitleBar, useHeadingVariants } from "./ui";

/* View 3 — Honorary Chairman's message (S6) + board and advisors, in the
   real order from about-data: group chairman → vice chairmen → directors →
   advisors. */

/* ---------------- S6 · Message ---------------- */
function ChairmanMessage({ copy }: { copy: AboutDict["chairman"] }) {
  const reduce = useReducedMotion();
  const data = visionAndMissionData.chairmanMessage;
  const hv = useHeadingVariants();
  return (
    <section id="sec-chairman" className={`${SURFACE} bg-[#FAF8F3] px-4 pb-24 pt-10 sm:px-8 lg:px-16 lg:pt-16`}>
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: csgEase }}
        className="mx-auto grid max-w-[1200px] gap-10 rounded-[28px] border-2 border-[#C8A96A]/60 bg-white p-6 sm:p-10 lg:grid-cols-[320px_1fr] lg:gap-16 lg:p-14"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2, ease: csgEase }}
            className="relative h-52 w-52 rounded-full border border-[#C8A96A] p-2 sm:h-60 sm:w-60"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#111e46]">
              <Image src={data.image} alt={copy.name} fill sizes="240px" className="object-cover" />
            </div>
          </motion.div>
          <div className="relative mt-6 h-20 w-40">
            <Image src={data.signature} alt="" fill sizes="160px" className="object-contain" />
          </div>
          <p className="mt-2 font-kanit text-xl font-semibold text-[#111e46]">{copy.name}</p>
          <p className="font-kanit text-sm tracking-wide text-[#C8A96A]">{copy.role}</p>
        </div>

        <div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
            <div className="flex items-center gap-3">
              <motion.span variants={hv.rule(0.2)} className="h-px w-10 origin-left bg-[#C8A96A]/70" aria-hidden />
              <motion.p variants={hv.fade(0.25, 8)} className="font-kanit text-xs uppercase tracking-[0.28em] text-[#111e46]/50">
                {copy.kicker}
              </motion.p>
            </div>
            <h2 className="mt-3 font-kanit text-3xl font-semibold text-[#111e46] sm:text-4xl">
              <MaskedTitle delay={0.35}>{copy.title}</MaskedTitle>
            </h2>
            <TitleBar delay={0.75} className="mt-4" />
          </motion.div>
          <div className="mt-6 space-y-5">
            {copy.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1} y={18}>
                <p className="font-sarabun text-base leading-[1.9] text-[#111e46]/80 lg:text-[17px]">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Board ----------------
   Board of directors and advisors share one profile style: round portrait
   on a warm beige disc + name + role. The bio stays hidden until the
   person is hovered or focused (tap on touch screens), then fades up
   (opacity 0→1, y 8→0) and a gold ring lights around the portrait. The
   bio's space is reserved, so the grid never jumps. */
function Profile({ src, name, role, bio, size = "md" }: { src: string; name: string; role: string; bio?: string; size?: "md" | "sm" }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const on = hover || focus;
  const bioId = useId();
  const disc = size === "sm" ? "h-36 w-36 sm:h-40 sm:w-40" : "h-40 w-40 sm:h-44 sm:w-44";
  return (
    <article
      tabIndex={0}
      aria-describedby={bio ? bioId : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className="flex h-full cursor-default flex-col items-center rounded-[24px] px-3 pb-2 pt-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A]/60"
    >
      <motion.div
        className={`relative ${disc}`}
        initial={false}
        animate={{ y: on && !reduce ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-[#EADCC0]" />
        <div className="absolute inset-[9px] overflow-hidden rounded-full bg-white">
          <Image src={src} alt={name} fill sizes="180px" className="object-cover object-top" />
        </div>
        {/* Gold ring on hover / focus (opacity + scale only) */}
        <motion.span
          aria-hidden
          className="absolute inset-[3px] rounded-full border-2 border-[#C8A96A]"
          initial={false}
          animate={{ opacity: on ? 1 : 0, scale: on || reduce ? 1 : 0.94 }}
          transition={{ duration: 0.3, ease: csgEase }}
        />
      </motion.div>
      <h4 className={`mt-4 font-kanit font-semibold text-[#111e46] ${size === "sm" ? "text-base" : "text-lg"}`}>{name}</h4>
      <p className="font-kanit text-sm text-[#B08D4F]">{role}</p>
      {bio && (
        <motion.p
          id={bioId}
          className="mt-2 max-w-[18rem] font-sarabun text-[15px] leading-relaxed text-[#111e46]/70"
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : 8 }}
          transition={{ duration: 0.35, ease: csgEase }}
        >
          {bio}
        </motion.p>
      )}
    </article>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="flex items-center gap-4">
      <span className="h-px flex-1 bg-[#C8A96A]/40" aria-hidden />
      <h3 className="font-kanit text-sm uppercase tracking-[0.28em] text-[#111e46]/60">{children}</h3>
      <span className="h-px flex-1 bg-[#C8A96A]/40" aria-hidden />
    </Reveal>
  );
}

/** Faint gold geometric divider under the group chairman */
function GeoDivider() {
  return (
    <svg aria-hidden viewBox="0 0 1200 60" preserveAspectRatio="none" className="mx-auto mt-12 h-10 w-full max-w-5xl">
      <path d="M0 30 H540 M660 30 H1200" stroke="#C8A96A" strokeOpacity={0.45} />
      <path d="M560 30 L600 6 L640 30 L600 54 Z" fill="none" stroke="#C8A96A" strokeOpacity={0.6} />
      <path d="M580 30 L600 18 L620 30 L600 42 Z" fill="#C8A96A" fillOpacity={0.35} />
      <path d="M380 30 L420 14 M380 30 L420 46 M820 30 L780 14 M820 30 L780 46" stroke="#C8A96A" strokeOpacity={0.25} />
    </svg>
  );
}

function Board({ copy }: { copy: AboutDict["board"] }) {
  const L = leadershipData;
  return (
    <section
      id="sec-board"
      className={`${SURFACE} bg-gradient-to-b from-[#F2E3C6] via-[#F9F1DF] to-[#FAF8F3] px-6 pb-24 pt-14 sm:px-10 lg:px-16 lg:pt-20`}
    >
      <SectionHeading kicker={copy.kicker} title={copy.title} align="center">
        {copy.subtitle}
      </SectionHeading>

      {/* Group chairman — featured, bio always shown, with background line graphics */}
      <div className="relative mt-14">
        <svg aria-hidden viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
          {[120, 170, 220, 270].map((rad) => (
            <circle key={rad} cx="600" cy="210" r={rad} fill="none" stroke="#C8A96A" strokeOpacity={0.22} />
          ))}
          <path d="M0 210 H330 M870 210 H1200" stroke="#C8A96A" strokeOpacity={0.3} />
          <path d="M60 140 L330 210 L60 280 M1140 140 L870 210 L1140 280" fill="none" stroke="#C8A96A" strokeOpacity={0.14} />
        </svg>
        <Reveal className="relative mx-auto max-w-xl">
          <div className="rounded-[24px] border border-[#C8A96A]/50 bg-white/75 p-6 text-center sm:p-8">
            <p className="font-kanit text-xs uppercase tracking-[0.28em] text-[#B08D4F]">{copy.chairmanLabel}</p>
            <div className="relative mx-auto mt-5 h-48 w-48 sm:h-56 sm:w-56">
              <span aria-hidden className="absolute inset-0 rounded-full bg-[#EADCC0]" />
              <div className="absolute inset-[10px] overflow-hidden rounded-full bg-white">
                <Image src={L.groupChairman.image} alt={copy.chairman.name} fill sizes="224px" className="object-cover object-top" />
              </div>
              <span aria-hidden className="absolute inset-[3px] rounded-full border-2 border-[#C8A96A]" />
            </div>
            <h4 className="mt-5 font-kanit text-2xl font-semibold text-[#111e46]">{copy.chairman.name}</h4>
            <p className="font-kanit text-[15px] text-[#B08D4F]">{copy.chairman.role}</p>
            <p className="mx-auto mt-3 max-w-md font-sarabun text-base leading-relaxed text-[#111e46]/70">{copy.chairman.bio}</p>
          </div>
        </Reveal>
      </div>
      <GeoDivider />

      {/* Board of directors: vice chairmen (3), then directors (rows of 4) */}
      <div className="mt-10 space-y-8">
        <TierLabel>{copy.boardLabel}</TierLabel>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {L.viceChairmen.map((p, i) => (
            <Reveal key={p.name} delay={0.06 * i}>
              <Profile src={p.image} name={copy.vice[i].name} role={copy.vice[i].role} bio={copy.vice[i].bio} />
            </Reveal>
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-y-6">
          {L.executiveDirectors.map((p, i) => (
            <Reveal key={p.name} delay={0.04 * (i % 4)} className="w-1/2 sm:w-1/3 lg:w-1/4">
              <Profile src={p.image} name={copy.directors[i].name} role={copy.directors[i].role} size="sm" />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Advisors — same profile style as the board */}
      <div className="mt-20 space-y-8">
        <TierLabel>{copy.advisorsLabel}</TierLabel>
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-sarabun text-base leading-relaxed text-[#111e46]/70 lg:text-[17px]">{copy.advisorsDescription}</p>
        </Reveal>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {L.advisors.map((p, i) => (
            <Reveal key={p.name} delay={0.05 * (i % 3)}>
              <Profile src={p.image} name={copy.advisors[i].name} role={copy.advisors[i].role} bio={copy.advisors[i].desc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LeadershipView({ copy }: { copy: AboutDict }) {
  return (
    <div className={`flex flex-col ${STACK_GAP}`}>
      <ChairmanMessage copy={copy.chairman} />
      <Board copy={copy.board} />
    </div>
  );
}
