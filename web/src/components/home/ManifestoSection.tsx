"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { homeStats, manifesto } from "@/data/home-data";
import { CountUp, Reveal, fadeUp } from "./motion";

/**
 * Section 2 — ปรัชญาและตัวตน 8 ทศวรรษ
 * Asymmetric editorial split on white: manifesto (5 cols) + a staggered 2×2
 * architectural grid of stats (7 cols) with light count-up numbers.
 */
export default function ManifestoSection() {
  return (
    <section aria-labelledby="manifesto-title" className="relative bg-[#FAF8F3] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
        {/* Left — manifesto */}
        <Reveal className="lg:col-span-5">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#a28757]/30 px-4 py-1.5 font-inter text-[10.5px] font-medium uppercase tracking-[0.26em] text-[#a28757]"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#a28757]" />
            {manifesto.tag}
          </motion.p>
          <motion.h2
            id="manifesto-title"
            variants={fadeUp}
            className="mt-6 font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.2] tracking-tight text-[#14171F]"
          >
            {manifesto.title}
          </motion.h2>
          <motion.span variants={fadeUp} aria-hidden className="mt-7 block h-px w-16 bg-gradient-to-r from-[#a28757] to-transparent" />
          <motion.p variants={fadeUp} className="mt-6 font-sarabun text-base lg:text-[1.05rem] leading-relaxed text-[#14171F]/75">
            {manifesto.vision}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 font-sarabun text-[15px] leading-relaxed text-[#14171F]/55">
            {manifesto.story}
          </motion.p>

          {/* Framed image card with a corner label */}
          <motion.figure
            variants={fadeUp}
            className="group relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[#a28757]/25 bg-[#E9DFCC] shadow-md"
          >
            <Image
              src={manifesto.image}
              alt={manifesto.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,23,31,0.45),rgba(20,23,31,0)_55%)]" />
            <figcaption className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 font-kanit text-xs text-[#14171F] shadow-sm">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#a28757]" />
              {manifesto.imageLabel}
            </figcaption>
          </motion.figure>

          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href={manifesto.cta.href}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#14171F] px-7 py-3.5 font-kanit text-sm text-white transition-colors duration-300 hover:bg-[#a28757]"
            >
              {manifesto.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </Reveal>

        {/* Right — staggered 2×2 architectural stat grid */}
        <Reveal as="dl" gap={0.12} className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-5">
          {homeStats.map((s, i) => (
            // Outer: reveal + stagger offset. Inner: hover lift (separate
            // elements so the two transforms never fight).
            <motion.div key={s.label} variants={fadeUp} className={i % 2 === 1 ? "sm:translate-y-10" : ""}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#a28757]/25 bg-white p-5 sm:p-7 min-h-[11rem] sm:min-h-[13.5rem] shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(60,45,20,0.35)]">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#a28757] via-[#cfc29f] to-transparent" />
              <dt className="font-kanit text-sm sm:text-base text-[#14171F]/70">{s.label}</dt>
              <dd className="mt-4">
                <span className="block font-inter font-extralight text-[2.6rem] sm:text-6xl lg:text-[4.2rem] leading-none tracking-tight text-[#14171F]">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </span>
                <span className="mt-2 block font-kanit text-sm text-[#a28757]">{s.unit}</span>
                <span className="mt-1 hidden sm:block font-sarabun text-xs text-[#14171F]/50">{s.note}</span>
              </dd>
            </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
