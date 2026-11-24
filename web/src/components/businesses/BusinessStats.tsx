"use client";

import React from "react";
import type { BusinessPageData } from "@/data/businesses-data";
import StatsHoverGrid from "@/components/common/StatsHoverGrid";

type Props = Pick<BusinessPageData, "stats"> & { id: string };

/**
 * Stats band directly after the Hero — four hover-reveal tiles (shared
 * StatsHoverGrid). Tiles rise in with a stagger and count up when the band
 * scrolls into view; hovering reveals each tile's photo.
 */
export default function BusinessStats({ stats, id }: Props) {
  return (
    <section
      id={id}
      aria-label="ศักยภาพกลุ่มธุรกิจเจริญสิน"
      className="relative w-full bg-white py-12 sm:py-14 lg:py-16 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsHoverGrid stats={stats} />
      </div>
    </section>
  );
}
