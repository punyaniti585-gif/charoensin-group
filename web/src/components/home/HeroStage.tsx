"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { heroCopy, heroPillars } from "./hero-data";
import MenuOverlay from "@/components/common/MenuOverlay";
import HeroWordmark from "./HeroWordmark";
import PillarModal from "./PillarModal";
import { useHomeCopy, useT } from "@/i18n";

/* ==========================================================================
   Home Hero — 2-Act Cinematic Typography → Frame Zoom-Out Reveal
   --------------------------------------------------------------------------
   Intro (on every load, ~2.1s, CSS only): navy stage → a gold drop falls on a
     reflective floor (0–0.45s) → splash ripples → the CSG emblem rises out of
     the splash (0.5s) → the HQ frame opens out of the emblem with a circular
     clip-path to full screen (1.2–1.95s) → centred eyebrow + CHAROENSIN rise
     (1.8s) and the corner logo / MENU button fade in (2.0s). The stage is
     pointer-events:none, unmounts at 2.3s, and scrolling skips it.
     Reload/F5 always starts at the top (manual scroll restoration).
   Act 1 (progress 0): full-bleed HQ photo in warm daylight, a micro card
     (top-left), an editorial intro (top-right) and the giant display word
     CHAROENSIN with a script line layered over it.
   Act 2 (scrolling): Act 1 type eases down + fades; the "camera" pulls back —
     the full-screen frame scales into a centred architectural frame — and the
     5 business cards float out from behind it.

   Performance
   • One rAF-throttled scroll handler; progress is read from the live rect and
     mapped directly (no spring — Lenis already smooths the wheel).
   • Only transform + opacity are written, straight to element.style.
   • The frame's end position is measured from an invisible layout "slot" on
     resize, so the zoom-out lands exactly in the grid at every breakpoint.
   • No blur. Reduced motion → the finished Act 2 layout, no sticky stage.
   ========================================================================== */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad2 = (s: string) => s.padStart(2, "0");


/** Act 2 cards: auto-play stagger (0.12s apart), y 24 → 0, 0.5s */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.25 } },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Card 05 sits under the frame on desktop; 01/03 left, 02/04 right */
const PLACEMENT = [
  "lg:col-start-1 lg:row-start-2 lg:justify-self-end lg:self-end",
  "lg:col-start-3 lg:row-start-2 lg:justify-self-start lg:self-end",
  "lg:col-start-1 lg:row-start-3 lg:justify-self-end lg:self-start",
  "lg:col-start-3 lg:row-start-3 lg:justify-self-start lg:self-start",
  "lg:col-start-2 lg:row-start-4 lg:justify-self-center",
];

/** Intro timeline (seconds) — the frame finishes opening at OPEN_AT + 0.9 (photo settles by +1.1) */
const OPEN_AT = 1.2;
const INTRO_END_MS = 2400;

