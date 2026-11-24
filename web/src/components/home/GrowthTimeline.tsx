"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { growthMilestones } from "@/data/home-data";
import { CountUp, luxEase } from "./motion";

/**
 * ภาพรวมการเติบโตธุรกิจในเครือ — Ascending S-Curve Growth Timeline.
 * Three centred columns step up like a staircase (2566 low → 2568 high). A
 * gold S-curve is built through the MEASURED centres of the three year dots,
 * so it always passes exactly through them at any width; it draws in
 * left → right (pathLength, 1.2s) on entering view, then a glowing comet
 * (stroke-dashoffset, CSS) rides it on a loop — paused while off screen.
 *
 * Background: a fine gold architectural grid + a mouse-following spotlight.
 * The spotlight is a fixed-size layer moved with translate3d (compositor);
 * the pointer position is written to CSS vars (--x / --y) at most once per
 * frame via rAF — no React re-render on mouse move.
 *
 * Hover a year: its card lifts (translate), brightens, gets a gold border;
 * the figure turns gold and the dot on the curve scales up with a glow ring.
 */
const DRAW_S = 1.2;
const GRID = 36;
const SPOT = 380;
type P = { x: number; y: number };

const gridLines = (a: number) =>
  `linear-gradient(to right, rgba(162,135,87,${a}) 1px, transparent 1px), linear-gradient(to bottom, rgba(162,135,87,${a}) 1px, transparent 1px)`;

/** Smooth curve through points (Catmull-Rom → cubic Bézier) */
function smoothPath(pts: P[]) {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const colV: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 + i * 0.15, ease: luxEase } }),
};
const dotV: Variants = {
  hidden: { scale: 0.3, opacity: 0 },
  show: (t: number) => ({ scale: [0.3, 1.35, 1], opacity: 1, transition: { duration: 0.5, delay: t, ease: luxEase } }),
};

