/**
 * Home page (sections after the Hero) — content.
 * Numbers, growth milestones and the 4 philosophies are the figures already
 * published on the home page; headings and copy follow V.1 (main).
 */

/* ---------- Section 2 — About (V.1 copy) + stats ---------- */
export const manifesto = {
  tag: "ABOUT CHAROENSIN GROUP",
  title: "เกี่ยวกับกลุ่มเจริญสิน",
  // V.1 paragraph (main). Founding year aligned with the Hero: 80 ปี / พ.ศ. 2489 (1946)
  vision:
    "กลุ่มบริษัทเจริญสินเป็นหนึ่งในกลุ่มบริษัทข้ามอุตสาหกรรม (conglomerate) ชั้นนำของประเทศไทย ที่ดำเนินธุรกิจมาอย่างมั่นคงและยั่งยืนยาวนานกว่า 80 ปี นับตั้งแต่ก่อตั้งในปี พ.ศ. 2489 โดยมีจุดเริ่มต้นจากธุรกิจการค้าในรูปแบบครอบครัว ด้วยรากฐานที่แข็งแกร่งและวิสัยทัศน์แห่งการพัฒนาอย่างต่อเนื่อง วันนี้กลุ่มเจริญสินได้เติบโตและขยายธุรกิจครอบคลุม 5 เสาหลักอุตสาหกรรม",
  // V.1 stats lead (EXCELLENCE & INTEGRITY)
  story:
    "ด้วยเครื่องจักรที่ทันสมัยและทีมงานมืออาชีพ เราช่วยให้ธุรกิจของคู่ค้าและพันธมิตรดำเนินงานได้อย่างมีประสิทธิภาพ ลดการสูญเสีย และเติบโตอย่างยั่งยืน",
  image: "/img/Modern%20Chareonsin%20Group%20Entrance.jpg",
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
  { value: "80", unit: "ปี", label: "ก่อตั้งมาแล้ว", note: "รากฐานความมั่นคงกว่า 8 ทศวรรษ", image: "/img/Modern%20Chareonsin%20Group%20Entrance.jpg", imageAlt: "อาคารสำนักงานใหญ่ กลุ่มบริษัทเจริญสิน", position: "center" },
  { value: "16,890", unit: "ราย", label: "ลูกค้าของเรา", note: "ที่มอบความไว้วางใจในสินค้าและบริการ", image: "/img/businesses/chemical.webp", imageAlt: "ธุรกิจและอุตสาหกรรมในเครือเจริญสิน", position: "center" },
  { value: "1,390", unit: "คน", label: "พนักงานของเรา", note: "บุคลากรมืออาชีพที่ร่วมขับเคลื่อนองค์กร", image: "/img/about/vision.webp", imageAlt: "ทีมงานและบุคลากรของกลุ่มเจริญสิน", position: "center 30%" },
  { value: "99.90", unit: "%", label: "อัตราความพึงพอใจ", note: "มาตรฐานคุณภาพและความพึงพอใจสูงสุด", image: "/img/businesses/other.webp", imageAlt: "มาตรฐานคุณภาพและนวัตกรรม", position: "center 25%" },
];

/* ---------- Section 3 — Global footprint + growth ---------- */
export const globalCopy = {
  eyebrow: "GLOBAL FOOTPRINT & ARCHITECTURAL NETWORK",
  title: "ฐานธุรกิจ CHAROENSIN GROUP",
  lead: "CSG ให้บริการลูกค้ากว่า 10 ล้านคน ใน 10 ประเทศทั่วโลก",
  sub: "เชื่อมโยงเครือข่ายคู่ค้า ผู้จัดจำหน่าย และฐานการผลิตข้ามทวีป สร้างเสถียรภาพและความเชื่อมั่นในระดับสากล",
  growthTitle: "ภาพรวมการเติบโตธุรกิจ ในเครือของเรา",
  growthSub: "การเติบโตอย่างมั่นคงและยั่งยืนต่อเนื่อง",
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
  title: "ปรัชญาของเรา",
  lead: "รากฐานความเชื่อและแนวคิดที่ยึดถือในการดำเนินธุรกิจ ส่งต่อคุณค่าจากรุ่นสู่รุ่น เป็นเข็มทิศนำทางสร้างความมั่นคงที่ยั่งยืน",
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
