"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getAffiliates } from "@/data/businesses-data";
import { useT } from "@/i18n";

const AFFILIATES = getAffiliates();
const ease = [0.22, 1, 0.36, 1] as const;
const noopSubscribe = () => () => {};

/**
 * "บริษัทในเครือ ▾" — the 13 affiliate companies, each linking to its
 * /businesses/[slug] summary page.
 *  - variant "mega": inside the Navbar mega menu; opens on hover or click,
 *    2-column list, panel drops down from the button.
 *  - variant "hero": outline button on the /businesses hero; opens on click,
 *    2–3 columns with logos. Rendered in a portal (the hero clips overflow).
 * Esc or a click outside closes; Esc returns focus to the button.
 */
export default function AffiliatesMenu({
  variant,
  onNavigate,
  className = "",
}: {
  variant: "mega" | "hero";
  /** Called after a company link is clicked (e.g. close the mega menu) */
  onNavigate?: () => void;
  className?: string;
}) {
  const { t, name } = useT();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const hero = variant === "hero";

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  // Hero panel: fixed position under the button, kept in place on scroll / resize
  const place = useCallback(() => {
    const b = buttonRef.current?.getBoundingClientRect();
    if (!b) return;
    const vw = window.innerWidth;
    const width = Math.min(760, vw - 32);
    const left = Math.max(16, Math.min(b.left, vw - width - 16));
    setPos({ top: b.bottom + 10, left, width });
  }, []);

  useLayoutEffect(() => {
    if (!hero || !open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [hero, open, place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  const onPick = () => {
    setOpen(false);
    onNavigate?.();
  };

  const motionProps = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
    transition: { duration: 0.25, ease },
  };

  const list = (
    <ul className={`grid gap-1 ${hero ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2"}`}>
      {AFFILIATES.map((a) => (
        <li key={a.id}>
          <Link
            href={a.href}
            onClick={onPick}
            className={`group flex items-center gap-2.5 rounded-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] ${
              hero ? "p-2" : "px-2.5 py-2"
            }`}
          >
            {hero && (
              <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-white border border-[#CCA369]/30 shrink-0">
                <Image src={a.logo} alt="" fill sizes="36px" className="object-contain p-0.5" />
              </span>
            )}
            <span className="min-w-0 font-kanit text-[13px] leading-snug text-[#1F1F1F]/85 group-hover:text-[#111e46] transition-colors">
              {name(a.label)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const panelBody = (
    <>
      <p className="px-2 pb-2 mb-1 border-b border-[#CCA369]/30 font-inter text-[11px] uppercase tracking-[0.2em] text-[#9A7B3E]">
        {t("บริษัทในเครือ")} · {AFFILIATES.length}
      </p>
      {list}
    </>
  );

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onMouseEnter={hero ? undefined : () => setOpen(true)}
      onMouseLeave={hero ? undefined : () => setOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={
          hero
            ? "group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#a28757] bg-white/70 text-[#111e46] hover:bg-[#111e46] hover:border-[#111e46] hover:text-white font-kanit text-sm font-medium transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] focus-visible:ring-offset-2"
            : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#CCA369]/60 text-xs font-medium text-[#6B5A3A] hover:border-[#a28757] hover:text-[#111e46] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369]"
        }
      >
        {t("บริษัทในเครือ")}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {hero ? (
        mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={panelRef}
                id={panelId}
                {...motionProps}
                style={{ top: pos.top, left: pos.left, width: pos.width }}
                className="fixed z-[60] max-h-[70vh] overflow-y-auto rounded-2xl border border-[#C8A96A]/60 bg-[#FAF6EE] p-3 sm:p-4 shadow-[0_24px_60px_rgba(17,30,70,0.18)]"
              >
                {panelBody}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      ) : (
        <AnimatePresence>
          {open && (
            // pt-2 bridges the gap so the hover doesn't drop between button and panel
            <motion.div ref={panelRef} id={panelId} {...motionProps} className="absolute right-0 top-full z-20 pt-2 w-[min(520px,90vw)]">
              <div className="rounded-2xl border border-[#C8A96A]/60 bg-[#FAF6EE] p-3 shadow-[0_20px_50px_rgba(17,30,70,0.16)]">
                {panelBody}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
