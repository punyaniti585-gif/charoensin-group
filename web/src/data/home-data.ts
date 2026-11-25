/**
 * Home page (sections after the Hero) — content.
 * Numbers, growth milestones and the 4 philosophies are the figures already
 * published on the home page; the vision line comes from about-data.ts.
 */
import { visionAndMissionData } from "./about-data";

/* ---------- Section 2 — Manifesto + stats ---------- */
export const manifesto = {
  tag: "SINCE 1946 • 80 YEARS OF EXCELLENCE",
  title: "มุ่งมั่นสู่การเป็นองค์กรชั้นนำ ที่เติบโตอย่างมั่นคง",
  vision: visionAndMissionData.vision.lead,
  story:
    "จากกิจการครอบครัวที่เริ่มต้นด้วยงานฟอกหนัง สู่กลุ่มบริษัทข้ามอุตสาหกรรมที่ครอบคลุมอสังหาริมทรัพย์ หนังและรองเท้า สิ่งทอ เคมีภัณฑ์ และธุรกิจแห่งอนาคต ด้วยความซื่อสัตย์ ความใส่ใจในคุณภาพ และการพัฒนาอย่างต่อเนื่องตลอดกว่า 8 ทศวรรษ",
  image: "/img/charoensin-building-hq.jpg",
  imageAlt: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน",
  imageLabel: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน",
  cta: { label: "รู้จักเรามากขึ้น", href: "/about" },
};

export interface HomeStat {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  unit: string;
  note: string;
}

export const homeStats: HomeStat[] = [
  { label: "ก่อตั้งมาแล้ว", value: 80, unit: "ปี", note: "รากฐานความมั่นคงกว่า 8 ทศวรรษ" },
  { label: "ลูกค้าของเรา", value: 16890, unit: "ราย", note: "ที่มอบความไว้วางใจในสินค้าและบริการ" },
  { label: "พนักงานของเรา", value: 1390, unit: "คน", note: "บุคลากรมืออาชีพที่ร่วมขับเคลื่อนองค์กร" },
  { label: "อัตราความพึงพอใจ", value: 99.9, decimals: 1, suffix: "%", unit: "ความพึงพอใจ", note: "มาตรฐานคุณภาพและความพึงพอใจสูงสุด" },
];

/** Section 2 showcase card — stats cycling over real photos (public/img) */
export const manifestoStats = [
  { value: "80", unit: "ปี", label: "ก่อตั้งมาแล้ว", image: "/img/charoensin-building-hq.jpg", imageAlt: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน", position: "center 60%" },
  { value: "16,890", unit: "ราย", label: "ลูกค้าของเรา", image: "/img/businesses/chemical.webp", imageAlt: "ธุรกิจและอุตสาหกรรมในเครือเจริญสิน", position: "center" },
  { value: "1,390", unit: "คน", label: "พนักงานของเรา", image: "/img/about/vision.webp", imageAlt: "ทีมงานและบุคลากรของกลุ่มเจริญสิน", position: "center 30%" },
  { value: "99.90", unit: "%", label: "อัตราความพึงพอใจ", image: "/img/businesses/other.webp", imageAlt: "มาตรฐานคุณภาพและนวัตกรรม", position: "center 25%" },
];

/* ---------- Section 3 — Global footprint + growth ---------- */
export const globalCopy = {
  eyebrow: "10 GLOBAL HUBS & MARKETS",
  title: "ฐานธุรกิจและเครือข่ายระดับสากล",
  lead: "จากสำนักงานใหญ่ในประเทศไทย สู่ตลาดและพันธมิตรใน 10 ประเทศทั่วโลก",
  growthTitle: "ภาพรวมการเติบโตธุรกิจในเครือ",
};

/** Growth milestones — bar = height relative to the tallest year */
export const growthMilestones = [
  { year: "2566", value: 5, tag: "FOUNDATION", bar: 0.35, desc: "รากฐานการเติบโตอย่างมีเสถียรภาพ และการปรับโครงสร้างเพื่อความยั่งยืน" },
  { year: "2567", value: 10, tag: "EXPANSION", bar: 0.65, desc: "การขยายตลาดเชิงรุกในระดับภูมิภาค และการพัฒนานวัตกรรมสีเขียว" },
  { year: "2568", value: 15, tag: "GLOBAL TARGET", bar: 1, desc: "เป้าหมายการเติบโตก้าวกระโดดสู่สากล พร้อมขับเคลื่อนเศรษฐกิจหมุนเวียน" },
];

/* ---------- Section 4 — Philosophy ---------- */
export const philosophyCopy = {
  eyebrow: "OUR PHILOSOPHY",
  title: "ปรัชญาการดำเนินธุรกิจ 4 ประการ",
};

export const philosophies = [
  {
    number: "01",
    image: "/img/about/ethics.webp",
    imageAlt: "ความซื่อสัตย์และจริยธรรมองค์กร",
    imagePosition: "center",
    title: "ความซื่อสัตย์",
    enTitle: "Integrity & Ethics",
    desc: "ยึดมั่นในความโปร่งใส จริยธรรม และการรักษาคำมั่นสัญญาในการดำเนินธุรกิจทุกมิติ เพื่อสร้างความไว้วางใจที่ยั่งยืนต่อคู่ค้า พันธมิตร และสังคมส่วนรวม",
  },
  {
    number: "02",
    image: "/img/about/vision.webp",
    imageAlt: "ทีมงานและพันธมิตรร่วมสร้างคุณค่า",
    imagePosition: "center",
    title: "ทุกฝ่ายได้ประโยชน์",
    enTitle: "Mutual Benefit",
    desc: "สร้างคุณค่าร่วมกันในทุกความสัมพันธ์ ทั้งคู่ค้า สังคม ชุมชน และพนักงานในองค์กร มุ่งเน้นการเติบโตร่วมกันอย่างเป็นธรรม มั่นคง และเกื้อกูล",
  },
  {
    number: "03",
    image: "/img/businesses/other.webp",
    imageAlt: "เทคโนโลยีการผลิตและพลังงานสะอาด",
    imagePosition: "top",
    title: "พัฒนาอย่างต่อเนื่อง",
    enTitle: "Continuous Innovation",
    desc: "เรียนรู้และเติบโตไปด้วยกันผ่านการวิจัย พัฒนานวัตกรรม และเทคโนโลยีอุตสาหกรรมที่ทันสมัย ยกระดับประสิทธิภาพการทำงานสู่มาตรฐานสากลอย่างไม่หยุดยั้ง",
  },
  {
    number: "04",
    image: "/img/businesses/leather.webp",
    imageAlt: "การตรวจสอบคุณภาพในสายการผลิต",
    imagePosition: "center",
    title: "ใส่ใจคุณภาพ",
    enTitle: "Uncompromising Quality",
    desc: "ใส่ใจในทุกรายละเอียดและกระบวนการผลิต เพื่อส่งมอบคุณภาพที่ดีที่สุดและมาตรฐานความปลอดภัยสูงสุดแก่ผู้บริโภคและภาคอุตสาหกรรมทั่วโลก",
  },
];

/* ---------- Section 5 — Ventures ---------- */
export const venturesCopy = {
  eyebrow: "FUTURE-DRIVING VENTURES",
  title: "ธุรกิจที่ขับเคลื่อนอนาคต",
  lead: "ร่วมสร้างคุณค่าในทุกมิติ ผ่านความเป็นเลิศของธุรกิจเรือธงและพันธมิตรเครือเจริญสิน",
};
