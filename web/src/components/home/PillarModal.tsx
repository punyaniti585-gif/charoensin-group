"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { HeroPillar } from "./hero-data";

/* ==========================================================================
   Expanded business card (Hero Act 2 → click a card).
   The clicked card MORPHS into a centred white card: FLIP — the panel is laid
   out at its final size, then animated from the card's rect (translate +
   scale, Web Animations API → compositor) to identity. Content rises in once
   the morph lands; closing plays the morph back into the card.
   Portal to <body>, locks page scroll (html overflow + data-lenis-prevent),
   Esc / backdrop / × to close, focus returns to the card.
   ========================================================================== */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MORPH_MS = 560;
const MAX_CHIPS = 6;

type Props = {
  pillar: HeroPillar;
  /** Rect of the card that was clicked (viewport coords) */
  origin: DOMRect;
  trigger: HTMLElement | null;
  onClose: () => void;
};

export default function PillarModal({ pillar, origin, trigger, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false); // backdrop + content state
  const closing = useRef(false);

  useEffect(() => setMounted(true), []);

  /** Transform that maps the final panel onto the clicked card */
  const fromCard = useCallback(() => {
    const el = panelRef.current!;
    const f = el.getBoundingClientRect();
    const dx = origin.left - f.left;
    const dy = origin.top - f.top;
    const sx = origin.width / f.width;
    const sy = origin.height / f.height;
    return `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`;
  }, [origin]);

  // Open: morph from the card
  useLayoutEffect(() => {
    if (!mounted) return;
    const el = panelRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      el.animate([{ transform: fromCard(), opacity: 0.7 }, { transform: "none", opacity: 1 }], { duration: MORPH_MS, easing: EASE });
    }
    setShown(true);
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), MORPH_MS);
    return () => window.clearTimeout(t);
  }, [mounted, fromCard]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    const el = panelRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce) return onClose();
    const anim = el.animate([{ transform: "none", opacity: 1 }, { transform: fromCard(), opacity: 0.6 }], {
      duration: 420,
      easing: EASE,
      fill: "forwards",
    });
    anim.onfinish = () => onClose();
  }, [fromCard, onClose]);

  // Scroll lock, Esc, focus return
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [close, trigger]);

  if (!mounted) return null;

  const chips = pillar.companies.slice(0, MAX_CHIPS);
  const more = pillar.companies.length - chips.length;
  const d = (i: number) => ({ animationDelay: `${0.38 + i * 0.06}s` });

  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-6" data-lenis-prevent>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="ปิด"
        tabIndex={-1}
        onClick={close}
        className={`absolute inset-0 cursor-default bg-[#14171F]/45 transition-opacity duration-400 ${shown ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pillar-title"
        className="relative flex w-full max-w-[860px] max-h-[86vh] flex-col overflow-hidden rounded-2xl lg:rounded-3xl bg-white shadow-[0_40px_90px_-30px_rgba(20,15,5,0.55)] md:grid md:h-[min(460px,80vh)] md:grid-cols-[44%_1fr]"
        style={{ transformOrigin: "0 0", willChange: "transform" }}
      >
        {/* Photo */}
        <div className="relative h-44 shrink-0 bg-[#E9DFCC] md:h-auto">
          <Image src={pillar.image} alt={pillar.imageAlt} fill sizes="(max-width: 768px) 92vw, 380px" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,15,5,0.25),transparent_45%)]" />
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-6 sm:p-7 lg:p-9">
          {shown && (
            <>
              <span className="pillar-in font-playfair text-4xl leading-none text-[#a28757]" style={d(0)}>
                {pillar.number.padStart(2, "0")}
              </span>
              <p className="pillar-in mt-3 font-inter text-[10.5px] uppercase tracking-[0.22em] text-[#8a7146]" style={d(0)}>
                {pillar.nameEn}
              </p>
              <h3 id="pillar-title" className="pillar-in mt-1 font-kanit font-normal text-2xl lg:text-[1.75rem] leading-snug text-[#14171F]" style={d(1)}>
                {pillar.nameTh}
              </h3>
              <p className="pillar-in mt-3 font-sarabun text-[15px] leading-relaxed text-[#14171F]/70 line-clamp-4" style={d(2)}>
                {pillar.description}
              </p>

              {pillar.highlights.length > 0 && (
                <ul className="pillar-in mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sarabun text-sm text-[#6B5A3A]" style={d(3)}>
                  {pillar.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-1.5">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[#a28757]" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {chips.length > 0 && (
                <div className="pillar-in mt-4" style={d(3)}>
                  <p className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#14171F]/40">บริษัทในเครือ</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <li key={c} className="rounded-full bg-[#F3EDE1] px-2.5 py-1 font-sarabun text-xs text-[#6B5A3A]">
                        {c}
                      </li>
                    ))}
                    {more > 0 && <li className="rounded-full border border-[#a28757]/25 px-2.5 py-1 font-sarabun text-xs text-[#8a7146]">+{more}</li>}
                  </ul>
                </div>
              )}

              <div className="pillar-in mt-auto flex items-center gap-3 pt-6" style={d(4)}>
                <Link
                  href={pillar.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#a28757] px-6 py-3 font-kanit text-[15px] text-white transition-colors hover:bg-[#8c7344] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] focus-visible:ring-offset-2"
                >
                  ดูธุรกิจนี้
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="ปิดรายละเอียด"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#6B5A3A] shadow-sm ring-1 ring-[#a28757]/20 transition-[background-color,transform] duration-300 hover:rotate-90 hover:bg-[#F3EDE1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
