"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useMenuT } from "@/i18n";
import { companyHref } from "@/data/businesses-data";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/** Menu ids moved out of the main bar into the top utility bar */
const CAREERS_ID = "06";
const CONTACT_ID = "07";
const careersItem = navigationMenu.find((i) => i.id === CAREERS_ID);
const contactItem = navigationMenu.find((i) => i.id === CONTACT_ID);
const mainMenu = navigationMenu.filter((i) => i.id !== CAREERS_ID && i.id !== CONTACT_ID);

export default function Navbar() {
  const tm = useMenuT();
  /** Top utility bar folded away (past the first section) */
  const [collapsed, setCollapsed] = useState(false);
  const [topBarH, setTopBarH] = useState(0);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [careersOpen, setCareersOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const topBarRef = useRef<HTMLDivElement>(null);
  const mainBarRef = useRef<HTMLDivElement>(null);

  // Top bar height (0 below lg, where it is hidden) — the header slides up by
  // exactly this much when collapsed, so only the main bar stays pinned.
  useEffect(() => {
    const el = topBarRef.current;
    if (!el) return;
    const measure = () => setTopBarH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Collapse once the page's 2nd section reaches the main bar (works on every
  // page and inside the home page's sticky stack); fallback: 85% of a screen.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const second = document.querySelector("main")?.children[1] as HTMLElement | undefined;
      const barBottom = mainBarRef.current?.offsetHeight ?? 64;
      const next = second
        ? second.getBoundingClientRect().top <= barBottom
        : window.scrollY > window.innerHeight * 0.85;
      setCollapsed(next);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Home page only: keep the header out of the Hero's first act (cinematic
  // full-screen opening) and slide it in once the visitor scrolls into Act 2.
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [homeHidden, setHomeHidden] = useState(isHome);
  useEffect(() => {
    if (!isHome) {
      setHomeHidden(false);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      setHomeHidden(window.scrollY <= window.innerHeight * 0.45);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // Close the top-bar dropdown when the bar folds away
  useEffect(() => {
    if (collapsed) setCareersOpen(false);
  }, [collapsed]);

  const toggleMobileSubmenu = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header
      // Collapse = slide the whole header up by the top bar's height (transform
      // only — the header keeps its place in the flow, so the page never jumps).
      // The transform + backdrop-filter also make the header the containing
      // block for the `fixed` mega menus, so they always open right under it.
      // Home page: hidden during the Hero's Act 1, slides in for Act 2.
      style={{
        transform: homeHidden
          ? "translate3d(0, -100%, 0)"
          : `translate3d(0, ${collapsed ? -topBarH : 0}px, 0)`,
      }}
      inert={homeHidden}
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-[transform,opacity,background-color,box-shadow,border-color] duration-500 ease-out ${
        homeHidden ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${
        collapsed
          ? "bg-[#F3EFE6]/95 shadow-sm border-[#B39B6B]/25"
          : "bg-[#FAF8F3]/90 border-[#a28757]/15"
      }`}
    >
      {/* ================= Top Utility Bar (desktop, right-aligned) ================= */}
      <div
        ref={topBarRef}
        inert={collapsed}
        className={`hidden lg:block border-b border-black/5 transition-opacity duration-300 ease-out ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-9 flex items-center justify-end gap-6 text-xs md:text-sm">
          {careersItem && (
            <div
              className="relative"
              onMouseEnter={() => setCareersOpen(true)}
              onMouseLeave={() => setCareersOpen(false)}
            >
              <Link
                href={careersItem.href}
                className="inline-flex items-center gap-1 py-1 text-[#1F1F1F]/80 hover:text-[#6B5A3A] transition-colors whitespace-nowrap"
              >
                {tm(careersItem.label)}
                {careersItem.children && careersItem.children.length > 0 && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${careersOpen ? "rotate-180 text-[#B39B6B]" : "text-[#1F1F1F]/50"}`}
                  />
                )}
              </Link>
              <AnimatePresence>
                {careersOpen && careersItem.children && careersItem.children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease: easeCurve }}
                    className="absolute right-0 top-full z-[60] pt-1.5 w-56"
                  >
                    <div className="rounded-xl bg-white shadow-xl border border-[#B39B6B]/25 py-2 overflow-hidden">
                      {careersItem.children.map((sub) => (
                        <Link
                          key={tm(sub.label)}
                          href={sub.href}
                          className="block px-4 py-2.5 text-xs text-[#1F1F1F]/85 hover:bg-[#F2EFE9] hover:text-[#6B5A3A] transition-colors"
                        >
                          {tm(sub.label)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {contactItem && (
            <Link
              href={contactItem.href}
              className="py-1 text-[#1F1F1F]/80 hover:text-[#6B5A3A] transition-colors whitespace-nowrap"
            >
              {tm(contactItem.label)}
            </Link>
          )}
          <span aria-hidden className="h-3.5 w-px bg-black/10" />
          <LanguageSwitcher />
        </div>
      </div>

      {/* ================= Main Navigation Bar ================= */}
      <div ref={mainBarRef} className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-2.5">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Slim and Elegant (h-8 to h-10 on Desktop) */}
          <Link
            href="/"
            className="flex items-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#B39B6B]/50 rounded-xl p-1 -ml-1 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative h-8 sm:h-9 md:h-10 w-auto aspect-[1490/351]">
              <Image
                src={brandAssets.logos.primary}
                alt={tm("กลุ่มบริษัทเจริญสิน (Charoensin Group)")}
                fill
                sizes="(max-width: 640px) 130px, (max-width: 1024px) 150px, 170px"
                className="object-contain"
                loading="eager"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - Single-line whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-5 shrink-0">
            {/* 6 main items — ร่วมงานกับเรา / ติดต่อเรา live in the top utility bar */}
            {mainMenu.map((item) => {
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
                      <span className="whitespace-nowrap">{tm(item.label)}</span>
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
                                  {tm("5 เสาหลักกลุ่มธุรกิจเจริญสิน")}
                                </h3>
                              </div>
                              <Link
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B5A3A] hover:text-[#B39B6B] transition-colors"
                              >
                                <span>{tm("ดูภาพรวมทุกธุรกิจ")}</span>
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
                                      <Link
                                        href={`/businesses#${cat.key}`}
                                        onClick={() => setActiveMega(null)}
                                        className="hover:underline underline-offset-4 decoration-[#CCA369]"
                                      >
                                        {tm(cat.titleTh.replace(/^[0-9]\./, ""))}
                                      </Link>
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-[#1F1F1F]/70 mb-3 line-clamp-2 leading-relaxed">
                                    {cat.description}
                                  </p>

                                  <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-[#F2EFE9]">
                                    {cat.companies.map((company) => (
                                      <Link
                                        key={company.id}
                                        href={companyHref(company.id)}
                                        onClick={() => setActiveMega(null)}
                                        title={tm(company.nameTh)}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white transition-shadow group/item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369]"
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
                                          {company.shortName || tm(company.nameTh)}
                                        </span>
                                      </Link>
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
                      <span className="whitespace-nowrap">{tm(item.label)}</span>
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
                                  {tm("รายงานกำกับดูแลและนโยบายองค์กร")}
                                </h3>
                              </div>
                              <span className="text-xs text-[#1F1F1F]/60">
                                {tm("ดำเนินงานด้วยความซื่อสัตย์ โปร่งใส มีธรรมาภิบาล")}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                              {item.governanceCategories?.map((gov) => (
                                <div key={tm(gov.title)} className="flex flex-col">
                                  <h4 className="text-sm font-semibold text-[#6B5A3A] font-kanit mb-3 pb-2 border-b border-[#B39B6B]/20">
                                    {tm(gov.title)}
                                  </h4>
                                  <ul className="space-y-2">
                                    {gov.items.map((sub) => (
                                      <li key={tm(sub.label)}>
                                        <Link
                                          href={sub.href}
                                          className="text-xs text-[#1F1F1F]/80 hover:text-[#6B5A3A] hover:translate-x-1 transition-all flex items-center justify-between group/link py-1"
                                        >
                                          <span className="line-clamp-1">{tm(sub.label)}</span>
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
                      <span className="whitespace-nowrap">{tm(item.label)}</span>
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
                              key={tm(sub.label)}
                              href={sub.href}
                              className="block px-4 py-2.5 text-xs text-[#1F1F1F]/85 hover:bg-[#F2EFE9] hover:text-[#6B5A3A] transition-colors"
                            >
                              {tm(sub.label)}
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
                  <span className="whitespace-nowrap">{tm(item.label)}</span>
                </Link>
              );
            })}
          </nav>

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
                        <span>{tm(item.label)}</span>
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
                                {tm(cat.titleTh)}
                              </span>
                              <div className="grid grid-cols-1 gap-1.5 pl-5">
                                {cat.companies.map((c) => (
                                  <Link
                                    key={c.id}
                                    href={companyHref(c.id)}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 text-xs text-[#1F1F1F]/80 hover:text-[#6B5A3A] py-0.5"
                                  >
                                    <div className="relative w-5 h-5 shrink-0 rounded bg-white border border-gray-200 overflow-hidden">
                                      <Image
                                        src={c.logo}
                                        alt={c.nameTh}
                                        fill
                                        className="object-contain p-0.5"
                                      />
                                    </div>
                                    <span className="line-clamp-1">{c.shortName || tm(c.nameTh)}</span>
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

                if (item.isMega && item.megaType === "governance") {
                  return (
                    <div key={item.id} className="border-b border-[#B39B6B]/15 pb-2">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubmenu(item.id)}
                        className="w-full flex items-center justify-between py-2 text-base font-semibold text-[#1F1F1F] font-kanit"
                      >
                        <span>{tm(item.label)}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#B39B6B] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 mt-2 space-y-3">
                          {item.governanceCategories?.map((g) => (
                            <div key={tm(g.title)} className="space-y-1">
                              <span className="text-xs font-semibold text-[#6B5A3A] block">
                                {tm(g.title)}
                              </span>
                              <div className="space-y-1 pl-2">
                                {g.items.map((sub) => (
                                  <Link
                                    key={tm(sub.label)}
                                    href={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-xs text-[#1F1F1F]/80 py-0.5 hover:text-[#6B5A3A]"
                                  >
                                    {tm(sub.label)}
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
                        <span>{tm(item.label)}</span>
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
                              key={tm(sub.label)}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1 text-xs text-[#1F1F1F]/80 hover:text-[#6B5A3A]"
                            >
                              {tm(sub.label)}
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
                    {tm(item.label)}
                  </Link>
                );
              })}
            </div>

            {/* Language (mobile) */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#6B5A3A] font-kanit">{tm("ภาษา / Language")}</span>
              <LanguageSwitcher variant="inline" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
