"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  leadershipData,
  LeaderPerson,
  AdvisoryPerson,
} from "@/data/about-data";
import { csgEase } from "@/components/ui/MotionWrapper";
import {
  Users,
  Crown,
  ShieldAlert,
  Sparkles,
  X,
  Award,
} from "lucide-react";

export default function LeadershipTeam() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"board" | "advisors">("board");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<
    ((LeaderPerson | AdvisoryPerson) & { categoryTag?: string }) | null
  >(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut (ESC) to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPerson(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedPerson) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPerson]);

  const {
    groupChairman,
    viceChairmen,
    executiveDirectors,
    advisors,
    advisorsDescription,
  } = leadershipData;

  const isAnyHovered = hoveredId !== null;

  return (
    <section
      id="leadership"
      className="relative w-full py-12 md:py-16 bg-gradient-to-b from-[#FCFBF9] via-white to-[#FCFBF9] overflow-hidden scroll-mt-28"
    >
      {/* Decorative Gold Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[650px] h-[650px] bg-radial from-[#CCA369]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Clean Title without tag badge) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: csgEase }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit text-[#1F1F1F] tracking-tight">
            {leadershipData.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-sarabun text-[#6B5A3A] max-w-xl mx-auto">
            คณะผู้นำองค์กรและคณะที่ปรึกษาผู้ทรงคุณวุฒิ ผู้ขับเคลื่อนกลุ่มบริษัทเจริญสินด้วยวิสัยทัศน์ที่ก้าวไกลและธรรมาภิบาลระดับสากล
          </p>

          {/* Luxury Tab Switcher */}
          <div className="mt-6 inline-flex p-1.5 rounded-full bg-white/90 border border-[#CCA369]/35 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("board");
                setHoveredId(null);
              }}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-kanit font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "board"
                  ? "bg-[#6B5A3A] text-white shadow-xs"
                  : "text-[#1F1F1F]/80 hover:text-[#6B5A3A]"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>คณะกรรมการบริษัท ({1 + viceChairmen.length + executiveDirectors.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("advisors");
                setHoveredId(null);
              }}
              className={`flex items-center gap-2 px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-kanit font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "advisors"
                  ? "bg-[#6B5A3A] text-white shadow-xs"
                  : "text-[#1F1F1F]/80 hover:text-[#6B5A3A]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>คณะที่ปรึกษา ({advisors.length})</span>
            </button>
          </div>
        </motion.div>

        {/* ====================================================
            TAB 1: BOARD OF DIRECTORS (คณะกรรมการบริษัท)
           ==================================================== */}
        {activeTab === "board" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: csgEase }}
            className="space-y-8 sm:space-y-12"
          >
            {/* 1. Group Chairman Feature Card (Centerpiece) */}
            <div className="flex justify-center">
              {(() => {
                const id = "board-chairman";
                const isHovered = hoveredId === id;
                const cardScale = shouldReduceMotion ? 1 : isHovered ? 1.04 : 1;
                const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.45) : 1;

                return (
                  <motion.div
                    animate={{
                      scale: cardScale,
                      opacity: cardOpacity,
                    }}
                    transition={{ duration: 0.28, ease: csgEase }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() =>
                      setSelectedPerson({
                        ...groupChairman,
                        categoryTag: "GROUP CHAIRMAN",
                      })
                    }
                    className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md text-center flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isHovered
                        ? "border-2 border-[#CCA369] shadow-[0_20px_50px_rgba(107,90,58,0.22)] z-20 ring-4 ring-[#CCA369]/20"
                        : "border-2 border-[#CCA369]/40 shadow-[0_12px_40px_rgba(107,90,58,0.1)] z-1"
                    }`}
                  >
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-md bg-[#F7F1E7] mb-5">
                      {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                          the circle and is clipped flush along its bottom curve; ~7% headroom */}
                      <Image
                        src={groupChairman.image}
                        alt={groupChairman.name}
                        fill
                        sizes="(max-width: 640px) 144px, 176px"
                        className={`object-cover object-top origin-top translate-y-[6%] transition-transform duration-500 ${
                          isHovered ? "scale-[1.18]" : "scale-[1.15]"
                        }`}
                      />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#CCA369]/40 text-[#6B5A3A] text-[11px] font-semibold tracking-wider font-kanit mb-2">
                      <Crown className="w-3 h-3 text-[#CCA369]" />
                      <span>GROUP CHAIRMAN</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-kanit text-[#1F1F1F]">
                      {groupChairman.name}
                    </h3>
                    <span className="text-xs sm:text-sm font-kanit font-medium text-[#6B5A3A] mt-1">
                      {groupChairman.role}
                    </span>
                    <span className="text-[11px] font-kanit text-[#9A7B3E] mt-3 opacity-75 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#CCA369]" />
                      คลิกเพื่อดูประวัติ
                    </span>
                  </motion.div>
                );
              })()}
            </div>

            {/* 2. Vice Chairmen Row (3 Members) */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#CCA369]/25">
                <h4 className="text-lg sm:text-xl font-bold font-kanit text-[#1F1F1F] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#CCA369]" />
                  <span>รองประธานและผู้บริหารระดับสูง</span>
                </h4>
                <span className="text-xs font-mono text-[#6B5A3A]">VICE CHAIRMEN & CEO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {viceChairmen.map((person: LeaderPerson, idx: number) => {
                  const id = `board-vc-${idx}`;
                  const isHovered = hoveredId === id;
                  const cardScale = shouldReduceMotion ? 1 : isHovered ? 1.04 : 1;
                  const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.45) : 1;

                  return (
                    <motion.div
                      key={person.name}
                      animate={{
                        scale: cardScale,
                        opacity: cardOpacity,
                      }}
                      transition={{ duration: 0.28, ease: csgEase }}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() =>
                        setSelectedPerson({
                          ...person,
                          categoryTag: "VICE CHAIRMAN & CEO",
                        })
                      }
                      className={`p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md text-center flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        isHovered
                          ? "border-2 border-[#CCA369] shadow-[0_18px_45px_rgba(107,90,58,0.2)] z-20 ring-4 ring-[#CCA369]/20"
                          : "border border-[#CCA369]/35 shadow-xs z-1"
                      }`}
                    >
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-sm bg-[#F7F1E7] mb-4">
                        {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                            the circle and is clipped flush along its bottom curve; ~7% headroom */}
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          sizes="128px"
                          className={`object-cover object-top origin-top translate-y-[6%] transition-transform duration-500 ${
                            isHovered ? "scale-[1.18]" : "scale-[1.15]"
                          }`}
                        />
                      </div>
                      <h5 className="text-base sm:text-lg font-bold font-kanit text-[#1F1F1F]">
                        {person.name}
                      </h5>
                      <span className="text-xs font-kanit font-medium text-[#6B5A3A] mt-1">
                        {person.role}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 3. Executive Directors Grid (7 Members) */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#CCA369]/25">
                <h4 className="text-lg sm:text-xl font-bold font-kanit text-[#1F1F1F] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#CCA369]" />
                  <span>คณะกรรมการบริหาร (Executive Directors)</span>
                </h4>
                <span className="text-xs font-mono text-[#6B5A3A]">7 DIRECTORS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative">
                {executiveDirectors.map((person: LeaderPerson, idx: number) => {
                  const id = `board-ed-${idx}`;
                  const isHovered = hoveredId === id;
                  const cardScale = shouldReduceMotion ? 1 : isHovered ? 1.04 : 1;
                  const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.45) : 1;

                  return (
                    <motion.div
                      key={person.name}
                      animate={{
                        scale: cardScale,
                        opacity: cardOpacity,
                      }}
                      transition={{ duration: 0.28, ease: csgEase }}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() =>
                        setSelectedPerson({
                          ...person,
                          categoryTag: "EXECUTIVE DIRECTOR",
                        })
                      }
                      className={`p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md text-center flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        isHovered
                          ? "border-2 border-[#CCA369] shadow-[0_16px_40px_rgba(107,90,58,0.18)] z-20 ring-4 ring-[#CCA369]/20"
                          : "border border-[#CCA369]/30 shadow-2xs z-1"
                      }`}
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xs bg-[#F7F1E7] mb-3">
                        {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                            the circle and is clipped flush along its bottom curve; ~7% headroom */}
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          sizes="96px"
                          className={`object-cover object-top origin-top translate-y-[6%] transition-transform duration-500 ${
                            isHovered ? "scale-[1.18]" : "scale-[1.15]"
                          }`}
                        />
                      </div>
                      <h6 className="text-xs sm:text-sm font-bold font-kanit text-[#1F1F1F] line-clamp-1">
                        {person.name}
                      </h6>
                      <span className="text-[11px] font-kanit text-[#6B5A3A] mt-0.5">
                        {person.role}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ====================================================
            TAB 2: ADVISORY BOARD (คณะที่ปรึกษา 6 ท่าน)
           ==================================================== */}
        {activeTab === "advisors" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: csgEase }}
            className="space-y-8"
          >
            {/* Description Banner */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#CCA369]/40 shadow-xs max-w-4xl mx-auto text-center">
              <span className="text-xs uppercase font-inter font-bold text-[#9A7B3E] tracking-widest block mb-1">
                DISTINGUISHED ADVISORS
              </span>
              <p className="text-xs sm:text-sm md:text-base font-sarabun text-[#1F1F1F]/85 leading-relaxed">
                {advisorsDescription}
              </p>
            </div>

            {/* 6 Advisors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 relative">
              {advisors.map((person: AdvisoryPerson, idx: number) => {
                const id = `advisor-${idx}`;
                const isHovered = hoveredId === id;
                const cardScale = shouldReduceMotion ? 1 : isHovered ? 1.04 : 1;
                const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.45) : 1;

                return (
                  <motion.div
                    key={person.name}
                    animate={{
                      scale: cardScale,
                      opacity: cardOpacity,
                    }}
                    transition={{ duration: 0.28, ease: csgEase }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() =>
                      setSelectedPerson({
                        ...person,
                        categoryTag: "DISTINGUISHED ADVISOR",
                      })
                    }
                    className={`p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md text-center flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isHovered
                        ? "border-2 border-[#CCA369] shadow-[0_16px_40px_rgba(107,90,58,0.18)] z-20 ring-4 ring-[#CCA369]/20"
                        : "border border-[#CCA369]/35 shadow-2xs z-1"
                    }`}
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xs bg-[#F7F1E7] mb-3">
                      {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                          the circle and is clipped flush along its bottom curve; ~7% headroom */}
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="96px"
                        className={`object-cover object-top origin-top translate-y-[6%] transition-transform duration-500 ${
                          isHovered ? "scale-[1.18]" : "scale-[1.15]"
                        }`}
                      />
                    </div>
                    <h6 className="text-xs sm:text-sm font-bold font-kanit text-[#1F1F1F] line-clamp-2 min-h-[32px] flex items-center justify-center">
                      {person.name}
                    </h6>
                    <span className="text-[11px] font-kanit text-[#6B5A3A] mt-1">
                      {person.role}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ========================================================
          CENTER FOCUS EXPAND MODAL (เมื่อคลิกที่การ์ด)
         ======================================================== */}
      <AnimatePresence>
        {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop: Dark Transparent & Blurred Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedPerson(null)}
              className="fixed inset-0 bg-[#1F1F1F]/45 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Focus Card */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.88, y: 20 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, y: 16 }
              }
              transition={{ duration: 0.35, ease: csgEase }}
              className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#FAF7F2] via-white to-[#F7F1E7] border-2 border-[#CCA369]/70 shadow-[0_24px_60px_rgba(0,0,0,0.3)] p-6 sm:p-8 z-10 overflow-hidden"
            >
              {/* Top Accent Gold Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#CCA369] via-[#E6C786] to-[#9A7B3E]" />

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={() => setSelectedPerson(null)}
                aria-label="ปิดหน้าต่าง"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-[#6B5A3A] text-[#6B5A3A] hover:text-white border border-[#CCA369]/40 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col items-center text-center pt-2">
                {/* Person Portrait with Luxury Gold Halo */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-xl bg-[#F7F1E7] mb-5 ring-4 ring-[#CCA369]/30">
                  {/* Portrait scaled 1.15 from the top + nudged down 6%: the suit runs past
                      the circle and is clipped flush along its bottom curve; ~7% headroom */}
                  <Image
                    src={selectedPerson.image}
                    alt={selectedPerson.name}
                    fill
                    sizes="176px"
                    className="object-cover object-top origin-top scale-[1.15] translate-y-[6%]"
                  />
                </div>

                {/* Category Pill Tag */}
                {selectedPerson.categoryTag && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#CCA369]/50 text-[#6B5A3A] text-xs font-semibold tracking-wider font-kanit mb-3 shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-[#CCA369]" />
                    <span>{selectedPerson.categoryTag}</span>
                  </div>
                )}

                {/* Person Name */}
                <h3 className="text-2xl sm:text-3xl font-bold font-kanit text-[#1F1F1F]">
                  {selectedPerson.name}
                </h3>

                {/* Person Role */}
                <span className="text-sm sm:text-base font-kanit font-medium text-[#6B5A3A] mt-1">
                  {selectedPerson.role}
                </span>

                {/* Thin CI Divider */}
                <div className="w-16 h-1 bg-[#CCA369] rounded-full my-4" />

                {/* Bio / Description */}
                <p className="text-sm sm:text-base font-sarabun text-[#1F1F1F]/85 leading-relaxed max-w-md">
                  {"bio" in selectedPerson && selectedPerson.bio
                    ? selectedPerson.bio
                    : "desc" in selectedPerson && selectedPerson.desc
                    ? selectedPerson.desc
                    : "กรรมการและผู้บริหารระดับสูงกลุ่มบริษัทเจริญสิน ร่วมขับเคลื่อนและกำกับดูแลองค์กรด้วยความซื่อสัตย์ โปร่งใส และธรรมาภิบาลเพื่อการเติบโตอย่างยั่งยืน"}
                </p>

                {/* Corporate Footer Stamp */}
                <div className="mt-6 pt-4 border-t border-[#CCA369]/25 w-full flex items-center justify-center gap-2 text-[11px] font-mono text-[#9A7B3E] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCA369]" />
                  <span>CHAROENSIN GROUP LEADERSHIP</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
