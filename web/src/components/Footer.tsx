"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { footerAffiliateLogos } from "@/data/asset-map";
import { FadeUp } from "@/components/ui/MotionWrapper";
import { ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------
   Social channels. lucide-react 1.x ships no brand icons, so the
   glyphs are inline SVG paths (24×24 viewBox, currentColor fill).
   TODO: Instagram / YouTube URLs are not in the project yet — replace
   the "#" placeholders with the official channel links.
   ------------------------------------------------------------------ */
const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/CharoensinGroup/",
    path: "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.08 1.08 0 1 0 0 2.16 1.08 1.08 0 0 0 0-2.16ZM12 3.6c-2.28 0-2.57.01-3.46.05-.9.04-1.5.18-2.04.39a4.1 4.1 0 0 0-1.49.97 4.1 4.1 0 0 0-.97 1.49c-.21.54-.35 1.15-.39 2.04C3.61 9.43 3.6 9.72 3.6 12s.01 2.57.05 3.46c.04.9.18 1.5.39 2.04.21.55.5 1.02.97 1.49.47.47.94.76 1.49.97.54.21 1.15.35 2.04.39.89.04 1.18.05 3.46.05s2.57-.01 3.46-.05c.9-.04 1.5-.18 2.04-.39a4.1 4.1 0 0 0 1.49-.97c.47-.47.76-.94.97-1.49.21-.54.35-1.15.39-2.04.04-.89.05-1.18.05-3.46s-.01-2.57-.05-3.46c-.04-.9-.18-1.5-.39-2.04a4.1 4.1 0 0 0-.97-1.49 4.1 4.1 0 0 0-1.49-.97c-.54-.21-1.15-.35-2.04-.39-.89-.04-1.18-.05-3.46-.05Zm0 1.51c2.24 0 2.5.01 3.39.05.82.04 1.26.17 1.56.29.39.15.67.33.96.62.29.29.47.57.62.96.12.3.25.74.29 1.56.04.89.05 1.15.05 3.39s-.01 2.5-.05 3.39c-.04.82-.17 1.26-.29 1.56-.15.39-.33.67-.62.96-.29.29-.57.47-.96.62-.3.12-.74.25-1.56.29-.89.04-1.15.05-3.39.05s-2.5-.01-3.39-.05c-.82-.04-1.26-.17-1.56-.29a2.6 2.6 0 0 1-.96-.62 2.6 2.6 0 0 1-.62-.96c-.12-.3-.25-.74-.29-1.56-.04-.89-.05-1.15-.05-3.39s.01-2.5.05-3.39c.04-.82.17-1.26.29-1.56.15-.39.33-.67.62-.96.29-.29.57-.47.96-.62.3-.12.74-.25 1.56-.29.89-.04 1.15-.05 3.39-.05Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  },
];

