"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { ATLAS_INSET, ATLAS_VIEWBOX, ATLAS_ZONES, type AtlasZone } from "@/data/atlas-map";
import { useHomeCopy } from "@/i18n";
import { luxEase } from "./motion";

/* ==========================================================================
   Global Footprint Map — V.3 atlas (_reference/Home-Modern.html #csg-atlas)
   --------------------------------------------------------------------------
   • Map art is V.3's: a static base SVG (graticule, land, borders —
     public/img/atlas-base.svg) under one inline SVG with the 10 country
     outlines (src/data/atlas-map.ts), dotted Bézier routes from the Bangkok
     HQ, country dots, and the USA inset (bottom-left; the US outline lives
     inside it). A gold CSG emblem floats over the selected country.
   • Layout: V.3's design frame is 1440×810; the composition we show is its
     Asia–Europe–Australia crop VIEW (386,24 → 1432,810) fitted ("contain")
     into the area under the centred country bar.
   • Camera = { zoom 1–3.5×, centre in frame px } written as ONE transform
     (translate3d + scale) on the map layer through motion values — no React
     render per frame. +/− zoom about the centre, drag pans, reset returns to
     the crop. No wheel handler → page / Lenis scrolling stays intact.
   • Overlays stay at real pixel size: the centred bar (top), the coordinate
     pill (top-right), the USA inset pinned bottom-left (its own mini map; the
     HQ → US route is drawn in screen space from the camera so it stays on
     Bangkok while zooming), the country card docked beside the inset over
     the South Atlantic (never over a target country) and the zoom controls
     (bottom-right). On phones the bar sits above
     and the card below the map.
   • Hover: pointing at a country (map shape, dot, USA inset) or a bar button
     previews it — highlight, route, card — without a click; a click locks it
     and leaving returns to the locked country. A gold pulse rides the dashed
     route from the Bangkok HQ to the previewed country.
   • Motion: Framer transform + opacity only (card swap, emblem flip, active
     country fill fade). The selected route's dashes flow via CSS, paused off
     screen; reduced motion → no flow, float or flip.
   ========================================================================== */

/** V.3 crop shown at zoom 1 (frame px) */
const VIEW = { x: 386, y: 24, w: 1046, h: 786 };
const ZMIN = 1;
const ZMAX = 3.5;
const BAR_H = 64; // desktop: room for the centred country bar
const PAD = 14;

type Key = (typeof ATLAS_ZONES)[number]["key"];

/** Per-country card data: capital (V.3), its coordinates and a local photo */
const INFO: Record<string, { code: string; en: string; city: string; lat: number; lon: number; image: string }> = {
  th: { code: "TH", en: "Thailand", city: "Bangkok", lat: 13.7563, lon: 100.5018, image: "/img/Modern%20Chareonsin%20Group%20Entrance.jpg" },
  cn: { code: "CN", en: "China", city: "Beijing", lat: 39.9042, lon: 116.4074, image: "/img/businesses/leather.webp" },
  kr: { code: "KR", en: "South Korea", city: "Seoul", lat: 37.5665, lon: 126.978, image: "/img/businesses/textile.webp" },
  jp: { code: "JP", en: "Japan", city: "Tokyo", lat: 35.6762, lon: 139.6503, image: "/img/businesses/chemical.webp" },
  in: { code: "IN", en: "India", city: "New Delhi", lat: 28.6139, lon: 77.209, image: "/img/cat-leather.webp" },
  ae: { code: "AE", en: "United Arab Emirates", city: "Abu Dhabi", lat: 24.4539, lon: 54.3773, image: "/img/businesses/asset-condo.webp" },
  de: { code: "DE", en: "Germany", city: "Berlin", lat: 52.52, lon: 13.405, image: "/img/cat-other.webp" },
  gb: { code: "GB", en: "United Kingdom", city: "London", lat: 51.5072, lon: -0.1276, image: "/img/businesses/other.webp" },
  us: { code: "US", en: "United States", city: "Washington", lat: 38.9072, lon: -77.0369, image: "/img/businesses/building.webp" },
  au: { code: "AU", en: "Australia", city: "Canberra", lat: -35.2809, lon: 149.13, image: "/img/businesses/tile-realestate.webp" },
};

