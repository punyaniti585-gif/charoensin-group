/**
 * Asset Mapping for Charoensin Group Web Platform
 * Maps local image assets in /img/ to companies, logos, and business pillars.
 * Optimized for Next.js Static Export (using local paths instead of external URLs).
 */

export interface CompanyAsset {
  id: string;
  nameTh: string;
  nameEn: string;
  shortName?: string;
  category: "real-estate" | "leather-footwear" | "non-woven" | "chemical" | "other" | "foundation";
  logo: string;
  url?: string;
}

export const brandAssets = {
  logos: {
    primary: "/img/csg-logo.png", // Charoensin Group Main Horizontal Logo (Transparent)
    verticalWhite: "/img/csg-vertical-white.png", // Clean White Vertical Logo for Sky Reveal
    verticalGold: "/img/csg-vertical-lockup.png", // Clean Gold Vertical Logo
    anniversary80: "/img/csg-vertical-logo.png", // 80th Anniversary Official Logo (Transparent)
    emblem: "/img/csg-emblem.png", // Golden CS Emblem (Transparent)
    altPrimary: "/img/csg-logo.png",
  },
  hero: {
    coverBackground: "/img/cover-bg.webp",
    aiBadgeText: "ภาพ AI",
  },
  stats: {
    backgroundVideo: "/img/stats-video.mp4",
  },
  founders: [
    { id: "founder-1", path: "/img/LINE_ALBUM_ผู้ก่อตั้ง_261117_1.jpg", alt: "ผู้ก่อตั้งกลุ่มบริษัทเจริญสิน 1" },
    { id: "founder-2", path: "/img/LINE_ALBUM_ผู้ก่อตั้ง_261117_2.jpg", alt: "ผู้ก่อตั้งกลุ่มบริษัทเจริญสิน 2" },
    { id: "founder-3", path: "/img/LINE_ALBUM_ผู้ก่อตั้ง_261117_3.jpg", alt: "ผู้ก่อตั้งกลุ่มบริษัทเจริญสิน 3" },
    { id: "founder-4", path: "/img/LINE_ALBUM_ผู้ก่อตั้ง_261117_4.jpg", alt: "ผู้ก่อตั้งกลุ่มบริษัทเจริญสิน 4" },
    { id: "founder-5", path: "/img/LINE_ALBUM_ผู้ก่อตั้ง_261117_5.jpg", alt: "ผู้ก่อตั้งกลุ่มบริษัทเจริญสิน 5" },
  ],
};

