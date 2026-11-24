"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  CARDS_PLAY,
  INTRO,
  PHOTO_ASPECT,
  TIMELINE,
  stageCards,
  stageCopy,
  stageImages,
  type StageCard,
} from "./stage-data";

/* ==========================================================================
   Home sticky stage — Hero intro → 80th Anniversary pull-back
   --------------------------------------------------------------------------
   Performance model
   • ONE requestAnimationFrame loop drives every layer (no useScroll chains).
   • Scroll progress is smoothed: pCur += (pT − pCur)·(1 − e^(−dt/0.187)).
   • Layers are moved only with translate3d / scale / opacity, written
     straight to element.style via refs (no React re-render per frame).
   • Photo-frame geometry is measured on resize only; the loop reads a single
     getBoundingClientRect per frame (before writes) so progress stays right
     inside the page's sticky wrapper. It sleeps when settled, wakes on scroll.
   • 160vh stage. The 5 cards auto-play as a timed stagger once progress
     crosses TIMELINE.cardsTrigger — no extra scrolling needed to see them.
   • prefers-reduced-motion → no sticky stage: two static blocks, no motion.

   Layers (back → front, inside the sticky viewport)
   1. Back scene  : sky + building photo (pans up on load, pulls back on scroll)
   2. Headline    : standard Charoensin Group logo (between the pillars)
   3. Front scene : pillars + canopy cut-out (same transform as the back scene,
                    so the letters sit between the pillars and the building)
   4. Warm tint   : cream wash that rises during the pull-back
   5. Section 2   : 80th emblem + 5 business cards
   ========================================================================== */

/** cubic-bezier(x1, y1, x2, y2) → easing function (Newton-Raphson on x) */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (sx(t) - x) / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

const luxEase = cubicBezier(0.22, 1, 0.36, 1);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const SMOOTH_TAU = 0.187; // seconds
/** Scene scale at the end of the pull-back */
const PULL_BACK_MIN = 0.86;

type Mode = "motion" | "static";

