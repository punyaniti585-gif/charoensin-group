"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe, Clock3 } from "lucide-react";
import type { BusinessGroup, Company } from "@/data/businesses-data";
import { luxEase } from "./motion";

interface Props {
  group: BusinessGroup;
  index: number;
}

/**
 * One business group "chapter":
 *  1. Header — photo (clip-path reveal) + number, name, tagline, highlights
 *  2. Company tabs (companies with content) → detail panel
 *  3. Directory grid for companies whose content is still pending
 * Chapters alternate photo side and background tone.
 */
export default function BusinessChapter({ group, index }: Props) {
  const reduce = useReducedMotion();
  const flip = index % 2 === 1;
  const ready = group.companies.filter((c) => c.status === "ready");
  const pending = group.companies.filter((c) => c.status === "pending");
  const [activeId, setActiveId] = useState(ready[0]?.id);
  const active = ready.find((c) => c.id === activeId) ?? ready[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + ready.length) % ready.length;
    setActiveId(ready[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id={group.id}
      aria-labelledby={`${group.id}-title`}
      className={`relative w-full py-16 sm:py-20 lg:py-24 scroll-mt-16 ${
        flip ? "bg-white" : "bg-[#F7F1E7]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= Header ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* The in-view trigger sits on this UNCLIPPED wrapper: browsers treat a
              target clipped to zero area as never intersecting, so the clipped
              element itself can't be the whileInView target. */}
          <motion.div
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}
          >
          <motion.div
            variants={{
              hidden: { clipPath: flip ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
              show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: luxEase } },
            }}
            className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-[#CCA369]/30 shadow-[0_18px_44px_rgba(107,90,58,0.14)] bg-[#E9DFCC]"
          >
            <motion.div
              className="absolute inset-0"
              variants={{
                hidden: { scale: 1.12 },
                show: { scale: 1, transition: { duration: 1.6, ease: luxEase } },
              }}
            >
              <Image
                src={group.image}
                alt={group.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-5 font-playfair text-6xl sm:text-7xl font-semibold text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] leading-none">
              {group.number}
            </span>
          </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: luxEase }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#9A7B3E] font-inter font-semibold">
              <span className="w-8 h-px bg-[#CCA369]" />
              {group.number} · {group.nameEn}
            </span>
            <h2
              id={`${group.id}-title`}
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]"
            >
              {group.nameTh}
            </h2>
            <p className="mt-2 font-kanit text-base sm:text-lg text-[#6B5A3A]">{group.tagline}</p>
            <p className="mt-4 font-sarabun text-sm sm:text-base text-[#1F1F1F]/75 leading-relaxed">
              {group.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.highlights.map((h) => (
                <li
                  key={h}
                  className="px-3.5 py-1.5 rounded-full border border-[#CCA369]/50 bg-white/80 text-xs sm:text-[13px] font-kanit text-[#6B5A3A]"
                >
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ================= Company tabs + panel ================= */}
        {active && (
          <div className="mt-12 lg:mt-16">
            <div
              role="tablist"
              aria-label={`บริษัทใน${group.nameTh}`}
              className="flex gap-2 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 border-b border-[#CCA369]/30"
            >
              {ready.map((c, i) => {
                const selected = c.id === active.id;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`${group.id}-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls={`${group.id}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(c.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`relative snap-start shrink-0 flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 mb-2 rounded-full border transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369] ${
                      selected
                        ? "border-[#CCA369] bg-white text-[#1F1F1F]"
                        : "border-transparent text-[#1F1F1F]/65 hover:text-[#1F1F1F] hover:bg-white/70"
                    }`}
                  >
                    <span className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[#CCA369]/30 shrink-0">
                      <Image src={c.logo} alt="" fill sizes="32px" className="object-contain p-0.5" />
                    </span>
                    <span className="font-kanit text-sm font-medium whitespace-nowrap">{c.shortName}</span>
                    {selected && (
                      <motion.span
                        layoutId={`${group.id}-tab-underline`}
                        className="absolute -bottom-[11px] left-4 right-4 h-[2px] bg-[#CCA369] rounded-full"
                        transition={{ duration: reduce ? 0 : 0.45, ease: luxEase }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              id={`${group.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${group.id}-tab-${active.id}`}
              className="mt-6"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduce ? 0.15 : 0.45, ease: luxEase }}
                >
                  <CompanyPanel company={active} fallbackImage={group.image} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ================= Pending directory ================= */}
        {pending.length > 0 && (
          <div className={active ? "mt-10" : "mt-12 lg:mt-16"}>
            <h3 className="font-kanit text-base sm:text-lg font-semibold text-[#1F1F1F] flex items-center gap-3">
              {active ? "บริษัทอื่นในกลุ่ม" : "บริษัทในกลุ่ม"}
              <span className="flex-1 h-px bg-[#CCA369]/30" />
            </h3>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {pending.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: luxEase }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#CCA369]/25 hover:border-[#CCA369]/60 transition-colors"
                >
                  <span className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#CCA369]/25 shrink-0">
                    <Image src={c.logo} alt="" fill sizes="48px" className="object-contain p-1" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-kanit text-sm font-medium text-[#1F1F1F] leading-snug">
                      {c.nameTh}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-sarabun text-[#9A7B3E]">
                      <Clock3 className="w-3 h-3" aria-hidden="true" />
                      รอข้อมูลจากบริษัท
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** Detail panel for one company (photo + gallery | content + actions) */
function CompanyPanel({ company, fallbackImage }: { company: Company; fallbackImage: string }) {
  const photos = [
    ...(company.image ? [{ src: company.image, alt: company.nameTh }] : []),
    ...(company.gallery ?? []),
  ];
  if (photos.length === 0) photos.push({ src: fallbackImage, alt: company.nameTh });
  const [photoIdx, setPhotoIdx] = useState(0);
  const photo = photos[photoIdx] ?? photos[0];

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8 rounded-3xl bg-white border border-[#CCA369]/30 shadow-[0_14px_40px_rgba(107,90,58,0.10)]">
      {/* Photo */}
      <div className="lg:col-span-5">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#E9DFCC]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={photo.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        {photos.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setPhotoIdx(i)}
                aria-label={`ดูภาพ: ${p.alt}`}
                aria-pressed={i === photoIdx}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  i === photoIdx ? "border-[#CCA369]" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="flex items-center gap-4">
          <span className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border border-[#CCA369]/30 shrink-0">
            <Image src={company.logo} alt={`โลโก้ ${company.shortName}`} fill sizes="64px" className="object-contain p-1" />
          </span>
          <div className="min-w-0">
            <h3 className="font-kanit text-lg sm:text-xl lg:text-2xl font-semibold text-[#1F1F1F] leading-snug">
              {company.nameTh}
            </h3>
            {company.nameEn && (
              <p className="font-inter text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9A7B3E] mt-0.5">
                {company.nameEn}
              </p>
            )}
          </div>
        </div>

        {company.tagline && (
          <p className="mt-4 font-kanit text-base sm:text-lg text-[#6B5A3A]">{company.tagline}</p>
        )}

        {company.facts && company.facts.length > 0 && (
          <dl
            className={`mt-5 grid gap-px rounded-2xl overflow-hidden bg-[#CCA369]/25 border border-[#CCA369]/25 ${
              company.facts.length === 1
                ? "grid-cols-1 w-full sm:w-56"
                : company.facts.length === 2
                ? "grid-cols-2 w-full sm:max-w-md"
                : "grid-cols-3"
            }`}
          >
            {company.facts.map((f) => (
              <div key={f.label} className="bg-[#FAF7F2] px-4 py-3">
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-playfair text-2xl sm:text-3xl font-semibold text-[#1F1F1F] leading-none">
                  {f.value}
                </dd>
                <dd className="mt-1.5 font-sarabun text-xs text-[#6B5A3A]">{f.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {company.description && (
          <p className="mt-5 font-sarabun text-sm sm:text-[15px] text-[#1F1F1F]/80 leading-relaxed">
            {company.description}
          </p>
        )}

        {(company.detailHref || company.website) && (
          <div className="mt-6 lg:mt-auto lg:pt-6 flex flex-wrap gap-3">
            {company.detailHref && (
              <a
                href={company.detailHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B5A3A] hover:bg-[#1F1F1F] text-white font-kanit text-sm font-medium transition-colors duration-300"
              >
                ดูรายละเอียด
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#CCA369] text-[#6B5A3A] hover:bg-[#CCA369] hover:text-[#1F1F1F] font-kanit text-sm font-medium transition-colors duration-300"
              >
                <Globe className="w-4 h-4" />
                เว็บไซต์บริษัท
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
