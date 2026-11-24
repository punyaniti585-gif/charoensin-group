"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { FadeUp, CountUp } from "@/components/ui/MotionWrapper";
import { Leaf, TrendingUp, Compass, Plus } from "lucide-react";

export default function SustainabilityAndPhilosophy() {
  const shouldReduceMotion = useReducedMotion();
  // Ambient loops in the growth chart (light pulse, end-point ring) only run
  // while the chart is on screen.
  const chartRef = useRef<SVGSVGElement>(null);
  const chartInView = useInView(chartRef, { margin: "100px 0px" });
  // The travelling bead is SMIL (<animateMotion>) — pause the SVG's timeline too
  useEffect(() => {
    const svg = chartRef.current;
    if (!svg) return;
    if (chartInView) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [chartInView]);
  const [isMounted, setIsMounted] = useState(false);
  const [activePhilIndex, setActivePhilIndex] = useState<number>(0);
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const growthStats = [
    {
      year: "2566",
      value: 5,
      suffix: "%",
      plus: "+",
      target: "5%+",
      desc: "รากฐานการเติบโตอย่างมีเสถียรภาพ และการปรับโครงสร้างเพื่อความยั่งยืน",
      elevation: "pt-32 sm:pt-36",
      cx: 150,
      cy: 115,
    },
    {
      year: "2567",
      value: 10,
      suffix: "%",
      plus: "+",
      target: "10%+",
      desc: "การขยายตลาดเชิงรุกในระดับภูมิภาค และการพัฒนานวัตกรรมสีเขียว",
      elevation: "pt-24 sm:pt-28",
      cx: 450,
      cy: 68,
    },
    {
      year: "2568",
      value: 15,
      suffix: "%",
      plus: "+",
      target: "15%+",
      desc: "เป้าหมายการเติบโตก้าวกระโดดสู่สากล พร้อมขับเคลื่อนเศรษฐกิจหมุนเวียน",
      elevation: "pt-14 sm:pt-16",
      cx: 750,
      cy: 25,
    },
  ];

  const philosophies = [
    {
      number: "01",
      title: "ความซื่อสัตย์",
      enTitle: "INTEGRITY & ETHICS",
      desc: "ยึดมั่นในความโปร่งใส จริยธรรม และการรักษาคำมั่นสัญญาในการดำเนินธุรกิจทุกมิติ เพื่อสร้างความไว้วางใจที่ยั่งยืนต่อคู่ค้า พันธมิตร และสังคมส่วนรวม",
    },
    {
      number: "02",
      title: "ทุกฝ่ายได้ประโยชน์",
      enTitle: "MUTUAL BENEFIT",
      desc: "สร้างคุณค่าร่วมกันในทุกความสัมพันธ์ ทั้งคู่ค้า สังคม ชุมชน และพนักงานในองค์กร มุ่งเน้นการเติบโตร่วมกันอย่างเป็นธรรม มั่นคง และเกื้อกูล",
    },
    {
      number: "03",
      title: "พัฒนาอย่างต่อเนื่อง",
      enTitle: "CONTINUOUS INNOVATION",
      desc: "เรียนรู้และเติบโตไปด้วยกันผ่านการวิจัย พัฒนานวัตกรรม และเทคโนโลยีอุตสาหกรรมที่ทันสมัย ยกระดับประสิทธิภาพการทำงานสู่มาตรฐานสากลอย่างไม่หยุดยั้ง",
    },
    {
      number: "04",
      title: "ใส่ใจคุณภาพ",
      enTitle: "UNCOMPROMISING QUALITY",
      desc: "ใส่ใจในทุกรายละเอียดและกระบวนการผลิต เพื่อส่งมอบคุณภาพที่ดีที่สุดและมาตรฐานความปลอดภัยสูงสุดแก่ผู้บริโภคและภาคอุตสาหกรรมทั่วโลก",
    },
  ];

  const trajectoryPathD = "M 150 115 C 280 110, 340 70, 450 68 C 560 66, 630 30, 750 25";
  const trajectoryAreaD = "M 150 115 C 280 110, 340 70, 450 68 C 560 66, 630 30, 750 25 L 750 160 L 150 160 Z";

  return (
    <section className="relative w-full py-12 lg:py-16 bg-[#F7F1E7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            1. SECTION HEADING: CHAROENSIN · SUSTAINABILITY
           ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <FadeUp delay={0.1} distance={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9CBAA]/50 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-4 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-[#6B5A3A]" />
              <span>CHAROENSIN · SUSTAINABILITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
              เจริญสินเพื่อความยั่งยืน
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#1F1F1F]/80 font-sarabun leading-relaxed">
              เติบโตอย่างรับผิดชอบ เพื่ออนาคตที่ยั่งยืน ร่วมสร้างคุณค่าให้กับสิ่งแวดล้อม ชุมชน และสังคมไทย
            </p>
          </FadeUp>
        </div>

        {/* ========================================================
            2. STEPPED TRAJECTORY & ARCHITECTURAL GRID (ภาพรวมการเติบโตธุรกิจ)
           ======================================================== */}
        <div className="mb-20 lg:mb-28">
          <FadeUp delay={0.15} distance={20} className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#B39B6B]/25">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#6B5A3A] font-semibold font-inter block mb-1">
                  FINANCIAL & BUSINESS RESILIENCE
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-kanit text-[#1F1F1F]">
                  ภาพรวมการเติบโตธุรกิจ ในเครือของเรา
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-[#6B5A3A] font-sarabun bg-[#D9CBAA]/30 border border-[#B39B6B]/30 px-3.5 py-1.5 rounded-full w-fit">
                <TrendingUp className="w-4 h-4 text-[#B39B6B]" />
                <span>การเติบโตอย่างมั่นคงและยั่งยืนต่อเนื่อง</span>
              </div>
            </div>
          </FadeUp>

          {/* Stepped Trajectory Architectural Container with 40px Grid */}
          <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/70 border border-[#CCA369]/30 overflow-hidden shadow-[0_4px_28px_rgba(204,163,105,0.08)]">
            {/* Architectural Grid Pattern (40px x 40px with #CCA369/25 lines) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-90"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(204, 163, 105, 0.25) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(204, 163, 105, 0.25) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 55%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 50%, black 55%, transparent 100%)",
              }}
            />

            {/* Scroll-Drawn Architectural SVG Trajectory Line with Loop Motion */}
            <div className="hidden md:block absolute inset-x-6 lg:inset-x-10 top-6 lg:top-10 h-40 lg:h-44 pointer-events-none z-10 overflow-visible">
              <svg
                ref={chartRef}
                data-map-active={chartInView ? "true" : "false"}
                viewBox="0 0 900 160"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="growthAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#CCA369" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#D9CBAA" stopOpacity="0.02" />
                  </linearGradient>

                  <filter id="goldenPulseGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Soft Golden Wash below trajectory line */}
                <motion.path
                  d={trajectoryAreaD}
                  fill="url(#growthAreaGrad)"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                />

                {/* Vertical Dashed Drop Guidelines */}
                {growthStats.map((item) => {
                  const isHovered = hoveredYear === item.year;
                  return (
                    <line
                      key={`guide-${item.year}`}
                      x1={item.cx}
                      y1={item.cy}
                      x2={item.cx}
                      y2={160}
                      stroke={isHovered ? "#CCA369" : "#B39B6B"}
                      strokeWidth={isHovered ? "1.8" : "1"}
                      strokeDasharray={isHovered ? "none" : "3 3"}
                      opacity={isHovered ? 0.95 : 0.35}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Main Golden Trajectory Line */}
                <motion.path
                  id="growthCurve"
                  d={trajectoryPathD}
                  fill="none"
                  stroke="#B39B6B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Streaming Trailing Light Pulse along path */}
                {isMounted && !shouldReduceMotion && (
                  <path
                    d={trajectoryPathD}
                    fill="none"
                    stroke="#CCA369"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="70 450"
                    className="chart-pulse-flow"
                    filter="url(#goldenPulseGlow)"
                    opacity={0.85}
                  />
                )}

                {/* Looping Light Particle traversing from 2566 to 2568 */}
                {isMounted && !shouldReduceMotion && (
                  <g>
                    <animateMotion
                      path={trajectoryPathD}
                      dur="3.2s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                    {/* Golden outer aura */}
                    <circle r="10" fill="#CCA369" opacity="0.38" filter="url(#goldenPulseGlow)" />
                    {/* Core vibrant gold bead */}
                    <circle r="5" fill="#8C6832" />
                    {/* Bright white specular center */}
                    <circle r="2.2" fill="#FFFFFF" />
                  </g>
                )}

                {/* Anchor Node 1 (2566) */}
                <circle
                  cx={150}
                  cy={115}
                  r={hoveredYear === "2566" ? 6.5 : 4.5}
                  fill={hoveredYear === "2566" ? "#8C6832" : "#B39B6B"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Anchor Node 2 (2567) - Clear above 10%+ */}
                <circle
                  cx={450}
                  cy={68}
                  r={hoveredYear === "2567" ? 6.5 : 4.5}
                  fill={hoveredYear === "2567" ? "#8C6832" : "#B39B6B"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Anchor Node 3 (2568 - Peak) with Beacon Pulse */}
                <circle
                  cx={750}
                  cy={25}
                  r={hoveredYear === "2568" ? 8 : 6}
                  fill="#8C6832"
                  stroke="#CCA369"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                {isMounted && !shouldReduceMotion && (
                  <circle
                    cx={750}
                    cy={25}
                    r={6}
                    fill="none"
                    stroke="#CCA369"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    className="map-hub-pulse"
                    style={{ animationDuration: "2.2s" }}
                  />
                )}
              </svg>
            </div>

            {/* 3 Stepped Elevation Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 relative z-20">
              {growthStats.map((item, i) => {
                const isHovered = hoveredYear === item.year;

                return (
                  <div
                    key={item.year}
                    onMouseEnter={() => setHoveredYear(item.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className={`relative flex flex-col justify-between px-6 lg:px-10 py-6 rounded-2xl transition-all duration-300 group cursor-pointer ${
                      item.elevation
                    } ${
                      isHovered
                        ? "bg-white/90 shadow-[0_12px_32px_rgba(204,163,105,0.22)] -translate-y-2 border border-[#CCA369]/60"
                        : "hover:bg-white/40 border border-transparent"
                    }`}
                  >
                    {/* Glowing vertical highlight line on hover */}
                    {isHovered && (
                      <motion.div
                        layoutId="columnGlowBeam"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#CCA369] via-[#8C6832] to-transparent shadow-[0_0_10px_#CCA369] pointer-events-none rounded-full"
                      />
                    )}

                    {/* Thin vertical hairline divider between columns */}
                    {i < 2 && (
                      <div className="hidden md:block absolute right-0 top-6 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-[#B39B6B]/30 to-transparent pointer-events-none" />
                    )}

                    {/* Year Label */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors ${
                            isHovered ? "bg-[#8C6832] scale-125" : "bg-[#B39B6B]"
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-semibold text-[#6B5A3A] font-inter uppercase tracking-wider">
                          ปี พ.ศ. {item.year}
                        </span>
                      </div>

                      {/* Large Stat Metric in Playfair Display (#6B5A3A / #8C6832 + #B39B6B) */}
                      <div className="my-2 flex items-baseline gap-1 select-none">
                        <span className="text-5xl sm:text-6xl lg:text-7xl font-bold font-playfair text-[#6B5A3A] tracking-tight group-hover:text-[#8C6832] group-hover:scale-105 transition-all origin-left duration-300">
                          <CountUp
                            to={item.value}
                            duration={2.0 + i * 0.2}
                            className="text-[#6B5A3A] group-hover:text-[#8C6832]"
                          />
                        </span>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-semibold text-[#6B5A3A] group-hover:text-[#8C6832]">
                          {item.suffix}
                        </span>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-[#B39B6B] ml-1">
                          {item.plus}
                        </span>
                      </div>
                    </div>

                    {/* Descriptor Text */}
                    <div className="mt-4 pt-3 border-t border-[#B39B6B]/20">
                      <p className="text-xs sm:text-sm text-[#1F1F1F]/75 font-sarabun leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thin Gold CI Divider between Part 1 and Part 2 */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent my-10 lg:my-12" />

        {/* ========================================================
            3. BESPOKE EDITORIAL HAIRLINE INDEX (ปรัชญาของเรา)
            Split-Screen 2 Columns (35% Left / 65% Right)
           ======================================================== */}
        <div>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* ----------------------------------------------------
                LEFT COLUMN (35%): HEADING & ARCHITECTURAL COMPASS NUMERAL
               ---------------------------------------------------- */}
            <div className="w-full lg:w-[35%] flex flex-col justify-between self-stretch">
              <FadeUp delay={0.1} distance={20}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9CBAA]/50 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-3.5 shadow-xs">
                  <Compass className="w-3.5 h-3.5 text-[#6B5A3A]" />
                  <span>OUR PHILOSOPHY</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-kanit text-[#1F1F1F] tracking-tight">
                  ปรัชญาของเรา
                </h3>
                <p className="mt-3.5 text-sm sm:text-base text-[#1F1F1F]/75 font-sarabun leading-relaxed max-w-sm">
                  รากฐานความเชื่อและแนวคิดที่ยึดถือในการดำเนินธุรกิจ ส่งต่อคุณค่าจากรุ่นสู่รุ่น เป็นเข็มทิศนำทางสร้างความมั่นคงที่ยั่งยืน
                </p>
              </FadeUp>

              {/* Centered Fine Architectural Compass Ring & Bold Numeral (01-04) */}
              <div className="flex-1 w-full my-auto py-4 sm:py-6 flex items-center justify-center relative select-none">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 flex items-center justify-center">
                  {/* Fine Architectural Ring & Degree Ticks (Rotates smoothly on activePhilIndex change) */}
                  <motion.svg
                    viewBox="0 0 240 240"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    animate={shouldReduceMotion ? {} : { rotate: activePhilIndex * 90 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <defs>
                      <filter id="ringMarkerGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Outer Fine Architectural Ring (1px) */}
                    <circle
                      cx="120"
                      cy="120"
                      r="108"
                      fill="none"
                      stroke="#CCA369"
                      strokeWidth="1"
                      strokeOpacity="0.45"
                    />

                    {/* Middle Dashed Ring */}
                    <circle
                      cx="120"
                      cy="120"
                      r="96"
                      fill="none"
                      stroke="#B39B6B"
                      strokeWidth="0.8"
                      strokeDasharray="3 4"
                      strokeOpacity="0.35"
                    />

                    {/* Inner Accent Ring */}
                    <circle
                      cx="120"
                      cy="120"
                      r="80"
                      fill="none"
                      stroke="#D9CBAA"
                      strokeWidth="0.6"
                      strokeOpacity="0.3"
                    />

                    {/* 36 Architectural Degree Ticks */}
                    {Array.from({ length: 36 }).map((_, idx) => {
                      const angle = (idx * 360) / 36;
                      const isMajor = idx % 9 === 0;
                      const isMedium = idx % 3 === 0;
                      const rInner = isMajor ? 100 : isMedium ? 103 : 105;
                      const rOuter = 108;
                      const rad = (angle * Math.PI) / 180;
                      const x1 = +(120 + rInner * Math.cos(rad)).toFixed(2);
                      const y1 = +(120 + rInner * Math.sin(rad)).toFixed(2);
                      const x2 = +(120 + rOuter * Math.cos(rad)).toFixed(2);
                      const y2 = +(120 + rOuter * Math.sin(rad)).toFixed(2);
                      return (
                        <line
                          key={idx}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isMajor ? "#8C6832" : "#B39B6B"}
                          strokeWidth={isMajor ? "1.5" : "0.75"}
                          strokeOpacity={isMajor ? "0.8" : "0.35"}
                        />
                      );
                    })}

                    {/* 4 Orbital Coordinate Gold Markers */}
                    <circle cx="120" cy="12" r="3.5" fill="#8C6832" filter="url(#ringMarkerGlow)" />
                    <circle cx="228" cy="120" r="2.5" fill="#B39B6B" opacity="0.75" />
                    <circle cx="120" cy="228" r="2.5" fill="#B39B6B" opacity="0.75" />
                    <circle cx="12" cy="120" r="2.5" fill="#B39B6B" opacity="0.75" />

                    {/* Crosshair Cardinal Ticks */}
                    <line x1="120" y1="28" x2="120" y2="40" stroke="#8C6832" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="120" y1="200" x2="120" y2="212" stroke="#8C6832" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="28" y1="120" x2="40" y2="120" stroke="#8C6832" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="200" y1="120" x2="212" y2="120" stroke="#8C6832" strokeWidth="1" strokeOpacity="0.5" />
                  </motion.svg>

                  {/* Bold Numeral (01 - 04) in Deep Gold (#8C6832 / #6B5A3A 85%) */}
                  <div className="relative z-10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={philosophies[activePhilIndex].number}
                        initial={shouldReduceMotion ? { opacity: 0.85 } : { opacity: 0, scale: 0.85, y: 8 }}
                        animate={{ opacity: 0.85, scale: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1, y: -8 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="font-playfair font-bold text-7xl sm:text-8xl lg:text-9xl leading-none text-[#8C6832] select-none tracking-tighter"
                      >
                        {philosophies[activePhilIndex].number}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                RIGHT COLUMN (65%): BESPOKE EDITORIAL HAIRLINE INDEX
               ---------------------------------------------------- */}
            <div className="w-full lg:w-[65%] flex flex-col">
              <FadeUp delay={0.2} distance={24}>
                <div className="flex flex-col">
                  {philosophies.map((phil, i) => {
                    const isActive = i === activePhilIndex;

                    return (
                      <div key={phil.number} className="w-full">
                        {/* Animated Hairline Divider */}
                        <div className="relative w-full h-[1px] bg-[#B39B6B]/30 overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ scaleX: isActive ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 origin-left bg-[#6B5A3A]"
                          />
                        </div>

                        {/* Interactive Item Row */}
                        <div
                          onClick={() => setActivePhilIndex(i)}
                          onMouseEnter={() => setActivePhilIndex(i)}
                          className="group cursor-pointer select-none py-5 sm:py-6 transition-colors"
                        >
                          <motion.div
                            animate={{ x: isActive ? 10 : 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                              {/* Number in Playfair Display */}
                              <span
                                className={`font-playfair text-xl sm:text-2xl font-bold transition-colors w-8 shrink-0 ${
                                  isActive ? "text-[#6B5A3A]" : "text-[#B39B6B]/70 group-hover:text-[#6B5A3A]"
                                }`}
                              >
                                {phil.number}
                              </span>

                              {/* Titles */}
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 truncate">
                                <h4
                                  className={`text-xl sm:text-2xl lg:text-3xl font-semibold font-kanit transition-colors truncate ${
                                    isActive ? "text-[#1F1F1F]" : "text-[#1F1F1F]/70 group-hover:text-[#6B5A3A]"
                                  }`}
                                >
                                  {phil.title}
                                </h4>
                                <span className="text-[11px] font-inter font-medium tracking-widest uppercase text-[#6B5A3A]/70 hidden sm:inline">
                                  {phil.enTitle}
                                </span>
                              </div>
                            </div>

                            {/* Interactive Plus/Close Indicator */}
                            <div
                              className={`w-8 h-8 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 ${
                                isActive
                                  ? "bg-[#6B5A3A] border-[#6B5A3A] text-white rotate-45 shadow-sm"
                                  : "border-[#B39B6B]/40 text-[#6B5A3A] group-hover:border-[#6B5A3A] group-hover:bg-[#D9CBAA]/30"
                              }`}
                            >
                              <Plus className="w-4 h-4 transition-transform duration-300" />
                            </div>
                          </motion.div>

                          {/* Unfolding Description Container (AnimatePresence) */}
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div
                                key="desc"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pl-12 sm:pl-14 pt-3 pb-2">
                                  <p className="text-sm sm:text-base text-[#1F1F1F]/80 font-sarabun leading-relaxed max-w-2xl">
                                    {phil.desc}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Closing Hairline for the last item */}
                        {i === philosophies.length - 1 && (
                          <div className="w-full h-[1px] bg-[#B39B6B]/30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}