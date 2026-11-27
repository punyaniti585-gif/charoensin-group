"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight, X } from "lucide-react";
import { brandAssets, businessCategories, navigationMenu } from "@/data/asset-map";
import { companyHref } from "@/data/businesses-data";
import { LANGUAGES } from "@/data/languages";
import { useLanguage } from "@/components/common/LanguageSwitcher";
import { useMenuT } from "@/i18n";

/* ==========================================================================
   Full-screen navigation overlay (navy #111e46, CI 2025).
   Built from the SAME `navigationMenu` / `businessCategories` data as the
   Navbar, so labels, links and sub-menus stay identical site-wide.
   • Desktop: main list (left) — hovering/focusing an item shows its
     sub-menu live on the right.
   • Mobile: one column; items with a sub-menu expand in place (accordion).
   Portal to <body> (the hero's ancestors are transformed, which would trap
   position:fixed). Locks page scroll (html overflow + data-lenis-prevent so
   Lenis can't drive the page behind), closes on Esc, restores focus.
   ========================================================================== */

type SubLink = { label: string; href: string };
type SubGroup = { title: string; links: SubLink[] };
type MenuEntry = { id: string; label: string; href: string; groups: SubGroup[] };

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Normalise the Navbar's three menu shapes into titled link groups */
const MENU: MenuEntry[] = navigationMenu.map((item) => {
  let groups: SubGroup[] = [];
  if (item.isMega && item.megaType === "business") {
    groups = businessCategories.map((cat) => ({
      title: `${cat.number} ${cat.titleTh}`,
      links: cat.companies.map((c) => ({ label: c.nameTh, href: companyHref(c.id) })),
    }));
  } else if (item.isMega && item.megaType === "governance" && "governanceCategories" in item) {
    groups = (item.governanceCategories ?? []).map((g) => ({ title: g.title, links: g.items }));
  } else if ("children" in item && item.children) {
    groups = [{ title: item.label, links: item.children }];
  }
  return { id: item.id, label: item.label, href: item.href, groups };
});

const CONTACT = MENU.find((m) => m.id === "07");

// TODO: only the Facebook URL is in the project — replace the "#" placeholders
// with the official X / Instagram / LinkedIn / TikTok channels.
const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/CharoensinGroup/" },
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "TikTok", href: "#" },
];