export default function GrowthTimeline({ title }: { title: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; t: number[] } | null>(null);
  const [len, setLen] = useState(0);
  const inView = useInView(boxRef, { margin: "80px 0px" });
  const remeasure = useRef<() => void>(() => {});
  const pointer = useRef({ x: 0, y: 0, raf: 0 });

  // Spotlight: write the pointer into CSS vars, throttled to one per frame
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pointer.current.x = e.clientX - r.left;
    pointer.current.y = e.clientY - r.top;
    if (pointer.current.raf) return;
    pointer.current.raf = requestAnimationFrame(() => {
      pointer.current.raf = 0;
      el.style.setProperty("--x", `${Math.round(pointer.current.x)}px`);
      el.style.setProperty("--y", `${Math.round(pointer.current.y)}px`);
    });
  };
  useEffect(() => {
    const ptr = pointer.current;
    return () => cancelAnimationFrame(ptr.raf);
  }, []);

  // Build the curve through the measured dot centres (desktop only)
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const br = { width: box.clientWidth, height: box.clientHeight };
      // Layout offsets (ignore the reveal/hover transforms). Each dot is the
      // first child of its column and centred in the column's content box
      // (items-center), so: x = content-box centre, y = top + padding-top.
      const dots = dotRefs.current.map((el) => {
        const li = el!.parentElement as HTMLElement;
        const cs = getComputedStyle(li);
        const pl = parseFloat(cs.paddingLeft);
        const pr = parseFloat(cs.paddingRight);
        return {
          x: li.offsetLeft + pl + (li.clientWidth - pl - pr) / 2,
          y: li.offsetTop + parseFloat(cs.paddingTop) + el!.offsetHeight / 2,
        };
      });
      // Stacked (mobile) → no curve
      if (dots.length < 3 || Math.abs(dots[0].y - dots[2].y) < 8 || dots[1].x <= dots[0].x) {
        setGeo(null);
        return;
      }
      const start = { x: Math.max(4, dots[0].x - (dots[1].x - dots[0].x) * 0.35), y: dots[0].y + (dots[0].y - dots[1].y) * 0.45 };
      const end = { x: Math.min(br.width - 4, dots[2].x + (dots[2].x - dots[1].x) * 0.35), y: dots[2].y - (dots[1].y - dots[2].y) * 0.3 };
      const pts = [start, ...dots, end];
      // When the drawing line reaches each dot (fraction of the horizontal run)
      const span = end.x - start.x || 1;
      const t = dots.map((p) => 0.05 + ((p.x - start.x) / span) * DRAW_S);
      setGeo({ w: br.width, h: br.height, d: smoothPath(pts), t });
    };
    // Re-measure whenever the box, the list or any column changes size (grid
    // settling, fonts loading, breakpoints) — the dots move with the columns.
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(box);
    box.querySelectorAll("ul, li").forEach((el) => ro.observe(el));
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener("resize", schedule);
    remeasure.current = schedule;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (inView) remeasure.current();
  }, [inView]);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [geo]);

  const half = SPOT / 2;

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="mx-auto w-full max-w-[1280px]">
      <motion.h3
        variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxEase } } }}
        className="text-center font-kanit font-normal text-2xl sm:text-3xl text-[#14171F]"
      >
        {title}
      </motion.h3>

      <div
        ref={frameRef}
        onMouseMove={onMove}
        className="group/frame relative mt-6 overflow-hidden rounded-3xl border border-[#a28757]/25 bg-[#FAF8F3] p-6 sm:p-8 lg:p-12 shadow-sm"
        style={{ backgroundImage: gridLines(0.08), backgroundSize: `${GRID}px ${GRID}px` }}
      >
        {/* Mouse spotlight — soft gold glow + brighter grid lines (kept aligned
            with the base grid), feathered by a static radial mask. Moves with
            translate3d only; hidden on touch layouts. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-500 group-hover/frame:opacity-100 max-md:hidden"
          style={{
            width: SPOT,
            height: SPOT,
            transform: `translate3d(calc(var(--x, -999px) - ${half}px), calc(var(--y, -999px) - ${half}px), 0)`,
            backgroundImage: `radial-gradient(circle at center, rgba(226,194,122,0.32), rgba(162,135,87,0.08) 45%, transparent 70%), ${gridLines(0.3)}`,
            backgroundSize: `100% 100%, ${GRID}px ${GRID}px, ${GRID}px ${GRID}px`,
            backgroundPosition: `0 0, calc(${half}px - var(--x, 0px)) calc(${half}px - var(--y, 0px)), calc(${half}px - var(--x, 0px)) calc(${half}px - var(--y, 0px))`,
            WebkitMaskImage: "radial-gradient(circle at center, #000 0%, transparent 70%)",
            maskImage: "radial-gradient(circle at center, #000 0%, transparent 70%)",
            willChange: "transform",
          }}
        />

        <div ref={boxRef} className="relative">
          {/* S-curve + comet (desktop) */}
          {geo && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo.w}
              height={geo.h}
              viewBox={`0 0 ${geo.w} ${geo.h}`}
              data-map-active={inView ? "true" : "false"}
            >
              <defs>
                <linearGradient id="growth-gold" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#cfc29f" />
                  <stop offset="55%" stopColor="#a28757" />
                  <stop offset="100%" stopColor="#8c7344" />
                </linearGradient>
              </defs>
              {/* soft under-glow */}
              <path d={geo.d} fill="none" stroke="#a28757" strokeOpacity="0.12" strokeWidth="8" strokeLinecap="round" />
              <motion.path
                ref={pathRef}
                d={geo.d}
                fill="none"
                stroke="url(#growth-gold)"
                strokeWidth="2.25"
                strokeLinecap="round"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: DRAW_S, ease: [0.45, 0, 0.25, 1] } } }}
              />
              {/* Glowing comet riding the curve (CSS stroke-dashoffset loop) */}
              {len > 0 && (
                <g style={{ ["--len" as string]: `${len}px`, ["--seg" as string]: "70px" } as React.CSSProperties}>
                  <path d={geo.d} fill="none" stroke="#e2c27a" strokeOpacity="0.55" strokeWidth="10" strokeLinecap="round" className="growth-comet" />
                  <path d={geo.d} fill="none" stroke="#b8913f" strokeWidth="3.5" strokeLinecap="round" className="growth-comet" />
                </g>
              )}
            </svg>
          )}

          {/* Stepped staircase columns — centred */}
          <ul className="relative grid grid-cols-1 md:grid-cols-3">
            {growthMilestones.map((m, i) => (
              <motion.li
                key={m.year}
                custom={i}
                variants={colV}
                className={`group flex flex-col items-center text-center md:px-5 lg:px-6 max-md:py-5 max-md:first:pt-0 max-md:last:pb-0 border-[#a28757]/15 max-md:border-b max-md:last:border-b-0 ${
                  i < 2 ? "md:border-r" : ""
                } ${["md:pt-28", "md:pt-14", "md:pt-0"][i]}`}
              >
                {/* Dot on the curve. The wrapper owns the hover scale (CSS
                    `scale`, separate from the reveal's transform) + glow ring. */}
                <span
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="relative z-10 block h-3 w-3 shrink-0 rounded-full transition-[scale,box-shadow] duration-300 group-hover:scale-125 group-hover:shadow-[0_0_0_5px_rgba(162,135,87,0.22),0_0_14px_4px_rgba(226,194,122,0.6)]"
                >
                  <motion.span
                    custom={geo ? geo.t[i] : 0.2 + i * 0.15}
                    variants={dotV}
                    className="block h-full w-full rounded-full border-2 border-[#a28757] bg-[#FAF8F3] shadow-[0_0_0_4px_rgba(162,135,87,0.12)] transition-colors duration-300 group-hover:bg-[#e2c27a]"
                  />
                </span>

                {/* Milestone card — lifts + brightens on hover */}
                <div className="mt-3 w-full max-w-xs rounded-2xl border border-transparent px-4 py-4 transition-[translate,background-color,border-color,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:border-[#a28757]/40 group-hover:bg-white/95 group-hover:shadow-md">
                  <p className="text-xs font-medium text-[#8c7344] font-sarabun">ปี พ.ศ. {m.year}</p>
                  <p className="mt-2 font-inter text-4xl lg:text-5xl font-light leading-none tracking-tight text-[#1C1F26] transition-colors duration-300 group-hover:text-[#a28757]">
                    <CountUp value={m.value} suffix="%+" duration={1.4} />
                  </p>
                  <p className="mt-3 font-sarabun text-sm leading-relaxed text-[#1C1F26]/65">{m.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
