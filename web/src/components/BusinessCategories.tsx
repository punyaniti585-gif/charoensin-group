"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { businessCategories } from "@/data/asset-map";
import { FadeUp } from "@/components/ui/MotionWrapper";
import { ArrowUpRight, Building2, ChevronRight, Layers } from "lucide-react";

const csgEase = [0.16, 1, 0.3, 1] as const;

export default function BusinessCategories() {
  const [activeCard, setActiveCard] = useState<number>(0);

  return (
    <section id="businesses" className="relative w-full py-12 lg:py-16 bg-[#F7F1E7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 lg:mb-10">
          <FadeUp delay={0.1} distance={20}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B39B6B]/15 border border-[#B39B6B]/30 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-4">
              <Layers className="w-3.5 h-3.5 text-[#B39B6B]" />
              <span>ABOUT CHAROENSIN GROUP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F] font-kanit tracking-tight">
              เกี่ยวกับกลุ่มเจริญสิน
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#1F1F1F]/80 font-sarabun leading-relaxed">
              กลุ่มบริษัทเจริญสินเป็นหนึ่งในกลุ่มบริษัทข้ามอุตสาหกรรม (conglomerate) ชั้นนำของประเทศไทย
              ที่ดำเนินธุรกิจมาอย่างมั่นคงและยั่งยืนยาวนานกว่า 90 ปี นับตั้งแต่ก่อตั้งในปี พ.ศ. 2475
              โดยมีจุดเริ่มต้นจากธุรกิจการค้าในรูปแบบครอบครัว ด้วยรากฐานที่แข็งแกร่งและวิสัยทัศน์แห่งการพัฒนาอย่างต่อเนื่อง
              วันนี้กลุ่มเจริญสินได้เติบโตและขยายธุรกิจครอบคลุม 5 เสาหลักอุตสาหกรรม
            </p>
          </FadeUp>
        </div>

        {/* Interactive Expandable Cards (Desktop Horizontal Flex / Mobile Vertical) */}
        <FadeUp delay={0.3} distance={28}>
          <div className="hidden lg:flex gap-4 h-[540px] w-full">
            {businessCategories.map((cat, index) => {
              const isExpanded = activeCard === index;

              return (
                <motion.div
                  key={cat.key}
                  onMouseEnter={() => setActiveCard(index)}
                  onClick={() => setActiveCard(index)}
                  layout
                  transition={{ duration: 0.6, ease: csgEase }}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                    isExpanded
                      ? "flex-[3.2] border-[#B39B6B] shadow-2xl"
                      : "flex-[1] border-[#B39B6B]/30 hover:border-[#B39B6B]/60 shadow-md bg-[#D9CBAA]/30"
                  }`}
                >
                  {/* Background Image with Dark Vignette */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={cat.image}
                      alt={cat.titleTh}
                      fill
                      sizes="(max-width: 1280px) 400px, 600px"
                      className={`object-cover object-center transition-transform duration-700 ${
                        isExpanded ? "scale-105" : "scale-100 filter brightness-75"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isExpanded
                          ? "bg-gradient-to-t from-[#1F1F1F]/90 via-[#1F1F1F]/50 to-black/20"
                          : "bg-gradient-to-t from-[#1F1F1F]/90 via-[#1F1F1F]/60 to-black/40"
                      }`}
                    />
                  </div>

                  {/* Card Content Overlay */}
                  <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between text-white">
                    {/* Top: Large Playfair Number & Category Subtitle */}
                    <div className="flex items-start justify-between">
                      <span className="font-playfair text-5xl sm:text-6xl font-bold text-[#B39B6B] drop-shadow-md">
                        {cat.number}
                      </span>

                      {/* Small Status Badge replacing English placeholder */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-sarabun bg-black/50 backdrop-blur-md text-[#D9CBAA] border border-[#B39B6B]/40">
                        [รอคำอธิบายธุรกิจ]
                      </span>
                    </div>

                    {/* Bottom: Titles, Description & Companies */}
                    <div className="mt-auto">
                      <span className="text-xs uppercase tracking-widest text-[#D9CBAA] font-inter font-medium block mb-1">
                        {cat.titleEn}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-kanit text-white mb-2 leading-snug">
                        {cat.titleTh}
                      </h3>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.15, ease: csgEase }}
                          className="mt-3 pt-3 border-t border-white/20"
                        >
                          <p className="text-xs sm:text-sm text-[#F2EFE9]/90 font-sarabun mb-4 leading-relaxed">
                            {cat.description}
                          </p>

                          {/* Member Companies */}
                          <div className="mb-4">
                            <span className="text-[11px] text-[#D9CBAA] font-semibold block mb-2 uppercase tracking-wider">
                              บริษัทในเครือ:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {cat.companies.map((c) => (
                                <div
                                  key={c.id}
                                  className="flex items-center gap-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10"
                                >
                                  <div className="relative w-6 h-6 rounded bg-white overflow-hidden shrink-0">
                                    <Image
                                      src={c.logo}
                                      alt={c.nameTh}
                                      fill
                                      className="object-contain p-0.5"
                                    />
                                  </div>
                                  <span className="text-xs text-white/90 line-clamp-1">
                                    {c.shortName || c.nameTh}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Link
                            href="https://csgok.sfinsulations.com/charoensin-our-business-v3/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#B39B6B] hover:text-white transition-colors group/btn"
                          >
                            <span>สำรวจธุรกิจกลุ่มนี้</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Vertical View */}
          <div className="grid grid-cols-1 gap-6 lg:hidden">
            {businessCategories.map((cat, index) => (
              <div
                key={cat.key}
                onClick={() => setActiveCard(activeCard === index ? -1 : index)}
                className="relative rounded-2xl overflow-hidden border border-[#B39B6B]/40 shadow-lg cursor-pointer bg-[#D9CBAA]/20"
              >
                {/* Background Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={cat.image}
                    alt={cat.titleTh}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#1F1F1F]/60 to-black/30" />

                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-playfair text-4xl font-bold text-[#B39B6B]">
                        {cat.number}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sarabun bg-black/60 text-[#D9CBAA] border border-[#B39B6B]/30">
                        [รอคำอธิบายธุรกิจ]
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#D9CBAA] font-inter">
                        {cat.titleEn}
                      </span>
                      <h3 className="text-lg font-bold font-kanit text-white">
                        {cat.titleTh}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Mobile Expand Content */}
                {activeCard === index && (
                  <div className="p-5 bg-[#1F1F1F] text-white border-t border-[#B39B6B]/30">
                    <p className="text-xs text-[#F2EFE9]/90 font-sarabun mb-3 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {cat.companies.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 text-xs text-white/80 py-1"
                        >
                          <div className="relative w-5 h-5 rounded bg-white overflow-hidden shrink-0">
                            <Image
                              src={c.logo}
                              alt={c.nameTh}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                          <span>{c.nameTh}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="https://csgok.sfinsulations.com/charoensin-our-business-v3/"
                      className="inline-flex items-center gap-1.5 text-xs text-[#B39B6B] font-medium"
                    >
                      <span>ดูรายละเอียดกลุ่มธุรกิจ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
