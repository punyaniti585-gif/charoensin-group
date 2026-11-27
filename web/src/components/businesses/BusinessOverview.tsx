import React from "react";
import type { BusinessPageData } from "@/data/businesses-data";
import BusinessHero from "./BusinessHero";
import BusinessStats from "./BusinessStats";
import BusinessManifesto from "./BusinessManifesto";
import BusinessIndex from "./BusinessIndex";
import BusinessChapter from "./BusinessChapter";
import FloatingJumpBar from "./FloatingJumpBar";

const STATS_ID = "business-stats";

/**
 * 03. ธุรกิจของเรา — page body (Option A: Editorial Chapters)
 *
 * Hero (text + 3D cards, full first screen) → Stats → Manifesto →
 * Group index → 5 chapters.
 * Receives all content as props (see getBusinessPageData) so the source can
 * move to WordPress REST without UI changes.
 */
export default function BusinessOverview({ data }: { data: BusinessPageData }) {
  return (
    <>
      <BusinessHero hero={data.hero} ctaTargetId={STATS_ID} />
      <BusinessStats id={STATS_ID} stats={data.stats} />
      <BusinessManifesto manifesto={data.manifesto} />
      <BusinessIndex groups={data.groups} />
      {data.groups.map((group, i) => (
        <BusinessChapter key={group.id} group={group} index={i} />
      ))}
      <FloatingJumpBar groups={data.groups} revealAfterId={STATS_ID} />
    </>
  );
}
