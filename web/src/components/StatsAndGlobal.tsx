"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { brandAssets, globalCountries } from "@/data/asset-map";
import { FadeUp } from "@/components/ui/MotionWrapper";
import StatsStaticGrid, { type StaticStat } from "@/components/common/StatsStaticGrid";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import {
  Globe2,
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface CountryPoint {
  code: string;
  nameTh: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  hub?: boolean;
  x: number;
  y: number;
  role: string;
  polygon: string;
}

const mapCountries: CountryPoint[] = [
  {
    ...globalCountries[0],
    x: 780,
    y: 255,
    role: "ศูนย์กลางยุทธศาสตร์ระดับภูมิภาค & สำนักงานใหญ่ (Regional HQ Hub)",
    polygon: "M 770 238 L 788 238 L 795 252 L 788 275 L 780 286 L 775 272 L 766 252 Z",
  },
  {
    ...globalCountries[1],
    x: 790,
    y: 185,
    role: "ตลาดการค้าและพันธมิตรซัพพลายเชนหลัก (Strategic Trade Partner)",
    polygon: "M 735 155 L 810 150 L 840 170 L 835 220 L 788 238 L 750 215 L 735 180 Z",
  },
  {
    ...globalCountries[2],
    x: 855,
    y: 182,
    role: "ฐานลูกค้านวัตกรรมสิ่งทอและวัสดุ (High-tech Materials Market)",
    polygon: "M 850 172 L 864 172 L 862 195 L 848 190 Z",
  },
  {
    ...globalCountries[3],
    x: 884,
    y: 183,
    role: "มาตรฐานความปลอดภัยและเคมีภัณฑ์ยานยนต์ (Automotive & Quality Hub)",
    polygon: "M 872 162 L 898 158 L 895 186 L 880 202 L 868 186 Z",
  },
  {
    ...globalCountries[4],
    x: 720,
    y: 235,
    role: "ตลาดเคมีภัณฑ์และพอลิเมอร์อุตสาหกรรม (Industrial Polymers Market)",
    polygon: "M 698 202 L 742 208 L 748 245 L 724 278 L 702 245 Z",
  },
  {
    ...globalCountries[5],
    x: 650,
    y: 230,
    role: "ศูนย์กระจายสินค้าตะวันออกกลางและแอฟริกา (Middle East & GCC Gateway)",
    polygon: "M 642 220 L 662 218 L 664 236 L 646 240 Z",
  },
  {
    ...globalCountries[6],
    x: 530,
    y: 135,
    role: "ฐานวิศวกรรมเทคโนโลยีความปลอดภัยยุโรป (EU Safety & Standards)",
    polygon: "M 518 122 L 544 122 L 542 148 L 520 146 Z",
  },
  {
    ...globalCountries[7],
    x: 496,
    y: 130,
    role: "ตลาดการค้าระหว่างประเทศและพันธมิตรยุโรป (International Trade Partner)",
    polygon: "M 476 110 L 500 106 L 500 136 L 484 144 L 476 125 Z",
  },
  {
    ...globalCountries[8],
    x: 226,
    y: 175,
    role: "ตลาดส่งออกหนังแท้และอุปกรณ์เซฟตี้สากล (Global Export Destination)",
    polygon: "M 155 146 L 295 146 L 310 185 L 294 218 L 225 224 L 170 196 Z",
  },
  {
    ...globalCountries[9],
    x: 872,
    y: 395,
    role: "ตลาดผลิตภัณฑ์เพื่อความยั่งยืนและการเกษตร (Oceania Agri-Ventures)",
    polygon: "M 825 352 L 878 336 L 922 362 L 928 412 L 892 445 L 842 445 L 820 400 Z",
  },
];

const connectionArcs = [
  { to: "CN", d: "M 780 255 Q 770 215 790 185" },
  { to: "KR", d: "M 780 255 Q 805 195 855 182" },
  { to: "JP", d: "M 780 255 Q 820 190 884 183" },
  { to: "IN", d: "M 780 255 Q 745 225 720 235" },
  { to: "AE", d: "M 780 255 Q 710 205 650 230" },
  { to: "DE", d: "M 780 255 Q 660 120 530 135" },
  { to: "GB", d: "M 780 255 Q 640 100 496 130" },
  { to: "US", d: "M 780 255 Q 500 40 226 175" },
  { to: "AU", d: "M 780 255 Q 850 315 872 395" },
];

export default function StatsAndGlobal() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [activeCode, setActiveCode] = useState<string>("TH");

  // Interactive Zoom & Pan States
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Scroll-to-Select Refs
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  // Section Parallax Ref & Transforms
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Background parallax (−25px → +25px across the section's pass through the
  // viewport). Read from the live rect, at most once per frame and only while
  // on screen — useScroll({ target }) caches offsets that go stale inside the
  // home page's sticky wrapper, which made the layer jump. No scroll-linked
  // scale (a fixed 1.04 keeps the edges covered without re-rastering).
  useEffect(() => {
    const sec = statsSectionRef.current;
    const bg = bgRef.current;
    if (!sec || !bg || shouldReduceMotion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = (vh - r.top) / (vh + r.height);
      bg.style.transform = `translate3d(0, ${(-25 + 50 * p).toFixed(1)}px, 0) scale(1.04)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [shouldReduceMotion]);

  // Map ambient loops (flowing dashes, HQ pulse) only run while the map is on
  // screen — they repaint the whole SVG every frame.
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { margin: "100px 0px" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentCountry = mapCountries.find((c) => c.code === activeCode) || mapCountries[0];

  // Auto-focus country camera in map
  const autoFocusCountry = (country: CountryPoint) => {
    if (country.hub || country.code === "TH") {
      // Overview state for Thailand HQ Hub (Full view of 10 countries)
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
    } else {
      // Focused glide to international partner country
      const targetZoom = 1.55;
      const targetX = 500 - country.x * targetZoom;
      const targetY = 250 - country.y * targetZoom;
      setZoom(targetZoom);
      setPan({ x: targetX, y: targetY });
    }
  };

  // Proportional scroll position sync
  const scrollItemToRatio = (code: string) => {
    const container = listContainerRef.current;
    if (!container) return;

    const idx = mapCountries.findIndex((c) => c.code === code);
    if (idx === -1) return;

    isProgrammaticScroll.current = true;
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll > 0) {
      const targetScroll = (idx / (mapCountries.length - 1)) * maxScroll;
      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  };

  // Select country handler (clicks)
  const handleSelectCountry = (country: CountryPoint) => {
    setActiveCode(country.code);
    autoFocusCountry(country);
    scrollItemToRatio(country.code);
  };

  // Scroll listener for left list (calculates proportional scroll progress from top to bottom)
  const handleListScroll = () => {
    if (isProgrammaticScroll.current) return;
    const container = listContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;

    // Progress ratio from 0.0 (top) to 1.0 (bottom)
    const ratio = Math.min(1, Math.max(0, container.scrollTop / maxScroll));

    // Sequentially map ratio to 0..9 (Country 01 to 10)
    const targetIndex = Math.min(
      mapCountries.length - 1,
      Math.round(ratio * (mapCountries.length - 1))
    );

    const targetCountry = mapCountries[targetIndex];
    if (targetCountry && targetCountry.code !== activeCode) {
      setActiveCode(targetCountry.code);
      autoFocusCountry(targetCountry);
    }
  };

  // Manual Zoom Controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.2, prev + 0.4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, prev - 0.4);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetMap = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setActiveCode("TH");
    scrollItemToRatio("TH");
  };

  // Map Drag Handlers (Pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const stats: StaticStat[] = [
    {
      title: "ก่อตั้งมาแล้ว",
      value: 80,
      unit: "ปี",
      note: "รากฐานความมั่นคงกว่า 8 ทศวรรษ",
    },
    {
      title: "ลูกค้าของเรา",
      value: 16890,
      unit: "ราย",
      note: "ที่มอบความไว้วางใจในสินค้าและบริการ",
    },
    {
      title: "พนักงานของเรา",
      value: 1390,
      unit: "คน",
      note: "บุคลากรมืออาชีพที่ร่วมขับเคลื่อนองค์กร",
    },
    {
      title: "อัตราความพึงพอใจ",
      value: 99.9,
      decimals: 1,
      suffix: "%",
      unit: "ความพึงพอใจ",
      note: "มาตรฐานคุณภาพและความพึงพอใจสูงสุด",
    },
  ];

  return (
    <section className="relative w-full bg-[#F7F1E7] text-[#1F1F1F] overflow-hidden">
      {/* ========================================================
          PART 1: COMPANY STATISTICS (Warm Champagne Cream & Architectural Motion)
         ======================================================== */}
      <div
        ref={statsSectionRef}
        className="relative w-full py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-[#F7F1E7] via-[#F3ECE0] to-[#F7F1E7]"
      >
        {/* 1. Monochromatic Architectural Texture with Scroll Parallax (0.25 opacity & mix-blend-multiply) */}
        <div
          ref={bgRef}
          style={{ transform: "scale(1.04)" }}
          className="absolute inset-0 -top-10 -bottom-10 pointer-events-none z-0 overflow-hidden will-change-transform"
        >
          <div className="relative w-full h-full opacity-25 filter grayscale contrast-125">
            <Image
              src="/img/cover-bg.webp"
              alt="Charoensin Group Architectural Texture"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* 2. Luxury Ambient Motion: Subtle Warm Light Sweep (18s Loop) */}
        {isMounted && !shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
            <div className="absolute -top-[60%] -left-[50%] w-[120%] h-[220%] bg-gradient-to-r from-transparent via-[#CCA369]/18 via-[#FAF7F2]/25 to-transparent -rotate-25 blur-3xl pointer-events-none animate-light-sweep-stats" />
          </div>
        )}

        {/* 3. Soft Warm Champagne Surface Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F1E7]/80 via-transparent to-[#F7F1E7]/90 pointer-events-none z-2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
            <FadeUp delay={0.1} distance={20}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9CBAA]/50 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
                <Compass className="w-3.5 h-3.5 text-[#6B5A3A]" />
                <span>EXCELLENCE & INTEGRITY</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
                กลุ่มบริษัทเจริญสิน
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#1F1F1F]/80 font-sarabun leading-relaxed">
                ด้วยเครื่องจักรที่ทันสมัยและทีมงานมืออาชีพ เราช่วยให้ธุรกิจของคู่ค้าและพันธมิตร
                ดำเนินงานได้อย่างมีประสิทธิภาพ ลดการสูญเสีย และเติบโตอย่างยั่งยืน
              </p>
            </FadeUp>
          </div>

          {/* 4 Statistics — static white tiles (no motion / hover) for smooth scrolling */}
          <StatsStaticGrid stats={stats} />
        </div>
      </div>

      {/* Thin Gold CI Divider between Top and Bottom */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
      </div>

      {/* ========================================================
          PART 2: GLOBAL FOOTPRINT - INTERACTIVE ARCHITECTURAL NETWORK MAP
         ======================================================== */}
      <div className="relative w-full py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-[#F7F1E7] via-[#D9CBAA]/25 to-[#F7F1E7]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-6 lg:mb-8">
            <FadeUp delay={0.1} distance={20}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9CBAA]/60 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-2.5 shadow-sm">
                <Globe2 className="w-3.5 h-3.5 text-[#6B5A3A]" />
                <span>GLOBAL FOOTPRINT & ARCHITECTURAL NETWORK</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
                ฐานธุรกิจ CHAROENSIN GROUP
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#6B5A3A] font-kanit font-bold">
                CSG ให้บริการลูกค้ากว่า 10 ล้านคน ใน 10 ประเทศทั่วโลก
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#1F1F1F]/75 font-sarabun max-w-3xl sm:max-w-4xl mx-auto leading-relaxed">
                เชื่อมโยงเครือข่ายคู่ค้า ผู้จัดจำหน่าย และฐานการผลิตข้ามทวีป สร้างเสถียรภาพและความเชื่อมั่นในระดับสากล
              </p>
            </FadeUp>
          </div>

          {/* ====================================================
              SPLIT-SCREEN: 40% EDITORIAL LIST | 60% INTERACTIVE MAP
             ==================================================== */}
          <FadeUp delay={0.25} distance={24}>
            <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-stretch">
              {/* ------------------------------------------------
                  LEFT COLUMN (40%): EDITORIAL COUNTRY LIST (Scroll-to-Select)
                 ------------------------------------------------ */}
              <div className="w-full lg:w-[40%] flex flex-col justify-between bg-white/95 rounded-2xl border border-[#B39B6B]/40 p-4 sm:p-5 shadow-[0_4px_24px_rgba(179,155,107,0.12)]">
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#B39B6B]/30">
                    <span className="text-xs uppercase font-inter font-bold tracking-widest text-[#6B5A3A]">
                      10 GLOBAL HUBS & MARKETS
                    </span>
                    <span className="text-[11px] font-sarabun text-[#6B5A3A]/80">
                      เลื่อนลูกกลิ้งหรือคลิกเพื่อเลือก
                    </span>
                  </div>

                  {/* Scrollable Country List (01-05 filled without top gap) */}
                  <div
                    ref={listContainerRef}
                    onScroll={handleListScroll}
                    className="relative z-10 h-[274px] overflow-y-auto gold-scrollbar pt-0 pb-1 pr-1 space-y-1.5"
                  >
                    {mapCountries.map((c, idx) => {
                      const isSelected = c.code === activeCode;
                      const isHub = c.hub;

                      return (
                        <div
                          key={c.code}
                          onClick={() => handleSelectCountry(c)}
                          className={`group relative h-[50px] px-3.5 flex items-center justify-between cursor-pointer rounded-xl transition-all duration-200 select-none ${isSelected
                            ? "bg-[#D9CBAA]/45 border border-[#B39B6B]/60 border-l-4 border-l-[#6B5A3A] shadow-xs translate-x-1"
                            : "hover:bg-white/60 border border-transparent opacity-75 hover:opacity-100"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Index 01-10 in Playfair Display #6B5A3A */}
                            <span
                              className={`font-playfair font-bold text-base transition-colors w-6 shrink-0 ${isSelected ? "text-[#6B5A3A] scale-110" : "text-[#6B5A3A]/70"
                                }`}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>

                            {/* Names */}
                            <div className="flex flex-col text-left truncate">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-kanit font-semibold text-sm leading-snug truncate transition-colors ${isSelected ? "text-[#1F1F1F]" : "text-[#1F1F1F]/80"
                                    }`}
                                >
                                  {c.nameTh}
                                </span>
                                {isHub && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-inter tracking-wider bg-[#D9CBAA] text-[#6B5A3A] border border-[#B39B6B]/40 shrink-0">
                                    HQ HUB
                                  </span>
                                )}
                              </div>
                              <span className="font-inter text-xs text-[#6B5A3A] font-medium tracking-wide truncate">
                                {c.nameEn}
                              </span>
                            </div>
                          </div>

                          {/* Country Code Pill */}
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span
                              className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded transition-colors ${isSelected
                                ? "bg-[#6B5A3A] text-white shadow-xs"
                                : "bg-[#F2EFE9] text-[#6B5A3A] border border-[#B39B6B]/30 group-hover:bg-[#D9CBAA]/40"
                                }`}
                            >
                              {c.code}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtext info at bottom of left column */}
                <div className="mt-3 pt-2.5 border-t border-[#B39B6B]/25 flex items-center justify-between text-xs text-[#6B5A3A] font-sarabun">
                  <span className="flex items-center gap-1.5 truncate mr-2">
                    <span className="w-2 h-2 rounded-full bg-[#B39B6B] shrink-0" />
                    <span className="truncate">{currentCountry.role}</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#6B5A3A]/80 font-bold shrink-0">
                    {currentCountry.code}
                  </span>
                </div>
              </div>

              {/* ------------------------------------------------
                  RIGHT COLUMN (60%): FULL-BLEED INTERACTIVE ARCHITECTURAL MAP
                 ------------------------------------------------ */}
              <div className="w-full lg:w-[60%] relative rounded-2xl bg-white/95 border border-[#B39B6B]/40 shadow-[0_4px_24px_rgba(179,155,107,0.12)] overflow-hidden flex flex-col justify-between lg:min-h-0">
                {/* Full-Bleed Map Canvas Area (Pannable & Interactive) */}
                <div
                  ref={mapRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`relative w-full aspect-[2/1] lg:aspect-auto lg:h-full lg:flex-1 flex items-center justify-center overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                >
                  <svg
                    viewBox="0 0 1000 500"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full select-none"
                    data-map-active={mapInView ? "true" : "false"}
                  >
                    <defs>
                      {/* Architectural Dot Grid Pattern */}
                      <pattern
                        id="arch-dots"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="10" cy="10" r="0.9" fill="#D9CBAA" fillOpacity="0.45" />
                      </pattern>

                      {/* Radial Glow for Thailand HQ */}
                      <radialGradient id="thailand-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#B39B6B" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#D9CBAA" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D9CBAA" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Graticule Background Grid */}
                    <g stroke="#B39B6B" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.2">
                      <line x1="30" y1="80" x2="970" y2="80" />
                      <line x1="30" y1="150" x2="970" y2="150" />
                      <line x1="30" y1="220" x2="970" y2="220" />
                      <line x1="30" y1="290" x2="970" y2="290" />
                      <line x1="30" y1="360" x2="970" y2="360" />
                      <line x1="30" y1="430" x2="970" y2="430" />
                      <line x1="125" y1="40" x2="125" y2="480" />
                      <line x1="250" y1="40" x2="250" y2="480" />
                      <line x1="375" y1="40" x2="375" y2="480" />
                      <line x1="500" y1="40" x2="500" y2="480" />
                      <line x1="625" y1="40" x2="625" y2="480" />
                      <line x1="750" y1="40" x2="750" y2="480" />
                      <line x1="875" y1="40" x2="875" y2="480" />
                    </g>

                    <rect width="1000" height="520" fill="url(#arch-dots)" opacity="0.75" />

                    {/* ------------------------------------------------
                        ZOOMABLE & PANNABLE CAMERA LAYER
                       ------------------------------------------------ */}
                    <motion.g
                      animate={{
                        scale: zoom,
                        x: pan.x,
                        y: pan.y,
                      }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
                      }
                    >
                      {/* Continents Base Layer */}
                      <g
                        fill="#D9CBAA"
                        fillOpacity="0.28"
                        stroke="#B39B6B"
                        strokeWidth="0.75"
                        strokeOpacity="0.3"
                      >
                        {/* North America */}
                        <path d="M 120 75 Q 160 65 240 70 Q 300 80 340 100 Q 355 125 330 145 Q 310 160 300 195 Q 260 215 240 240 Q 220 270 230 280 Q 200 250 195 210 Q 170 180 145 160 Q 110 130 95 105 Z" />
                        {/* Greenland */}
                        <path d="M 370 50 Q 410 45 425 70 Q 415 100 380 95 Z" />
                        {/* South America */}
                        <path d="M 265 285 Q 310 280 345 320 Q 360 360 330 420 Q 300 470 285 480 Q 280 440 270 380 Q 255 330 265 285 Z" />
                        {/* Europe & Scandinavia */}
                        <path d="M 470 120 Q 510 100 550 95 Q 565 115 540 145 Q 560 170 535 185 Q 490 195 470 170 Q 460 140 470 120 Z" />
                        {/* British Isles */}
                        <path d="M 475 115 Q 495 110 495 130 Q 480 145 475 115 Z" />
                        {/* Africa */}
                        <path d="M 480 200 Q 550 195 590 230 Q 610 270 595 340 Q 570 410 540 430 Q 510 400 490 320 Q 460 250 480 200 Z" />
                        {/* Madagascar */}
                        <path d="M 625 355 Q 640 350 635 385 Q 620 395 625 355 Z" />
                        {/* Asia Mainland */}
                        <path d="M 565 110 Q 650 85 750 90 Q 860 95 910 120 Q 930 150 890 170 Q 840 185 830 220 Q 815 255 780 275 Q 755 250 735 270 Q 700 280 690 240 Q 650 250 625 220 Q 580 205 565 160 Z" />
                        {/* Japan Archipelago */}
                        <path d="M 875 165 Q 895 160 895 185 Q 880 205 870 185 Z" />
                        {/* Indonesia & Maritime SE Asia */}
                        <path d="M 770 295 Q 810 295 845 315 Q 810 330 770 295 Z M 835 300 Q 875 305 870 325 Q 845 320 835 300 Z" />
                        {/* Australia */}
                        <path d="M 825 355 Q 875 340 920 365 Q 930 410 895 440 Q 850 445 830 420 Q 815 385 825 355 Z" />
                        {/* New Zealand */}
                        <path d="M 940 425 Q 955 420 950 450 Q 935 455 940 425 Z" />
                      </g>

                      {/* ------------------------------------------------
                          TOPOGRAPHIC CONTOUR LINES (Iso-elevation Curves)
                         ------------------------------------------------ */}
                      <g
                        stroke="#B39B6B"
                        strokeWidth="0.75"
                        strokeOpacity="0.25"
                        strokeDasharray="2 3"
                        fill="none"
                      >
                        {/* Himalayas & Tibetan Highland Contours */}
                        <path d="M 700 185 Q 750 172 820 176 Q 855 185 875 180" />
                        <path d="M 712 195 Q 762 182 812 184 Q 840 194 862 190" />
                        <path d="M 724 205 Q 768 192 798 194 Q 825 204 845 202" />
                        {/* Rocky Mountains & Western Cordillera */}
                        <path d="M 175 105 Q 195 145 210 185 Q 220 225 235 258" />
                        <path d="M 185 115 Q 202 152 216 190 Q 225 230 240 264" />
                        {/* European Alps & Highlands */}
                        <path d="M 508 142 Q 528 136 548 144" />
                        <path d="M 514 148 Q 532 142 544 149" />
                        {/* Australian Dividing Range */}
                        <path d="M 890 355 Q 912 385 908 425" />
                        <path d="M 896 365 Q 918 395 914 435" />
                      </g>

                      {/* ------------------------------------------------
                          COUNTRY TERRITORY POLYGONS (10 Countries Highlight)
                         ------------------------------------------------ */}
                      <g>
                        {mapCountries.map((c) => {
                          const isSelected = c.code === activeCode;
                          return (
                            <path
                              key={`poly-${c.code}`}
                              d={c.polygon}
                              fill={isSelected ? "#B39B6B" : "#D9CBAA"}
                              fillOpacity={isSelected ? 0.55 : 0.35}
                              stroke={isSelected ? "#6B5A3A" : "#B39B6B"}
                              strokeWidth={isSelected ? "1.8" : "0.9"}
                              strokeOpacity={isSelected ? 1 : 0.5}
                              onClick={() => handleSelectCountry(c)}
                              className="transition-all duration-300 cursor-pointer"
                            />
                          );
                        })}
                      </g>

                      {/* ------------------------------------------------
                          SVG QUADRATIC BEZIER CONNECTION ARCS
                         ------------------------------------------------ */}
                      <g>
                        {connectionArcs.map((arc) => {
                          const isSelected = arc.to === activeCode;

                          return (
                            <g key={arc.to}>
                              <path
                                d={arc.d}
                                fill="none"
                                stroke="#B39B6B"
                                strokeWidth={isSelected ? "2.5" : "1.2"}
                                strokeOpacity={isSelected ? 0.95 : 0.25}
                                className="transition-all duration-300"
                              />

                              {/* Animated Flowing Dash — CSS keyframes (no JS per frame),
                                  paused while the map is off screen */}
                              {isMounted && !shouldReduceMotion && (
                                <path
                                  d={arc.d}
                                  fill="none"
                                  stroke={isSelected ? "#6B5A3A" : "#B39B6B"}
                                  strokeWidth={isSelected ? "2.5" : "1.4"}
                                  strokeDasharray="5 6"
                                  className="map-dash-flow"
                                  style={{ animationDuration: isSelected ? "1.4s" : "2.8s" }}
                                  opacity={isSelected ? 1 : 0.5}
                                />
                              )}
                            </g>
                          );
                        })}
                      </g>

                      {/* ------------------------------------------------
                          COUNTRY PINS (10 Geographically Accurate Points)
                         ------------------------------------------------ */}
                      <g>
                        {mapCountries.map((c) => {
                          const isSelected = c.code === activeCode;
                          const isHub = c.hub;

                          return (
                            <g
                              key={`pin-${c.code}`}
                              className="cursor-pointer group/pin"
                              onClick={() => handleSelectCountry(c)}
                            >
                              {/* Thailand HQ Pulse Ring */}
                              {isHub && isMounted && !shouldReduceMotion && (
                                <circle
                                  cx={c.x}
                                  cy={c.y}
                                  r={8}
                                  fill="none"
                                  stroke="#B39B6B"
                                  strokeWidth="2"
                                  vectorEffect="non-scaling-stroke"
                                  className="map-hub-pulse"
                                />
                              )}

                              {/* Outer Selection Highlight Ring */}
                              {isSelected && (
                                <circle
                                  cx={c.x}
                                  cy={c.y}
                                  r={isHub ? 12 : 10}
                                  fill="none"
                                  stroke="#6B5A3A"
                                  strokeWidth="2"
                                  strokeDasharray="2 3"
                                  className="animate-spin-slow origin-center"
                                />
                              )}

                              {/* Pin Circle */}
                              <circle
                                cx={c.x}
                                cy={c.y}
                                r={isHub ? 7.5 : isSelected ? 6.5 : 4.5}
                                fill={isHub ? "#B39B6B" : isSelected ? "#6B5A3A" : "#B39B6B"}
                                stroke="#FFFFFF"
                                strokeWidth={isHub ? 2.5 : 2}
                                className="transition-all duration-300 drop-shadow-sm group-hover/pin:scale-125 origin-center"
                              />

                              {isHub && <circle cx={c.x} cy={c.y} r={2.5} fill="#6B5A3A" />}

                              {/* Country Code Label on Map */}
                              <text
                                x={c.x}
                                y={c.y + (isHub ? 18 : 14)}
                                textAnchor="middle"
                                className={`text-[10px] font-mono font-bold select-none transition-colors ${isSelected ? "fill-[#6B5A3A]" : "fill-[#6B5A3A]/70"
                                  }`}
                              >
                                {c.code}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    </motion.g>
                  </svg>

                  {/* Floating Header Toolbar Overlay */}
                  <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-[10px] font-mono select-none pointer-events-none">
                    <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-[#B39B6B]/40 shadow-xs pointer-events-auto text-[#6B5A3A]">
                      <span className="font-bold tracking-wider">NETWORK RADAR</span>
                      <span className="text-[#B39B6B]/60">·</span>
                      <span className="text-[#B39B6B]/80 hidden sm:inline">
                        {zoom === 1 ? "GLOBAL VIEW" : `ZOOM ${zoom.toFixed(1)}x`}
                      </span>
                    </div>

                    {/* Compact Zoom Controls (+, -, Reset) */}
                    <div className="flex items-center gap-1.5 bg-white/95 p-1 rounded-xl border border-[#B39B6B]/40 shadow-xs pointer-events-auto">
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        title="ซูมเข้า (Zoom In)"
                        className="p-1 rounded-lg hover:bg-[#D9CBAA]/50 text-[#6B5A3A] hover:text-[#1F1F1F] transition-colors"
                        aria-label="ซูมเข้า"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        title="ซูมออก (Zoom Out)"
                        className="p-1 rounded-lg hover:bg-[#D9CBAA]/50 text-[#6B5A3A] hover:text-[#1F1F1F] transition-colors"
                        aria-label="ซูมออก"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-3.5 w-[1px] bg-[#B39B6B]/30 mx-0.5" />
                      <button
                        type="button"
                        onClick={handleResetMap}
                        title="รีเซ็ตกลับภาพรวม (Reset View)"
                        className="p-1 rounded-lg hover:bg-[#D9CBAA]/50 text-[#6B5A3A] hover:text-[#1F1F1F] transition-colors flex items-center gap-1 text-[10px] font-sans px-2 font-medium"
                        aria-label="รีเซ็ตภาพรวม"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ภาพรวม</span>
                      </button>
                    </div>
                  </div>

                  {/* Floating Coordinate & Role Card (Desktop >= lg) */}
                  <AnimatePresence>
                    {isMounted && currentCountry && (
                      <motion.div
                        key={`tip-${currentCountry.code}`}
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hidden lg:block absolute bottom-3 right-3 max-w-xs z-30 pointer-events-none"
                      >
                        <div className="p-2.5 sm:p-3 rounded-xl bg-white/95 border border-[#B39B6B]/60 shadow-lg text-left">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#B39B6B] animate-pulse" />
                              <span className="font-kanit font-bold text-xs text-[#1F1F1F]">
                                {currentCountry.nameTh} ({currentCountry.nameEn})
                              </span>
                            </div>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D9CBAA]/50 text-[#6B5A3A]">
                              {currentCountry.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B5A3A] font-sarabun leading-snug">
                            {currentCountry.role}
                          </p>
                          <div className="mt-1 pt-1 border-t border-[#B39B6B]/20 flex items-center justify-between text-[10px] font-mono text-[#6B5A3A]/75">
                            <span>
                              {currentCountry.latitude.toFixed(1)}°N, {currentCountry.longitude.toFixed(1)}°E
                            </span>
                            {currentCountry.hub && (
                              <span className="font-bold text-[#6B5A3A]">REGIONAL HQ</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Map Bottom Legend Overlay (Visible on sm and up) */}
                  <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3.5 text-xs text-[#6B5A3A] font-sarabun bg-white/90 px-3 py-1.5 rounded-xl border border-[#B39B6B]/40 shadow-xs pointer-events-auto">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B39B6B] border border-white" />
                      <span className="text-[11px] font-medium">ศูนย์กลาง (HQ HUB)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-[2px] bg-[#B39B6B]" />
                      <span className="text-[11px] font-medium">เส้นทางสากล</span>
                    </span>
                  </div>
                </div>

                {/* Mobile Docked Country Detail Card (< lg): Clean bottom panel, never overlaps map pins */}
                <div className="lg:hidden p-3 border-t border-[#B39B6B]/25 bg-[#FAF7F2]/90">
                  <AnimatePresence mode="wait">
                    {isMounted && currentCountry && (
                      <motion.div
                        key={`mob-tip-${currentCountry.code}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-[#B39B6B] animate-pulse shrink-0" />
                            <span className="font-kanit font-bold text-xs text-[#1F1F1F] truncate">
                              {currentCountry.nameTh} ({currentCountry.nameEn})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D9CBAA]/50 text-[#6B5A3A]">
                              {currentCountry.code}
                            </span>
                            {currentCountry.hub && (
                              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#6B5A3A] text-white">
                                REGIONAL HQ
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6B5A3A] font-sarabun leading-snug">
                          {currentCountry.role}
                        </p>
                        <div className="mt-1.5 pt-1 border-t border-[#B39B6B]/20 flex items-center justify-between text-[10px] font-mono text-[#6B5A3A]/75">
                          <span>
                            {currentCountry.latitude.toFixed(1)}°N, {currentCountry.longitude.toFixed(1)}°E
                          </span>
                          <span className="text-[#6B5A3A]/70 text-[9.5px]">
                            แตะจุดบนแผนที่หรือเลือกประเทศด้านล่าง
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Highlight Card for Thailand Headquarters (Compact for Single Viewport) */}
          <FadeUp delay={0.4} distance={20} className="mt-5 sm:mt-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-[#B39B6B]/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#6B5A3A] text-white flex items-center justify-center shrink-0 font-bold font-kanit text-lg shadow-md">
                  TH
                </div>
                <div>
                  <h4 className="text-base font-bold font-kanit text-[#1F1F1F] flex items-center gap-2">
                    <span>ศูนย์กลางยุทธศาสตร์ระดับภูมิภาค (Regional Headquarters Hub)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#D9CBAA]/50 text-[#6B5A3A] border border-[#B39B6B]/40 font-mono font-semibold">
                      ประเทศไทย
                    </span>
                  </h4>
                  <p className="text-xs text-[#1F1F1F]/75 font-sarabun mt-1">
                    กลุ่มบริษัทเจริญสินขับเคลื่อนการส่งออก นวัตกรรมเคมีภัณฑ์ ยาง สิ่งทอ
                    และอุปกรณ์ความปลอดภัยสู่ตลาดโลกอย่างต่อเนื่อง
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-6 text-center sm:text-right">
                <div>
                  <span className="text-2xl font-bold font-inter text-[#6B5A3A]">10+</span>
                  <span className="block text-[11px] text-[#1F1F1F]/70 font-sarabun">
                    ประเทศปลายทาง
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-[#B39B6B]/30" />
                <div>
                  <span className="text-2xl font-bold font-inter text-[#6B5A3A]">10M+</span>
                  <span className="block text-[11px] text-[#1F1F1F]/70 font-sarabun">
                    ผู้ใช้บริการทั่วโลก
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
