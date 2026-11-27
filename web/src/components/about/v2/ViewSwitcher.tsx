"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Compass, Crown } from "lucide-react";
import { VIEW_ORDER, type ViewId } from "./ui";

const ICONS: Record<ViewId, React.ComponentType<{ className?: string }>> = {
  history: History,
  vision: Compass,
  leadership: Crown,
};

/** Segmented tab bar for the three About views. `variant="bar"` sits under
    the hero; `variant="pill"` is the compact floating one. */
export default function ViewSwitcher({
  view,
  onChange,
  labels,
  ariaLabel,
  variant,
}: {
  view: ViewId;
  onChange: (v: ViewId) => void;
  labels: Record<ViewId, string>;
  ariaLabel: string;
  variant: "bar" | "pill";
}) {
  const pill = variant === "pill";
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={
        pill
          ? "flex items-center gap-1 rounded-full border border-[#C8A96A]/40 bg-[#111e46] p-1.5 shadow-[0_18px_40px_-18px_rgba(17,30,70,0.7)]"
          : "flex w-full flex-col gap-1.5 rounded-[1.5rem] border border-[#C8A96A]/30 bg-white p-1.5 sm:flex-row"
      }
    >
      {VIEW_ORDER.map((id) => {
        const active = id === view;
        const Icon = ICONS[id];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="about-view-panel"
            onClick={() => onChange(id)}
            className={`relative flex items-center justify-center gap-2 rounded-full font-kanit transition-colors duration-300 ${
              pill
                ? `px-3.5 py-2 text-[13px] sm:px-4 ${active ? "text-[#111e46]" : "text-white/75 hover:text-white"}`
                : `flex-1 px-5 py-3.5 text-[15px] lg:text-base ${active ? "text-white" : "text-[#111e46]/70 hover:text-[#111e46]"}`
            }`}
          >
            {active && (
              <motion.span
                layoutId={`about-switch-${variant}`}
                className={`absolute inset-0 rounded-full ${pill ? "bg-[#C8A96A]" : "bg-[#111e46]"}`}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                aria-hidden
              />
            )}
            <Icon className={`relative h-4 w-4 shrink-0 ${!pill && active ? "text-[#C8A96A]" : ""}`} />
            <span className="relative whitespace-nowrap">{labels[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