export const businessCategories = [
  {
    key: "real-estate",
    number: "01",
    titleTh: "ธุรกิจอสังหาริมทรัพย์",
    titleEn: "Real Estate",
    description: "การพัฒนาโครงการที่อยู่อาศัย ชุมชนน่าอยู่ และพื้นที่เชิงพาณิชย์",
    image: "/img/cat-realestate.webp",
    companies: [
      {
        id: "csa",
        nameTh: "บริษัท เจริญสิน แอสเสท จำกัด",
        nameEn: "Charoensin Asset Co., Ltd.",
        shortName: "CSA",
        logo: "/img/เจริญสิน แอสเสท (หรือ CSA).jpg",
        category: "real-estate" as const,
      },
      {
        id: "csp",
        nameTh: "บริษัท เจริญสิน พัฒนา จำกัด",
        nameEn: "Charoensin Pattana Co., Ltd.",
        shortName: "CSP",
        logo: "/img/เจริญสิน แอสเสท (หรือ CSA).jpg",
        category: "real-estate" as const,
      },
    ],
  },
  {
    key: "leather-footwear",
    number: "02",
    titleTh: "ธุรกิจผลิตหนังและรองเท้า",
    titleEn: "Leather & Footwear",
    description: "ผู้ผลิตหนังฟอกและอุปกรณ์ความปลอดภัยมาตรฐานสากล",
    image: "/img/cat-leather.webp",
    companies: [
      {
        id: "cpl",
        nameTh: "บริษัท ซีพีแอล กรุ๊ป จำกัด (มหาชน) — ผลิตหนังแท้",
        nameEn: "CPL Group Public Co., Ltd. (Leather)",
        shortName: "CPL Leather",
        logo: "/img/CPL.jpg",
        category: "leather-footwear" as const,
      },
      {
        id: "pangolin",
        nameTh: "บริษัท ซีพีแอล กรุ๊ป จำกัด (มหาชน) — อุปกรณ์เซฟตี้ แพงโกลิน",
        nameEn: "Pangolin Safety Products (CPL Group)",
        shortName: "PANGOLIN",
        logo: "/img/PANGOLIN.jpg",
        category: "leather-footwear" as const,
      },
      {
        id: "manwood",
        nameTh: "บริษัท แมนวูด อินเตอร์เทรด จำกัด",
        nameEn: "Manwood Intertrade Co., Ltd.",
        shortName: "MANWOOD / LUIGI BATANI",
        logo: "/img/LUIGI BATANI.jpg",
        category: "leather-footwear" as const,
      },
    ],
  },
  {
    key: "non-woven",
    number: "03",
    titleTh: "ธุรกิจสิ่งทอ",
    titleEn: "Non-woven Textiles",
    description: "นวัตกรรมเส้นใยและแผ่นสิ่งทอไม่ถักทอสำหรับอุตสาหกรรม",
    image: "/img/cat-textile.webp",
    companies: [
      {
        id: "ttn",
        nameTh: "บริษัท ทีทีเอ็น นันวูเว่น โซลูชั่น จำกัด",
        nameEn: "TTN Nonwoven Solution Co., Ltd.",
        shortName: "TTN",
        logo: "/img/TTN.jpg",
        category: "non-woven" as const,
      },
      {
        id: "smn",
        nameTh: "บริษัท ซงเม่า นันวูเว่น จำกัด",
        nameEn: "Song Mao Nonwoven Co., Ltd.",
        shortName: "SMN",
        logo: "/img/SMN.jpg",
        category: "non-woven" as const,
      },
      {
        id: "ft",
        nameTh: "บริษัท เอฟแอนด์ที นันวูเว่น โซลูชั่น จำกัด",
        nameEn: "F&T Nonwoven Solution Co., Ltd.",
        shortName: "TF / F&T",
        logo: "/img/TF (หรือ F&T).jpg",
        category: "non-woven" as const,
      },
      {
        id: "hrt",
        nameTh: "บริษัท เอชอาร์ที นันวูเว่น จำกัด",
        nameEn: "HRT Nonwoven Co., Ltd.",
        shortName: "HRT",
        logo: "/img/HRT.jpg",
        category: "non-woven" as const,
      },
    ],
  },
  {
    key: "chemical",
    number: "04",
    titleTh: "ธุรกิจเคมีภัณฑ์",
    titleEn: "Chemical & Polymers",
    description: "ผลิตภัณฑ์กาว ยาแนว กาวอุตสาหกรรม และยางสังเคราะห์",
    image: "/img/cat-chemical.webp",
    companies: [
      {
        id: "adb",
        nameTh: "บริษัท แอ็พพลาย ดีบี จำกัด (มหาชน)",
        nameEn: "Applied DB Public Co., Ltd.",
        shortName: "ADB",
        logo: "/img/ADB.jpg",
        category: "chemical" as const,
      },
      {
        id: "eagle",
        nameTh: "บริษัท อีเกิ้ล เคมีคอล อินดัสตรี จำกัด",
        nameEn: "Eagle Chemical Industry Co., Ltd.",
        shortName: "EAGLE",
        logo: "/img/EAGLE.jpg",
        category: "chemical" as const,
      },
      {
        id: "csr",
        nameTh: "บริษัท ซี เอส รับเบอร์ อินดัสทรี่ จำกัด",
        nameEn: "CS Rubber Industry Co., Ltd.",
        shortName: "CSR",
        logo: "/img/CSR.jpg",
        category: "chemical" as const,
      },
      {
        id: "unitel",
        nameTh: "บริษัท ซีเอส ยูนิเทล เทคโนโลยี จำกัด",
        nameEn: "CS Unitel Technology Co., Ltd.",
        shortName: "CS UNITEL",
        logo: "/img/CS UNITEL.jpg",
        category: "chemical" as const,
      },
      {
        id: "mitsufuku",
        nameTh: "บริษัท ซี เอส มิตซูฟุกุ อิลาสโตเมอร์ จำกัด",
        nameEn: "CS Mitsufuku Elastomer Co., Ltd.",
        shortName: "CS MITSUFUKU",
        logo: "/img/CS MITSUFUKU.jpg",
        category: "chemical" as const,
      },
      {
        id: "csj",
        nameTh: "บริษัท ซีเอสเจ รับเบอร์ชีท จำกัด",
        nameEn: "CSJ Rubber Sheet Co., Ltd.",
        shortName: "CSJ",
        logo: "/img/CSJ.jpg",
        category: "chemical" as const,
      },
    ],
  },
  {
    key: "other",
    number: "05",
    titleTh: "ธุรกิจอื่นๆ",
    titleEn: "Other Ventures",
    description: "สินเชื่อ ลวดสลิง เกษตรกรรม อาหาร และการรักษาความปลอดภัย",
    image: "/img/cat-other.webp",
    companies: [
      {
        id: "ccap",
        nameTh: "บริษัท เจริญสิน แคปปิตอล จำกัด",
        nameEn: "Charoensin Capital Co., Ltd.",
        shortName: "CCAP",
        logo: "/img/CCAP.jpg",
        category: "other" as const,
      },
      {
        id: "tws",
        nameTh: "บริษัท ไทย ไวร์ริ่ง ซิสเต็ม จำกัด",
        nameEn: "Thai Wiring System Co., Ltd.",
        shortName: "TWS",
        logo: "/img/TWS.jpg",
        category: "other" as const,
      },
      {
        id: "caltree",
        nameTh: "บริษัท แสงบูรพา แพลนเทชั่น จำกัด",
        nameEn: "Saeng Burapa Plantation Co., Ltd.",
        shortName: "CALTREE",
        logo: "/img/CALTREE.jpg",
        category: "other" as const,
      },
      {
        id: "premium",
        nameTh: "บริษัท ไฟน์ ฟู้ด แฟกเตอร์ จำกัด",
        nameEn: "Fine Food Factor Co., Ltd.",
        shortName: "PREMIUM",
        logo: "/img/PREMIUM.jpg",
        category: "other" as const,
      },
      {
        id: "smartsense",
        nameTh: "บริษัท สมาร์ท เซนส์ อินดัสเตรียล ดีไซน์ จำกัด",
        nameEn: "Smart Sense Industrial Design Co., Ltd.",
        shortName: "SMART SENSE",
        logo: "/img/SMART SENSE.jpg",
        category: "other" as const,
      },
      {
        id: "endofwaste",
        nameTh: "บริษัท นาว เอนด์ออฟเวสท์ จำกัด",
        nameEn: "Now End of Waste Co., Ltd.",
        shortName: "END OF WASTE",
        logo: "/img/END OF WASTE.jpg",
        category: "other" as const,
      },
      {
        id: "bbest",
        nameTh: "บริษัท รักษาความปลอดภัย บี-เบสท์ เซอร์วิส จำกัด",
        nameEn: "B-Best Service Security Co., Ltd.",
        shortName: "B-BEST",
        logo: "/img/BEST (หรือ B BEST).jpg",
        category: "other" as const,
      },
    ],
  },
];

