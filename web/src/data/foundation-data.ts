/* ==========================================================================
   Wongcharoensin Foundation (/foundation) — content
   --------------------------------------------------------------------------
   Source: the foundation's 2026 page export (wongcharoensinfoundation2026,
   exported 2026-11-17). Thai copy here is the single source of truth; the
   other languages live in src/i18n/foundation.ts and match these arrays by
   index.

   Photos: the 4 activity photos were copied from the old site's uploads
   (wp-content/uploads/foundation-2026/donate-{15m,6m,1m,500k}.webp) into
   public/img/foundation/ under readable names.

   Contact: the export has no address / phone / Facebook of its own, so the
   CTA uses the group's channels (contact page + Facebook).
   ========================================================================== */

export const foundationPhotos = {
  hospital: "/img/foundation/hospital-building-donation.webp",
  temple: "/img/foundation/temple-sermon-hall.webp",
  ventilator: "/img/foundation/ventilator-donation.webp",
  school: "/img/foundation/school-education-donation.webp",
} as const;

export const foundationLogo = "/img/foundation/foundation-logo.jpg";

export const foundationLinks = {
  contact: "https://csgok.sfinsulations.com/contact-us-2026-greenshift/",
  facebook: "https://www.facebook.com/CharoensinGroup/",
};

export const foundationHero = {
  eyebrow: "Wongcharoensin Foundation · ก่อตั้ง พ.ศ. 2551",
  name: "มูลนิธิวงษ์เจริญสิน",
  under: "ภายใต้กลุ่มบริษัทเจริญสิน",
  /** Big title, revealed word by word */
  title: ["ให้คืน", "สู่สังคม"],
  accent: "ในที่ที่สำคัญที่สุด",
  quote: "เพราะทุกการให้ เริ่มต้นจากหัวใจ และต่อยอดเป็นความหวัง",
  cta: "สำรวจงานของเรา",
  badges: [
    { value: "17+", label: "ปีแห่งการให้" },
    { value: "50M+", label: "บาทที่บริจาคแล้ว" },
  ],
  scroll: "เลื่อนลง",
};

export const foundationAbout = {
  eyebrow: "เกี่ยวกับมูลนิธิ",
  title: "พันธกิจที่หยั่งรากใน การศึกษา ศรัทธา และการดูแล",
  story:
    "มูลนิธิวงษ์เจริญสินก่อตั้งอย่างเป็นทางการในปี พ.ศ. 2551 ภายใต้การดูแลของประธานกลุ่มบริษัทเจริญสิน เพื่อส่งต่อความเมตตาให้สังคมไทยอย่างยั่งยืน",
  founded: { value: "2551", label: "ปีที่ก่อตั้ง (พ.ศ.)" },
  objectivesLabel: "วัตถุประสงค์",
  objectives: [
    { id: "founded", title: "ก่อตั้งโดยกลุ่มบริษัทเจริญสิน" },
    { id: "rooted", title: "มีรากฐานจากองค์กรที่มั่นคง" },
    { id: "sport", title: "สนับสนุนผู้พิการและกีฬา" },
    { id: "skills", title: "ฝึกอาชีพให้ผู้พิการ" },
  ],
  partnersLabel: "องค์กรที่ได้รับการสนับสนุน",
  partners: [
    "ศิริราชมูลนิธิ",
    "มูลนิธิดวงประทีป",
    "มูลนิธิป่อเต็กตึ๊ง",
    "วัดจากแดง",
    "วัดผ่องพลอยวิริยาราม",
    "โรงเรียนธรรมิกวิทยา",
  ],
};

export type PillarId = "school" | "temple" | "hospital" | "care";

export const foundationImpact = {
  eyebrow: "สี่เสาหลัก",
  title: "พื้นที่ที่เราให้",
  lead: "ทุกการบริจาคได้รับการบันทึกและตรวจสอบได้ ภายใต้การดูแลของกลุ่มบริษัทเจริญสิน",
  stats: [
    { value: 50, suffix: "M+", label: "ยอดบริจาครวม (บาท)" },
    { value: 50000, suffix: "", label: "นักเรียนที่ได้รับการสนับสนุน" },
    { value: 30, suffix: "", label: "อุปกรณ์การแพทย์ที่ส่งมอบ" },
    { value: 17, suffix: "+", label: "ปีแห่งการให้" },
  ],
  baht: "บาท",
  hint: "ชี้หรือแตะแต่ละเสาหลัก",
  pillars: [
    {
      id: "school" as PillarId,
      name: "โรงเรียน",
      desc: "อาคารเรียน สื่อการเรียนรู้ และการสนับสนุนครู เพื่อขยายโอกาสให้นักเรียนไทย",
      image: foundationPhotos.school,
      projects: [{ title: "สร้างอาคารเรียน", amount: 500_000 }],
    },
    {
      id: "temple" as PillarId,
      name: "วัด",
      desc: "บูรณะและสนับสนุนศาสนสถาน รากฐานของวัฒนธรรมและอัตลักษณ์ไทย",
      image: foundationPhotos.temple,
      projects: [{ title: "สร้างศาลาการเปรียญ", amount: 6_000_000 }],
    },
    {
      id: "hospital" as PillarId,
      name: "โรงพยาบาล",
      desc: "อุปกรณ์การแพทย์และทุนสนับสนุนสถานพยาบาล เพื่อเสริมความแข็งแกร่งให้ระบบสาธารณสุข",
      image: foundationPhotos.hospital,
      projects: [
        { title: "อาคารภูมิสิริมังคลานุสรณ์ รพ.จุฬาลงกรณ์ สภากาชาดไทย", amount: 15_000_000 },
        { title: "มอบเครื่องช่วยหายใจ", amount: 1_000_000 },
      ],
    },
    {
      id: "care" as PillarId,
      name: "บ้านพักคนชราและสถานสงเคราะห์",
      desc: "ฝึกอาชีพและดูแลชีวิตประจำวันให้ผู้สูงอายุและเด็กที่ต้องการความช่วยเหลือทั่วประเทศ",
      image: foundationPhotos.ventilator,
      projects: [] as { title: string; amount: number }[],
    },
  ],
};

export const foundationGallery = {
  eyebrow: "ช่วงเวลาแห่งการให้",
  title: "ผู้คน สถานที่ และพิธีเล็ก ๆ",
  hint: "ลากเพื่อเลื่อน · แตะเพื่อดูภาพ",
  close: "ปิด",
  prev: "ภาพก่อนหน้า",
  next: "ภาพถัดไป",
  items: [
    { src: foundationPhotos.hospital, caption: "อาคารภูมิสิริมังคลานุสรณ์", place: "รพ.จุฬาลงกรณ์ สภากาชาดไทย" },
    { src: foundationPhotos.temple, caption: "สร้างศาลาการเปรียญ", place: "ศาสนสถาน" },
    { src: foundationPhotos.ventilator, caption: "มอบเครื่องช่วยหายใจ", place: "สาธารณสุข" },
    { src: foundationPhotos.school, caption: "สนับสนุนการศึกษาเด็ก", place: "โรงเรียน" },
  ],
};

export const foundationContact = {
  eyebrow: "ร่วมเป็นส่วนหนึ่ง",
  title: "ร่วมส่งต่อ",
  accent: "ความเมตตา",
  lead: "ติดตามทุกโครงการ ทั้งโรงเรียน วัด โรงพยาบาล และบ้านพัก แบ่งปันทันทีที่เกิดขึ้น",
  support: "ร่วมสนับสนุน",
  facebook: "Facebook",
  under: "ภายใต้การดูแลของ กลุ่มบริษัทเจริญสิน",
};
