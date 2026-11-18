"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/ui/MotionWrapper";
import {
  Play,
  X as CloseIcon,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface VideoModalData {
  title: string;
  type: "youtube" | "mp4";
  url: string;
}

const csgEase = [0.16, 1, 0.3, 1] as const;

export default function FlagshipBento() {
  const [activeVideo, setActiveVideo] = useState<VideoModalData | null>(null);

  const flagshipBusinesses = [
    {
      id: "adb",
      name: "แอ๊พพลาย ดีบี",
      subtitle: "กาว ยาแนว และพลาสติกคอมพาวด์มาตรฐานสากล",
      logo: "/img/affiliate-adb.png",
      bgImage: "/img/thumb-adb.jpg",
      isFlagship: true,
      row: "top",
      gridSpan: "col-span-1 md:col-span-3 lg:col-span-3",
      cardHeight: "h-[240px] sm:h-[250px] lg:h-[255px]",
      video: {
        title: "วิดีโอแนะนำ แอ๊พพลาย ดีบี (ADB)",
        type: "youtube" as const,
        url: "https://www.youtube.com/embed/HnI4uXJYhfE?autoplay=1&playsinline=1&rel=0",
      },
      link: {
        url: "#businesses",
        isPending: true,
      },
    },
    {
      id: "cpl",
      name: "ซีพีแอล กรุ๊ป",
      subtitle: "ผู้นำอุตสาหกรรมฟอกหนังและอุปกรณ์เซฟตี้ครบวงจร",
      logo: "/img/affiliate-cpl.png",
      bgImage: "/img/cat-leather.jpg",
      isFlagship: true,
      row: "top",
      gridSpan: "col-span-1 md:col-span-3 lg:col-span-3",
      cardHeight: "h-[240px] sm:h-[250px] lg:h-[255px]",
      video: {
        title: "วิดีโอแนะนำ ซีพีแอล กรุ๊ป (CPL)",
        type: "mp4" as const,
        url: "https://csgok.sfinsulations.com/wp-content/uploads/2025/12/0_Leatherworking_Leather_1280x720.mp4",
      },
      link: {
        url: "#businesses",
        isPending: true,
      },
    },
    {
      id: "ttn",
      name: "ทีทีเอ็น นันวูเว่น โซลูชั่น",
      subtitle: "นวัตกรรมเส้นใยและผ้าไม่ถักทอสำหรับอุตสาหกรรม",
      logo: "/img/affiliate-ttn.png",
      bgImage: "/img/thumb-ttn.jpg",
      isFlagship: false,
      row: "bottom",
      gridSpan: "col-span-1 md:col-span-2 lg:col-span-2",
      cardHeight: "h-[210px] sm:h-[215px] lg:h-[220px]",
      video: {
        title: "วิดีโอแนะนำ ทีทีเอ็น นันวูเว่น (TTN)",
        type: "youtube" as const,
        url: "https://www.youtube.com/embed/0EEwVXLixNQ?autoplay=1&playsinline=1&rel=0",
      },
      link: {
        url: "#businesses",
        isPending: true,
      },
    },
    {
      id: "tws",
      name: "ไทย ไวร์ริ่ง ซิสเต็ม",
      subtitle: "โซลูชันระบบสายไฟและชิ้นส่วนวิศวกรรมยานยนต์",
      logo: "/img/affiliate-tws.png",
      bgImage: "/img/cat-other.png",
      isFlagship: false,
      row: "bottom",
      gridSpan: "col-span-1 md:col-span-2 lg:col-span-2",
      cardHeight: "h-[210px] sm:h-[215px] lg:h-[220px]",
      video: null,
      link: {
        url: "#businesses",
        isPending: true,
      },
    },
    {
      id: "foundation",
      name: "มูลนิธิร่วมเจริญสิน",
      subtitle: "ส่งเสริมการศึกษา พัฒนาสังคม และคุณภาพชีวิตที่ยั่งยืน",
      logo: "/img/affiliate-foundation.png",
      bgImage: "/img/cover-bg.webp",
      isFlagship: false,
      row: "bottom",
      gridSpan: "col-span-1 md:col-span-2 lg:col-span-2",
      cardHeight: "h-[210px] sm:h-[215px] lg:h-[220px]",
      video: {
        title: "วิดีโอสนับสนุนการศึกษาเด็ก มูลนิธิร่วมเจริญสิน",
        type: "mp4" as const,
        url: "https://csgok.sfinsulations.com/wp-content/uploads/2026/03/%E0%B8%AA%E0%B8%99%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%99%E0%B8%B8%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81.mp4",
      },
      link: {
        url: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
        isPending: false,
      },
    },
  ];

  return (
    <section className="relative w-full py-8 sm:py-10 lg:py-12 bg-[#F7F1E7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            SECTION HEADER: FUTURE-DRIVING VENTURES (Compact for Single Viewport)
           ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
          <FadeUp delay={0.1} distance={18}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9CBAA]/50 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6B5A3A]" />
              <span>FUTURE-DRIVING VENTURES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-kanit text-[#1F1F1F] tracking-tight">
              ธุรกิจที่ขับเคลื่อนอนาคต
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#1F1F1F]/75 font-sarabun max-w-2xl">
              ร่วมสร้างคุณค่าในทุกมิติ ผ่านความเป็นเลิศของธุรกิจเรือธงและพันธมิตรเครือเจริญสิน
            </p>
          </FadeUp>
        </div>

        {/* ========================================================
            EDITORIAL BENTO GRID: 5 CARDS IN 2 BALANCED ROWS (gap-4)
            Row 1 (Top): 2 Cards (ADB, CPL) -> h-[240px]-h-[255px]
            Row 2 (Bottom): 3 Cards (TTN, TWS, Foundation) -> h-[210px]-h-[220px]
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {flagshipBusinesses.map((biz, idx) => (
            <FadeUp
              key={biz.id}
              delay={0.12 + idx * 0.06}
              distance={20}
              className={`${biz.gridSpan} h-full`}
            >
              <div
                className={`group relative rounded-2xl overflow-hidden border border-[#B39B6B]/40 hover:border-[#B39B6B] shadow-md hover:shadow-xl transition-all duration-500 w-full ${biz.cardHeight} flex flex-col justify-between bg-[#1F1F1F] text-white`}
              >
                {/* Background Image with Dark Vignette */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={biz.bgImage}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 pointer-events-none" />
                </div>

                {/* ----------------------------------------------------
                    TOP BAR: Glowing Logo (Top-Left) & Arrow Link (Top-Right)
                   ---------------------------------------------------- */}
                <div className="relative z-10 p-3.5 sm:p-4.5 flex items-start justify-between gap-3">
                  {/* Top-Left: Transparent Logo with White Edge Glow Filter */}
                  <div className="relative h-9 sm:h-10 w-28 sm:w-32 md:w-36 flex items-center justify-start shrink-0">
                    <Image
                      src={biz.logo}
                      alt={biz.name}
                      fill
                      sizes="(max-width: 640px) 120px, 160px"
                      className="object-contain object-left group-hover:scale-105 transition-transform duration-300"
                      style={{
                        filter:
                          "drop-shadow(0 0 1.5px rgba(255,255,255,0.95)) drop-shadow(0 0 6px rgba(255,255,255,0.65))",
                      }}
                    />
                  </div>

                  {/* Top-Right: Circular Arrow Link Button */}
                  <div className="shrink-0">
                    {biz.link.isPending ? (
                      <span
                        title="รอยืนยันลิงก์อย่างเป็นทางการ"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/40 cursor-default"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <Link
                        href={biz.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`เปิดเว็บไซต์ทางการ ${biz.name}`}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-[#B39B6B] backdrop-blur-md border border-white/30 hover:border-[#B39B6B] flex items-center justify-center text-white hover:text-black transition-all duration-300 group/link shadow-sm hover:scale-110"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* ----------------------------------------------------
                    BOTTOM BAR: Thai Name & Subtitle (Left) + Play Button (Right)
                   ---------------------------------------------------- */}
                <div className="relative z-10 p-3.5 sm:p-4.5 flex items-end justify-between gap-3">
                  {/* Bottom-Left: Thai Company Name (Bold) & Short 1-Line Subtitle */}
                  <div className="min-w-0 pr-2">
                    <h4 className="text-base sm:text-lg lg:text-[19px] font-bold font-kanit text-white leading-snug drop-shadow-md group-hover:text-[#D9CBAA] transition-colors truncate">
                      {biz.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#F2EFE9]/90 font-sarabun truncate mt-0.5 drop-shadow-sm">
                      {biz.subtitle}
                    </p>
                  </div>

                  {/* Bottom-Right: Small Circular Video Play Button */}
                  {biz.video && (
                    <button
                      type="button"
                      onClick={() => setActiveVideo(biz.video)}
                      aria-label={`เล่นวิดีโอ ${biz.name}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-[#B39B6B] backdrop-blur-md border border-white/30 hover:border-[#B39B6B] text-white hover:text-black flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Video Modal (Smooth Framer Motion) */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: csgEase }}
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#B39B6B]/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1F1F1F]">
                <h4 className="text-sm sm:text-base font-semibold font-kanit text-white">
                  {activeVideo.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-[#B39B6B] text-white hover:text-black transition-colors"
                  aria-label="ปิดหน้าต่างวิดีโอ"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className="relative aspect-video w-full bg-black">
                {activeVideo.type === "youtube" ? (
                  <iframe
                    src={activeVideo.url}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
                  </video>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
