/**
 * News & Activities — single source of truth.
 *
 * Every place that lists news reads from this file: the home page
 * "ข่าวสารและกิจกรรม" deck now, and the /news index page next. Add a new item
 * here (newest date first is not required — helpers sort by date) and it
 * appears everywhere at once.
 *
 * TODO(content): titles, dates and excerpts below are PLACEHOLDERS — replace
 * them with the real announcements. The links (Facebook posts and the
 * existing WordPress pages) and cover images are real.
 */

export interface NewsItem {
  id: string;
  /** URL-safe key, used for /news/[slug] later */
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  excerpt: string;
  /** Cover image — must exist in /public */
  image: string;
  /** Where "อ่านรายละเอียด" goes until an internal detail page exists */
  externalUrl: string;
}

export const NEWS_CATEGORIES = [
  "กิจกรรมองค์กร",
  "ข่าวสารกลุ่มธุรกิจ",
  "ความยั่งยืน",
  "ร่วมงานกับเรา",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** Index page for all news (to be built next) */
export const NEWS_INDEX_HREF = "/news";

export const newsItems: NewsItem[] = [
  {
    id: "n-001",
    slug: "corporate-activity-latest",
    title: "กิจกรรมองค์กรล่าสุดของกลุ่มบริษัทเจริญสิน",
    category: "กิจกรรมองค์กร",
    date: "2026-11-18",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมองค์กรล่าสุด จากเพจทางการของกลุ่มบริษัทเจริญสิน",
    image: "/img/businesses/building.webp",
    externalUrl:
      "https://www.facebook.com/CharoensinGroup/posts/pfbid0FW9daEYB5PydsQwWyVNminAgi8TTsmwMrF3WAPmqzq5LmbTRLsv7i7CVdMR56pBJl",
  },
  {
    id: "n-002",
    slug: "business-group-update",
    title: "อัปเดตความเคลื่อนไหวจากกลุ่มธุรกิจในเครือ",
    category: "ข่าวสารกลุ่มธุรกิจ",
    date: "2026-11-12",
    excerpt: "ข่าวสารและความคืบหน้าจากบริษัทในเครือทั้ง 5 กลุ่มธุรกิจของเจริญสิน",
    image: "/img/businesses/leather.webp",
    externalUrl:
      "https://www.facebook.com/CharoensinGroup/posts/pfbid0mnFKdu35RDH4vmENDzmet3YuEF15QvKHVyDStmLY4jTJ1WJJTQN7zyvRDKXPqX2jl",
  },
  {
    id: "n-003",
    slug: "innovation-sustainability",
    title: "นวัตกรรมและความยั่งยืน เพื่อการเติบโตอย่างมั่นคง",
    category: "ความยั่งยืน",
    date: "2026-11-05",
    excerpt: "แนวทางการพัฒนานวัตกรรมและการดำเนินธุรกิจอย่างยั่งยืนของกลุ่มบริษัทเจริญสิน",
    image: "/img/businesses/other.webp",
    externalUrl:
      "https://www.facebook.com/CharoensinGroup/posts/pfbid02AAKTeopJ26fkmqK9bqZcU7BAxVBd4kodHXsvPPAmV47ogyKbRzVAbCELvJkpvXCal",
  },
  {
    id: "n-004",
    slug: "executive-news",
    title: "ข่าวสารผู้บริหารและประกาศบริษัท",
    category: "ข่าวสารกลุ่มธุรกิจ",
    date: "2026-10-28",
    excerpt: "รวมข่าวสารจากผู้บริหารและประกาศสำคัญของกลุ่มบริษัทเจริญสิน",
    image: "/img/businesses/chemical.webp",
    externalUrl: "https://csgok.sfinsulations.com/new2026/",
  },
  {
    id: "n-005",
    slug: "careers-open-positions",
    title: "เปิดรับสมัครงาน ร่วมเติบโตไปกับเจริญสิน",
    category: "ร่วมงานกับเรา",
    date: "2026-10-20",
    excerpt: "ตำแหน่งงานที่เปิดรับ พร้อมข้อมูลการอบรมและสัมมนาสำหรับพนักงาน",
    image: "/img/businesses/textile.webp",
    externalUrl: "https://csgok.sfinsulations.com/mycareer2026/",
  },
  {
    id: "n-006",
    slug: "wongcharoensin-foundation",
    title: "มูลนิธิวงษ์เจริญสิน กับกิจกรรมเพื่อสังคม",
    category: "ความยั่งยืน",
    date: "2026-10-12",
    excerpt: "กิจกรรมเพื่อชุมชนและสังคมที่ดำเนินงานโดยมูลนิธิวงษ์เจริญสิน",
    image: "/img/businesses/tile-realestate.webp",
    externalUrl: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
  },
];

/** All news, newest first */
export function getAllNews(): NewsItem[] {
  return [...newsItems].sort((a, b) => b.date.localeCompare(a.date));
}

/** Latest n items, newest first */
export function getLatestNews(n = 6): NewsItem[] {
  return getAllNews().slice(0, n);
}

/** Categories that actually have items, in NEWS_CATEGORIES order */
export function getUsedCategories(): NewsCategory[] {
  return NEWS_CATEGORIES.filter((c) => newsItems.some((n) => n.category === c));
}

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

/** "2026-11-18" → "18 พ.ย. 2569" (deterministic — same on server and client) */
export function formatThaiDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${TH_MONTHS[m - 1]} ${y + 543}`;
}
