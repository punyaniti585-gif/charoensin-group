/**
 * Home Hero (2-act cinematic typography → frame zoom-out) — copy and data.
 * The 5 pillars (names, images, links) come from businesses-data.ts.
 */
import { businessGroups } from "@/data/businesses-data";

export const heroCopy = {
  /** Act 1 — script line over the giant display word */
  script: "80th Anniversary • Since 1946",
  /** Intro — emblem that rises out of the gold splash */
  introEmblem: "/img/csg-emblem.png",
  display: "CHAROENSIN",
  displaySr: "กลุ่มบริษัทเจริญสิน — Charoensin Group",
  /** Top corners (Act 1) */
  logo: "/img/csg-logo.png",
  emblem: "/img/80th-anniversary-gold.png",
  /** Main frame (Act 1 full-bleed → Act 2 framed) */
  frameImage: "/img/charoensin-building-hq.jpg",
  frameAlt: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน",
  /** Act 2 heading */
  eyebrow: "Our Businesses",
  title: "5 กลุ่มธุรกิจหลักของเจริญสิน",
  allHref: "/businesses",
};

export interface HeroPillar {
  id: string;
  number: string;
  nameTh: string;
  nameEn: string;
  tagline: string;
  image: string;
  imageAlt: string;
  href: string;
  /** Expanded card (click) — from businesses-data.ts */
  description: string;
  highlights: string[];
  companies: string[];
}

/** Card labels follow the home-page naming of the 5 groups */
const DOCK_NAMES: Record<string, string> = {
  "real-estate": "ธุรกิจอสังหาริมทรัพย์",
  "leather-footwear": "ธุรกิจผลิตหนังและรองเท้า",
  "non-woven": "ธุรกิจสิ่งทอ",
  chemical: "ธุรกิจเคมีภัณฑ์และอุตสาหกรรม",
  other: "ธุรกิจอื่นๆ",
};

export const heroPillars: HeroPillar[] = businessGroups.map((g) => ({
  id: g.id,
  number: g.number,
  nameTh: DOCK_NAMES[g.id] ?? g.nameTh,
  nameEn: g.nameEn,
  tagline: g.tagline,
  image: g.image,
  imageAlt: g.imageAlt,
  href: `/businesses#${g.id}`,
  description: g.description,
  highlights: g.highlights,
  companies: g.companies.map((c) => c.shortName),
}));

