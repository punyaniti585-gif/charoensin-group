"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  ChevronDown,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  brandAssets,
  businessCategories,
  navigationMenu,
} from "@/data/asset-map";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#F2EFE9]/90 backdrop-blur-md shadow-sm border-b border-[#B39B6B]/25 py-2"
          : "bg-white/25 backdrop-blur-md border-b border-white/25 py-2 sm:py-2.5"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Slim and Elegant (h-8 to h-10 on Desktop) */}
          <Link
            href="/"
            className="flex items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#B39B6B]/50 rounded-xl p-1 -ml-1 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative h-8 sm:h-9 md:h-10 w-auto aspect-[1490/351]">
              <Image
                src={brandAssets.logos.primary}
                alt="กลุ่มบริษัทเจริญสิน (Charoensin Group)"
                fill
                sizes="(max-width: 640px) 130px, (max-width: 1024px) 150px, 170px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - Single-line whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-5 shrink-0">
            {navigationMenu
              .filter((item) => item.id !== "07") // ลบเมนู 'ติดต่อเรา' ซ้ำออก เหลือเฉพาะปุ่ม CTA ด้านขวา
              .map((item) => {
              const isHovered = activeMega === item.id;

              if (item.isMega && item.megaType === "business") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveMega(item.id)}
                    onMouseLeave={() => setActiveMega(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                        isHovered
                          ? "text-[#6B5A3A] bg-[#B39B6B]/10"
                          : "text-[#1F1F1F] hover:text-[#6B5A3A] hover:bg-black/[0.03]"
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-[#B39B6B]" : "text-[#1F1F1F]/60"
                        }`}
                      />
                    </Link>

                    {/* Mega Menu for Businesses */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: easeCurve }}
                          className="fixed left-0 right-0 top-full mt-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto"
                        >
                          <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#B39B6B]/30 p-6 md:p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F2EFE9]">
                              <div>
                                <span className="text-xs uppercase tracking-widest text-[#6B5A3A] font-semibold font-inter">
                                  Charoensin Group Businesses
                                </span>
                                <h3 className="text-xl font-semibold text-[#1F1F1F] font-kanit">
                                  5 เสาหลักกลุ่มธุรกิจเจริญสิน
                                </h3>
                              </div>
                              <Link
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B5A3A] hover:text-[#B39B6B] transition-colors"
                              >
                                <span>ดูภาพรวมทุกธุรกิจ</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-5 gap-6">
                              {businessCategories.map((cat) => (
                                <div
                                  key={cat.key}
                                  className="group/cat flex flex-col p-3 rounded-xl transition-all duration-200 hover:bg-[#F2EFE9]/50"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#B39B6B]/20 text-[#6B5A3A] text-xs font-bold flex items-center justify-center">
                                      {cat.number}
                                    </span>
                                    <h4 className="text-sm font-semibold text-[#1F1F1F] font-kanit group-hover/cat:text-[#6B5A3A] transition-colors">
                                      {cat.titleTh.replace(/^[0-9]\./, "")}
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-[#1F1F1F]/70 mb-3 line-clamp-2 leading-relaxed">
                                    {cat.description}
                                  </p>

                                  <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-[#F2EFE9]">
                                    {cat.companies.map((company) => (
                                      <div
                                        key={company.id}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white transition-shadow group/item"
                                      >
                                        <div className="relative w-7 h-7 rounded border border-gray-200 bg-white overflow-hidden shrink-0">
                                          <Image
                                            src={company.logo}
                                            alt={company.nameTh}
                                            fill
                                            className="object-contain p-0.5"
                                          />
                                        </div>
                                        <span className="text-xs text-[#1F1F1F]/85 line-clamp-1 group-hover/item:text-[#6B5A3A] transition-colors">
                                          {company.shortName || company.nameTh}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (item.isMega && item.megaType === "governance") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveMega(item.id)}
                    onMouseLeave={() => setActiveMega(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                        isHovered
                          ? "text-[#6B5A3A] bg-[#B39B6B]/10"
                          : "text-[#1F1F1F] hover:text-[#6B5A3A] hover:bg-black/[0.03]"
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-[#B39B6B]" : "text-[#1F1F1F]/60"
                        }`}
                      />
                    </Link>

                    {/* Mega Menu for Governance */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: easeCurve }}
                          className="fixed left-0 right-0 top-full mt-1 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pointer-events-auto"
                        >
                          <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#B39B6B]/30 p-6 md:p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F2EFE9]">
                              <div>
                                <span className="text-xs uppercase tracking-widest text-[#6B5A3A] font-semibold font-inter">
                                  Corporate Governance & Transparency
                                </span>
                                <h3 className="text-xl font-semibold text-[#1F1F1F] font-kanit">
                                  รายงานกำกับดูแลและนโยบายองค์กร
                                </h3>
                              </div>
                              <span className="text-xs text-[#1F1F1F]/60">
                                ดำเนินงานด้วยความซื่อสัตย์ โปร่งใส มีธรรมาภิบาล
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                              {item.governanceCategories?.map((gov) => (
                                <div key={gov.title} className="flex flex-col">
                                  <h4 className="text-sm font-semibold text-[#6B5A3A] font-kanit mb-3 pb-2 border-b border-[#B39B6B]/20">
                                    {gov.title}
                                  </h4>
                                  <ul className="space-y-2">
                                    {gov.items.map((sub) => (
                                      <li key={sub.label}>
                                        <Link
                                          href={sub.href}
                                          className="text-xs text-[#1F1F1F]/80 hover:text-[#6B5A3A] hover:translate-x-1 transition-all flex items-center justify-between group/link py-1"
                                        >
                                          <span className="line-clamp-1">{sub.label}</span>
                                          <ChevronRight className="w-3 h-3 text-[#B39B6B] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (item.children && item.children.length > 0) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveMega(item.id)}
                    onMouseLeave={() => setActiveMega(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                        isHovered
                          ? "text-[#6B5A3A] bg-[#B39B6B]/10"
                          : "text-[#1F1F1F] hover:text-[#6B5A3A] hover:bg-black/[0.03]"
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-[#B39B6B]" : "text-[#1F1F1F]/60"
                        }`}
                      />
                    </Link>

                    {/* Standard Dropdown */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: easeCurve }}
                          className="absolute left-0 top-full mt-1 w-56 rounded-xl bg-white shadow-xl border border-[#B39B6B]/25 py-2 z-50 overflow-hidden"
                        >
                          {item.children.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2.5 text-xs text-[#1F1F1F]/85 hover:bg-[#F2EFE9] hover:text-[#6B5A3A] transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-2.5 py-1.5 text-sm font-medium text-[#1F1F1F] hover:text-[#6B5A3A] hover:bg-black/[0.03] transition-colors rounded-md whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Contact Button */}
          <div className="hidden lg:flex items-center shrink-0 ml-2 xl:ml-4">
            <Link
              href="https://csgok.sfinsulations.com/contact-us-2026-greenshift/"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full bg-[#6B5A3A] hover:bg-[#B39B6B] text-white text-xs sm:text-sm font-semibold font-kanit transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">ติดต่อเรา</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-[#1F1F1F] hover:bg-[#B39B6B]/15 transition-colors focus:outline-none"
            >
              {mobileOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easeCurve }}
            className="lg:hidden bg-[#F2EFE9] border-b border-[#B39B6B]/30 px-4 pt-3 pb-8 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-1">
              {navigationMenu.map((item) => {
                const isExpanded = !!mobileExpanded[item.id];

                if (item.isMega && item.megaType === "business") {
                  return (
                    <div key={item.id} className="border-b border-[#B39B6B]/15 pb-2">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(item.id)}
                        className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1F1F1F] font-kanit"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#B39B6B] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 mt-2 space-y-4">
                          {businessCategories.map((cat) => (
                            <div key={cat.key} className="space-y-1.5">
                              <span className="text-xs font-bold text-[#6B5A3A] flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-[#B39B6B]/20 text-[10px] flex items-center justify-center">
                                  {cat.number}
                                </span>
                                {cat.titleTh}
                              </span>
                              <div className="grid grid-cols-1 gap-1.5 pl-5">
                                {cat.companies.map((c) => (
                                  <div
                                    key={c.id}
                                    className="flex items-center gap-2 text-xs text-[#1F1F1F]/80 py-0.5"
                                  >
                                    <div className="relative w-5 h-5 shrink-0 rounded bg-white border border-gray-200 overflow-hidden">
                                      <Image
                                        src={c.logo}
                                        alt={c.nameTh}
                                        fill
                                        className="object-contain p-0.5"
                                      />
                                    </div>
                                    <span className="line-clamp-1">{c.shortName || c.nameTh}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.isMega && item.megaType === "governance") {
                  return (
                    <div key={item.id} className="border-b border-[#B39B6B]/15 pb-2">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(item.id)}
                        className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1F1F1F] font-kanit"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#B39B6B] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 mt-2 space-y-3">
                          {item.governanceCategories?.map((g) => (
                            <div key={g.title} className="space-y-1">
                              <span className="text-xs font-semibold text-[#6B5A3A] block">
                                {g.title}
                              </span>
                              <div className="space-y-1 pl-2">
                                {g.items.map((sub) => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-xs text-[#1F1F1F]/80 py-0.5 hover:text-[#6B5A3A]"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.children && item.children.length > 0) {
                  return (
                    <div key={item.id} className="border-b border-[#B39B6B]/15 pb-2">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(item.id)}
                        className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1F1F1F] font-kanit"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#B39B6B] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.children.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1 text-xs text-[#1F1F1F]/80 hover:text-[#6B5A3A]"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-base font-semibold text-[#1F1F1F] font-kanit border-b border-[#B39B6B]/15 hover:text-[#6B5A3A]"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
