"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { CompanyPhoto } from "@/data/businesses-data";
import { useT } from "@/i18n";
import { luxEase } from "./motion";

/**
 * Full-screen image viewer shared by /businesses and /businesses/[slug].
 * ← / → change photo, Esc closes, Tab stays inside, focus returns to the
 * opener. Motion is transform + opacity only; reduced motion → fade only.
 */
export default function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
  label,
}: {
  photos: CompanyPhoto[];
  /** Open photo, or null when closed */
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** Dialog name, e.g. the company name */
  label: string;
}) {
  const { t } = useT();
  const reduce = useReducedMotion();
  // true only in the browser (portal target exists), false during static render
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [dir, setDir] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const count = photos.length;

  const go = useCallback(
    (step: number) => {
      if (index === null || count < 2) return;
      setDir(step);
      onIndex((index + step + count) % count);
    },
    [index, count, onIndex],
  );

  // Remember the opener, lock page scroll, focus the close button; undo on close
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!mounted) return null;
  const photo = index !== null ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#0a1026]/95"
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4" onClick={(e) => e.stopPropagation()}>
            <p className="min-w-0 font-kanit text-sm text-[#C8A96A] truncate" aria-live="polite">
              <span className="tabular-nums">{index + 1} / {count}</span>
              <span className="mx-2 text-white/30">·</span>
              <span className="text-white/80">{t(photo.alt)}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("ปิด")}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#C8A96A] text-white hover:text-[#111e46] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo */}
          <motion.div
            initial={reduce ? false : { scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={reduce ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.4, ease: luxEase }}
            className="relative flex-1 min-h-0 mx-2 sm:mx-20 lg:mx-24 mb-4 sm:mb-8"
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={photo.src}
                custom={dir}
                variants={{
                  enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 40, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -40, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.2 : 0.45, ease: luxEase }}
                className="absolute inset-0"
              >
                <Image
                  src={photo.src}
                  alt={t(photo.alt)}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {count > 1 && (
            <>
              <NavButton side="left" label={t("ภาพก่อนหน้า")} onClick={() => go(-1)} />
              <NavButton side="right" label={t("ภาพถัดไป")} onClick={() => go(1)} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const noopSubscribe = () => () => {};

function NavButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-2 sm:left-5" : "right-2 sm:right-5"} z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-[#C8A96A]/70 bg-[#111e46]/70 text-white hover:bg-[#C8A96A] hover:text-[#111e46] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A]`}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}

/** Corner badge shown on hover over a zoomable photo */
export function ZoomBadge({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-[#111e46]/80 text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-[opacity,transform] duration-300 ${className}`}
    >
      <Maximize2 className="w-3.5 h-3.5" />
    </span>
  );
}