export default function HeroStage() {
  const [mode, setMode] = useState<Mode>("motion");

  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Reduced-motion preference → static layout
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMode(mq.matches ? "static" : "motion");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Photo frame geometry (CSS variables) — needed in both modes
  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport) return;
    const setGeometry = () => {
      const vw = document.documentElement.clientWidth;
      const vh = viewport.clientHeight;
      const desktop = vw >= 768;
      const top = desktop ? 0.18 * vh : 0.4 * vh; // photo top edge (sky above)
      // Cover the rest of the viewport below the sky, and stay wide enough to
      // still cover the screen when pulled back to PULL_BACK_MIN scale
      const bw = Math.max(vw / PULL_BACK_MIN, (vh - top) * PHOTO_ASPECT);
      const bh = bw / PHOTO_ASPECT;
      const s = root.style;
      // The site header is in normal flow: tuck the stage under it so the
      // hero fills exactly one screen and the header floats over the sky
      const header = document.querySelector("header");
      s.marginTop = header ? `-${header.getBoundingClientRect().height}px` : "";
      s.setProperty("--bw", `${bw}px`);
      s.setProperty("--bh", `${bh}px`);
      s.setProperty("--bl", `${(vw - bw) / 2}px`);
      s.setProperty("--bt", `${top}px`);
      // Pull-back pivots around the headline band
      s.setProperty("--oy", `${desktop ? top + 0.365 * bh : top + 0.3 * bh}px`);
    };
    setGeometry();
    const ro = new ResizeObserver(setGeometry);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [mode]);

  // The single render loop
  useEffect(() => {
    if (mode !== "motion") return;
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport) return;

    let scrollLen = 1;
    let vh = viewport.clientHeight;
    const measure = () => {
      vh = viewport.clientHeight;
      scrollLen = Math.max(1, root.offsetHeight - vh);
    };
    measure();

    // Live rect (one read at the start of each frame, before any writes):
    // stays correct while the page pins this stage in a sticky wrapper, where
    // a cached offset would go stale. Reads exactly 1 once pinned.
    const target = () => clamp01(-root.getBoundingClientRect().top / scrollLen);
    let pCur = target();

    // Card auto-play state (time-based, independent of further scrolling)
    let cardsOn = false;
    let cardsT0 = 0;
    const cardE = stageCards.map(() => 0); // current 0..1 per card
    let cardOutFrom = cardE.slice();
    let cardsBusy = false;
    let last = performance.now();
    const t0 = last;
    const introEnd = Math.max(
      INTRO.scene.delay + INTRO.scene.duration,
      INTRO.headline.delay + INTRO.headline.duration
    );
    let raf = 0;

    const introAt = (it: number, k: { delay: number; duration: number }) =>
      luxEase(clamp01((it - k.delay) / k.duration));

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const pT = target();
      pCur += (pT - pCur) * (1 - Math.exp(-dt / SMOOTH_TAU));
      if (Math.abs(pT - pCur) < 1e-4) pCur = pT;
      const p = pCur;
      const it = (now - t0) / 1000;

      // ---- Intro
      const eScene = introAt(it, INTRO.scene);
      const eHead = introAt(it, INTRO.headline);

      // ---- Scroll tweens
      const hOut = easeOut(range(p, TIMELINE.headlineOut));
      const pb = easeOut(range(p, TIMELINE.pullBack));
      const tint = easeOut(range(p, TIMELINE.tint));
      const em = easeOut(range(p, TIMELINE.emblemIn));

      // Scene: pans up into place on load, pulls back (zooms out) on scroll
      const sceneY = (1 - eScene) * 0.14 * vh - pb * 0.03 * vh;
      const sceneS = (1.06 - 0.06 * eScene) * (1 - (1 - PULL_BACK_MIN) * pb);
      const sceneT = `translate3d(0, ${sceneY.toFixed(2)}px, 0) scale(${sceneS.toFixed(4)})`;
      backRef.current!.style.transform = sceneT;
      frontRef.current!.style.transform = sceneT;

      // Headline logo — load: cinematic mask reveal (rises out of its clip,
      // scale 0.96 → 1, 0.8s luxEase); scroll: fades and slides down.
      const head = headlineRef.current!;
      head.style.opacity = (Math.min(1, eHead * 2.5) * (1 - hOut)).toFixed(3);
      head.style.transform = `translate3d(0, ${(hOut * 70).toFixed(2)}px, 0)`;
      revealRef.current!.style.transform = `translate3d(0, ${((1 - eHead) * 100).toFixed(2)}%, 0) scale(${(0.96 + 0.04 * eHead).toFixed(4)})`;
      hintRef.current!.style.opacity = (eHead * (1 - easeOut(range(p, [0, 0.08])))).toFixed(3);

      // Warm cream tint over the pulled-back scene
      tintRef.current!.style.opacity = (0.88 * tint).toFixed(3);

      // 80th emblem
      const emblem = emblemRef.current!;
      emblem.style.opacity = em.toFixed(3);
      emblem.style.transform = `translate3d(0, ${((1 - em) * 24).toFixed(2)}px, 0) scale(${(0.86 + 0.14 * em).toFixed(4)})`;

      // Cards: once the raw progress crosses the trigger, the 5 cards play in
      // on their own as a timed stagger (01 L, 02 R, 03 L, 04 R, 05 ↑) — the
      // user doesn't have to keep scrolling. Scrolling back up hides them.
      if (!cardsOn && pT >= TIMELINE.cardsTrigger) {
        cardsOn = true;
        cardsT0 = now;
      } else if (cardsOn && pT < TIMELINE.cardsReset) {
        cardsOn = false;
        cardsT0 = now;
        cardOutFrom = cardE.slice();
      }
      const ct = (now - cardsT0) / 1000;
      cardsBusy = false;
      for (let i = 0; i < cardE.length; i++) {
        if (cardsOn) {
          const local = (ct - i * CARDS_PLAY.stagger) / CARDS_PLAY.duration;
          cardE[i] = Math.max(cardE[i], luxEase(clamp01(local)));
          if (cardE[i] < 1) cardsBusy = true;
        } else {
          cardE[i] = cardOutFrom[i] * (1 - easeOut(clamp01(ct / CARDS_PLAY.outDuration)));
          if (cardE[i] > 0) cardsBusy = true;
        }
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const e = cardE[i];
        const from = stageCards[i].from;
        const x = from === "left" ? -(1 - e) * 160 : from === "right" ? (1 - e) * 160 : 0;
        const y = from === "bottom" ? (1 - e) * 80 : (1 - e) * 12;
        el.style.opacity = e.toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        el.style.pointerEvents = e > 0.6 ? "auto" : "none";
        el.tabIndex = e > 0.6 ? 0 : -1;
      });

      raf = it < introEnd || pCur !== pT || cardsBusy ? requestAnimationFrame(frame) : 0;
    };

    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onResize = () => {
      measure();
      wake();
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [mode]);

  const isMotion = mode === "motion";
  // Initial (pre-JS) state for animated layers; static mode shows everything
  const hidden: React.CSSProperties | undefined = isMotion ? { opacity: 0 } : undefined;

  return (
    <>
      {/* If JS is off, show the hero headline (cards stay in the next section) */}
      <noscript>
        <style>{`.hs-reveal{opacity:1!important}.hs-reveal-inner{transform:none!important}`}</style>
      </noscript>

      <section
        ref={rootRef}
        aria-label="Charoensin Group"
        className="relative w-full bg-[#F7F1E7]"
        style={isMotion ? { height: "160vh" } : undefined}
      >
        {/* ================= Viewport (sticky in motion mode) ================= */}
        <div
          ref={viewportRef}
          className={`${isMotion ? "sticky top-0" : "relative"} h-[100svh] w-full overflow-hidden bg-gradient-to-b from-[#4C8FD3] via-[#8DBDEA] to-[#F7F1E7]`}
        >
          {/* 1 — Back scene: sky + building */}
          <div
            ref={backRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: "50% var(--oy, 50%)" }}
          >
            <PhotoFrame>
              {/* Sky continues above the photo */}
              <div
                className="absolute left-0 w-full"
                style={{ bottom: "92%", aspectRatio: "1600 / 1292" }}
              >
                <Image src={stageImages.sky} alt="" fill priority sizes="100vw" className="object-cover object-bottom" />
              </div>
              <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%)]">
                <Image
                  src={stageImages.building}
                  alt="อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              {/* Soft warm scrim behind the headline band (desktop) for contrast */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute inset-x-0 top-[26%] h-[26%] bg-[linear-gradient(to_bottom,transparent,rgba(31,22,10,0.42)_50%,transparent)]"
              />
            </PhotoFrame>
            {/* Overall gentle grade */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
          </div>

          {/* 2 — Headline: the standard Charoensin Group logo, centred in the
                 pillar gap (desktop) / in the sky above the building (mobile) */}
          <div
            className="absolute inset-x-0 z-10 flex justify-center pointer-events-none px-4 -translate-y-1/2 md:translate-x-[calc(var(--bw,100vw)_*_0.0308)] top-[calc(var(--bt,40vh)_*_0.78_+_1rem)] md:top-[calc(var(--bt,18vh)_+_var(--bh,60vh)_*_0.365)]"
          >
            <div ref={headlineRef} className="hs-reveal relative will-change-transform" style={hidden}>
              {/* Soft warm-dark radial vignette: lifts the gold logo off the
                  concrete, pillar shadows (desktop) and bright sky (mobile).
                  Static gradient — no blur, no per-frame cost. */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[300%] md:h-[280%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(26,19,10,0.62),rgba(26,19,10,0.34)_52%,rgba(26,19,10,0)_100%)] pointer-events-none"
              />
              <h1 className="relative m-0">
                <span className="sr-only">{stageCopy.headlineSr}</span>
                {/* Cinematic mask reveal: the logo rises out of this clip */}
                <span aria-hidden="true" className="block overflow-hidden py-2 -my-2 px-3 -mx-3">
                  <span
                    ref={revealRef}
                    className="hs-reveal-inner block will-change-transform"
                    style={isMotion ? { transform: "translate3d(0, 100%, 0) scale(0.96)" } : undefined}
                  >
                    <span className="relative block aspect-[1490/351] w-[min(82vw,380px)] md:w-[clamp(240px,calc(var(--bw,100vw)_*_0.27),560px)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      <Image
                        src={stageImages.logo}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 82vw, 560px"
                        className="object-contain"
                      />
                      {/* Subtle gold light sweep, masked to the logo's own shape */}
                      {isMotion && (
                        <span
                          className="hs-logo-sweep absolute inset-0"
                          style={{
                            WebkitMaskImage: `url(${stageImages.logo})`,
                            maskImage: `url(${stageImages.logo})`,
                          }}
                        />
                      )}
                    </span>
                  </span>
                </span>
              </h1>
            </div>
          </div>

          {/* 3 — Front scene: pillars + canopy cut-out (same transform as back) */}
          <div
            ref={frontRef}
            aria-hidden="true"
            className="absolute inset-0 z-20 pointer-events-none will-change-transform"
            style={{ transformOrigin: "50% var(--oy, 50%)" }}
          >
            <PhotoFrame>
              <Image src={stageImages.foreground} alt="" fill priority sizes="100vw" className="object-cover" />
            </PhotoFrame>
          </div>

          {/* Scroll hint */}
          <div
            ref={hintRef}
            className="hs-reveal absolute bottom-5 inset-x-0 z-30 flex justify-center pointer-events-none"
            style={isMotion ? { opacity: 0 } : { display: "none" }}
          >
            <span className="hs-hint relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1F1F]/60 text-[#F7F1E7] text-xs sm:text-sm font-sarabun">
              {/* Soft pulse ring (transform + opacity only) */}
              <span aria-hidden="true" className="hs-hint-ring absolute inset-0 rounded-full border border-[#CCA369]/70" />
              <ChevronDown className="relative w-4 h-4 text-[#CCA369] animate-bounce" />
              <span className="relative">{stageCopy.scrollHint}</span>
            </span>
          </div>

          {/* 4 — Warm tint (motion mode only) */}
          {isMotion && (
            <div
              ref={tintRef}
              aria-hidden="true"
              className="absolute inset-0 z-[25] bg-[#F7F1E7] pointer-events-none will-change-[opacity]"
              style={{ opacity: 0 }}
            />
          )}

          {/* 5 — Section 2 inside the stage (motion mode) */}
          {isMotion && (
            <AnniversaryLayer emblemRef={emblemRef} cardRefs={cardRefs} overlay />
          )}
        </div>

        {/* Section 2 as a normal block (reduced motion) */}
        {!isMotion && <AnniversaryLayer cardRefs={cardRefs} />}
      </section>
    </>
  );
}

