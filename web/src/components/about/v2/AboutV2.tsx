"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAboutCopy } from "@/i18n";
import HistoryHero from "./HistoryHero";
import ViewSwitcher from "./ViewSwitcher";
import HistoryView from "./HistoryView";
import VisionView from "./VisionView";
import LeadershipView from "./LeadershipView";
import { NAV_OFFSET, type ViewId } from "./ui";

/* ==========================================================================
   About V.2 — Instant View Switcher
   --------------------------------------------------------------------------
   One page, three views (history / vision / leadership). Picking a view —
   from the bar under the hero or the floating pill — crossfades the old view
   out, then jumps (instantly, while nothing is on screen) to the top of the
   content and fades the new view in. The view lives in the URL hash, and the
   site menu's /about#… links (vision, mission, values, leadership …) open
   the matching view and section.
   ========================================================================== */

/** Hash → view and the section to land on ("top" = top of the content) */
const HASH_MAP: Record<string, { view: ViewId; target: string }> = {
  history: { view: "history", target: "top" },
  timeline: { view: "history", target: "sec-timeline" },
  vision: { view: "vision", target: "top" },
  mission: { view: "vision", target: "sec-mission" },
  values: { view: "vision", target: "sec-values" },
  conduct: { view: "vision", target: "sec-conduct" },
  leadership: { view: "leadership", target: "top" },
  chairman: { view: "leadership", target: "top" },
  board: { view: "leadership", target: "sec-board" },
};

const isAboutPath = (p: string) => p.replace(/\/+$/, "") === "/about";

export default function AboutV2() {
  const { copy } = useAboutCopy();
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewId>("history");
  const viewRef = useRef<ViewId>("history");
  const pending = useRef<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [barGone, setBarGone] = useState(false);
  const [footerIn, setFooterIn] = useState(false);

  /** Scroll to the pending target. Instant after a swap (the page is empty
      at that moment); smooth when re-selecting the current view. */
  const flushScroll = useCallback((smooth: boolean) => {
    const target = pending.current;
    pending.current = null;
    if (!target) return;
    const el = target === "top" ? contentRef.current : document.getElementById(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    // Landing on the top of the content: only scroll up, never pull the
    // visitor down past the hero when they are still above it.
    if (target === "top" && window.scrollY <= top) return;
    window.scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "auto" });
  }, [reduce]);

  const go = useCallback(
    (next: ViewId, target = "top") => {
      pending.current = target;
      const hash = target === "top" ? next : Object.keys(HASH_MAP).find((k) => HASH_MAP[k].target === target) ?? next;
      window.history.replaceState(window.history.state, "", `#${hash}`);
      if (next === viewRef.current) {
        flushScroll(true);
        return;
      }
      viewRef.current = next;
      setView(next);
    },
    [flushScroll],
  );

  // Initial view from the hash, and /about#… links clicked while on the page
  useEffect(() => {
    const fromHash = () => {
      const hit = HASH_MAP[window.location.hash.replace("#", "")];
      if (hit) go(hit.view, hit.target);
    };
    fromHash();
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      const hit = HASH_MAP[url.hash.replace("#", "")];
      if (url.origin !== window.location.origin || !isAboutPath(url.pathname) || !hit) return;
      e.preventDefault();
      go(hit.view, hit.target);
    };
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [go]);

  // Floating pill: shown once the top bar has scrolled above the viewport,
  // hidden again while the footer is on screen.
  useEffect(() => {
    const bar = barRef.current;
    const footer = document.querySelector("footer");
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.target === bar) setBarGone(!en.isIntersecting && en.boundingClientRect.top < 0);
        else setFooterIn(en.isIntersecting);
      }
    });
    if (bar) io.observe(bar);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const pillShown = barGone && !footerIn;

  return (
    <>
      <HistoryHero copy={copy.hero} />

      {/* Sections are full-bleed surfaces (see SURFACE in ./ui) */}
      <div className="relative z-10 w-full flex-1 pb-3 lg:pb-6">
        <div>
          <div ref={barRef} className="mx-auto mt-3 max-w-4xl px-3 lg:mt-6 lg:px-6">
            <ViewSwitcher view={view} onChange={go} labels={copy.nav.views} ariaLabel={copy.nav.label} variant="bar" />
          </div>

          <div ref={contentRef} id="about-view-panel" role="tabpanel" className="mt-3 lg:mt-6">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => flushScroll(false)}>
              <motion.div
                key={view}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
              >
                {view === "history" && <HistoryView copy={copy.timeline} />}
                {view === "vision" && <VisionView copy={copy} />}
                {view === "leadership" && <LeadershipView copy={copy} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating pill (outside every transformed wrapper, so `fixed` works) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6">
        <AnimatePresence>
          {pillShown && (
            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ViewSwitcher view={view} onChange={go} labels={copy.nav.short} ariaLabel={copy.nav.label} variant="pill" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
