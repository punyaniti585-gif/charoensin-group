"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { VentureVideo } from "@/data/ventures-data";
import { useT } from "@/i18n";

/** Fullscreen video modal (YouTube embed or MP4), portalled to <body>. */
export default function VideoModal({ video, onClose }: { video: VentureVideo | null; onClose: () => void }) {
  const { t } = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, onClose]);

  // Portal to <body>: the section sits inside a sticky layer with a transform,
  // which would otherwise trap a position:fixed modal inside it.
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/85"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t(video.title)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#B39B6B]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1F1F1F]">
              <h4 className="text-sm sm:text-base font-semibold font-kanit text-white">{t(video.title)}</h4>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="p-1.5 rounded-full bg-white/10 hover:bg-[#B39B6B] text-white hover:text-black transition-colors"
                aria-label={t("ปิดหน้าต่างวิดีโอ")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {video.type === "youtube" ? (
                <iframe
                  src={video.url}
                  title={t(video.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video src={video.url} controls autoPlay playsInline className="w-full h-full object-contain">
                  {t("เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้")}
                </video>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
