/**
 * "ธุรกิจที่ขับเคลื่อนอนาคต" (Future-Driving Ventures) — home page bento.
 *
 * Company facts, descriptions and sister-company lists are read from
 * businesses-data.ts (single source of truth); taglines are the ones used on
 * the live site (homepage-data.json). Images, logos and videos are the files
 * already in /public plus the existing video URLs.
 */
import { businessGroups, type BusinessGroup, type Company } from "./businesses-data";

export interface VentureVideo {
  title: string;
  type: "youtube" | "mp4";
  url: string;
}

export interface VentureTheme {
  /** Panel background */
  base: string;
  /** Panels / gradients */
  mid: string;
  /** Accent: active tab, CTA */
  acc: string;
  /** Light tint: kickers, logo tile */
  light: string;
}

export interface Venture {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  /** Short line used on the live site */
  tagline: string;
  description: string;
  /** Big hero tile + detail backdrop */
  heroImage: string;
  /** Secondary media tile (video poster when `video` is set) */
  mediaImage: string;
  video: VentureVideo | null;
  logo: string;
  fact: { value: string; unit?: string; label: string };
  highlight: string;
  list: { title: string; items: { name: string; en?: string; note?: string }[] };
  /** "Group" tile: where the venture sits in the Charoensin structure */
  group: { label: string; name: string; href: string };
  /** Detail CTA */
  href: string;
  ctaLabel: string;
  theme: VentureTheme;
}

const group = (id: string): BusinessGroup => {
  const g = businessGroups.find((x) => x.id === id);
  if (!g) throw new Error(`business group "${id}" not found`);
  return g;
};
const company = (g: BusinessGroup, id: string): Company => {
  const c = g.companies.find((x) => x.id === id);
  if (!c) throw new Error(`company "${id}" not found in ${g.id}`);
  return c;
};
const shortList = (g: BusinessGroup) =>
  g.companies.map((c) => ({
    name: c.nameTh.replace(/^บริษัท\s*/, "").replace(/\s*จำกัด.*$/, ""),
    /** Registered English short name, shown in non-Thai languages */
    en: (c.nameEn ?? c.shortName).replace(/\s*\(.*?\)\s*$/, "").replace(/\s*(Public\s+)?Co\.,?\s*Ltd\.?$/i, ""),
    note: c.tagline,
  }));

const chemical = group("chemical");
const leather = group("leather-footwear");
const nonwoven = group("non-woven");
const other = group("other");

const adb = company(chemical, "adb");
const cpl = company(leather, "cpl");
const ttn = company(nonwoven, "ttn");