function NavLink({ href, className, children, onNavigate }: { href: string; className?: string; children: React.ReactNode; onNavigate: () => void }) {
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

function SubMenu({ entry, onNavigate }: { entry: MenuEntry; onNavigate: () => void }) {
  const tm = useMenuT();
  if (!entry.groups.length) {
    return (
      <NavLink href={entry.href} onNavigate={onNavigate} className="group inline-flex items-center gap-2 font-kanit text-lg text-white/80 hover:text-[#cfc29f] transition-colors">
        {tm("ไปที่หน้า")} {tm(entry.label)}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </NavLink>
    );
  }
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {entry.groups.map((g) => (
        <div key={g.title}>
          <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#cfc29f]/80">{tm(g.title)}</p>
          <ul className="mt-3 space-y-2">
            {g.links.map((l, i) => (
              <li key={`${l.label}-${i}`}>
                <NavLink href={l.href} onNavigate={onNavigate} className="font-sarabun text-[15px] leading-snug text-white/75 hover:text-white transition-colors">
                  {tm(l.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function MenuOverlay({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  /** Element to return focus to on close (the MENU button) */
  triggerRef?: React.RefObject<HTMLElement | null>;
}) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(MENU[1]?.id ?? MENU[0].id);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lang, setLang] = useLanguage();
  const tm = useMenuT();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock page scroll, Esc to close, focus management
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      (triggerRef?.current ?? prevFocus)?.focus?.();
    };
  }, [open, onClose, triggerRef]);

  if (!mounted) return null;
  const current = MENU.find((m) => m.id === active) ?? MENU[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={tm("เมนูหลัก")}
          data-lenis-prevent
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overscroll-contain bg-[#111e46] text-white"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 lg:py-6">
            <Link href="/" onClick={onClose} className="relative block h-7 sm:h-8 aspect-[1490/351]" aria-label={tm("Charoensin Group — หน้าแรก")}>
              <Image src={brandAssets.logos.primary} alt={tm("กลุ่มบริษัทเจริญสิน")} fill sizes="200px" className="object-contain brightness-0 invert" />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={tm("ปิดเมนู")}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-[background-color,border-color,transform] duration-300 hover:rotate-90 hover:border-[#cfc29f] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfc29f]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main: list | sub-menu */}
          <div className="mx-5 sm:mx-8 lg:mx-12 flex-1 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] border-t border-white/10">
            <nav aria-label={tm("เมนูหลัก")} className="py-6 lg:py-10 lg:pr-12 lg:border-r lg:border-white/10">
              <ul>
                {MENU.map((m) => {
                  const on = m.id === active;
                  const isOpen = expanded === m.id;
                  return (
                    <li
                      key={m.id}
                      className="border-b border-white/[0.06] lg:border-0"
                      onMouseEnter={() => setActive(m.id)}
                      onFocusCapture={() => setActive(m.id)}
                    >
                      {/* Desktop row: hover/focus selects, click navigates */}
                      <NavLink
                        href={m.href}
                        onNavigate={onClose}
                        className="group hidden lg:flex items-center gap-5 py-2.5 xl:py-3"
                      >
                        <span className="w-7 font-playfair text-sm text-[#a28757]">{m.id}</span>
                        <span
                          className={`font-kanit text-2xl xl:text-[1.9rem] leading-tight transition-colors duration-300 ${on ? "text-[#cfc29f]" : "text-white/85 group-hover:text-[#cfc29f]"}`}
                        >
                          {tm(m.label)}
                        </span>
                        <ChevronRight
                          className={`h-5 w-5 text-[#cfc29f] transition-[opacity,transform] duration-300 ${on ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                        />
                      </NavLink>

                      {/* Mobile row: expand sub-menu in place */}
                      <div className="lg:hidden">
                        <div className="flex items-center gap-4 py-3.5">
                          <span className="w-6 font-playfair text-sm text-[#a28757]">{m.id}</span>
                          <NavLink href={m.href} onNavigate={onClose} className="flex-1 font-kanit text-xl text-white/90 active:text-[#cfc29f]">
                            {tm(m.label)}
                          </NavLink>
                          {m.groups.length > 0 && (
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              aria-label={`${tm(isOpen ? "ซ่อนเมนูย่อย" : "แสดงเมนูย่อย")} ${tm(m.label)}`}
                              onClick={() => setExpanded(isOpen ? null : m.id)}
                              className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
                            >
                              <ChevronDown className={`h-4 w-4 text-[#cfc29f] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5 pl-10">
                                <SubMenu entry={m} onNavigate={onClose} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Desktop sub-menu panel (live) */}
            <div className="hidden lg:block py-10 lg:pl-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-playfair text-sm text-[#a28757]">{current.id}</p>
                  <h2 className="mt-1 mb-8 font-kanit font-normal text-3xl text-white">{tm(current.label)}</h2>
                  <SubMenu entry={current} onNavigate={onClose} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mx-5 sm:mx-8 lg:mx-12 border-t border-white/10 py-5 lg:py-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {CONTACT && (
              <NavLink
                href={CONTACT.href}
                onNavigate={onClose}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#a28757] px-6 py-3 font-kanit text-[15px] text-white transition-colors hover:bg-[#b89a62]"
              >
                {tm("ติดต่อเรา")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
            )}

            <div role="group" aria-label={tm("เลือกภาษา")} className="flex items-center gap-1 font-sarabun text-sm">
              {LANGUAGES.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span aria-hidden className="text-white/25">/</span>}
                  <button
                    type="button"
                    aria-pressed={lang === l.code}
                    onClick={() => setLang(l.code)}
                    className={`rounded-full px-3 py-1.5 transition-colors ${lang === l.code ? "text-[#cfc29f]" : "text-white/60 hover:text-white"}`}
                  >
                    {l.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-inter text-xs uppercase tracking-[0.14em]">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#cfc29f] transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
