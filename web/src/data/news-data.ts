/**
 * News & Activities — single source of truth.
 *
 * Every place that lists news reads from this file: the home page
 * "ข่าวสารและกิจกรรม" deck now, and the /news index page next. Add a new item
 * here (newest date first is not required — helpers sort by date) and it
 * appears everywhere at once.
 *
 * To publish a story: add one object to `newsItems` (newest dates appear
 * first automatically). It shows up on the home page deck, /news and its own
 * /news/<slug> page at the next build. Set `featured: true` to pin it as the
 * headline story on /news.
 *
 * TODO(content): titles, dates, excerpts and body text below are
 * PLACEHOLDERS — replace them with the real announcements. The links
 * (Facebook posts and the existing WordPress pages) and cover images are real.
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
  /** Full story, one string per paragraph */
  content: string[];
  /** Cover image — must exist in /public */
  image: string;
  /** Where "อ่านรายละเอียด" goes until an internal detail page exists */
  externalUrl: string;
  /** Pin as the headline story on /news */
  featured?: boolean;
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
    content: ["กลุ่มบริษัทเจริญสินจัดกิจกรรมองค์กรเพื่อเสริมสร้างความสัมพันธ์ระหว่างพนักงานทุกกลุ่มธุรกิจ พร้อมถ่ายทอดค่านิยมองค์กรด้านความซื่อสัตย์และการใส่ใจคุณภาพ", "ติดตามภาพบรรยากาศและรายละเอียดเพิ่มเติมได้จากโพสต์ต้นฉบับบนเพจทางการของกลุ่มบริษัทเจริญสิน"],
    featured: true,
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
    content: ["บริษัทในเครือทั้ง 5 กลุ่มธุรกิจอัปเดตความคืบหน้าด้านการผลิต การขยายตลาด และการพัฒนาผลิตภัณฑ์ใหม่ เพื่อตอบโจทย์ลูกค้าในประเทศและต่างประเทศ", "รายละเอียดฉบับเต็มสามารถอ่านได้จากโพสต์ต้นฉบับบนเพจทางการ"],
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
    content: ["กลุ่มบริษัทเจริญสินเดินหน้าพัฒนานวัตกรรมควบคู่กับการดำเนินธุรกิจอย่างยั่งยืน ทั้งการลดของเสียในกระบวนการผลิตและการพัฒนาวัสดุที่เป็นมิตรต่อสิ่งแวดล้อม", "อ่านรายละเอียดและชมภาพประกอบเพิ่มเติมได้จากโพสต์ต้นฉบับ"],
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
    content: ["รวบรวมข่าวสารจากผู้บริหารและประกาศสำคัญของกลุ่มบริษัทเจริญสิน เพื่อให้พนักงาน คู่ค้า และผู้สนใจติดตามทิศทางขององค์กรได้อย่างใกล้ชิด", "ดูประกาศทั้งหมดได้ที่หน้าข่าวสารและกิจกรรมบนเว็บไซต์เดิม"],
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
    content: ["กลุ่มบริษัทเจริญสินเปิดรับบุคลากรที่มีความสามารถเข้าร่วมเติบโตไปด้วยกัน พร้อมโอกาสในการพัฒนาทักษะผ่านการอบรมและสัมมนาอย่างต่อเนื่อง", "ดูตำแหน่งงานที่เปิดรับและรายละเอียดการสมัครได้ที่หน้าร่วมงานกับเรา"],
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
    content: ["มูลนิธิวงษ์เจริญสินดำเนินกิจกรรมเพื่อชุมชนและสังคมอย่างต่อเนื่อง โดยเฉพาะการส่งเสริมการศึกษาและคุณภาพชีวิตของเด็กในพื้นที่ห่างไกล", "ติดตามกิจกรรมทั้งหมดของมูลนิธิได้ที่หน้ามูลนิธิ"],
    image: "/img/businesses/tile-realestate.webp",
    externalUrl: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
  },
  {
    id: "n-007",
    slug: "charoensin",
    title: "เจริญสิน",
    category: "ความยั่งยืน",
    date: "2026-10-14",
    excerpt: "เจริญสิน",
    content: ["เจริญสินดำเนินกิจกรรมเพื่อชุมชนและสังคมอย่างต่อเนื่อง โดยเฉพาะการส่งเสริมการศึกษาและคุณภาพชีวิตของเด็กในพื้นที่ห่างไกล", "ติดตามกิจกรรมทั้งหมดของมูลนิธิได้ที่หน้ามูลนิธิ"],
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

/** Headline story for /news: newest item marked featured, else the newest item */
export function getFeaturedNews(): NewsItem {
  const all = getAllNews();
  return all.find((n) => n.featured) ?? all[0];
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((n) => n.slug === slug);
}

/** Same-category stories first, topped up with the latest others */
export function getRelatedNews(item: NewsItem, n = 3): NewsItem[] {
  const others = getAllNews().filter((x) => x.id !== item.id);
  const same = others.filter((x) => x.category === item.category);
  const rest = others.filter((x) => x.category !== item.category);
  return [...same, ...rest].slice(0, n);
}

export const newsHref = (item: NewsItem) => `${NEWS_INDEX_HREF}/${item.slug}`;

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