export const ventures: Venture[] = [
  {
    id: "adb",
    code: "ADB",
    nameTh: "แอ็พพลาย ดีบี",
    nameEn: "Applied DB Public Co., Ltd.",
    tagline: "ผลิตภัณฑ์กาวและวัสดุสำหรับอุตสาหกรรม",
    description: adb.description ?? chemical.description,
    heroImage: chemical.image,
    mediaImage: "/img/thumb-adb.jpg",
    video: {
      title: "วิดีโอแนะนำ แอ็พพลาย ดีบี (ADB)",
      type: "youtube",
      url: "https://www.youtube.com/embed/HnI4uXJYhfE?autoplay=1&playsinline=1&rel=0",
    },
    logo: "/img/affiliate-adb.png",
    fact: { value: adb.facts?.[0]?.value ?? "2548", label: adb.facts?.[0]?.label ?? "ปีที่ก่อตั้ง" },
    highlight: chemical.highlights[0],
    list: { title: "บริษัทในกลุ่มเคมีภัณฑ์", items: shortList(chemical) },
    group: { label: "กลุ่มธุรกิจ", name: chemical.nameTh, href: `/businesses#${chemical.id}` },
    href: adb.detailHref ?? adb.website ?? `/businesses#${chemical.id}`,
    ctaLabel: "ดูกลุ่มธุรกิจเคมีภัณฑ์",
    theme: { base: "#0C1C2D", mid: "#164B78", acc: "#2F78B4", light: "#C7DBEC" },
  },
  {
    id: "cpl",
    code: "CPL",
    nameTh: "ซีพีแอล กรุ๊ป",
    nameEn: "CPL Group Public Co., Ltd.",
    tagline: "ความเชี่ยวชาญด้านการผลิตและงานหนัง",
    description: cpl.description ?? leather.description,
    heroImage: leather.image,
    mediaImage: "/img/cat-leather.webp",
    video: {
      title: "วิดีโอแนะนำ ซีพีแอล กรุ๊ป (CPL)",
      type: "mp4",
      url: "https://csgok.sfinsulations.com/wp-content/uploads/2025/12/0_Leatherworking_Leather_1280x720.mp4",
    },
    logo: "/img/affiliate-cpl.png",
    fact: { value: cpl.facts?.[0]?.value ?? "4", label: cpl.facts?.[0]?.label ?? "ประเทศ สำนักงานตัวแทน" },
    highlight: leather.highlights[0],
    list: { title: "บริษัทในกลุ่มหนังและรองเท้า", items: shortList(leather) },
    group: { label: "กลุ่มธุรกิจ", name: leather.nameTh, href: `/businesses#${leather.id}` },
    href: cpl.detailHref ?? cpl.website ?? `/businesses#${leather.id}`,
    ctaLabel: "ไปยังหน้า ซีพีแอล กรุ๊ป",
    theme: { base: "#2B1512", mid: "#7A2E24", acc: "#B04A36", light: "#EBCFC4" },
  },
  {
    id: "ttn",
    code: "TTN",
    nameTh: "ทีทีเอ็น นันวูเว่น โซลูชั่น",
    nameEn: "TTN Nonwoven Solution Co., Ltd.",
    tagline: "วัสดุนอนวูเว่นเพื่อภาคอุตสาหกรรม",
    description: ttn.description ?? nonwoven.description,
    heroImage: nonwoven.image,
    mediaImage: "/img/thumb-ttn.jpg",
    video: {
      title: "วิดีโอแนะนำ ทีทีเอ็น นันวูเว่น (TTN)",
      type: "youtube",
      url: "https://www.youtube.com/embed/0EEwVXLixNQ?autoplay=1&playsinline=1&rel=0",
    },
    logo: "/img/affiliate-ttn.png",
    fact: { value: ttn.facts?.[0]?.value ?? "35+", label: ttn.facts?.[0]?.label ?? "ปีประสบการณ์" },
    highlight: nonwoven.highlights[1] ?? nonwoven.highlights[0],
    list: { title: "บริษัทในกลุ่มสิ่งทอ", items: shortList(nonwoven) },
    group: { label: "กลุ่มธุรกิจ", name: nonwoven.nameTh, href: `/businesses#${nonwoven.id}` },
    href: ttn.website ?? ttn.detailHref ?? `/businesses#${nonwoven.id}`,
    ctaLabel: "เว็บไซต์ ทีทีเอ็น นันวูเว่น",
    theme: { base: "#0F2429", mid: "#2D6270", acc: "#4A8192", light: "#C9DFE3" },
  },
  {
    id: "tws",
    code: "TWS",
    nameTh: "ไทย ไวร์ริ่ง ซิสเต็ม",
    nameEn: "Thai Wiring System Co., Ltd.",
    tagline: "ผลิตภัณฑ์ลวดและโซลูชันงานวิศวกรรม",
    description: other.description,
    heroImage: other.image,
    mediaImage: "/img/cat-other.webp",
    video: null,
    logo: "/img/affiliate-tws.png",
    fact: { value: String(other.companies.length), unit: "บริษัท", label: "ในกลุ่มธุรกิจอื่นๆ" },
    highlight: other.highlights[1] ?? other.tagline,
    list: { title: "บริษัทในกลุ่มธุรกิจอื่นๆ", items: shortList(other) },
    group: { label: "กลุ่มธุรกิจ", name: other.nameTh, href: `/businesses#${other.id}` },
    href: "https://csgok.sfinsulations.com/wiring",
    ctaLabel: "ไปยังหน้า ไทย ไวร์ริ่ง ซิสเต็ม",
    theme: { base: "#161A20", mid: "#3D4A5A", acc: "#6B7C90", light: "#D3DAE2" },
  },
  {
    id: "foundation",
    code: "CSR",
    nameTh: "มูลนิธิร่วมเจริญสิน",
    nameEn: "Charoensin Foundation",
    tagline: "ส่งต่อโอกาส เพื่อชุมชนและสังคม",
    description:
      "สร้างอนาคตให้เด็กที่ยากไร้ และชนบทที่ขาดแคลน ด้วยการส่งเสริมการศึกษา พัฒนาสังคม และคุณภาพชีวิตที่ยั่งยืน",
    heroImage: "/img/charoensin-building-hq.jpg",
    mediaImage: "/img/cover-bg.webp",
    video: {
      title: "วิดีโอสนับสนุนการศึกษาเด็ก มูลนิธิร่วมเจริญสิน",
      type: "mp4",
      url: "https://csgok.sfinsulations.com/wp-content/uploads/2026/03/%E0%B8%AA%E0%B8%99%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%99%E0%B8%B8%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81.mp4",
    },
    logo: "/img/affiliate-foundation.png",
    fact: { value: "3", unit: "ด้าน", label: "พันธกิจเพื่อสังคม" },
    highlight: "ร่วมสร้างคุณค่า ส่งต่อโอกาสสู่ชุมชน",
    list: {
      title: "พันธกิจของมูลนิธิ",
      items: [{ name: "ส่งเสริมการศึกษา" }, { name: "พัฒนาสังคมและชุมชน" }, { name: "คุณภาพชีวิตที่ยั่งยืน" }],
    },
    group: {
      label: "เพื่อสังคม",
      name: "มูลนิธิร่วมเจริญสิน",
      href: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
    },
    href: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
    ctaLabel: "ไปยังหน้ามูลนิธิ",
    theme: { base: "#2A2419", mid: "#6B5A3A", acc: "#B39B6B", light: "#D9CBAA" },
  },
];