/** Box with the building photo's exact aspect, sized/positioned via CSS vars */
function PhotoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute"
      style={{
        left: "var(--bl, 0px)",
        top: "var(--bt, 18vh)",
        width: "var(--bw, 100vw)",
        height: "var(--bh, 66vw)",
      }}
    >
      {children}
    </div>
  );
}

/** 80th emblem + motto + 5 business cards */
function AnniversaryLayer({
  emblemRef,
  cardRefs,
  overlay = false,
}: {
  emblemRef?: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.RefObject<(HTMLAnchorElement | null)[]>;
  overlay?: boolean;
}) {
  const hidden: React.CSSProperties | undefined = overlay ? { opacity: 0 } : undefined;
  return (
    <div
      className={
        overlay
          ? "absolute inset-0 z-30 flex items-center justify-center pt-16 pb-6 px-4 sm:px-6 pointer-events-none"
          : "relative w-full bg-[#F7F1E7] flex items-center justify-center py-14 px-4 sm:px-6"
      }
    >
      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2.5 sm:gap-3 md:gap-x-5 lg:gap-x-12 md:gap-y-5 items-center">
        {/* Emblem */}
        <div
          ref={emblemRef}
          className="col-span-2 md:col-span-1 md:col-start-2 md:row-start-1 md:row-span-2 flex flex-col items-center text-center will-change-transform mb-2 md:mb-0"
          style={hidden}
        >
          <div className="relative h-[clamp(110px,22vh,250px)] aspect-square drop-shadow-[0_10px_30px_rgba(107,90,58,0.25)]">
            <Image src={stageImages.emblem} alt="80th Anniversary — Charoensin Group" fill sizes="250px" className="object-contain" />
          </div>
          <p className="mt-2 max-w-[16rem] lg:max-w-none font-kanit text-sm sm:text-base md:text-lg text-[#6B5A3A] text-balance">
            {stageCopy.motto}
          </p>
          <span aria-hidden="true" className="mt-2 h-px w-20 bg-gradient-to-r from-transparent via-[#CCA369] to-transparent" />
        </div>

        {/* Cards */}
        {stageCards.map((card, i) => (
          <BusinessCard
            key={card.number}
            card={card}
            index={i}
            style={hidden}
            refCb={(el) => {
              cardRefs.current[i] = el;
            }}
            interactive={!overlay}
          />
        ))}
      </div>
    </div>
  );
}

