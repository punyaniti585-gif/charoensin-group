"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock3, ExternalLink } from "lucide-react";
import { companyPhotos, type BusinessGroup, type Company } from "@/data/businesses-data";
import { useT } from "@/i18n";
import { luxEase } from "./motion";
import Lightbox, { ZoomBadge } from "./Lightbox";

/**
 * /businesses/[slug] — "Split dossier" (option B):
 * sticky identity panel (logo, name, group, figures, website) on the left,
 * scrolling story (main photo, summary, strengths, gallery) on the right.
 * Stacks into one column on mobile. Same template for every company.
 */
export default function CompanySummary({ company, group }: { company: Company; group: BusinessGroup }) {
  const { t, name, lang } = useT();
  const reduce = useReducedMotion();
  const photos = companyPhotos(company, group);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const companyName = name(company.nameTh, company.nameEn);
  const pending = company.status === "pending";
  const siblings = group.companies.filter((c) => c.id !== company.id);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: luxEase },
        };

  return (
    <section className="relative w-full bg-[#F7F1E7] pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/businesses#${group.id}`}
          className="group inline-flex items-center gap-2 font-kanit text-sm text-[#6B5A3A] hover:text-[#111e46] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] rounded-full"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          {t("กลับไปหน้าธุรกิจของเรา")}
        </Link>

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* ================= Identity panel ================= */}
          <motion.aside {...rise()} className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-white border border-[#CCA369]/30 shadow-[0_14px_40px_rgba(107,90,58,0.10)] p-5 sm:p-7">
              <span className="relative block w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border border-[#CCA369]/30">
                <Image src={company.logo} alt={`${t("โลโก้")} ${companyName}`} fill sizes="96px" className="object-contain p-1.5" priority />
              </span>

              <Link
                href={`/businesses#${group.id}`}
                className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C8A96A]/70 bg-[#FAF7F2] text-xs font-kanit text-[#6B5A3A] hover:border-[#a28757] transition-colors"
              >
                <span className="font-playfair font-semibold text-[#a28757]">{group.number}</span>
                <span aria-hidden="true">·</span>
                {t(group.nameTh)}
              </Link>

              <h1 className="mt-3 font-kanit text-2xl sm:text-[28px] font-semibold text-[#111e46] leading-snug">
                {companyName}
              </h1>
              {company.nameEn && lang === "th" && (
                <p className="mt-1 font-inter text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#9A7B3E]">
                  {company.nameEn}
                </p>
              )}

              {company.facts && company.facts.length > 0 && (
                <dl className="mt-6 border-t border-[#CCA369]/30 divide-y divide-[#CCA369]/20">
                  {company.facts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="font-sarabun text-sm text-[#6B5A3A]">{t(f.label)}</dt>
                      <dd className="font-playfair text-2xl sm:text-3xl font-semibold text-[#111e46] leading-none tabular-nums">
                        {t(f.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#111e46] hover:bg-[#a28757] text-white font-kanit text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] focus-visible:ring-offset-2"
                >
                  {t("เยี่ยมชมเว็บไซต์บริษัทหลัก")}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">{t("(เปิดในแท็บใหม่)")}</span>
                </a>
              )}
            </div>
          </motion.aside>

          {/* ================= Story column ================= */}
          <div className="lg:col-span-8 min-w-0">
            <motion.div {...rise(0.1)}>
              <button
                type="button"
                onClick={() => setLightbox(0)}
                aria-label={`${t("ขยายภาพ")}: ${t(photos[0].alt)}`}
                className="group relative block w-full aspect-[16/10] rounded-3xl overflow-hidden bg-[#E9DFCC] border border-[#CCA369]/30 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] focus-visible:ring-offset-2"
              >
                <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <Image src={photos[0].src} alt={t(photos[0].alt)} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
                </span>
                <ZoomBadge className="!top-4 !right-4 !w-10 !h-10 [&_svg]:!w-4 [&_svg]:!h-4" />
              </button>
            </motion.div>

            <motion.div {...rise(0.2)} className="mt-8 sm:mt-10">
              <SectionTitle>{t("ภาพรวมธุรกิจ")}</SectionTitle>
              {company.tagline && (
                <p className="mt-3 font-kanit text-lg sm:text-xl text-[#6B5A3A]">{t(company.tagline)}</p>
              )}
              {pending ? (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-[#C8A96A]/70 bg-white/70 p-4 sm:p-5">
                  <Clock3 className="w-5 h-5 text-[#a28757] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-kanit text-[15px] font-medium text-[#111e46]">{t("ข้อมูลบริษัทกำลังจัดเตรียม")}</p>
                    <p className="mt-1 font-sarabun text-sm text-[#1F1F1F]/75 leading-relaxed">{t(group.description)}</p>
                  </div>
                </div>
              ) : (
                company.description && (
                  <p className="mt-4 font-sarabun text-[15px] sm:text-base text-[#1F1F1F]/80 leading-relaxed">
                    {t(company.description)}
                  </p>
                )
              )}
            </motion.div>

            {company.strengths && company.strengths.length > 0 && (
              <div className="mt-10">
                <SectionTitle>{t("จุดแข็ง")}</SectionTitle>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.strengths.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: i * 0.07, ease: luxEase }}
                      className="flex items-start gap-3 rounded-2xl bg-white border border-[#CCA369]/25 p-4"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#111e46] text-[#C8A96A] flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className="font-sarabun text-sm sm:text-[15px] text-[#1F1F1F]/85 leading-relaxed">{t(s)}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {photos.length > 1 && (
              <div className="mt-10">
                <SectionTitle>{t("แกลเลอรีภาพ")}</SectionTitle>
                <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((p, i) => (
                    <li key={p.src}>
                      <button
                        type="button"
                        onClick={() => setLightbox(i)}
                        aria-label={`${t("ขยายภาพ")}: ${t(p.alt)}`}
                        className="group relative block w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E9DFCC] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] focus-visible:ring-offset-2"
                      >
                        <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                          <Image src={p.src} alt={t(p.alt)} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                        </span>
                        <span className="absolute left-3 bottom-3 px-2.5 py-1 rounded-full bg-white/90 font-kanit text-xs text-[#111e46]">
                          {t(p.alt)}
                        </span>
                        <ZoomBadge />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {siblings.length > 0 && (
              <div className="mt-12">
                <SectionTitle>{t("บริษัทอื่นในกลุ่ม")}</SectionTitle>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {siblings.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/businesses/${c.slug}`}
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#CCA369]/25 hover:border-[#a28757] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A]"
                      >
                        <span className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-[#CCA369]/25 shrink-0">
                          <Image src={c.logo} alt="" fill sizes="44px" className="object-contain p-1" />
                        </span>
                        <span className="flex-1 min-w-0 font-kanit text-sm text-[#1F1F1F] leading-snug">{name(c.nameTh, c.nameEn)}</span>
                        <ArrowRight className="w-4 h-4 text-[#a28757] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Lightbox photos={photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} label={companyName} />
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-kanit text-lg sm:text-xl font-semibold text-[#111e46]">
      <span className="w-6 h-px bg-[#a28757]" aria-hidden="true" />
      {children}
    </h2>
  );
}
