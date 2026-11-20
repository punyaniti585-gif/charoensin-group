"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { BusinessPageData } from "@/data/businesses-data";
import { luxEase } from "./motion";

type Props = Pick<BusinessPageData, "synergy">;

/**
 * Closing section on charcoal: building photo + synergy statement,
 * 4 working principles, and a horizontal milestone line that draws in.
 */
export default function BusinessSynergy({ synergy }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full bg-[#1F1F1F] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #CCA369 1px, transparent 1px), linear-gradient(to bottom, #CCA369 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statement + photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: luxEase }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#CCA369] font-inter font-semibold">
              <span className="w-8 h-px bg-[#CCA369]" />
              {synergy.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight leading-tight">
              {synergy.title}
            </h2>
            <p className="mt-5 font-sarabun text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl">
              {synergy.body}
            </p>
          </motion.div>

          {/* Unclipped wrapper is the in-view target (a zero-area clipped
              element never reports as intersecting) */}
          <motion.div
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5"
          >
          <motion.div
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0%)" },
              show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: luxEase } },
            }}
            className="relative aspect-[4/5] max-h-[520px] w-full rounded-3xl overflow-hidden border border-[#CCA369]/30"
          >
            <Image
              src={synergy.image}
              alt={synergy.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-5 font-kanit text-sm text-white/90">อาคารเจริญสิน</span>
          </motion.div>
          </motion.div>
        </div>

        {/* Principles */}
        <div className="mt-14 lg:mt-20">
          <h3 className="font-kanit text-lg sm:text-xl font-semibold text-[#E6C786] flex items-center gap-3">
            หลักในการทำงาน
            <span className="flex-1 h-px bg-[#CCA369]/30" />
          </h3>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {synergy.principles.map((p, i) => (
              <motion.li
                key={p.en}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: luxEase }}
                className="group p-6 rounded-2xl bg-white/[0.04] border border-[#CCA369]/25 hover:border-[#CCA369]/70 hover:bg-white/[0.07] transition-colors duration-500"
              >
                <span className="font-playfair text-3xl text-[#CCA369]">0{i + 1}</span>
                <p className="mt-3 font-kanit text-xl font-semibold">{p.th}</p>
                <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#CCA369]/80">{p.en}</p>
                <p className="mt-3 font-sarabun text-sm text-white/70 leading-relaxed">{p.description}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Milestones */}
        <div className="mt-14 lg:mt-20">
          <h3 className="font-kanit text-lg sm:text-xl font-semibold text-[#E6C786] flex items-center gap-3">
            เส้นทางของเครือ
            <span className="flex-1 h-px bg-[#CCA369]/30" />
          </h3>
          <div className="relative mt-8">
            {/* Gold line draws in (desktop horizontal / mobile vertical) */}
            <motion.span
              aria-hidden="true"
              className="hidden lg:block absolute top-[7px] left-0 right-0 h-px bg-gradient-to-r from-[#CCA369] via-[#E6C786] to-[#9A7B3E] origin-left"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.4, ease: luxEase }}
            />
            <motion.span
              aria-hidden="true"
              className="lg:hidden absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-[#CCA369] via-[#E6C786] to-[#9A7B3E] origin-top"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.4, ease: luxEase }}
            />
            <ol className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {synergy.milestones.map((m, i) => (
                <motion.li
                  key={m.year}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: luxEase }}
                  className="relative pl-8 lg:pl-0 lg:pt-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 lg:top-0 w-[15px] h-[15px] rounded-full bg-[#1F1F1F] border-2 border-[#CCA369] shadow-[0_0_10px_rgba(204,163,105,0.5)]"
                  />
                  <p className="font-playfair text-3xl sm:text-4xl font-semibold text-[#CCA369] leading-none">{m.year}</p>
                  <p className="mt-2 font-kanit text-base font-semibold">{m.title}</p>
                  <p className="mt-1 font-sarabun text-sm text-white/65 leading-relaxed">{m.description}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
