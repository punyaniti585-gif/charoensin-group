"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { brandAssets, footerAffiliateLogos } from "@/data/asset-map";
import { FadeUp } from "@/components/ui/MotionWrapper";
import {
  ExternalLink,
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const half = Math.ceil(footerAffiliateLogos.length / 2);
  const row1 = footerAffiliateLogos.slice(0, half);
  const row2 = footerAffiliateLogos.slice(half);

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

  return (
    <footer className="relative w-full bg-[#F7F1E7] border-t border-[#B39B6B]/30 pt-12 lg:pt-16 pb-10 overflow-hidden text-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            PART 1: BRAND TAGLINES & HERITAGE BANNER
           ======================================================== */}
        <div className="pb-8 mb-10 border-b border-[#B39B6B]/25">
          <FadeUp delay={0.1} distance={20}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="relative h-12 w-auto aspect-[1490/351] mb-4">
                  <Image
                    src={brandAssets.logos.primary}
                    alt="กลุ่มบริษัทเจริญสิน (Charoensin Group)"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-kanit text-[#1F1F1F]">
                  สร้างคุณค่า เติบโตอย่างมั่นคง
                </h3>
                <p className="mt-2 text-sm sm:text-base font-inter italic text-[#6B5A3A]">
                  &ldquo;Building value through trust, driving growth across generations.&rdquo;
                </p>
                <p className="text-xs text-[#1F1F1F]/70 font-sarabun mt-1">
                  Today&apos;s Progress. Tomorrow&apos;s Greatness. — สถาปนา พ.ศ. 2475
                </p>
              </div>

              {/* 90+ Years Enterprise Badge */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#B39B6B]/30 shadow-sm shrink-0">
                <div className="relative h-12 w-12 rounded-xl bg-[#6B5A3A] text-white flex items-center justify-center font-playfair font-bold text-xl shadow-md">
                  90+
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#6B5A3A] font-bold font-inter block">
                    Enterprise Heritage
                  </span>
                  <span className="text-xs text-[#1F1F1F]/80 font-sarabun">
                    มั่นคง โปร่งใส ขับเคลื่อนเศรษฐกิจไทย
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ========================================================
            PART 2: 24 AFFILIATE LOGOS ZONE (Borderless Minimal Floating Logos - Dual-Row Seamless Left Marquee)
           ======================================================== */}
        <div className="mb-16">
          <FadeUp delay={0.2} distance={20}>
            <div className="flex items-center justify-between mb-8">
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

            {/* Dual-Row Seamless Left Marquee (or Static Grid for Reduced Motion) */}
            {shouldReduceMotion ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 py-4 items-center">
                {footerAffiliateLogos.map((item) => (
                  <div
                    key={item.id}
                    className="group/logo relative h-9 sm:h-10 w-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={item.logo}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 140px, 180px"
                        className="object-contain transition-transform duration-300"
                      />
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#1F1F1F] text-white text-xs font-sarabun whitespace-nowrap opacity-0 group-hover/logo:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl border border-[#B39B6B]/40 flex items-center gap-1.5">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#1F1F1F] border-r border-b border-[#B39B6B]/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B39B6B] shrink-0" />
                      <span className="font-medium text-white">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full overflow-hidden pt-4 pb-8 space-y-4 sm:space-y-6 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
                {/* Subtle Edge Fade Gradients for natural blending */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#F7F1E7] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#F7F1E7] to-transparent z-10 pointer-events-none" />

                {/* Row 1: Leftward Seamless Marquee */}
                <div className="animate-marquee-left flex items-center gap-8 sm:gap-10 lg:gap-14">
                  {[...row1, ...row1].map((item, idx) => (
                    <div
                      key={`${item.id}-r1-${idx}`}
                      className="group/logo relative h-9 sm:h-10 w-32 sm:w-36 flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 140px, 180px"
                          className="object-contain transition-transform duration-300"
                        />
                      </div>
                      {/* Tooltip on hover (Row 1: appears below logo into the middle gap) */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#1F1F1F] text-white text-xs font-sarabun whitespace-nowrap opacity-0 group-hover/logo:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl border border-[#B39B6B]/40 flex items-center gap-1.5">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#1F1F1F] border-l border-t border-[#B39B6B]/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B39B6B] shrink-0" />
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2: Leftward Seamless Marquee (ความเร็วเท่ากัน) */}
                <div className="animate-marquee-left flex items-center gap-8 sm:gap-10 lg:gap-14">
                  {[...row2, ...row2].map((item, idx) => (
                    <div
                      key={`${item.id}-r2-${idx}`}
                      className="group/logo relative h-9 sm:h-10 w-32 sm:w-36 flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 140px, 180px"
                          className="object-contain transition-transform duration-300"
                        />
                      </div>
                      {/* Tooltip on hover (Row 2: appears ABOVE logo into the middle gap, avoiding bottom overflow clip) */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#1F1F1F] text-white text-xs font-sarabun whitespace-nowrap opacity-0 group-hover/logo:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl border border-[#B39B6B]/40 flex items-center gap-1.5">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#1F1F1F] border-r border-b border-[#B39B6B]/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B39B6B] shrink-0" />
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FadeUp>
        </div>

        {/* Thin Gold CI Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent my-12" />

        {/* ========================================================
            PART 3: 4 CATEGORIZED LINK COLUMNS
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {footerSections.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-base font-bold font-kanit text-[#1F1F1F] mb-4 pb-2 border-b border-[#B39B6B]/20 flex items-center justify-between">
                <span>{sec.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B5A3A]" />
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-[13px] text-[#1F1F1F]/80 hover:text-[#6B5A3A] transition-colors flex items-center justify-between group/link"
                      >
                        <span className="line-clamp-1">{link.label}</span>
                        <ExternalLink className="w-3 h-3 text-[#6B5A3A] opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ml-1" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs sm:text-[13px] text-[#1F1F1F]/80 hover:text-[#6B5A3A] transition-colors flex items-center justify-between group/link"
                      >
                        <span className="line-clamp-1">{link.label}</span>
                        <ChevronRight className="w-3 h-3 text-[#6B5A3A] opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ml-1" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ========================================================
            PART 4: COPYRIGHT & COMPLIANCE BAR
           ======================================================== */}
        <div className="pt-8 border-t border-[#B39B6B]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1F1F1F]/70 font-sarabun">
          <div>
            <p>&copy; 2026 Charoensin Group &mdash; All Rights Reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-[#6B5A3A] transition-colors">
              ความมั่นคง ปลอดภัย และธรรมาภิบาล
            </span>
            <div className="h-3 w-[1px] bg-[#B39B6B]/40" />
            <span className="font-inter">
              Static Export Production Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
