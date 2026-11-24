"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { MapPin, Minus, Plus, RotateCcw } from "lucide-react";
import { WORLD_BORDERS, WORLD_LAND, WORLD_VIEWBOX } from "@/data/world-map";
import { hubMarket, markets, type Market } from "@/data/global-data";
import { luxEase } from "./motion";

/* ==========================================================================
   Global Footprint Map — real country outlines + travel routes, one screen
   • Pre-projected vector paths (world-atlas 110m) — no map library at runtime.
   • Camera = { zoom 1–3.5×, centre in map units }, applied as ONE CSS
     transform (translate3d + scale) on the HTML wrapper → compositor-driven.
     Country select frames Bangkok + destination inside the area that the
     floating pill bar and info card leave free; +/− zoom about the centre;
     drag pans (pointer events). No wheel handler → page / Lenis scroll intact.
   • Route: quadratic Bézier from Bangkok drawn with Framer pathLength, spark at
     the tip; on arrival the country fills gold and a label pops.
   ========================================================================== */

const VW = WORLD_VIEWBOX.width;
const VH = WORLD_VIEWBOX.height;
const ZMIN = 1;
const ZMAX = 3.5;
const CAMERA_MS = 750;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Pt = { x: number; y: number };
type View = { z: number; cx: number; cy: number };

/** Curved route: control point lifted perpendicular to the chord */
function routeOf(a: Pt, b: Pt) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const lift = Math.min(140, len * 0.28);
  const c = { x: mx + nx * lift, y: my + ny * lift };
  return { c, d: `M ${a.x} ${a.y} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x} ${b.y}` };
}

