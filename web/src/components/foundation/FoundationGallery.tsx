"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  wrap,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { foundationGallery } from "@/data/foundation-data";
import { useFoundationCopy } from "@/i18n";
import { Reveal, fadeUp, luxEase } from "@/components/home/motion";

const TILTS = [-4, 3, -2, 4, -3, 2];
const SPEED = 40; // px per second
const COPIES = 3; // enough strip to cover a 1760px shell

/**
 * Activities gallery (option A)
 *  A strip of tilted polaroids drifts left forever. Hover pauses it, a drag
 *  scrubs it (pointer pan adds to the same x), and a photo straightens and
 *  lifts under the pointer. A tap (no drag) opens the lightbox: arrows,
 *  ←/→ keys, swipe, Esc. The strip only animates while on screen.
 *  transform + opacity only; reduced motion = a static, scrollable row.
 */
export default function FoundationGallery() {
  const c = useFoundationCopy().gallery;
  const reduce = useReducedMotion();
  const items = foundationGallery.items;
  const [open, setOpen] = useState<number | null>(null);

  const stripRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null); // one copy, for the wrap width
  const inView = useInView(stripRef, { amount: 0.1 });
  const x = useMotionValue(0);
  const paused = useRef(false);
  const dragged = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || paused.current || open !== null) return;
    const w = setRef.current?.offsetWidth ?? 0;
    if (!w) return;
    x.set(wrap(-w, 0, x.get() - (SPEED * delta) / 1000));
  });

  const scrub = (dx: number) => {
    const w = setRef.current?.offsetWidth ?? 0;
    if (w) x.set(wrap(-w, 0, x.get() + dx));
  };

  return (
    <section aria-labelledby="foundation-gallery-title" className="overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      <div className="home-shell flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <motion.p variants={fadeUp} className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">
            <span aria-hidden className="h-px w-8 bg-[#a28757]" />
            {c.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} id="foundation-gallery-title" className="mt-5 font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] tracking-tight text-[#111e46]">
            {c.title}
          </motion.h2>
        </Reveal>
        <p className="font-sarabun text-sm text-[#14171F]/45">{c.hint}</p>
      </div>

      <div
        ref={stripRef}
        className={`mt-12 select-none ${reduce ? "overflow-x-auto" : "cursor-grab active:cursor-grabbing touch-pan-y"}`}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <motion.div
          className="flex w-max py-8"
          style={reduce ? undefined : { x }}
          onPointerDown={() => (dragged.current = 0)}
          onPanStart={() => (paused.current = true)}
          onPan={(_, info) => {
            if (reduce) return;
            dragged.current += Math.abs(info.delta.x);
            scrub(info.delta.x);
          }}
          onPanEnd={(e) => {
            if ((e as PointerEvent).pointerType !== "mouse") paused.current = false;
          }}
        >
          {Array.from({ length: reduce ? 1 : COPIES }).map((_, copy) => (
            <div key={copy} ref={copy === 0 ? setRef : undefined} className="flex gap-6 pr-6 sm:gap-10 sm:pr-10" aria-hidden={copy > 0}>
              {items.map((it, i) => {
                const k = copy * items.length + i;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    tabIndex={copy > 0 ? -1 : 0}
                    onClick={() => {
                      if (dragged.current < 6) setOpen(i);
                    }}
                    initial={{ rotate: TILTS[k % TILTS.length] }}
                    whileHover={reduce ? undefined : { rotate: 0, y: -14, scale: 1.04 }}
                    whileFocus={{ rotate: 0, y: -14, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="group w-[15rem] shrink-0 rounded-sm bg-white p-3 pb-4 text-left shadow-[0_22px_40px_-22px_rgba(17,30,70,0.55)] ring-1 ring-[#111e46]/5 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] sm:w-[19rem]"
                  >
                    <span className="block aspect-[4/5] overflow-hidden bg-[#F1EADC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.src}
                        alt={copy === 0 ? c.items[i]?.caption ?? it.caption : ""}
                        draggable={false}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    </span>
                    <span className="mt-3 block font-kanit text-base text-[#111e46]">{c.items[i]?.caption ?? it.caption}</span>
                    <span className="block font-sarabun text-xs text-[#14171F]/50">{c.items[i]?.place ?? it.place}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>

      <Lightbox index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}

function Lightbox({ index, onClose, onIndex }: { index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const c = useFoundationCopy().gallery;
  const items = foundationGallery.items;
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      onIndex(wrap(0, items.length, index + d));
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, go, onClose]);

  const it = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {it && index !== null && (
        <motion.div
          key="lb"
          role="dialog"
          aria-modal="true"
          aria-label={c.items[index]?.caption ?? it.caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1230]/95 p-4 sm:p-10"
          onClick={onClose}
        >
          <div className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 80, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -80, scale: 0.96 }}
                transition={{ duration: 0.5, ease: luxEase }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                className="flex max-h-full w-full flex-col items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={c.items[index]?.caption ?? it.caption} draggable={false} className="max-h-[72svh] w-auto max-w-full rounded-xl object-contain" />
                <figcaption className="mt-5 text-center">
                  <span className="block font-kanit text-lg text-white">{c.items[index]?.caption ?? it.caption}</span>
                  <span className="block font-sarabun text-sm text-white/55">
                    {c.items[index]?.place ?? it.place} · {index + 1}/{items.length}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <button type="button" onClick={() => go(-1)} aria-label={c.prev} className="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white hover:border-[#C8A96A] hover:text-[#C8A96A]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={c.next} className="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white hover:border-[#C8A96A] hover:text-[#C8A96A]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={c.close} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-8 sm:top-8">
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