/** HQ pin (V.3): Charoensin building, Bangkok */
const HQ = { lat: 13.756111, lon: 100.501944 };

const pad2 = (n: number) => String(n).padStart(2, "0");
function dms(v: number, pos: string, neg: string) {
  const a = Math.abs(v);
  let d = Math.floor(a);
  const mf = (a - d) * 60;
  let m = Math.floor(mf);
  let s = Math.round((mf - m) * 60);
  if (s === 60) { s = 0; m++; }
  if (m === 60) { m = 0; d++; }
  return `${d}° ${pad2(m)}' ${pad2(s)}" ${v >= 0 ? pos : neg}`;
}
const coord = (lat: number, lon: number) => `${dms(lat, "N", "S")}, ${dms(lon, "E", "W")}`;

const hub = ATLAS_ZONES.find((z) => z.key === "th")!.dot;
/** V.3 route: quadratic Bézier from the hub, lifted by min(190, 0.32·dist) */
function routeTo(z: AtlasZone) {
  const [ax, ay] = z.dot;
  const mx = (hub[0] + ax) / 2;
  const my = (hub[1] + ay) / 2;
  const lift = Math.min(190, Math.hypot(ax - hub[0], ay - hub[1]) * 0.32);
  return `M${hub[0]} ${hub[1]}Q${mx} ${my - lift} ${ax} ${ay}`;
}
const ROUTES = Object.fromEntries(ATLAS_ZONES.filter((z) => z.key !== "th").map((z) => [z.key, routeTo(z)]));
/** US lives in the pinned inset (screen space), not on the main map */
const US = ATLAS_ZONES.find((z) => z.key === "us")!;
const MAP_ZONES = ATLAS_ZONES.filter((z) => z.key !== "us");

