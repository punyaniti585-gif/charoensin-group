/**
 * Content + timeline for the Home sticky stage (Hero intro → 80th pull-back).
 * Kept separate from the component so copy/links can change without touching
 * the render loop.
 */

export interface StageCard {
  number: string;
  titleTh: string;
  titleEn: string;
  image: string;
  href: string;
  /** Direction the card slides in from */
  from: "left" | "right" | "bottom";
}

export const stageCopy = {
  headlineSr: "กลุ่มบริษัทเจริญสิน — Charoensin Group",
  motto: "สร้างสรรค์อย่างยั่งยืน เติบโตอย่างมั่นคง",
  scrollHint: "เลื่อนลงเพื่อสำรวจ 5 กลุ่มธุรกิจ",
};

export const stageImages = {
  sky: "/img/home/sky.webp",
  building: "/img/charoensin-building-hq.jpg",
  /** Pillars + canopy fascia cut from the building photo (same 1024×682 frame) */
  foreground: "/img/home/building-foreground.webp",
  /** Standard horizontal Charoensin Group logo (same file as the Navbar) */
  logo: "/img/csg-logo.png",
  emblem: "/img/80th-anniversary-gold.png",
};

/** Building photo aspect (1024 × 682) — all photo layers share this frame */
export const PHOTO_ASPECT = 1024 / 682;

/** Order = slide-in order; 01/03 from the left, 02/04 from the right, 05 from below */
export const stageCards: StageCard[] = [
  { number: "01", titleTh: "ธุรกิจอสังหาริมทรัพย์", titleEn: "Real Estate", image: "/img/home/cat-realestate.webp", href: "#businesses", from: "left" },
  { number: "02", titleTh: "ธุรกิจผลิตหนังและรองเท้า", titleEn: "Leather & Footwear", image: "/img/home/cat-leather.webp", href: "#businesses", from: "right" },
  { number: "03", titleTh: "ธุรกิจสิ่งทอ", titleEn: "Non-woven Textiles", image: "/img/home/cat-textile.webp", href: "#businesses", from: "left" },
  { number: "04", titleTh: "ธุรกิจเคมีภัณฑ์และอุตสาหกรรม", titleEn: "Chemical & Industrial", image: "/img/home/cat-chemical.webp", href: "#businesses", from: "right" },
  { number: "05", titleTh: "ธุรกิจอื่นๆ", titleEn: "Other Ventures", image: "/img/home/cat-other.webp", href: "#businesses", from: "bottom" },
];

/**
 * Scroll timeline (p = smoothed progress through the 160vh sticky stage, 0 → 1).
 * Each entry is [start, end] for that layer's 0 → 1 tween.
 */
export const TIMELINE = {
  headlineOut: [0.0, 0.3],
  pullBack: [0.05, 0.5],
  tint: [0.08, 0.45],
  emblemIn: [0.2, 0.45],
  /** Crossing this (raw) progress auto-plays the 5 cards — no more scrolling needed */
  cardsTrigger: 0.35,
  /** Scrolling back above this hides them again (hysteresis avoids flicker) */
  cardsReset: 0.28,
} as const;

/** Card auto-play sequence (time-based, seconds) */
export const CARDS_PLAY = {
  stagger: 0.12,
  duration: 0.5,
  /** All cards fade out together when scrolling back up */
  outDuration: 0.3,
} as const;

/** Intro (on load) — seconds */
export const INTRO = {
  scene: { delay: 0, duration: 1.8 },
  /** Logo mask reveal: 0.8s, ease [0.22, 1, 0.36, 1] */
  headline: { delay: 0.45, duration: 0.8 },
} as const;