/** Desktop grid placement around the emblem */
const PLACEMENT = [
  "md:col-start-1 md:row-start-1 md:justify-self-end", // 01
  "md:col-start-3 md:row-start-1 md:justify-self-start", // 02
  "md:col-start-1 md:row-start-2 md:justify-self-end", // 03
  "md:col-start-3 md:row-start-2 md:justify-self-start", // 04
  "col-span-2 md:col-span-1 md:col-start-2 md:row-start-3 md:justify-self-center", // 05
];

function BusinessCard({
  card,
  index,
  style,
  refCb,
  interactive,
}: {
  card: StageCard;
  index: number;
  style?: React.CSSProperties;
  refCb: (el: HTMLAnchorElement | null) => void;
  interactive: boolean;
}) {
  return (
    <a
      ref={refCb}
      href={card.href}
      style={interactive ? style : { ...style, pointerEvents: "none" }}
      tabIndex={interactive ? 0 : -1}
      className={`group w-full md:w-[clamp(176px,20vw,260px)] md:max-w-full flex md:flex-col items-center md:items-stretch gap-2.5 md:gap-0 p-1.5 md:p-0 rounded-2xl overflow-hidden bg-white border border-[#CCA369]/40 shadow-[0_10px_28px_rgba(107,90,58,0.14)] hover:border-[#CCA369] hover:shadow-[0_16px_36px_rgba(107,90,58,0.22)] transition-[border-color,box-shadow] duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369] ${PLACEMENT[index]}`}
    >
      <div className="relative shrink-0 w-14 h-14 md:w-full md:h-[clamp(64px,11vh,104px)] rounded-xl md:rounded-none overflow-hidden bg-[#E9DFCC]">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(max-width: 768px) 56px, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="hidden md:flex absolute top-2 left-2 items-center justify-center min-w-8 h-8 px-1.5 rounded-full bg-[#1F1F1F]/70 border border-[#E6C786]/70 font-playfair text-sm font-semibold text-[#E6C786]">
          {card.number}
        </span>
      </div>
      <div className="min-w-0 flex-1 md:px-3.5 md:py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-kanit text-[13px] md:text-sm font-semibold text-[#1F1F1F] leading-snug truncate">
            <span className="md:hidden font-playfair text-[#9A7B3E] mr-1.5">{card.number}</span>
            {card.titleTh}
          </p>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-[#CCA369] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="font-inter text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-[#9A7B3E] truncate">
          {card.titleEn}
        </p>
      </div>
    </a>
  );
}