export const globalCountries = [
  { nameEn: "Thailand", nameTh: "ไทย", code: "TH", longitude: 100.99, latitude: 15.87, hub: true },
  { nameEn: "China", nameTh: "จีน", code: "CN", longitude: 104.2, latitude: 35.86, hub: false },
  { nameEn: "South Korea", nameTh: "เกาหลีใต้", code: "KR", longitude: 127.9, latitude: 36.5, hub: false },
  { nameEn: "Japan", nameTh: "ญี่ปุ่น", code: "JP", longitude: 138.25, latitude: 36.2, hub: false },
  { nameEn: "India", nameTh: "อินเดีย", code: "IN", longitude: 78.96, latitude: 22.5, hub: false },
  { nameEn: "United Arab Emirates", nameTh: "สหรัฐอาหรับเอมิเรตส์", code: "AE", longitude: 54.0, latitude: 24.0, hub: false },
  { nameEn: "Germany", nameTh: "เยอรมนี", code: "DE", longitude: 10.45, latitude: 51.16, hub: false },
  { nameEn: "United Kingdom", nameTh: "สหราชอาณาจักร", code: "GB", longitude: -1.5, latitude: 52.5, hub: false },
  { nameEn: "United States of America", nameTh: "สหรัฐอเมริกา", code: "US", longitude: -98.5, latitude: 39.8, hub: false },
  { nameEn: "Australia", nameTh: "ออสเตรเลีย", code: "AU", longitude: 134.0, latitude: -25.6, hub: false },
];

