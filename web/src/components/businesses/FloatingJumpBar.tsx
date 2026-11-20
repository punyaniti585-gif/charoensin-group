"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BusinessGroup } from "@/data/businesses-data";
import { luxEase } from "./motion";

interface Props {
  groups: BusinessGroup[];
  /** Section right after the Hero; the bar appears once it scrolls up */
  revealAfterId: string;
}

/**
 * Floating dark capsule (bottom centre) with 01–05 business jump links.
 * - Hidden over the Hero (opacity 0, y 32, no pointer events), slides up once
 *   the stats section reaches 75% of the viewport — same rule as /about.
 * - Scroll-spy: the chapter crossing the viewport midline gets the gold pill.
 * - Click smooth-scrolls to the chapter; scrolls sideways on narrow screens.
 */
export default function FloatingJumpBar({ groups, revealAfterId }: Props) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Show / hide
  useEffect(() => {
    const update = () => {
      const target = document.getElementById(revealAfterId);
      if (!target) return;
      setShow(target.getBoundingClientRect().top <= window.innerHeight * 0.75);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [revealAfterId]);

  // Scroll-spy
  useEffect(() => {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        const first = groups.find((g) => visible.has(g.id));
        setActiveId(first ? first.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    groups.forEach((g) => {
      const el = document.getElementById(g.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [groups]);

  // Keep the active button in view inside the capsule (narrow screens).
  // Scroll ONLY the capsule — element.scrollIntoView() would move the page.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const btn = scroller?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!scroller || !btn || scroller.scrollWidth <= scroller.clientWidth) return;
    scroller.scrollTo({
      left: btn.offsetLeft - scroller.clientWidth / 2 + btn.offsetWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeId, reduce]);

  const jumpTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setActiveId(id);
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: luxEase }}
      aria-hidden={!show}
      inert={!show}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-1.5rem)] ${
        show ? "" : "pointer-events-none"
      }`}
    >
      <nav
        aria-label="ไปยังกลุ่มธุรกิจ"
        className="rounded-full bg-[#1F1F1F]/95 backdrop-blur-md border border-[#CCA369]/45 shadow-[0_14px_36px_rgba(0,0,0,0.45)]"
      >
        <div ref={scrollerRef} className="flex items-center gap-0.5 p-1.5 overflow-x-auto no-scrollbar">
          {groups.map((g) => {
            const isActive = g.id === activeId;
            return (
              <a
                key={g.id}
                data-id={g.id}
                href={`#${g.id}`}
                onClick={(e) => jumpTo(e, g.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-kanit text-xs sm:text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C786] ${
                  isActive ? "text-[#1F1F1F]" : "text-white/80 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="floating-jump-pill"
                    className="absolute inset-0 rounded-full bg-[#CCA369] shadow-[0_4px_14px_rgba(204,163,105,0.45)]"
                    transition={{ duration: reduce ? 0 : 0.4, ease: luxEase }}
                  />
                )}
                <span className={`relative font-playfair font-semibold ${isActive ? "text-[#1F1F1F]" : "text-[#CCA369]"}`}>
                  {g.number}
                </span>
                <span className="relative whitespace-nowrap font-medium">{g.nameTh.replace(/^ธุรกิจ/, "")}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </motion.div>
  );
}