export default function FootprintMap() {
  const reduce = useReducedMotion();
  const [code, setCode] = useState(hubMarket.code);
  const [arrived, setArrived] = useState<string | null>(hubMarket.code);
  const active = markets.find((m) => m.code === code) ?? hubMarket;

  /* ---------------- Geometry ---------------- */
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1200, h: 600 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      // Ignore transient zero sizes (hidden / not laid out yet) — they would make the scale 0
      if (el.clientWidth > 10 && el.clientHeight > 10) setBox({ w: el.clientWidth, h: el.clientHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);
  const inView = useInView(boxRef, { margin: "100px 0px" });

  const narrow = box.w < 640; // mobile: info card sits below the map
  const k0 = Math.min(box.w / VW, box.h / VH); // contain scale (zoom 1×)
  const TOP_PAD = narrow ? 64 : 76; // floating pill bar
  const CARD_W = narrow ? 0 : Math.min(400, box.w * 0.34); // bottom-left card (+ margin)

  /** Keep the view inside the map (or centred when the map is smaller) */
  const clampView = useCallback(
    (v: View): View => {
      const z = clamp(v.z, ZMIN, ZMAX);
      const S = k0 * z;
      const mapW = VW * S;
      const mapH = VH * S;
      let tx = box.w / 2 - v.cx * S;
      let ty = box.h / 2 - v.cy * S;
      tx = mapW <= box.w ? (box.w - mapW) / 2 : clamp(tx, box.w - mapW, 0);
      ty = mapH <= box.h ? (box.h - mapH) / 2 : clamp(ty, box.h - mapH, 0);
      return { z, cx: (box.w / 2 - tx) / S, cy: (box.h / 2 - ty) / S };
    },
    [box.w, box.h, k0]
  );

  const overview = useCallback((): View => {
    if (!narrow) return { z: 1, cx: VW / 2, cy: VH / 2 };
    // Narrow screens: fill the frame height, centred on the Bangkok hub region
    const z = clamp((box.h - TOP_PAD) / (VH * k0), 1, ZMAX);
    return { z, cx: hubMarket.city.x, cy: hubMarket.city.y };
  }, [narrow, box.h, k0, TOP_PAD]);

  /** Frame Bangkok + destination inside the unobstructed area */
  const focusOn = useCallback(
    (m: Market): View => {
      if (m.hub) return overview();
      const [x0, y0, x1, y1] = m.bbox;
      const bx0 = Math.min(x0, hubMarket.city.x) - 20;
      const by0 = Math.min(y0, hubMarket.city.y) - 34; // room for the label
      const bx1 = Math.max(x1, hubMarket.city.x) + 20;
      const by1 = Math.max(y1, hubMarket.city.y) + 16;
      const availW = box.w - CARD_W - 48;
      const availH = box.h - TOP_PAD - 36;
      const z = clamp(Math.min(availW / ((bx1 - bx0) * k0), availH / ((by1 - by0) * k0)), ZMIN, ZMAX);
      const S = k0 * z;
      const sx = CARD_W + 24 + availW / 2; // screen point the frame centre should land on
      const sy = TOP_PAD + 12 + availH / 2;
      const fcx = (bx0 + bx1) / 2;
      const fcy = (by0 + by1) / 2;
      return { z, cx: fcx - (sx - box.w / 2) / S, cy: fcy - (sy - box.h / 2) / S };
    },
    [box.w, box.h, k0, CARD_W, TOP_PAD, overview]
  );

  /* ---------------- Camera state ---------------- */
  const [view, setView] = useState<View>({ z: 1, cx: VW / 2, cy: VH / 2 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setView(clampView(focusOn(active)));
  }, [active, focusOn, clampView]);

  const S = k0 * view.z;
  const tx = box.w / 2 - view.cx * S;
  const ty = box.h / 2 - view.cy * S;
  const inv = 1 / S; // map units per screen px — keeps pins/labels a constant size

  const zoomBy = (f: number) => setView((v) => clampView({ ...v, z: v.z * f }));
  const reset = () => {
    setCode(hubMarket.code);
    setView(clampView(overview()));
  };

  /* ---------------- Drag to pan (pointer events; no wheel) ---------------- */
  const drag = useRef<{ id: number; x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    setView((v) => clampView({ ...v, cx: d.cx - dx / S, cy: d.cy - dy / S }));
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    suppressClick.current = d.moved;
    drag.current = null;
    setDragging(false);
  };
  const select = (c: string) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setCode(c);
  };

  /* ---------------- Route animation ---------------- */
  const progress = useMotionValue(0);
  const route = useMemo(() => (active.hub ? null : routeOf(hubMarket.city, active.city)), [active]);
  const sparkX = useTransform(progress, (t) => {
    if (!route) return 0;
    const a = hubMarket.city, c = route.c, b = active.city;
    return (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x;
  });
  const sparkY = useTransform(progress, (t) => {
    if (!route) return 0;
    const a = hubMarket.city, c = route.c, b = active.city;
    return (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y;
  });
  const sparkOpacity = useTransform(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (active.hub) {
      setArrived(active.code);
      return;
    }
    setArrived(null);
    progress.set(0);
    if (reduce) {
      progress.set(1);
      setArrived(active.code);
      return;
    }
    const controls = animate(progress, 1, {
      duration: 0.9,
      delay: 0.15,
      ease: [0.45, 0, 0.2, 1],
      onComplete: () => setArrived(active.code),
    });
    return () => controls.stop();
  }, [active, progress, reduce]);

  const overviewRoutes = useMemo(
    () => markets.filter((m) => !m.hub).map((m) => ({ code: m.code, ...routeOf(hubMarket.city, m.city) })),
    []
  );

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-[#a28757]/20 bg-[#FAF8F3] shadow-md">
        <div className="relative">
        {/* ---------------- Map viewport (camera) ---------------- */}
        <div
          ref={boxRef}
          className={`relative w-full h-[62vh] sm:h-[66vh] min-h-[460px] sm:min-h-[520px] max-h-[680px] overflow-hidden select-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: VW,
              height: VH,
              transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${S.toFixed(4)})`,
              transition: reduce || dragging ? "none" : `transform ${CAMERA_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
          >
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              width={VW}
              height={VH}
              className="block"
              role="img"
              aria-label="แผนที่ฐานธุรกิจและเครือข่าย 10 ประเทศของกลุ่มบริษัทเจริญสิน"
              data-map-active={inView ? "true" : "false"}
            >
              <path d={WORLD_LAND} fill="#EBE4D5" />
              <path d={WORLD_BORDERS} fill="none" stroke="#D8CEB8" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />

              {/* The 10 markets: faint tint always; gold fill + outline on arrival */}
              {markets.map((m) => {
                const lit = arrived === m.code;
                return (
                  <path
                    key={m.code}
                    d={m.d}
                    onClick={() => select(m.code)}
                    className="cursor-pointer"
                    fill="#a28757"
                    stroke="#a28757"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      fillOpacity: lit ? 0.22 : 0.1,
                      strokeOpacity: lit ? 1 : 0,
                      strokeWidth: 2,
                      transition: "fill-opacity 400ms ease, stroke-opacity 400ms ease",
                    }}
                  />
                );
              })}

              {/* Overview: all routes from Bangkok */}
              <AnimatePresence>
                {active.hub &&
                  overviewRoutes.map((r, i) => (
                    <motion.path
                      key={`ov-${r.code}`}
                      d={r.d}
                      fill="none"
                      stroke="#a28757"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0.55 }}
                      animate={{ pathLength: 1, opacity: 0.55 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        pathLength: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.2 + i * 0.06, ease: luxEase },
                        opacity: { duration: 0.3 },
                      }}
                    />
                  ))}
              </AnimatePresence>

              {/* Selected route */}
              {route && (
                <g key={`route-${active.code}`}>
                  <path d={route.d} fill="none" stroke="#a28757" strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <motion.path
                    d={route.d}
                    fill="none"
                    stroke="#a28757"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength: progress }}
                  />
                  <motion.circle cx={sparkX} cy={sparkY} r={8 * inv} fill="#f3e2b0" style={{ opacity: sparkOpacity }} />
                  <motion.circle cx={sparkX} cy={sparkY} r={3.5 * inv} fill="#fff" style={{ opacity: sparkOpacity }} />
                </g>
              )}

              {/* City pins (constant screen size) */}
              {markets.map((m) => {
                const on = m.code === code;
                return (
                  <g key={`pin-${m.code}`} className="cursor-pointer" onClick={() => select(m.code)}>
                    {(m.hub || (on && arrived === m.code)) && (
                      <circle cx={m.city.x} cy={m.city.y} r={8 * inv} fill="none" stroke="#a28757" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="map-hub-pulse" />
                    )}
                    <circle
                      cx={m.city.x}
                      cy={m.city.y}
                      fill={m.hub ? "#14171F" : on ? "#a28757" : "#b9a77f"}
                      stroke="#fff"
                      strokeWidth="1.8"
                      vectorEffect="non-scaling-stroke"
                      style={
                        {
                          r: (m.hub ? 6.5 : on ? 6 : 4.5) * inv,
                          transition: reduce || dragging ? "none" : `r ${CAMERA_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
                        } as React.CSSProperties
                      }
                    />
                  </g>
                );
              })}

              {/* HQ label (always) */}
              <g transform={`translate(${hubMarket.city.x} ${hubMarket.city.y}) scale(${inv})`} pointerEvents="none">
                <text x="11" y="20" fontSize="12" fontFamily="var(--font-inter)" fontWeight="600" letterSpacing="1.2" fill="#14171F" fillOpacity="0.75">
                  HQ • BANGKOK
                </text>
              </g>

              {/* Destination label pops on arrival */}
              <AnimatePresence>
                {arrived && !active.hub && arrived === active.code && (
                  <g key={`label-${active.code}`} transform={`translate(${active.city.x} ${active.city.y}) scale(${inv})`} pointerEvents="none">
                    <motion.g
                      initial={{ opacity: 0, y: 8, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: luxEase }}
                    >
                      <rect x={-68} y={-50} width={136} height={32} rx={16} fill="#14171F" />
                      <text x={-50} y={-29} fontSize="11" fontFamily="var(--font-inter)" fontWeight="600" letterSpacing="1.4" fill="#cfc29f">
                        {active.code}
                      </text>
                      <text x={-28} y={-29} fontSize="12.5" fontFamily="var(--font-kanit)" fill="#fff">
                        {active.nameTh}
                      </text>
                      <path d="M -6 -18 L 0 -11 L 6 -18 Z" fill="#14171F" />
                    </motion.g>
                  </g>
                )}
              </AnimatePresence>
            </svg>
          </div>
        </div>

        {/* ---------------- Floating pill bar (top) ---------------- */}
        <div className="absolute inset-x-3 top-3 z-20">
          <div
            role="tablist"
            aria-label="เลือกประเทศ"
            className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#a28757]/20 bg-white/85 backdrop-blur-md p-2 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {markets.map((m) => {
              const on = m.code === code;
              return (
                <button
                  key={m.code}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCode(m.code)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-kanit text-[13px] transition-colors duration-300 ${
                    on ? "bg-[#14171F] text-white" : "text-[#14171F]/70 hover:bg-[#a28757]/10 hover:text-[#14171F]"
                  }`}
                >
                  <span className={`font-inter text-[10px] tracking-[0.14em] ${on ? "text-[#cfc29f]" : "text-[#a28757]"}`}>{m.code}</span>
                  {m.nameTh}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- Zoom controls (bottom-right) ---------------- */}
        <div className="absolute right-3 bottom-3 z-20 flex flex-col items-center overflow-hidden rounded-xl border border-[#a28757]/25 bg-white/95 shadow-sm">
          <button type="button" onClick={() => zoomBy(1.4)} disabled={view.z >= ZMAX - 0.01} aria-label="ซูมเข้า" className="grid h-9 w-9 place-items-center text-[#14171F] hover:bg-[#a28757]/10 disabled:opacity-35">
            <Plus className="h-4 w-4" />
          </button>
          <span className="w-full border-y border-[#a28757]/15 py-1 text-center font-inter text-[10px] text-[#6B5A3A]" aria-live="polite">
            {view.z.toFixed(1)}×
          </span>
          <button type="button" onClick={() => zoomBy(1 / 1.4)} disabled={view.z <= ZMIN + 0.01} aria-label="ซูมออก" className="grid h-9 w-9 place-items-center text-[#14171F] hover:bg-[#a28757]/10 disabled:opacity-35">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={reset} aria-label="กลับมุมมองภาพรวม" className="grid h-9 w-9 place-items-center border-t border-[#a28757]/15 text-[#14171F] hover:bg-[#a28757]/10">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        </div>

        {/* ---------------- Info card (bottom-left on desktop, below on mobile) ---------------- */}
        <div className="sm:absolute sm:left-3 sm:bottom-3 sm:z-20 sm:w-[min(23rem,33%)] border-t sm:border border-[#a28757]/20 bg-white/95 sm:rounded-2xl p-4 sm:p-5 sm:shadow-[0_18px_40px_-22px_rgba(40,30,15,0.45)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: luxEase }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#a28757]" />
                <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-[#a28757]">
                  {active.hub ? "Headquarters" : "Market & Partner"} · {active.code}
                </p>
              </div>
              <p className="mt-1.5 font-kanit text-lg sm:text-xl text-[#14171F]">
                {active.nameTh} <span className="text-sm text-[#14171F]/45">{active.nameEn}</span>
              </p>
              <p className="font-sarabun text-xs text-[#14171F]/50">
                {active.hub ? "สำนักงานใหญ่ · " : "เมืองหลัก · "}
                {active.city.th}
              </p>
              <p className="mt-1.5 font-sarabun text-[13px] leading-relaxed text-[#14171F]/70">{active.role}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {active.groups.map((g) => (
                  <span key={g} className="rounded-full bg-[#a28757]/10 px-2.5 py-0.5 font-kanit text-[11px] text-[#6B5A3A]">
                    {g}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