export const foundationAsset: CompanyAsset = {
  id: "foundation",
  nameTh: "มูลนิธิวงษ์เจริญสิน (มูลนิธิร่วมเจริญสิน)",
  nameEn: "Wongcharoensin Foundation",
  shortName: "WCS FOUNDATION",
  logo: "/img/มูลนิธิวงษ์เจริญสิน (หรือ WCS FOUNDATION).jpg",
  category: "foundation",
};

/**
 * All company logos indexed by id/key for direct lookup
 */
export const companyLogoMap: Record<string, string> = {
  csa: "/img/เจริญสิน แอสเสท (หรือ CSA).jpg",
  cpl: "/img/CPL.jpg",
  pangolin: "/img/PANGOLIN.jpg",
  manwood: "/img/LUIGI BATANI.jpg",
  ttn: "/img/TTN.jpg",
  smn: "/img/SMN.jpg",
  ft: "/img/TF (หรือ F&T).jpg",
  hrt: "/img/HRT.jpg",
  adb: "/img/ADB.jpg",
  eagle: "/img/EAGLE.jpg",
  csr: "/img/CSR.jpg",
  unitel: "/img/CS UNITEL.jpg",
  mitsufuku: "/img/CS MITSUFUKU.jpg",
  csj: "/img/CSJ.jpg",
  ccap: "/img/CCAP.jpg",
  tws: "/img/TWS.jpg",
  caltree: "/img/CALTREE.jpg",
  premium: "/img/PREMIUM.jpg",
  smartsense: "/img/SMART SENSE.jpg",
  endofwaste: "/img/END OF WASTE.jpg",
  bbest: "/img/BEST (หรือ B BEST).jpg",
  foundation: "/img/มูลนิธิวงษ์เจริญสิน (หรือ WCS FOUNDATION).jpg",
};

/**
 * Navigation structure for the 8 official sections from page-status.md
 */
export const navigationMenu = [
  {
    id: "01",
    label: "หน้าแรก",
    href: "/",
    isMega: false,
  },
  {
    id: "02",
    label: "เกี่ยวกับเรา",
    href: "/about",
    isMega: false,
    children: [
      { label: "วิสัยทัศน์", href: "/about#vision" },
      { label: "พันธกิจ", href: "/about#mission" },
      { label: "ประวัติความเป็นมา", href: "/about#history" },
      { label: "ค่านิยมองค์กร", href: "/about#values" },
      { label: "ผู้นำของเรา", href: "/about#leadership" },
    ],
  },
  {
    id: "03",
    label: "ธุรกิจของเรา",
    href: "/businesses",
    isMega: true,
    megaType: "business" as const,
  },
  {
    id: "04",
    label: "มูลนิธิ",
    href: "https://csgok.sfinsulations.com/wongcharoensinfoundation2026/",
    isMega: false,
  },
  {
    id: "05",
    label: "ข่าวสารและกิจกรรม",
    href: "https://csgok.sfinsulations.com/new2026/",
    isMega: false,
    children: [
      { label: "ข่าวสารผู้บริหาร", href: "https://csgok.sfinsulations.com/new2026/" },
      { label: "ประกาศบริษัท", href: "https://csgok.sfinsulations.com/new2026/" },
    ],
  },
  {
    id: "06",
    label: "ร่วมงานกับเรา",
    href: "https://csgok.sfinsulations.com/mycareer2026/",
    isMega: false,
    children: [
      { label: "นโยบายการบริหารงานบุคคล", href: "https://csgok.sfinsulations.com/compliant_hr_2026/" },
      { label: "ตำแหน่งงาน", href: "https://csgok.sfinsulations.com/mycareer2026/" },
      { label: "ประกาศบริษัท", href: "https://csgok.sfinsulations.com/mycareer2026/" },
      { label: "การอบรมและสัมมนา", href: "https://csgok.sfinsulations.com/mycareer2026/" },
    ],
  },
  {
    id: "07",
    label: "ติดต่อเรา",
    href: "https://csgok.sfinsulations.com/contact-us-2026-greenshift/",
    isMega: false,
  },
  {
    id: "08",
    label: "รายงานกำกับดูแล",
    href: "#governance",
    isMega: true,
    megaType: "governance" as const,
    governanceCategories: [
      {
        title: "08.01 นโยบาย",
        items: [
          { label: "นโยบายกำกับดูแล", href: "#policy-governance" },
          { label: "นโยบายการใช้ระบบเทคโนโลยี", href: "#policy-it" },
          { label: "นโยบายการต่อต้านคอรัปชั่น", href: "#policy-anticorruption" },
          { label: "นโยบายการให้และรับของขวัญ", href: "#policy-gifts" },
          { label: "นโยบายค่าตอบแทนกรรมการและผู้บริหาร", href: "#policy-compensation" },
          { label: "นโยบายการป้องกันผลประโยชน์ทับซ้อน", href: "#policy-conflict" },
          { label: "นโยบายการใช้ข้อมูลและการซื้อขายหลักทรัพย์", href: "#policy-insider" },
          { label: "นโยบายและแนวปฏิบัติรักษาความมั่นคง", href: "#policy-security" },
        ],
      },
      {
        title: "08.02 องค์กร",
        items: [
          { label: "โครงสร้างองค์กร", href: "#org-structure" },
          { label: "จรรยาบรรณธุรกิจและคู่ค้า", href: "https://csgok.sfinsulations.com/codeofconduct/" },
          { label: "รายงานผลการบริหารความเสี่ยง", href: "#org-risk" },
          { label: "นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)", href: "#org-pdpa" },
        ],
      },
      {
        title: "08.03 หลักการ",
        items: [
          { label: "หลักการดูแลกำกับกิจการที่ดี", href: "#principles-cg" },
          { label: "นโยบายการใช้ AI", href: "https://csgok.sfinsulations.com/ai-policy2/" },
        ],
      },
    ],
  },
];


