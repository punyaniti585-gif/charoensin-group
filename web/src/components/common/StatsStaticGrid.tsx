import React from "react";

export interface StaticStat {
  title: string;
  value: number;
  /** Unit under the number, e.g. "ปี" */
  unit: string;
  /** Appended straight after the number, e.g. "+" or "%" */
  suffix?: string;
  decimals?: number;
  /** Optional small line under the unit */
  note?: string;
}

/** Deterministic number formatting (same output on server and client) */
function formatValue(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Static stats grid — clean white tiles with hairline dividers and crisp,
 * still numbers. No motion, no hover effects, no client JS, so scrolling past
 * it costs nothing. (The hover-reveal variant, StatsHoverGrid, is still used
 * on /businesses.)
 */
export default function StatsStaticGrid({
  stats,
  className = "",
}: {
  stats: StaticStat[];
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 ${className}`}
    >
      {stats.map((s) => (
        <div
          key={s.title}
          className="flex flex-col items-center justify-center text-center bg-white px-6 py-10 sm:py-12 lg:py-14"
        >
          <dt className="font-kanit text-base sm:text-lg font-medium text-[#151824]">{s.title}</dt>
          <dd className="mt-4 flex flex-col items-center">
            <span className="font-playfair text-5xl sm:text-6xl font-semibold leading-none tracking-tight text-[#151824]">
              {formatValue(s.value, s.decimals)}
              {s.suffix}
            </span>
            <span className="mt-3 font-sarabun text-sm sm:text-base text-[#151824]/70">{s.unit}</span>
            {s.note && <span className="mt-1 font-sarabun text-xs text-[#9A7B3E]">{s.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