export default function FootprintMap() {
  const reduce = useReducedMotion();
  const copy = useHomeCopy().global.map;
  /** locked = clicked country; hover = mouse preview (wins while present) */
  const [locked, setLocked] = useState<Key>("th");
  const [hover, setHover] = useState<Key | null>(null);
  const key = hover ?? locked;
  const preview = (k: Key) => setHover(k);
  const endPreview = () => setHover(null);
  const zone = ATLAS_ZONES.find((z) => z.key === key)!;
  const index = ATLAS_ZONES.indexOf(zone);
  const info = INFO[key];
  const name = copy.countries[key]?.name ?? info.en;

  /* ---------------- Geometry ---------------- */
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1200, h: 720 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      if (el.clientWidth > 10 && el.clientHeight > 10) setBox({ w: el.clientWidth, h: el.clientHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);
  const inView = useInView(boxRef, { margin: "100px 0px" });

  const narrow = box.w < 640; // phones: bar above, card below the map
  const top = narrow ? 0 : BAR_H;
  const areaH = Math.max(1, box.h - top);
  /** zoom-1 scale: the V.3 crop "contain"-fitted under the bar */
  const s0 = Math.min(box.w / VIEW.w, areaH / VIEW.h);
  /** USA inset: pinned to the bottom-left corner (left-6 bottom-6), its own
      mini map at a fixed size — it no longer zooms with the main map */
  const insetW = narrow ? 104 : box.w >= 1024 ? 200 : 176;
  const insetH = (insetW * ATLAS_INSET.h) / ATLAS_INSET.w;
  const insetLeft = narrow ? 8 : 24;
  const insetTop = box.h - (narrow ? 8 : 24) - insetH;
  const insetK = insetW / ATLAS_INSET.w;
  const usDot = { x: insetLeft + (US.dot[0] - ATLAS_INSET.x) * insetK, y: insetTop + (US.dot[1] - ATLAS_INSET.y) * insetK };
  /** Docked card: right beside the inset, over the South Atlantic */
  const cardLeft = insetLeft + insetW + 16;

  /* ---------------- Camera (motion values → one transform) ---------------- */
  const z = useMotionValue(1);
  const cx = useMotionValue(VIEW.x + VIEW.w / 2);
  const cy = useMotionValue(VIEW.y + VIEW.h / 2);
  /** Zoom target (label + button states) — set once per zoom, not per frame */
  const [zoomLabel, setZoomLabel] = useState(1);

  /** Keep the view inside the crop (centred when the crop is smaller) */
  const clampC = useCallback(
    (zz: number, x: number, y: number) => {
      const S = s0 * zz;
      const hw = box.w / (2 * S);
      const hh = areaH / (2 * S);
      const fit = (c: number, lo: number, len: number, half: number) =>
        len <= half * 2 ? lo + len / 2 : Math.min(Math.max(c, lo + half), lo + len - half);
      return { x: fit(x, VIEW.x, VIEW.w, hw), y: fit(y, VIEW.y, VIEW.h, hh) };
    },
    [s0, box.w, areaH],
  );

  /** Layout geometry as motion values too, so a resize re-renders the
      transform (a useTransform callback only re-runs when its inputs change) */
  const gS = useMotionValue(s0);
  const gX = useMotionValue(box.w / 2);
  const gY = useMotionValue(top + areaH / 2);
  useEffect(() => {
    gS.set(s0);
    gX.set(box.w / 2);
    gY.set(top + areaH / 2);
  }, [gS, gX, gY, s0, box.w, top, areaH]);
  const transform = useTransform([z, cx, cy, gS, gX, gY], ([zz, x, y, s, ox, oy]: number[]) => {
    const S = s * zz;
    return `translate3d(${(ox - x * S).toFixed(2)}px, ${(oy - y * S).toFixed(2)}px, 0) scale(${S.toFixed(5)})`;
  });
  /** HQ → inset route in screen px: re-drawn from the camera motion values,
      so it stays attached to Bangkok while the map zooms / pans */
  const gUx = useMotionValue(usDot.x);
  const gUy = useMotionValue(usDot.y);
  useEffect(() => {
    gUx.set(usDot.x);
    gUy.set(usDot.y);
  }, [gUx, gUy, usDot.x, usDot.y]);
  const usRoute = useTransform([z, cx, cy, gS, gX, gY, gUx, gUy], ([zz, x, y, s, ox, oy, ux, uy]: number[]) => {
    const S = s * zz;
    const hx = ox + (hub[0] - x) * S;
    const hy = oy + (hub[1] - y) * S;
    const lift = Math.min(190 * S, Math.hypot(ux - hx, uy - hy) * 0.32);
    return `M${hx.toFixed(1)} ${hy.toFixed(1)}Q${((hx + ux) / 2).toFixed(1)} ${((hy + uy) / 2 - lift).toFixed(1)} ${ux.toFixed(1)} ${uy.toFixed(1)}`;
  });
  /** The emblem keeps its real pixel size (undoes the map scale and zoom) */
  const counter = useTransform([z, gS], ([v, s]: number[]) => `scale(${(1 / (v * s)).toFixed(4)})`);

  const flyTo = useCallback(
    (zz: number, x: number, y: number) => {
      const c = clampC(zz, x, y);
      setZoomLabel(Math.round(zz * 10) / 10);
      const opts = reduce ? { duration: 0 } : { duration: 0.75, ease: luxEase };
      animate(z, zz, opts);
      animate(cx, c.x, opts);
      animate(cy, c.y, opts);
    },
    [clampC, reduce, z, cx, cy],
  );

  // Re-clamp when the box resizes
  useEffect(() => {
    const c = clampC(z.get(), cx.get(), cy.get());
    cx.set(c.x);
    cy.set(c.y);
  }, [clampC, z, cx, cy]);

  const zoomBy = (f: number) => flyTo(Math.min(ZMAX, Math.max(ZMIN, z.get() * f)), cx.get(), cy.get());
  const reset = () => flyTo(1, VIEW.x + VIEW.w / 2, VIEW.y + VIEW.h / 2);

  const select = (k: Key) => {
    setLocked(k);
    // Zoomed in → glide to the country (at zoom 1 the whole crop is visible)
    if (z.get() > 1.01 && k !== "us") {
      const d = ATLAS_ZONES.find((x) => x.key === k)!.dot;
      flyTo(z.get(), d[0], d[1]);
    }
  };

  /* ---------------- Drag to pan ---------------- */
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (z.get() <= 1.01) return; // nothing to pan at zoom 1
    drag.current = { x: e.clientX, y: e.clientY, cx: cx.get(), cy: cy.get(), moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    d.moved = true;
    const S = s0 * z.get();
    const c = clampC(z.get(), d.cx - dx / S, d.cy - dy / S);
    cx.set(c.x);
    cy.set(c.y);
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current = null;
  };

  const usOn = key === "us";
  const flow = inView && !reduce;
  const zones = useMemo(() => ATLAS_ZONES, []);

  /* ---------------- Pieces ---------------- */
  /** Champagne-gold CS emblem on a cream disc, anchored at (0,0) = the dot.
      The PNG is used as a mask over a bright gold gradient — crisp at any
      size, no dark edge or shadow. Flips in on change; floats gently. */
  const emblem = (size: number, stem = 36) => (
    <>
      {stem > 0 && (
      <span
        className="absolute w-[1.5px] bg-[linear-gradient(rgba(200,169,106,0.08),#C8A96A)]"
        style={{ left: -0.75, top: -stem, height: stem }}
      />
      )}
      <div
        className={`absolute [perspective:520px] ${reduce ? "" : "atlas-float"}`}
        style={{ left: -size / 2, top: stem > 0 ? -(stem + size) : -size / 2, width: size, height: size }}
      >
        <motion.div
          key={key}
          className="grid h-full w-full place-items-center rounded-full border border-[#C8A96A]/50 bg-white/90 shadow-[0_4px_16px_rgba(255,255,255,0.95)]"
          initial={reduce ? false : { rotateY: -160, scale: 0.65 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: luxEase }}
        >
          <span
            className="block h-[62%] w-[62%]"
            style={{
              background: "linear-gradient(135deg,#E2C78B 0%,#C8A96A 55%,#E2C78B 100%)",
              WebkitMask: "url(/img/csg-emblem.png) center / contain no-repeat",
              mask: "url(/img/csg-emblem.png) center / contain no-repeat",
            }}
          />
        </motion.div>
      </div>
    </>
  );

  /** Pinned USA inset — its own mini map (fixed size, bottom-left corner) */
  const inset = (
    <div
      role="button"
      tabIndex={0}
      aria-label={copy.countries.us?.name ?? "United States"}
      aria-pressed={usOn}
      onClick={() => select("us")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select("us"))}
      onMouseEnter={() => preview("us")}
      onMouseLeave={endPreview}
      onFocus={() => preview("us")}
      onBlur={endPreview}
      className={`absolute z-20 cursor-pointer rounded-[4px] border bg-[#F7F5F0] transition-[border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] ${
        usOn ? "border-[#6B5A3A] shadow-[0_6px_18px_-8px_rgba(54,41,18,0.35)]" : "border-[#B39B6B]/55"
      }`}
      style={{ left: insetLeft, top: insetTop, width: insetW, height: insetH }}
    >
      <span className="absolute left-2 top-1.5 font-inter text-[8.5px] tracking-[0.16em] text-[#6B5A3A] sm:text-[9.5px]">USA · INSET</span>
      <svg viewBox={`${ATLAS_INSET.x} ${ATLAS_INSET.y} ${ATLAS_INSET.w} ${ATLAS_INSET.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path d={US.d} fill="transparent" stroke="#1F1F1F" strokeWidth={1.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <AnimatePresence>
          {usOn && (
            <motion.path
              key="us-fill"
              d={US.d}
              fill="#6B5A3A"
              stroke="#6B5A3A"
              strokeWidth={1.4}
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: luxEase }}
            />
          )}
        </AnimatePresence>
        <g transform={`translate(${US.dot[0]} ${US.dot[1]})`}>
          {usOn && !reduce && <circle r={8} fill="#B39B6B" opacity={0.18} className="map-hub-pulse" />}
          <circle r={8} fill="#B39B6B" opacity={0.18} />
          <circle r={usOn ? 6 : 4.6} fill={usOn ? "#C8A96A" : "#B39B6B"} stroke="#F7F5F0" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      {usOn && (
        <div aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ transform: `translate(${usDot.x - insetLeft}px, ${usDot.y - insetTop}px)` }}>
          {emblem(narrow ? 30 : 44, narrow ? 12 : 20)}
        </div>
      )}
    </div>
  );

  /** Zoom controls: bottom-right on the map (desktop), a row under it (phones) */
  const zoomCtl = (
        <div className={`z-20 flex items-center overflow-hidden rounded-xl border border-[#a28757]/25 bg-white/95 shadow-sm ${narrow ? "relative flex-row [&>button]:h-7 [&>button]:w-7 [&>span]:w-9 [&>span]:border-y-0 [&>span]:border-x [&>button:last-child]:border-t-0 [&>button:last-child]:border-l" : "absolute bottom-3 right-3 flex-col"}`}>
          <button type="button" onClick={() => zoomBy(1.4)} disabled={zoomLabel >= ZMAX - 0.01} aria-label={copy.zoomIn} className="grid h-9 w-9 place-items-center text-[#14171F] hover:bg-[#a28757]/10 disabled:opacity-30 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
          <span className="w-full border-y border-[#a28757]/15 py-1 text-center font-inter text-[10px] text-[#6B5A3A]" aria-live="polite">
            {zoomLabel.toFixed(1)}x
          </span>
          <button type="button" onClick={() => zoomBy(1 / 1.4)} disabled={zoomLabel <= ZMIN + 0.01} aria-label={copy.zoomOut} className="grid h-9 w-9 place-items-center text-[#14171F] hover:bg-[#a28757]/10 disabled:opacity-30 transition-colors">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={reset} aria-label={copy.reset} className="grid h-9 w-9 place-items-center border-t border-[#a28757]/15 text-[#14171F] hover:bg-[#a28757]/10 transition-colors">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
  );

  /** HQ → USA route + pulse in screen px (follows the camera) */
  const usRouteLayer = (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible">
      <motion.path
        id="atlas-us-route"
        d={usRoute}
        fill="none"
        stroke={usOn ? "#6B5A3A" : "#B39B6B"}
        strokeOpacity={usOn ? 0.95 : 0.6}
        strokeWidth={usOn ? 1.6 : 1.1}
        strokeDasharray="2 6"
        strokeLinecap="round"
        className={usOn && flow ? "map-dash-flow" : undefined}
      />
      {usOn && flow && (
        <g key="us-pulse">
          <circle r={7} fill="#B39B6B" opacity={0.28}>
            <animateMotion dur="1.8s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1">
              <mpath href="#atlas-us-route" />
            </animateMotion>
          </circle>
          <circle r={3.2} fill="#6B5A3A" stroke="#F7F5F0" strokeWidth={1}>
            <animateMotion dur="1.8s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1">
              <mpath href="#atlas-us-route" />
            </animateMotion>
          </circle>
        </g>
      )}
    </svg>
  );
  const bar = (
    <div role="tablist" aria-label={copy.choose} className={narrow ? "px-3 pt-3" : "absolute inset-x-0 top-3 z-20 px-3 pointer-events-none"}>
      <div className="mx-auto w-fit max-w-full pointer-events-auto" onMouseLeave={endPreview}>
        <div className="flex justify-start gap-1 overflow-x-auto rounded-2xl border border-[#a28757]/20 bg-white/90 p-1.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {zones.map((zz) => {
            const on = zz.key === key;
            return (
              <button
                key={zz.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(zz.key)}
                onMouseEnter={() => preview(zz.key)}
                onFocus={() => preview(zz.key)}
                onBlur={endPreview}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-kanit text-[13px] leading-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] ${
                  on ? "bg-[#14171F] text-white" : "text-[#14171F]/75 hover:bg-[#a28757]/10 hover:text-[#14171F]"
                }`}
              >
                <span className={`font-inter text-[10px] tracking-[0.14em] ${on ? "text-[#cfc29f]" : "text-[#a28757]"}`}>{INFO[zz.key].code}</span>
                {copy.countries[zz.key]?.name ?? INFO[zz.key].en}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const card = (
    <article
      aria-live="polite"
      style={narrow ? undefined : { left: cardLeft }}
      className={
        narrow
          ? "mx-3 mb-3 flex gap-3 rounded-2xl border border-[#a28757]/30 bg-[#FBF8F1] p-2"
          : "absolute bottom-6 z-20 w-[250px] lg:w-[270px] rounded-[14px] border border-[#b39b6b]/45 bg-[#FBF8F1]/[0.97] p-2 shadow-[0_2px_4px_rgba(20,16,10,0.06),0_14px_34px_rgba(54,41,18,0.12)]"
      }
    >
      {/* Photo: cross-fade + settle */}
      <div className={`relative overflow-hidden rounded-lg bg-[#D9CBAA] ${narrow ? "aspect-[4/3] w-28 shrink-0" : "aspect-[2/1] w-full"}`}>
        <AnimatePresence initial={false}>
          <motion.div
            key={info.image + key}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: luxEase }}
          >
            <Image src={info.image} alt="" fill sizes="280px" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          className={narrow ? "min-w-0 py-0.5" : "px-1 pb-0.5 pt-2.5"}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: luxEase }}
        >
          <div className="flex items-center gap-1.5 font-inter text-[9.5px] tracking-[0.14em] text-[#857A66]">
            <span>{pad2(index + 1)}</span>
            <span className="relative block h-px w-[34px] overflow-hidden bg-[#1b1e23]/20">
              <span className="absolute inset-0 origin-left bg-[#6B5A3A]" style={{ transform: `scaleX(${(index + 1) / zones.length})` }} />
            </span>
            <span>{pad2(zones.length)}</span>
          </div>
          <p className="mt-0.5 font-kanit text-[21px] leading-tight text-[#1F1F1F]">{name}</p>
          <p className="font-inter text-[9.5px] uppercase tracking-[0.12em] text-[#6B5A3A]">
            {info.en} · {info.city}
          </p>
          <p className="mt-0.5 font-sarabun text-[12px] leading-snug text-[#4A4438] line-clamp-2">{copy.countries[key]?.desc}</p>
        </motion.div>
      </AnimatePresence>
    </article>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#a28757]/20 bg-[#F7F5F0] shadow-md">
      {narrow && bar}

      <div
        ref={boxRef}
        className="relative w-full aspect-[1046/786] sm:aspect-auto sm:h-[480px] lg:h-[530px] overflow-hidden select-none touch-pan-y bg-[radial-gradient(ellipse_at_78%_30%,#fff_0%,transparent_55%)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseLeave={endPreview}
      >
        {/* ================= Map layer (camera transform) ================= */}
        <motion.div className="absolute left-0 top-0 origin-top-left" style={{ transform }}>
          {/* Static base art (V.3): graticule, land, borders */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/atlas-base.svg"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute max-w-none"
            style={{ left: ATLAS_VIEWBOX.x, top: ATLAS_VIEWBOX.y, width: ATLAS_VIEWBOX.w, height: ATLAS_VIEWBOX.h }}
          />
          <svg
            viewBox={`${ATLAS_VIEWBOX.x} ${ATLAS_VIEWBOX.y} ${ATLAS_VIEWBOX.w} ${ATLAS_VIEWBOX.h}`}
            className="absolute overflow-visible"
            style={{ left: ATLAS_VIEWBOX.x, top: ATLAS_VIEWBOX.y, width: ATLAS_VIEWBOX.w, height: ATLAS_VIEWBOX.h }}
            role="img"
            aria-label={copy.label}
            data-map-active={flow ? "true" : "false"}
          >
            {/* Country outlines (9 — the US is drawn in the pinned inset) */}
            {MAP_ZONES.map((zz) => (
              <path
                key={zz.key}
                d={zz.d}
                fill="transparent"
                stroke="#1F1F1F"
                strokeWidth={1.4}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer"
                onClick={() => select(zz.key)}
                onMouseEnter={() => preview(zz.key)}
                onMouseLeave={endPreview}
              />
            ))}
            {/* Selected country fill — fades in (opacity only) */}
            <AnimatePresence>
              {key !== "us" && (
              <motion.path
                key={`fill-${key}`}
                d={zone.d}
                fill="#6B5A3A"
                stroke="#6B5A3A"
                strokeWidth={1.8}
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: luxEase }}
              />
              )}
            </AnimatePresence>

            {/* Routes from the Bangkok HQ (the US route is drawn in screen space) */}
            {MAP_ZONES.map((zz) =>
              zz.key === "th" ? null : (
                <path
                  key={`r-${zz.key}`}
                  d={ROUTES[zz.key]}
                  fill="none"
                  stroke={zz.key === key ? "#6B5A3A" : "#B39B6B"}
                  strokeOpacity={zz.key === key ? 0.95 : 0.6}
                  strokeWidth={zz.key === key ? 1.6 : 1.1}
                  strokeDasharray="2 6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  className={zz.key === key ? "map-dash-flow" : undefined}
                />
              ),
            )}

            {/* Gold pulse travelling HQ → the hovered / selected country (SMIL
                motion along the same route — no layout or paint per frame on
                the map). Off screen or reduced motion: none. */}
            {key !== "th" && key !== "us" && flow && (
              <g key={`pulse-${key}`} pointerEvents="none">
                <circle r={8} fill="#B39B6B" opacity={0.28}>
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={ROUTES[key]} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
                </circle>
                <circle r={3.4} fill="#6B5A3A" stroke="#F7F5F0" strokeWidth={1} vectorEffect="non-scaling-stroke">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={ROUTES[key]} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
                </circle>
              </g>
            )}

            {/* Country dots */}
            {MAP_ZONES.map((zz) => {
              const on = zz.key === key;
              return (
                <g key={`d-${zz.key}`} transform={`translate(${zz.dot[0]} ${zz.dot[1]})`} className="cursor-pointer" onClick={() => select(zz.key)} onMouseEnter={() => preview(zz.key)} onMouseLeave={endPreview}>
                  {on && !reduce && <circle r={8} fill="#B39B6B" opacity={0.18} className="map-hub-pulse" />}
                  <circle r={8} fill="#B39B6B" opacity={0.18} />
                  <circle r={on ? 6 : 4.6} fill={on ? "#6B5A3A" : "#B39B6B"} stroke="#F7F5F0" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                  <circle r={13} fill="transparent" />
                </g>
              );
            })}
          </svg>

          {/* Champagne emblem over the selected country (keeps its size while
              zooming). The US emblem sits in the pinned inset instead. */}
          {key !== "us" && (
            <div aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ transform: `translate(${zone.dot[0]}px, ${zone.dot[1]}px)` }}>
              <motion.div style={{ transform: counter }} className="origin-top-left">{narrow ? emblem(28, 0) : emblem(56)}</motion.div>
            </div>
          )}
        </motion.div>

        {usRouteLayer}
        {inset}

        {!narrow && bar}

        {/* Coordinates (top-right) */}
        {!narrow && (
          <div aria-live="polite" className="absolute right-4 top-[4.75rem] z-10 rounded-full bg-[#F7F5F0]/90 px-3.5 py-1.5 text-right font-inter text-[10.2px] leading-[17px] tracking-[0.06em] text-[#4A4438]">
            <div>
              {info.en.toUpperCase()} · <span className="text-[#6B5A3A]">{coord(info.lat, info.lon)}</span>
            </div>
            <div>
              HQ · <span className="text-[#6B5A3A]">{coord(HQ.lat, HQ.lon)}</span>
            </div>
          </div>
        )}

        {!narrow && card}

        {!narrow && zoomCtl}
      </div>

      {/* Phones: zoom controls sit under the map (the map is too short to
          share its corners with the emblem), then the card */}
      {narrow && <div className="flex justify-end px-3 pt-2">{zoomCtl}</div>}
      {narrow && card}
    </div>
  );
}