/**
 * 24 Affiliate Company & Brand Logos for Footer Grid (matching homepage-data.json footer.images)
 */
export const footerAffiliateLogos = [
  { id: "csa", name: "เจริญสิน แอสเสท", logo: "/img/affiliate-csa.png" },
  { id: "cpl", name: "ซีพีแอล กรุ๊ป", logo: "/img/affiliate-cpl.png" },
  { id: "pangolin", name: "แพงโกลิน", logo: "/img/affiliate-pangolin.png" },
  { id: "adb", name: "แอ็พพลาย ดีบี", logo: "/img/affiliate-adb.png" },
  { id: "ccap", name: "เจริญสิน แคปปิตอล", logo: "/img/affiliate-ccap.png" },
  { id: "csj", name: "ซีเอสเจ รับเบอร์ชีท", logo: "/img/affiliate-csj.png" },
  { id: "csg-logo", name: "กลุ่มบริษัทเจริญสิน", logo: "/img/affiliate-csg-logo.png" },
  { id: "marni", name: "มาร์นิ", logo: "/img/affiliate-marni.png" },
  { id: "csr", name: "ซี เอส รับเบอร์ อินดัสทรี่", logo: "/img/affiliate-csr.png" },
  { id: "luigi", name: "ลุยจิ บาตานี (Luigi Batani)", logo: "/img/affiliate-luigi.png" },
  { id: "smn", name: "ซงเม่า นันวูเว่น", logo: "/img/affiliate-smn.png" },
  { id: "tws", name: "ไทย ไวร์ริ่ง ซิสเต็ม", logo: "/img/affiliate-tws.png" },
  { id: "ply", name: "พลาย (Ply)", logo: "/img/affiliate-ply.png" },
  { id: "galavela", name: "กาลาเวลา", logo: "/img/affiliate-galavela.png" },
  { id: "smartsense", name: "สมาร์ท เซนส์", logo: "/img/affiliate-smartsense.png" },
  { id: "premium", name: "ไฟน์ ฟู้ด แฟกเตอร์ (Premium)", logo: "/img/affiliate-premium.png" },
  { id: "caltree", name: "แสงบูรพา แพลนเทชั่น (Caltree)", logo: "/img/affiliate-caltree.png" },
  { id: "chub", name: "ชับส์ (Chubs)", logo: "/img/affiliate-chub.png" },
  { id: "unitel", name: "ซีเอส ยูนิเทล เทคโนโลยี", logo: "/img/affiliate-unitel.png" },
  { id: "ft", name: "เอฟแอนด์ที นันวูเว่น โซลูชั่น", logo: "/img/affiliate-ft.png" },
  { id: "bbest", name: "บี-เบสท์ เซอร์วิส", logo: "/img/affiliate-bbest.png" },
  { id: "ttn", name: "ทีทีเอ็น นันวูเว่น โซลูชั่น", logo: "/img/affiliate-ttn.png" },
  { id: "mitsufuku", name: "ซี เอส มิตซูฟุกุ อิลาสโตเมอร์", logo: "/img/affiliate-mitsufuku.png" },
];
