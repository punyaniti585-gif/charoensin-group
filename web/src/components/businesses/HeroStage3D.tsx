"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { BusinessPageData } from "@/data/businesses-data";
import { luxEase } from "./motion";

type Tile = BusinessPageData["hero"]["tiles"][number];

/**
 * Desktop slots — brick layout that reads in order:
 *   01 · 02 · 03   (top row)
 *     04 · 05      (bottom row, offset half a card)
 * Each card sits a step further forward in depth, so 01→05 also reads as a
 * cascade toward the viewer on the tilted stage.
 */
const SLOTS = [
  { left: "0%", top: "3%", width: "31%", height: "45%", z: 0 }, // 01
  { left: "34.5%", top: "0%", width: "31%", height: "45%", z: 15 }, // 02
  { left: "69%", top: "3%", width: "31%", height: "45%", z: 30 }, // 03
  { left: "17.25%", top: "52%", width: "31%", height: "45%", z: 45 }, // 04
  { left: "51.75%", top: "55%", width: "31%", height: "45%", z: 60 }, // 05
];

/** Stage tilt (deg) — cards counter-rotate to face the viewer on hover */
const TILT_X = 8;
const TILT_Y = -8;

/**
 * Hero 3D perspective cards.
 * - lg+: tilted stage (rotateX 8° / rotateY -8°), cards on staggered Z planes,
 *   glass labels, soft shadows. Hover lifts a card and turns it upright.
 *   Scrolling slides the cards up diagonally and adds a slight twist,
 *   staggered 01→05 (transform/opacity only).
 * - <lg: flat 2-column grid (no 3D) so nothing overflows on phones.
 */
export default function HeroStage3D({
  tiles,
  progress,
}: {
  tiles: Tile[];
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const stageRotateX = useTransform(progress, [0, 1], [TILT_X, TILT_X + 6]);

  return (
    <>
      {/* ---------- Desktop: 3D stage ---------- */}
      <div
        className="hidden lg:block relative h-[clamp(380px,60vh,540px)]"
        style={{ perspective: "1800px", perspectiveOrigin: "60% 40%" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            rotateX: reduce ? TILT_X : stageRotateX,
            rotateY: TILT_Y,
          }}
        >
          {tiles.map((tile, i) => (
            <StageCard key={tile.groupId + i} tile={tile} index={i} progress={progress} reduce={!!reduce} />
          ))}
        </motion.div>
      </div>

      {/* ---------- Mobile / tablet: flat grid ---------- */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {tiles.map((tile, i) => (
          <motion.a
            key={tile.groupId + i}
            href={`#${tile.groupId}`}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: luxEase }}
            className={`group relative overflow-hidden rounded-2xl border border-[#CCA369]/30 bg-[#E9DFCC] shadow-[0_10px_24px_rgba(107,90,58,0.14)] ${
              i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            <CardFace tile={tile} sizes="(max-width: 1024px) 50vw, 1px" compact={i !== 0} />
          </motion.a>
        ))}
      </div>
    </>
  );
}

function StageCard({
  tile,
  index,
  progress,
  reduce,
}: {
  tile: Tile;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const slot = SLOTS[index];
  const [hover, setHover] = useState(false);
  const [entered, setEntered] = useState(false);

  // Scroll-linked diagonal slide-up + twist, staggered by index
  const start = index * 0.05;
  const end = 0.75 + index * 0.05;
  const y = useTransform(progress, [start, end], [0, -(60 + index * 22)]);
  const x = useTransform(progress, [start, end], [0, -(18 + index * 8)]);
  const rotateZ = useTransform(progress, [start, end], [0, -(1.5 + index * 0.6)]);

  return (
    // Outer: placement + scroll motion
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: slot.left,
        top: slot.top,
        width: slot.width,
        height: slot.height,
        transformStyle: "preserve-3d",
        x: reduce ? 0 : x,
        y: reduce ? 0 : y,
        rotateZ: reduce ? 0 : rotateZ,
        zIndex: hover ? 100 : slot.z,
      }}
    >
      {/* Inner: entrance + hover (lift and turn upright) */}
      <motion.a
        href={`#${tile.groupId}`}
        aria-label={`${tile.number} ${tile.group} — ${tile.label}`}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        initial={reduce ? false : { opacity: 0, z: slot.z - 120, y: 40 }}
        animate={
          hover && !reduce
            ? { opacity: 1, z: slot.z + 70, y: -10, rotateX: -TILT_X, rotateY: -TILT_Y, scale: 1.03 }
            : { opacity: 1, z: slot.z, y: 0, rotateX: 0, rotateY: 0, scale: 1 }
        }
        onAnimationComplete={() => setEntered(true)}
        transition={
          hover
            ? { duration: 0.5, ease: luxEase }
            : { duration: 0.9, ease: luxEase, delay: entered ? 0 : 0.25 + index * 0.12 }
        }
        className={`group block w-full h-full rounded-2xl overflow-hidden border bg-[#E9DFCC] shadow-[0_22px_44px_-20px_rgba(107,90,58,0.45)] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCA369] ${
          hover ? "border-[#CCA369]" : "border-white/50"
        }`}
      >
        <CardFace tile={tile} sizes="(max-width: 1024px) 1px, 22vw" priority flatGlass />
      </motion.a>
    </motion.div>
  );
}

/** Photo + glass number badge + glass label */
/**
 * flatGlass: inside the moving 3D stage, backdrop-filter would be recomputed
 * on every scroll frame, so the stage uses a tinted (non-blurred) glass.
 */
function CardFace({
  tile,
  sizes,
  compact = false,
  priority = false,
  flatGlass = false,
}: {
  tile: Tile;
  sizes: string;
  compact?: boolean;
  priority?: boolean;
  flatGlass?: boolean;
}) {
  const glass = flatGlass ? "bg-[#1F1F1F]/40" : "bg-white/15 backdrop-blur-md";
  const badgeGlass = flatGlass ? "bg-[#1F1F1F]/70" : "bg-[#1F1F1F]/55 backdrop-blur-md";
  return (
    <>
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

      {/* Glass number badge */}
      <span className={`absolute top-2.5 left-2.5 inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-full ${badgeGlass} border border-[#E6C786]/70 font-playfair text-base font-semibold text-[#E6C786] shadow-[0_6px_16px_rgba(0,0,0,0.3)]`}>
        {tile.number}
      </span>
      <span className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full ${glass} border border-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        <ArrowUpRight className="w-4 h-4" />
      </span>

      {/* Glass label */}
      <span
        className={`absolute left-2.5 right-2.5 bottom-2.5 rounded-xl ${glass} border border-white/35 text-white ${
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        }`}
      >
        <span className={`block font-kanit font-semibold leading-tight drop-shadow ${compact ? "text-xs" : "text-sm"}`}>
          {tile.group}
        </span>
        <span className={`block font-sarabun text-white/85 leading-snug truncate ${compact ? "text-[10px]" : "text-[11px]"}`}>
          {tile.label}
        </span>
      </span>
    </>
  );
}
