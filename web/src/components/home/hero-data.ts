/**
 * Home Hero (2-act cinematic typography → frame zoom-out) — copy and data.
 * The 5 pillars (names, images, links) come from businesses-data.ts.
 */
import { businessGroups } from "@/data/businesses-data";

export const heroCopy = {
  /** Act 1 — italic kicker over the giant display word (V.3) */
  script: "Trusted. Established. Future-Focused.",
  /** Intro — emblem that rises out of the gold splash */
  introEmblem: "/img/csg-emblem.png",
  display: "Charoensin",
  displaySr: "กลุ่มบริษัทเจริญสิน — Charoensin Group",
  /** Top corners (Act 1) */
  contactHref: "/contact",
  contactLabel: "ติดต่อเรา",
  logo: "/img/csg-logo.png",
  emblem: "/img/80th-anniversary-gold.png",
  /** Main frame (Act 1 full-bleed → Act 2 framed) */
  /** HQ entrance (file name has spaces → URL-encoded so it always loads) */
  frameImage: "/img/Modern%20Chareonsin%20Group%20Entrance.jpg",
  frameAlt: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน",
  /** Act 2 heading */
  eyebrow: "Our Businesses",
  title: "5 กลุ่มธุรกิจหลักของเจริญสิน",
  /** V.1 hero line */
  tagline: "สร้างคุณค่า เติบโตอย่างมั่นคง",
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
/** V.1 one-line card descriptions (main: HeroCover) */
const DOCK_DESC: Record<string, string> = {
  "real-estate": "พัฒนาที่อยู่อาศัยและพื้นที่พาณิชย์",
  "leather-footwear": "หนังฟอกและอุปกรณ์เซฟตี้สากล",
  "non-woven": "เส้นใยและสิ่งทอไม่ถักทอ",
  chemical: "กาว ยาแนว และยางสังเคราะห์",
  other: "สินเชื่อ พลังงาน และกิจการเพื่อสังคม",
};

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
  tagline: DOCK_DESC[g.id] ?? g.tagline,
  image: g.image,
  imageAlt: g.imageAlt,
  href: `/businesses#${g.id}`,
  description: g.description,
  highlights: g.highlights,
  companies: g.companies.map((c) => c.shortName),
}));