export default function HeroStage() {
  const [reduce, setReduce] = useState(false);
  const tx = useHomeCopy().hero;
  const { t } = useT();
  /** hasEnteredStage2 — set once the camera has pulled back */
  const [stage2, setStage2] = useState(false);
  /** Intro: re-keyed on every mount / bfcache restore so it always replays */
  const [animKey, setAnimKey] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = React.useCallback(() => setMenuOpen(false), []);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  /** Act 2 card expanded into the centred detail card */
  const [openPillar, setOpenPillar] = useState<{ index: number; rect: DOMRect; trigger: HTMLElement } | null>(null);
  const closePillar = React.useCallback(() => setOpenPillar(null), []);
  const skipIntro = useRef<() => void>(() => {});
  skipIntro.current = () => {
    if (!introDone) setIntroDone(true);
  };

  // F5 / reload / back-forward: always start at the top and replay the intro.
  // (Runs before the scroll-stage effect below so it measures from the top.)
  useEffect(() => {
    const h = window.history;
    const prev = "scrollRestoration" in h ? h.scrollRestoration : null;
    if (prev) h.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    // A late restore (after fonts/images) can still move the page — once more
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      window.scrollTo(0, 0);
      setIntroDone(false);
      setAnimKey((k) => k + 1);
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", onShow);
      if (prev) h.scrollRestoration = prev;
    };
  }, []);

  // Unmount the intro stage once the frame has fully opened
  useEffect(() => {
    if (introDone) return;
    const t = window.setTimeout(() => setIntroDone(true), INTRO_END_MS);
    return () => window.clearTimeout(t);
  }, [animKey, introDone]);

  const showIntro = !reduce && !introDone;

  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const act1Ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameImgRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  /** 80th-anniversary sash + crest: sits over the Act 2 frame's top-left corner */
  const badgeRef = useRef<HTMLDivElement>(null);
  const [slotBox, setSlotBox] = useState({ x: 0, y: 0, w: 0, h: 0, r: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const frame = frameRef.current;
    const slot = slotRef.current;
    if (!root || !viewport || !frame || !slot) return;

    // Geometry (resize only)
    let vw = 0;
    let vh = 0;
    let target = { s: 1, tx: 0, ty: 0 };
    let entered = false;

    const measure = () => {
      vw = viewport.clientWidth;
      vh = viewport.clientHeight;
      // Tuck the stage under the sticky header so the photo fills the screen
      const header = document.querySelector("header");
      const hh = header ? header.getBoundingClientRect().height : 0;
      root.style.marginTop = reduce ? "" : `-${hh}px`;
      // The frame is inset 8/12px on a cream margin (V.3) — the slot keeps the
      // frame's own aspect, and the pull-back scales from the frame's width.
      // (offset* = layout size, unaffected by the scroll transform.)
      const fw = frame.offsetWidth || vw;
      const fh = frame.offsetHeight || vh;
      root.style.setProperty("--hh", `${hh}px`);
      root.style.setProperty("--va", `${fw} / ${fh}`);

      // Slot rect relative to the viewport box (layout positions, untransformed)
      const vr = viewport.getBoundingClientRect();
      const sr = slot.getBoundingClientRect();
      const sCx = sr.left - vr.left + sr.width / 2;
      const sCy = sr.top - vr.top + sr.height / 2;
      const fCx = frame.offsetLeft + fw / 2;
      const fCy = frame.offsetTop + fh / 2;
      target = { s: sr.width / fw, tx: sCx - fCx, ty: sCy - fCy };
      // Where the frame lands (for the 80th badge — a separate layer so it
      // isn't shrunk with the frame); radius = the frame's 24px at that scale
      setSlotBox({ x: sr.left - vr.left, y: sr.top - vr.top, w: sr.width, h: sr.height, r: 24 * (sr.width / fw) });

    };

    let lastP = -1;
    const render = (force = false) => {
      const r = root.getBoundingClientRect();
      const len = Math.max(1, r.height - vh);
      const p = reduce ? 1 : clamp01(-r.top / len);
      if (!force && Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      // Scrolling during the intro → finish it at once (never blocks the page)
      if (p > 0.02) skipIntro.current();

      // Act 1 type: ease down 40px and fade
      const e1 = easeOut(range(p, 0, 0.32));
      const a1 = act1Ref.current!;
      a1.style.opacity = (1 - e1).toFixed(3);
      a1.style.transform = `translate3d(0, ${(e1 * 40).toFixed(2)}px, 0)`;
      a1.style.visibility = e1 >= 1 ? "hidden" : "";

      // Camera pull-back: full-screen frame → slot
      const e2 = easeInOut(range(p, 0.1, 0.68));
      const s = 1 + (target.s - 1) * e2;
      frame.style.transform = `translate3d(${(target.tx * e2).toFixed(2)}px, ${(target.ty * e2).toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      frameImgRef.current!.style.transform = `scale(${(1.12 - 0.12 * e2).toFixed(4)})`;

      // Act 2 heading
      const e3 = easeOut(range(p, 0.5, 0.78));
      const t = titleRef.current!;
      t.style.opacity = e3.toFixed(3);
      t.style.transform = `translate3d(0, ${((1 - e3) * 18).toFixed(2)}px, 0)`;

      // 80th badge: reveals as the frame settles into its slot (opacity + scale)
      const b = badgeRef.current;
      if (b) {
        const e4 = easeOut(range(p, 0.6, 0.78));
        b.style.opacity = e4.toFixed(3);
        b.style.transform = `scale(${(0.92 + 0.08 * e4).toFixed(4)})`;
        b.style.visibility = e4 <= 0 ? "hidden" : "";
      }

      // Act 2 entered → cards play their own stagger (no further scrolling
      // needed). Hysteresis avoids flicker around the threshold.
      const next = entered ? p > 0.3 : p >= 0.42;
      if (next !== entered) {
        entered = next;
        setStage2(next);
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          render();
        });
    };
    const onResize = () => {
      measure();
      render(true);
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(viewport);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      aria-label={t("กลุ่มบริษัทเจริญสิน")}
      className={`relative w-full bg-[#FAF8F3] ${reduce ? "" : "h-[190vh]"}`}
    >
      <div
        ref={viewportRef}
        className={`hero-vp ${reduce || stage2 ? "is-act2" : ""} ${reduce ? "relative" : "sticky top-0"} h-[100svh] w-full overflow-hidden`}
      >
        {/* Warm cream backdrop revealed by the pull-back */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_45%,rgba(212,202,159,0.38),transparent_72%),radial-gradient(40%_40%_at_100%_0%,rgba(170,151,103,0.12),transparent_70%)]"
        />

        {/* ================= Act 2 layout (cards around an invisible slot) ================= */}
        <div className="absolute inset-0 z-10 px-4 sm:px-6 lg:px-10 pt-[calc(var(--hh,6.5rem)_+_0.75rem)] pb-4 lg:pb-6">
          <div className="mx-auto h-full max-w-[90rem] grid grid-cols-[44%_1fr] lg:grid-cols-[minmax(0,1fr)_minmax(0,44vw)_minmax(0,1fr)] grid-rows-[auto_repeat(5,auto)] lg:grid-rows-[auto_1fr_1fr_auto] content-center gap-x-3 sm:gap-x-5 lg:gap-x-7 gap-y-2.5 lg:gap-y-4">
            <div ref={titleRef} className="col-span-2 lg:col-span-3 text-center mb-1 lg:mb-2 will-change-transform" style={{ opacity: 0 }}>
              <p className="font-inter text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8a7146]">{tx.eyebrow}</p>
              <Link href={heroCopy.allHref} className="group mt-1 inline-flex items-center gap-2 font-kanit text-xl sm:text-2xl lg:text-[1.9rem] text-[#1F1F1F] hover:text-[#6B5A3A] transition-colors">
                {tx.title}
                <ArrowUpRight className="h-5 w-5 text-[#a28757] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <p className="mt-0.5 hidden sm:block font-sarabun text-sm text-[#6B5A3A]/80">{tx.tagline}</p>
            </div>

            {/* Invisible slot: where the frame lands (viewport aspect) */}
            <div
              ref={slotRef}
              aria-hidden
              className="row-start-2 row-span-5 col-start-1 lg:col-start-2 lg:row-start-2 lg:row-span-2 self-center w-full max-h-full justify-self-center"
              style={{ aspectRatio: "var(--va, 16 / 9)" }}
            />

            {heroPillars.map((p, i) => {
              const shown = reduce || stage2;
              return (
              // Wrapper = grid placement + hover spotlight (CSS `scale`/opacity,
              // see .hero-pillar in globals.css). Act 2 guard: pointer-events-none
              // until the cards are shown, so a hidden card can never be hovered
              // through the Act 1 photo. The button inside keeps the
              // framer reveal transform.
              <div
                key={p.id}
                className={`hero-pillar col-start-2 row-start-auto ${PLACEMENT[i]} w-full lg:w-[min(100%,19.5rem)] ${shown ? "pointer-events-auto" : "pointer-events-none"} ${openPillar?.index === i ? "is-open" : ""}`}
              >
              <motion.button
                type="button"
                custom={i}
                variants={cardVariants}
                initial={false}
                animate={shown ? "show" : "hidden"}
                tabIndex={shown ? 0 : -1}
                aria-hidden={!shown || undefined}
                aria-haspopup="dialog"
                onClick={(e) => setOpenPillar({ index: i, rect: e.currentTarget.getBoundingClientRect(), trigger: e.currentTarget })}
                style={{ pointerEvents: shown ? "auto" : "none" }}
                className={`group w-full text-left flex lg:block items-center gap-3 rounded-xl lg:rounded-2xl bg-white/95 ring-1 ring-[#a28757]/20 shadow-[0_18px_40px_-22px_rgba(60,45,20,0.55)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_22px_48px_-20px_rgba(60,45,20,0.6)] hover:ring-[1.5px] hover:ring-[#a28757] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757]`}
              >
                <div className="relative hidden lg:block h-[clamp(64px,11vh,120px)] overflow-hidden bg-[#E9DFCC]">
                  <Image src={p.image} alt="" fill sizes="320px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 items-center gap-3 p-2.5 sm:p-3 lg:px-4 lg:py-3">
                  <span className="font-playfair text-lg lg:text-2xl leading-none text-[#aa9767]">{pad2(p.number)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-kanit text-[12.5px] sm:text-sm lg:text-[15px] leading-snug text-[#1F1F1F] line-clamp-2">{tx.pillars[p.id]?.name ?? p.nameTh}</p>
                    <p className="hidden sm:block font-sarabun text-[11px] lg:text-xs text-[#8a7146] truncate">{tx.pillars[p.id]?.tagline ?? p.tagline}</p>
                  </div>
                  <ArrowUpRight className="hidden sm:block h-4 w-4 shrink-0 text-[#a28757] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.button>
              </div>
              );
            })}
          </div>
        </div>

        {/* ================= Intro stage (navy) — drop → splash → emblem ================= */}
        {showIntro && (
          <div key={`intro-${animKey}`} aria-hidden className="absolute inset-0 z-[15] overflow-hidden bg-[#111e46] pointer-events-none">
            {/* Reflective floor: soft gold pool + hairline horizon at 64% */}
            <div className="absolute inset-x-0 top-[64%] bottom-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgba(207,194,159,0.22),rgba(207,194,159,0)_70%)]" />
            <div className="absolute inset-x-[12%] top-[64%] h-px bg-[linear-gradient(90deg,transparent,rgba(207,194,159,0.35),transparent)]" />
            {/* Gold drop falling onto the floor */}
            <span
              className="intro-drop absolute left-1/2 top-[64%] -ml-[6px] -mt-[18px] h-[18px] w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[linear-gradient(180deg,#fff3cf,#e5c778_45%,#a28757)] shadow-[0_0_14px_rgba(229,199,120,0.6)]"
            />
            {/* Splash ripples on the floor */}
            {[0.45, 0.6, 0.75].map((d) => (
              <span
                key={d}
                className="intro-splash absolute left-1/2 top-[64%] h-[clamp(22px,3.4vw,44px)] w-[clamp(120px,18vw,240px)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[1.5px] border-[#e5c778]"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
            {/* CSG emblem rising out of the splash + its reflection */}
            <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
              <div className="intro-emblem grid h-[clamp(104px,14vw,176px)] aspect-square place-items-center rounded-full border-[1.5px] border-[#e5c778]/80 bg-[#111e46] shadow-[0_0_40px_-6px_rgba(229,199,120,0.45)]" style={{ animationDelay: "0.5s" }}>
                <span className="relative block h-[62%] w-[62%]">
                  <Image src={heroCopy.introEmblem} alt="" fill loading="eager" sizes="176px" className="object-contain" />
                </span>
              </div>
            </div>
            <div className="absolute left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 scale-y-[-0.55]">
              <div className="intro-reflection grid h-[clamp(104px,14vw,176px)] aspect-square place-items-center rounded-full border-[1.5px] border-[#e5c778]/80 [mask-image:linear-gradient(0deg,#000,transparent_75%)]" style={{ animationDelay: "0.5s" }}>
                <span className="relative block h-[62%] w-[62%]">
                  <Image src={heroCopy.introEmblem} alt="" fill sizes="176px" className="object-contain" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= The frame (full-bleed in Act 1 → framed in Act 2) ================= */}
        <div
          ref={frameRef}
          className={`hero-frame absolute inset-2 sm:inset-3 z-20 overflow-hidden rounded-[24px] bg-[#E9DFCC] shadow-[0_40px_90px_-30px_rgba(40,30,15,0.55)] will-change-transform pointer-events-none ${showIntro ? "intro-open" : ""}`}
          style={{ transformOrigin: "50% 50%", animationDelay: showIntro ? `${OPEN_AT}s` : undefined }}
        >
          <div ref={frameImgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
            {/* HQ entrance photo: anchored 85% down so the two elephants by the
                door stay in frame (the photo is 3:2, the frame wider, and Act 1
                adds a 1.12 zoom) */}
            <div className={`absolute inset-0 ${showIntro ? "intro-zoom" : ""}`} style={{ animationDelay: showIntro ? `${OPEN_AT}s` : undefined }}>
                <Image
                src={heroCopy.frameImage}
                alt={t(heroCopy.frameAlt)}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="100vw"
                className="object-cover object-[center_85%]"
            />
            </div>
          </div>
          {/* Warm daylight grade */}
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,236,200,0.18),rgba(255,236,200,0)_40%,rgba(80,55,20,0.12))]" />
        </div>

        {/* ================= 80th anniversary corner sash + crest (Act 2 only) =================
            Navy CI sash at 45° with bright-gold edges across the frame's
            top-left corner, a cream crest with a double gold ring on it and
            the 80th logo inside. Clipped to the frame's rounded corner;
            opacity / scale driven by scroll (see render). */}
        {(() => {
          const size = slotBox.w < 260 ? 60 : slotBox.w < 520 ? 96 : 112; // crest Ø
          const c = size * 0.72; // crest centre (px from the corner, both axes)
          const len = c * 2 * Math.SQRT2 + 40; // sash long enough to cross the corner
          const band = Math.round(size * 0.3);
          return (
            <div
              ref={badgeRef}
              aria-hidden
              className="pointer-events-none absolute z-[25] origin-top-left will-change-transform"
              style={{ left: slotBox.x, top: slotBox.y, width: slotBox.w, height: slotBox.h, opacity: reduce ? 1 : 0, visibility: reduce ? undefined : "hidden" }}
            >
              {/* inner wrapper follows the frame's hover dim (.hero-badge-in in globals.css) */}
              <div className="hero-badge-in absolute inset-0">
              <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: slotBox.r }}>
                <div
                  className="absolute border-y-[1.5px] border-[#D4B675] bg-[#111e46] shadow-md"
                  style={{ width: len, height: band, left: c - len / 2, top: c - band / 2, transform: "rotate(-45deg)" }}
                />
              </div>
              <div
                className="absolute grid place-items-center rounded-full bg-[#FAF8F3] shadow-[0_0_0_2px_#D4B675,0_0_0_5px_#FAF8F3,0_0_0_6.5px_#D4B675,0_10px_24px_-8px_rgba(17,30,70,0.45)]"
                style={{ width: size, height: size, left: c - size / 2, top: c - size / 2 }}
              >
                <span className="relative block h-[78%] w-[78%]">
                  <Image src={heroCopy.emblem} alt="" fill sizes="112px" className="object-contain" />
                </span>
              </div>
              </div>
            </div>
          );
        })()}

        {/* ================= Act 1 type (fades + slides down on scroll) ================= */}
        {/* Same inset + radius as the frame, so the scrims stop at its edge */}
        <div ref={act1Ref} className="absolute inset-2 sm:inset-3 z-30 overflow-hidden rounded-[24px] pointer-events-none will-change-transform" style={reduce ? { opacity: 0, visibility: "hidden" } : undefined}>
         {/* Re-keyed with the intro so every entry replays from the start */}
         <div key={`act1-${animKey}`} className="absolute inset-0">
          {/* V.3 scrims (fade in as the frame opens): thin dark grades at the
              top, bottom and left — the building stays clear in the middle */}
          <div aria-hidden className="hero-shade hero-fade absolute inset-0" style={{ animationDelay: "1.5s" }} />

          {/* Top corners: CSG logo (left) + ติดต่อเรา / MENU (right), V.3 --pad.
              The navbar is hidden during Act 1, so these sit right at the top. */}
          <div className="absolute inset-x-0 top-0 px-5 pt-5 sm:px-12 sm:pt-12">
            <div className="flex items-center justify-between gap-3">
              <div
                className="hero-drop inline-flex items-center rounded-full border border-white/20 bg-[#2A2D34]/75 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 shadow-md"
                style={{ animationDelay: "2s" }}
              >
                <span className="relative block h-6 sm:h-7 lg:h-8 aspect-[1490/351]">
                  {/* White version of the wordmark (static filter, no repaint cost) */}
                  <Image src={heroCopy.logo} alt={t("กลุ่มบริษัทเจริญสิน")} fill loading="eager" sizes="200px" className="object-contain brightness-0 invert" />
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
              {/* ติดต่อเรา — V.3 glass pill (hidden on phones so it never meets the logo) */}
              <Link
                href={heroCopy.contactHref}
                className="hero-drop pointer-events-auto hidden sm:inline-flex items-center rounded-full border border-white/20 bg-[#2A2D34]/75 backdrop-blur-md px-5 py-3 font-kanit text-[14px] text-white shadow-md transition-[background-color,border-color,color] duration-300 hover:border-[#cfc29f]/60 hover:bg-[#2A2D34]/90 hover:text-[#cfc29f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfc29f]"
                style={{ animationDelay: "2s" }}
              >
                {tx.contact}
              </Link>
              {/* MENU = — opens the full-screen navigation overlay */}
              <button
                type="button"
                ref={menuBtnRef}
                onClick={() => setMenuOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                className="hero-drop group pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/20 bg-[#2A2D34]/75 backdrop-blur-md px-5 py-2.5 sm:py-3 text-white shadow-md transition-[background-color,border-color] duration-300 hover:border-[#cfc29f]/60 hover:bg-[#2A2D34]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfc29f]"
                style={{ animationDelay: "2s" }}
              >
                <span className="font-inter text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-[#cfc29f]">{tx.menu}</span>
                <span aria-hidden className="flex w-5 flex-col items-end gap-[5px]">
                  <span className="block h-[1.5px] w-5 rounded-full bg-current transition-[width,background-color] duration-300 group-hover:bg-[#cfc29f]" />
                  <span className="block h-[1.5px] w-3.5 rounded-full bg-current transition-[width,background-color] duration-300 group-hover:w-5 group-hover:bg-[#cfc29f]" />
                </span>
              </button>
              </div>
            </div>
          </div>

          {/* V.3 wordmark (bottom-left): italic kicker + per-letter gold-sweep reveal */}
          <HeroWordmark replay={animKey > 0} reduce={reduce} />
         </div>
        </div>
      </div>
      <MenuOverlay open={menuOpen} onClose={closeMenu} triggerRef={menuBtnRef} />
      {openPillar && (
        <PillarModal
          key={openPillar.index}
          pillar={heroPillars[openPillar.index]}
          origin={openPillar.rect}
          trigger={openPillar.trigger}
          onClose={closePillar}
        />
      )}
    </section>
  );
}