const footerSections = [
  {
    title: "ธุรกิจของเรา",
    links: [
      { label: "ภาพรวมธุรกิจทั้งหมด", href: "/businesses", isExternal: false },
      { label: "ธุรกิจอสังหาริมทรัพย์", href: "/businesses#real-estate", isExternal: false },
      { label: "ธุรกิจผลิตหนังและรองเท้า", href: "/businesses#leather-footwear", isExternal: false },
      { label: "ธุรกิจสิ่งทอ", href: "/businesses#non-woven", isExternal: false },
      { label: "ธุรกิจเคมีภัณฑ์", href: "/businesses#chemical", isExternal: false },
      { label: "ธุรกิจอื่นๆ ในเครือ", href: "/businesses#other", isExternal: false },
    ],
  },
  {
    title: "ประวัติของเรา",
    links: [
      { label: "ประวัติความเป็นมา 90+ ปี", href: "/about#history", isExternal: false },
      { label: "วิสัยทัศน์และพันธกิจ", href: "/about#vision", isExternal: false },
      { label: "ค่านิยมและปรัชญาองค์กร", href: "/about#values", isExternal: false },
      { label: "คณะผู้บริหารและผู้นำของเรา", href: "/about#leadership", isExternal: false },
      { label: "มูลนิธิวงษ์เจริญสิน", href: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/", isExternal: true },
    ],
  },
  {
    title: "ติดต่อเรา & ร่วมงาน",
    links: [
      { label: "ติดต่อกลุ่มบริษัทเจริญสิน", href: "https://csgok.sfinsulations.com/contact-us-2026-greenshift/", isExternal: true },
      { label: "ร่วมงานกับเรา (Careers)", href: "https://csgok.sfinsulations.com/mycareer2026/", isExternal: true },
      { label: "นโยบายการบริหารงานบุคคล", href: "https://csgok.sfinsulations.com/compliant_hr_2026/", isExternal: true },
      { label: "จรรยาบรรณธุรกิจและคู่ค้า", href: "https://csgok.sfinsulations.com/codeofconduct/", isExternal: true },
      { label: "แจ้งเรื่องร้องเรียน / ธรรมาภิบาล", href: "#policy-governance", isExternal: false },
    ],
  },
  {
    title: "ติดตามเรา & นโยบาย",
    links: [
      { label: "ข่าวสารและกิจกรรม", href: "https://csgok.sfinsulations.com/new2026/", isExternal: true },
      { label: "Facebook: Charoensin Group", href: "https://www.facebook.com/CharoensinGroup/", isExternal: true },
      { label: "นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)", href: "#org-pdpa", isExternal: false },
      { label: "นโยบายการใช้ AI", href: "https://csgok.sfinsulations.com/ai-policy2/", isExternal: true },
      { label: "เงื่อนไขการใช้งานเว็บไซต์", href: "#terms", isExternal: false },
    ],
  },
];

const linkClass =
  "group/link inline-flex items-start gap-1.5 text-[12.5px] sm:text-[13px] leading-relaxed text-[#E5E7EB] hover:text-[#9CA3AF] transition-colors duration-200";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const half = Math.ceil(footerAffiliateLogos.length / 2);
  const row1 = footerAffiliateLogos.slice(0, half);
  const row2 = footerAffiliateLogos.slice(half);

  return (
    <footer className="relative w-full">
      {/* ========================================================
          PART 1: AFFILIATE LOGOS BAND (cream — the 24 colour logos
          are JPG/PNG on light grounds and read poorly on dark)
         ======================================================== */}
      <div className="bg-[#F7F1E7] border-t border-[#B39B6B]/30 pt-12 lg:pt-14 pb-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.1} distance={20}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-[#6B5A3A] uppercase tracking-widest font-inter block">
                  AFFILIATE COMPANIES & BRANDS
                </span>
                <h4 className="text-lg sm:text-xl font-bold font-kanit text-[#1F1F1F]">
                  บริษัทและแบรนด์ในเครือกลุ่มเจริญสิน
                </h4>
              </div>
              <span className="hidden sm:inline-block text-xs text-[#6B5A3A] font-sarabun">
                ชี้เมาส์ที่โลโก้เพื่อดูชื่อบริษัท
              </span>
            </div>

            {shouldReduceMotion ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 py-4 items-center">
                {footerAffiliateLogos.map((item) => (
                  <AffiliateLogo key={item.id} item={item} tooltip="top" fluid />
                ))}
              </div>
            ) : (
              <div className="relative w-full overflow-hidden pt-4 pb-8 space-y-4 sm:space-y-6 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
                <div className="animate-marquee-left flex items-center gap-8 sm:gap-10 lg:gap-14">
                  {[...row1, ...row1].map((item, idx) => (
                    <AffiliateLogo key={`${item.id}-r1-${idx}`} item={item} tooltip="bottom" />
                  ))}
                </div>
                <div className="animate-marquee-left flex items-center gap-8 sm:gap-10 lg:gap-14">
                  {[...row2, ...row2].map((item, idx) => (
                    <AffiliateLogo key={`${item.id}-r2-${idx}`} item={item} tooltip="top" />
                  ))}
                </div>
              </div>
            )}
          </FadeUp>
        </div>
      </div>

      {/* ========================================================
          PART 2: DARK CHARCOAL-INDIGO MAIN FOOTER
         ======================================================== */}
      <div className="relative overflow-hidden bg-[#111e46] text-[#E5E7EB]">
        {/* Faint architectural backdrop (static → filter is free after first paint) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.08] [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)]"
        >
          <Image
            src="/img/charoensin-building-hq.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center grayscale contrast-125"
          />
        </div>
        {/* Indigo wash so the photo reads as texture, not image */}
        <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#111e46]/40 via-[#111e46]/70 to-[#111e46]" />
        {/* Thin pale-gold top rule */}
        <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CCA369]/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] gap-12 lg:gap-14 xl:gap-20">
            {/* ---------------- Brand & Social ---------------- */}
            <div>
              <Link href="/" aria-label="Charoensin Group — หน้าแรก" className="inline-block">
                <p className="font-playfair uppercase leading-[0.95] tracking-[0.14em]">
                  <span className="block text-[2.1rem] sm:text-[2.5rem] xl:text-[2.75rem] font-semibold text-[#CCA369]">
                    Charoensin
                  </span>
                  <span className="block text-[2.1rem] sm:text-[2.5rem] xl:text-[2.75rem] font-normal text-[#F3F4F6] tracking-[0.42em]">
                    Group
                  </span>
                </p>
              </Link>

              <div className="mt-5 h-px w-14 bg-[#CCA369]/60" />

              <p className="mt-5 font-kanit text-base sm:text-lg text-[#E5E7EB]/85">
                สร้างคุณค่า เติบโตอย่างมั่นคง
              </p>
              <p className="mt-1 font-sarabun text-xs text-[#9CA3AF]">
                สถาปนา พ.ศ. 2475 · Today&apos;s Progress. Tomorrow&apos;s Greatness.
              </p>

              <ul className="mt-7 flex items-center gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CCA369]/45 text-[#CCA369] transition-colors duration-200 hover:bg-[#CCA369] hover:border-[#CCA369] hover:text-[#111e46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369]/70"
                    >
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------------- 4 Link Columns ---------------- */}
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 md:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 lg:gap-x-10"
            >
              {footerSections.map((sec) => (
                <div key={sec.title} className="min-w-0">
                  <h4 className="font-kanit text-[15px] font-medium text-[#CCA369] flex items-center gap-2 mb-5">
                    <span>{sec.title}</span>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#CCA369]" />
                  </h4>
                  <ul className="space-y-2.5 sm:space-y-3 font-sarabun">
                    {sec.links.map((link) => (
                      <li key={link.label}>
                        {link.isExternal ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            <span>{link.label}</span>
                            <ArrowUpRight className="mt-[0.3em] h-3 w-3 shrink-0 text-[#CCA369]/0 group-hover/link:text-[#CCA369] transition-colors" />
                          </a>
                        ) : (
                          <Link href={link.href} className={linkClass}>
                            <span>{link.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* ---------------- Bottom Bar ---------------- */}
          <div className="mt-14 lg:mt-16 pt-6 border-t border-[#CCA369]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[#9CA3AF] font-sarabun text-center md:text-left">
            <p>&copy; 2026 Charoensin Group &mdash; All Rights Reserved.</p>
            <p className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1">
              <span className="whitespace-nowrap">ความมั่นคง ปลอดภัย และธรรมาภิบาล</span>
              <span aria-hidden className="text-[#6B7280]">|</span>
              <span className="whitespace-nowrap font-inter">Static Export Production Ready</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------
   Affiliate logo tile with name tooltip (marquee + reduced-motion grid)
   ------------------------------------------------------------------ */
function AffiliateLogo({
  item,
  tooltip,
  fluid = false,
}: {
  item: { id: string; name: string; logo: string };
  tooltip: "top" | "bottom";
  fluid?: boolean;
}) {
  const below = tooltip === "bottom";
  return (
    <div
      className={`group/logo relative h-9 sm:h-10 ${fluid ? "w-full" : "w-32 sm:w-36 shrink-0"} flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110`}
    >
      <div className="relative w-full h-full">
        <Image src={item.logo} alt={item.name} fill sizes="(max-width: 640px) 140px, 180px" className="object-contain" />
      </div>
      <div
        className={`absolute ${below ? "-bottom-8" : "-top-8"} left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#1F1F1F] text-white text-xs font-sarabun whitespace-nowrap opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl border border-[#B39B6B]/40 flex items-center gap-1.5`}
      >
        <div
          className={`absolute ${below ? "-top-1 border-l border-t" : "-bottom-1 border-r border-b"} left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#1F1F1F] border-[#B39B6B]/40`}
        />
        <span className="w-1.5 h-1.5 rounded-full bg-[#B39B6B] shrink-0" />
        <span className="font-medium">{item.name}</span>
      </div>
    </div>
  );
}
