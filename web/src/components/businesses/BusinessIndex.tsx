"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { BusinessGroup } from "@/data/businesses-data";
import { luxEase } from "./motion";

/**
 * Group index: 5 large rows. Hover/focus a row to preview that group's
 * photo on the right (desktop); click to jump to its chapter.
 */
export default function BusinessIndex({ groups }: { groups: BusinessGroup[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = groups[active];

  return (
    <section
      id="groups"
      className="relative w-full bg-[#F7F1E7] py-16 sm:py-20 lg:py-24 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 lg:mb-12">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#6B5A3A] font-inter font-semibold">
              Business Groups
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
              กลุ่มธุรกิจในเครือ
            </h2>
          </div>
          <p className="font-sarabun text-sm text-[#6B5A3A] max-w-xs sm:text-right">
            <span className="hidden lg:inline">ชี้ที่ชื่อกลุ่มเพื่อดูภาพ </span>
            กดเพื่อไปที่บริษัทในกลุ่มนั้น
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Rows */}
          <ol className="lg:col-span-7 border-t border-[#CCA369]/40">
            {groups.map((g, i) => {
              const isActive = i === active;
              return (
                <li key={g.id} className="border-b border-[#CCA369]/40">
                  <a
                    href={`#${g.id}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative flex items-center gap-4 sm:gap-6 py-5 sm:py-6 pr-2 focus-visible:outline-none focus-visible:bg-white/60"
                  >
                    {/* Hover wash */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 -left-3 -right-3 rounded-xl bg-white transition-opacity duration-500 ${
                        isActive ? "opacity-100 max-lg:opacity-0" : "opacity-0"
                      }`}
                    />
                    <span className="relative font-playfair text-2xl sm:text-3xl text-[#CCA369] w-10 sm:w-12 shrink-0">
                      {g.number}
                    </span>
                    <span className="relative flex-1 min-w-0">
                      <span className="block font-kanit text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1F1F1F] group-hover:text-[#6B5A3A] transition-colors">
                        {g.nameTh}
                      </span>
                      <span className="block mt-0.5 font-sarabun text-xs sm:text-sm text-[#1F1F1F]/60 truncate">
                        {g.tagline}
                      </span>
                    </span>
                    <span className="relative hidden sm:inline-flex items-center px-3 py-1 rounded-full border border-[#CCA369]/50 text-[11px] font-kanit text-[#6B5A3A] bg-white/70 shrink-0">
                      {g.companies.length} บริษัท
                    </span>
                    <ArrowRight
                      className={`relative w-5 h-5 shrink-0 text-[#CCA369] transition-transform duration-300 ${
                        isActive ? "lg:translate-x-1" : ""
                      } group-hover:translate-x-1`}
                    />
                  </a>
                </li>
              );
            })}
          </ol>

          {/* Preview (desktop) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 h-[420px] rounded-3xl overflow-hidden border border-[#CCA369]/30 shadow-[0_18px_44px_rgba(107,90,58,0.16)] bg-[#E9DFCC]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.2 : 0.8, ease: luxEase }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-inter text-[11px] uppercase tracking-[0.25em] text-[#E6C786]">
                      {current.number} · {current.nameEn}
                    </p>
                    <p className="mt-1 font-kanit text-2xl font-semibold drop-shadow">{current.nameTh}</p>
                    <p className="mt-1 font-sarabun text-sm text-white/85 line-clamp-2">
                      {current.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
