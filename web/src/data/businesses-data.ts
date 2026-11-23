/**
 * Businesses Data — 03. ธุรกิจของเรา (/businesses)
 *
 * Single source of truth for the Charoensin Group business portfolio:
 * 5 business groups and their companies (page-status.md 03.xx list, plus
 * Marni Pattaya hotel from the v3 source export).
 *
 * Content source: exports/charoensin-our-business-v3.html (copy, facts, images)
 * and docs/page-status.md (company list + existing detail pages).
 *
 * WordPress-ready: every record carries a stable `id` + `slug` and the shape
 * mirrors what a WP REST endpoint (e.g. /wp-json/wp/v2/business-groups) would
 * return. Components only read data through `getBusinessGroups()` /
 * `getBusinessPageData()`, so the static data below can later be swapped for
 * a fetch without touching the UI.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CompanyStatus = "ready" | "pending";

export interface CompanyFact {
  value: string;
  label: string;
}

export interface Company {
  id: string;
  /** URL-safe key reserved for future internal routes: /businesses/[group]/[slug] */
  slug: string;
  nameTh: string;
  nameEn?: string;
  shortName: string;
  logo: string;
  /** Feature photo; falls back to the group image when absent */
  image?: string;
  /** Extra photos (e.g. Asset project types) */
  gallery?: { src: string; alt: string }[];
  tagline?: string;
  description?: string;
  facts?: CompanyFact[];
  /** Company's own website / official page */
  website?: string;
  /** "ดูรายละเอียด" target — existing company page (WordPress) for now */
  detailHref?: string;
  /** "pending" = content not yet supplied by the company */
  status: CompanyStatus;
}

export interface BusinessGroup {
  /** Also used as the section anchor: /businesses#<id> */
  id: string;
  slug: string;
  number: string;
  nameTh: string;
  nameEn: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  companies: Company[];
}

export interface BusinessStat {
  value: number;
  suffix?: string;
  label: string;
  note?: string;
}

export interface BusinessPrinciple {
  th: string;
  en: string;
  description: string;
}

export interface BusinessMilestone {
  year: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const IMG = "/img/businesses";
const WP = "https://csgok.sfinsulations.com";

// ---------------------------------------------------------------------------
// Business groups
// ---------------------------------------------------------------------------

export const businessGroups: BusinessGroup[] = [
  {
    id: "real-estate",
    slug: "real-estate",
    number: "01",
    nameTh: "ธุรกิจอสังหาริมทรัพย์",
    nameEn: "Real Estate & Hospitality",
    tagline: "พัฒนาอสังหาริมทรัพย์เชิงพาณิชย์และที่อยู่อาศัย",
    description:
      "ตั้งแต่ชุมชนห้องพักให้เช่าขนาดใหญ่ใกล้นิคมอุตสาหกรรม บ้านจัดสรร ที่ดิน โกดัง และอาคารพาณิชย์ ไปจนถึงโรงแรมบูทีคริมทะเลพัทยา",
    image: `${IMG}/tile-realestate.webp`,
    imageAlt: "โครงการอสังหาริมทรัพย์ของกลุ่มเจริญสิน",
    highlights: ["25 โครงการ", "ห้องพักกว่า 40,000 ห้อง", "ประสบการณ์กว่า 35 ปี"],
    companies: [
      {
        id: "csa",
        slug: "charoensin-asset",
        nameTh: "บริษัท เจริญสิน แอสเสท จำกัด",
        nameEn: "Charoensin Asset Co., Ltd.",
        shortName: "เจริญสิน แอสเสท",
        logo: `${IMG}/logo-asset.webp`,
        image: `${IMG}/asset-condo.webp`,
        gallery: [
          { src: `${IMG}/asset-house.webp`, alt: "บ้านจัดสรร" },
          { src: `${IMG}/asset-land.webp`, alt: "ที่ดิน" },
          { src: `${IMG}/asset-warehouse.webp`, alt: "โกดัง" },
          { src: `${IMG}/asset-shophouse.webp`, alt: "อาคารพาณิชย์" },
        ],
        tagline: "25 โครงการ ห้องพักกว่า 40,000 ห้อง",
        description:
          "ดำเนินธุรกิจพัฒนาอสังหาริมทรัพย์และบริการห้องพักให้เช่ามากว่า 35 ปี มีความเชี่ยวชาญในการบริหารชุมชนขนาดใหญ่ สำหรับห้องพักให้เช่าผู้มีรายได้น้อย และลูกค้าทำงานในนิคมอุตสาหกรรม รวมถึงแหล่งท่องเที่ยวในประเทศไทย ซึ่งมีทำเลที่ตั้งในเขตชุมชน เมือง หรือใกล้ศูนย์กลางทางธุรกิจ สามารถเดินทางได้สะดวก",
        facts: [
          { value: "25", label: "โครงการ" },
          { value: "40,000+", label: "ห้องพัก" },
          { value: "35+", label: "ปีประสบการณ์" },
        ],
        detailHref: `${WP}/charoensin-asset-2026.html`,
        status: "ready",
      },
      {
        id: "marni",
        slug: "marni-pattaya",
        nameTh: "โรงแรม มาร์นี่ พัทยา",
        nameEn: "Marni Pattaya",
        shortName: "มาร์นี่ พัทยา",
        logo: `${IMG}/logo-marni.webp`,
        image: `${IMG}/marni.webp`,
        tagline: "ห้องพักและสวีท 40 ห้อง ที่พัทยา",
        description:
          "มอบประสบการณ์การพักผ่อนเหนือระดับ ด้วยห้องพักหลากหลายรูปแบบ ตั้งแต่ห้องดีลักซ์ขนาด 28 ตร.ม. ไปจนถึงสวีทหรูขนาด 176 ตร.ม. และพูลวิลล่าส่วนตัว ห้องพักทั้ง 40 ห้องออกแบบใหม่ในสไตล์ร่วมสมัย ทุกห้องมีพื้นที่กลางแจ้งส่วนตัว ทั้งระเบียงและเทอร์เรซ พร้อมวิวสระน้ำหรือวิวทะเลพัทยาบางส่วน",
        facts: [
          { value: "40", label: "ห้องพักและสวีท" },
          { value: "28–176", label: "ตร.ม. ต่อห้อง" },
        ],
        website: "https://www.marnipattaya.com/th/",
        status: "ready",
      },
      {
        id: "csp",
        slug: "charoensin-pattana",
        nameTh: "บริษัท เจริญสิน พัฒนา จำกัด",
        nameEn: "Charoensin Pattana Co., Ltd.",
        shortName: "เจริญสิน พัฒนา",
        logo: "/img/เจริญสิน แอสเสท (หรือ CSA).jpg",
        status: "pending",
      },
    ],
  },
  {
    id: "leather-footwear",
    slug: "leather-footwear",
    number: "02",
    nameTh: "ธุรกิจผลิตหนังและรองเท้า",
    nameEn: "Leather & Footwear",
    tagline: "ผลิตหนังฟอก อุปกรณ์เซฟตี้ และรองเท้าหนังคุณภาพสูง",
    description:
      "ห่วงโซ่อุตสาหกรรมหนังครบวงจร ตั้งแต่โรงฟอกหนังระดับโลก รองเท้าเซฟตี้มาตรฐานสากล ไปจนถึงแบรนด์รองเท้าหนังแท้สัญชาติไทย",
    image: `${IMG}/leather.webp`,
    imageAlt: "ธุรกิจหนัง CPL",
    highlights: ["โรงฟอกหนังชั้นนำของโลก", "สำนักงานตัวแทน 4 ประเทศ", "มาตรฐาน มอก. และ ISO"],
    companies: [
      {
        id: "cpl",
        slug: "cpl-group",
        nameTh: "บริษัท ซีพีแอล กรุ๊ป จำกัด (มหาชน)",
        nameEn: "CPL Group Public Co., Ltd.",
        shortName: "CPL",
        logo: `${IMG}/logo-cpl.webp`,
        image: `${IMG}/leather.webp`,
        tagline: "โรงฟอกหนังที่สมุทรปราการ ใกล้สนามบินสุวรรณภูมิ",
        description:
          "หนึ่งในบริษัทฟอกหนังชั้นนำของโลก ตั้งอยู่ที่จังหวัดสมุทรปราการ ห่างจากกรุงเทพมหานครประมาณ 20 กิโลเมตร ใกล้สนามบินสุวรรณภูมิ มีสำนักงานตัวแทนที่ประเทศจีน สหรัฐอเมริกา เวียดนาม และอินโดนีเซีย เพื่อการติดต่อสื่อสารอย่างใกล้ชิดและการบริการหลังการขายอย่างต่อเนื่อง",
        facts: [
          { value: "4", label: "ประเทศ สำนักงานตัวแทน" },
          { value: "20", label: "กม. จากกรุงเทพฯ" },
        ],
        detailHref: `${WP}/cpl-leather-2026.html`,
        status: "ready",
      },
      {
        id: "pangolin",
        slug: "pangolin",
        nameTh: "แพงโกลิน — ธุรกิจอุปกรณ์เซฟตี้ (ซีพีแอล กรุ๊ป)",
        nameEn: "Pangolin Safety Products",
        shortName: "แพงโกลิน",
        logo: `${IMG}/logo-pangolin.webp`,
        image: `${IMG}/pangolin.webp`,
        tagline: "รองเท้าเซฟตี้รายแรกของไทยที่ได้รับ มอก.",
        description:
          "ผู้ผลิตและจำหน่ายอุปกรณ์เซฟตี้ โดยเฉพาะรองเท้าเซฟตี้ เป็นบริษัทแรกในประเทศไทยที่ได้รับการรับรองมาตรฐานผลิตภัณฑ์อุตสาหกรรม มอก.523-2528 และมาตรฐานระบบบริหารคุณภาพ ISO 9001:2008 จาก Bureau Veritas อีกทั้งเป็นสมาชิกศูนย์เทคโนโลยี SATRA",
        facts: [
          { value: "มอก.", label: "523-2528" },
          { value: "ISO", label: "9001:2008" },
        ],
        website: "https://pangolin.co.th/",
        status: "ready",
      },
      {
        id: "manwood",
        slug: "manwood-intertrade",
        nameTh: "บริษัท แมนวูด อินเตอร์เทรด จำกัด",
        nameEn: "Manwood Intertrade Co., Ltd.",
        shortName: "แมนวูด",
        logo: `${IMG}/logo-manwood.webp`,
        image: `${IMG}/manwood.webp`,
        tagline: "รองเท้าหนังแท้แบรนด์ไทย",
        description:
          "ผู้นำด้านรองเท้าหนังแท้สัญชาติไทย ภายใต้แบรนด์ MANWOOD ที่ผสมผสานความประณีตและคุณภาพเหนือกาลเวลา ตั้งแต่การคัดสรรหนังแท้คุณภาพสูง การตัดเย็บอย่างประณีต ไปจนถึงการออกแบบที่ใส่ใจสรีระของผู้สวมใส่ เพื่อความมั่นใจและความสบายในทุกย่างก้าว",
        website: "https://www.facebook.com/Manwoodofficial/",
        detailHref: `${WP}/manwood-intertrade-2026.html`,
        status: "ready",
      },
    ],
  },
  {
    id: "non-woven",
    slug: "textiles",
    number: "03",
    nameTh: "ธุรกิจสิ่งทอ",
    nameEn: "Non-woven Textiles",
    tagline: "ผลิตและจัดจำหน่ายสิ่งทอครบวงจร",
    description:
      "ผู้เชี่ยวชาญผ้าใยสังเคราะห์และผ้าสักหลาด (non-woven) คุณภาพสูง ที่ได้รับความไว้วางใจจากแบรนด์ระดับโลกในหลากหลายอุตสาหกรรม",
    image: `${IMG}/textile.webp`,
    imageAlt: "ผ้าใยสังเคราะห์ TTN",
    highlights: ["ผลิตผ้าใยสังเคราะห์กว่า 35 ปี", "ลูกค้าแบรนด์ระดับโลก", "ตลาดในและต่างประเทศ"],
    companies: [
      {
        id: "ttn",
        slug: "ttn-nonwoven",
        nameTh: "บริษัท ทีทีเอ็น นันวูเว่น โซลูชั่น จำกัด",
        nameEn: "TTN Nonwoven Solution Co., Ltd.",
        shortName: "TTN",
        logo: `${IMG}/logo-ttn.webp`,
        image: `${IMG}/textile.webp`,
        tagline: "ผลิตผ้าใยสังเคราะห์มากว่า 35 ปี",
        description:
          "ผู้นำด้านการผลิตผ้าใยสังเคราะห์และผ้าสักหลาด (felt) ในประเทศไทย ด้วยประสบการณ์มากกว่า 35 ปี ได้รับความไว้วางใจจากลูกค้าที่มีชื่อเสียงทั่วโลก และพัฒนาเทคนิคการผลิตวัสดุ non-woven คุณภาพสูงอย่างต่อเนื่อง",
        facts: [{ value: "35+", label: "ปีประสบการณ์" }],
        website: "https://www.ttnsnonwoven.com/",
        detailHref: `${WP}/ttn-nonwoven-2026.html`,
        status: "ready",
      },
      {
        id: "smn",
        slug: "songmao-nonwoven",
        nameTh: "บริษัท ซงเม่า นันวูเว่น จำกัด",
        nameEn: "Song Mao Nonwoven Co., Ltd.",
        shortName: "ซงเม่า",
        logo: `${IMG}/logo-songmao.webp`,
        tagline: "ก่อตั้งมากว่า 25 ปี",
        description:
          "ผู้เชี่ยวชาญด้านการผลิตและจำหน่ายผ้าใยสังเคราะห์ทุกชนิดที่มีคุณภาพ มีผลิตภัณฑ์เส้นใยหลากหลายที่ตอบสนองความต้องการของกลุ่มอุตสาหกรรมต่างๆ และเป็นที่ยอมรับจากลูกค้าแบรนด์ดังระดับโลก",
        facts: [{ value: "25+", label: "ปีที่ก่อตั้ง" }],
        detailHref: `${WP}/songmao-nonwoven-2026.html`,
        status: "ready",
      },
      {
        id: "ft",
        slug: "ft-nonwoven",
        nameTh: "บริษัท เอฟแอนด์ที นันวูเว่น โซลูชั่น จำกัด",
        nameEn: "F&T Nonwoven Solution Co., Ltd.",
        shortName: "เอฟแอนด์ที",
        logo: "/img/TF (หรือ F&T).jpg",
        status: "pending",
      },
      {
        id: "hrt",
        slug: "hrt-nonwoven",
        nameTh: "บริษัท เอชอาร์ที นันวูเว่น จำกัด",
        nameEn: "HRT Nonwoven Co., Ltd.",
        shortName: "เอชอาร์ที",
        logo: `${IMG}/logo-hrt.webp`,
        tagline: "สิ่งทอ non-woven และผลิตภัณฑ์ที่เกี่ยวข้อง",
        description:
          "ประกอบธุรกิจอุตสาหกรรมทอผ้า อุตสาหกรรมผ้าที่ผลิตโดยไม่ผ่านกระบวนการถักทอ (non-woven) การผลิตเสื้อผ้า สิ่งทอ และผลิตภัณฑ์ที่เกี่ยวข้อง รวมถึงการผลิตและจำหน่ายผ้า เสื้อผ้า รองเท้า หมวก ร่ม และเครื่องประดับ",
        status: "ready",
      },
    ],
  },
  {
    id: "chemical",
    slug: "chemicals",
    number: "04",
    nameTh: "ธุรกิจเคมีภัณฑ์",
    nameEn: "Chemicals & Polymers",
    tagline: "ผลิตและจำหน่ายเคมีภัณฑ์เพื่ออุตสาหกรรม",
    description:
      "กาวอุตสาหกรรม เม็ดพลาสติกคอมปาวด์ ยางสังเคราะห์ และเคมีภัณฑ์สำหรับอุตสาหกรรมฟอกหนังและพิมพ์ผ้า พร้อมบริการแบบ One Stop Service",
    image: `${IMG}/chemical.webp`,
    imageAlt: "เคมีภัณฑ์ ADB",
    highlights: ["ADB จดทะเบียนในตลาด mai", "ร่วมทุนไทย–ไต้หวันตั้งแต่ 2533", "ตัวแทนแบรนด์เคมีระดับโลก"],
    companies: [
      {
        id: "adb",
        slug: "applied-db",
        nameTh: "บริษัท แอ็พพลาย ดีบี จำกัด (มหาชน)",
        nameEn: "Applied DB Public Co., Ltd. (ADB)",
        shortName: "ADB",
        logo: `${IMG}/logo-adb.webp`,
        image: `${IMG}/chemical.webp`,
        tagline: "ก่อตั้งปี 2548 เข้าตลาด mai ปี 2560",
        description:
          "ก่อตั้งขึ้นเมื่อปี 2548 จากการควบรวมกิจการระหว่างบริษัท ดี.บี. เคมีคัล อินดัสเตรียล จำกัด ผู้ผลิตกาวอุตสาหกรรม และบริษัท แอ็พพลาย เคมีคอล อินดัสตรี้ จำกัด ผู้ผลิตเม็ดพลาสติกคอมปาวด์ ต่อมาแปรสภาพเป็นบริษัทมหาชนจำกัด และเข้าจดทะเบียนในตลาดหลักทรัพย์ เอ็ม เอ ไอ ในปี 2560",
        facts: [
          { value: "2548", label: "ปีที่ก่อตั้ง" },
          { value: "mai", label: "จดทะเบียนปี 2560" },
        ],
        status: "ready",
      },
      {
        id: "eagle",
        slug: "eagle-chemical",
        nameTh: "บริษัท อีเกิ้ล เคมีคอล อินดัสตรี จำกัด",
        nameEn: "Eagle Chemical Industry Co., Ltd.",
        shortName: "อีเกิ้ล เคมีคอล",
        logo: `${IMG}/logo-eagle.webp`,
        tagline: "ร่วมทุนไทยและไต้หวัน ตั้งแต่ปี 2533",
        description:
          "บริษัทร่วมทุนระหว่างกลุ่มเจริญสินและหุ้นส่วนชาวไต้หวัน ตั้งแต่ปี พ.ศ. 2533 ดำเนินธุรกิจเคมีภัณฑ์สำหรับอุตสาหกรรมฟอกหนังและพิมพ์ผ้า ปัจจุบันเป็น One Stop Service ทั้งผลิตเองและเป็นตัวแทนจัดจำหน่ายเคมีภัณฑ์จากทั่วโลก เช่น Stahl, Lanxess, GSC, Alpa, Pulcra และ Bussetti พร้อมพัฒนาเทคนิคการผลิตหนังไปพร้อมกับลูกค้า",
        facts: [{ value: "2533", label: "เริ่มร่วมทุน" }],
        status: "ready",
      },
      {
        id: "csr",
        slug: "cs-rubber",
        nameTh: "บริษัท ซี เอส รับเบอร์ อินดัสทรี่ จำกัด",
        nameEn: "CS Rubber Industry Co., Ltd.",
        shortName: "ซี เอส รับเบอร์",
        logo: "/img/CSR.jpg",
        status: "pending",
      },
      {
        id: "unitel",
        slug: "cs-unitel",
        nameTh: "บริษัท ซีเอส ยูนิเทล เทคโนโลยี จำกัด",
        nameEn: "CS Unitel Technology Co., Ltd.",
        shortName: "ซีเอส ยูนิเทล",
        logo: "/img/CS UNITEL.jpg",
        status: "pending",
      },
      {
        id: "mitsufuku",
        slug: "cs-mitsufuku",
        nameTh: "บริษัท ซี เอส มิตซูฟุกุ อิลาสโตเมอร์ จำกัด",
        nameEn: "CS Mitsufuku Elastomer Co., Ltd.",
        shortName: "ซี เอส มิตซูฟุกุ",
        logo: "/img/CS MITSUFUKU.jpg",
        status: "pending",
      },
      {
        id: "csj",
        slug: "csj-rubber-sheet",
        nameTh: "บริษัท ซีเอสเจ รับเบอร์ชีท จำกัด",
        nameEn: "CSJ Rubber Sheet Co., Ltd.",
        shortName: "ซีเอสเจ",
        logo: "/img/CSJ.jpg",
        status: "pending",
      },
    ],
  },
  {
    id: "other",
    slug: "other-ventures",
    number: "05",
    nameTh: "ธุรกิจอื่นๆ",
    nameEn: "Other Ventures",
    tagline: "ธุรกิจใหม่ และการลงทุนในอุตสาหกรรมอนาคต",
    description:
      "การลงทุนที่ต่อยอดความแข็งแกร่งของกลุ่ม ครอบคลุมบริการทางการเงิน ระบบสายไฟ เกษตรกรรม อาหาร การออกแบบอุตสาหกรรม การจัดการของเสีย และการรักษาความปลอดภัย",
    image: `${IMG}/other.webp`,
    imageAlt: "ธุรกิจอื่นๆ ของกลุ่มเจริญสิน",
    highlights: ["7 บริษัทในกลุ่ม", "การลงทุนในอุตสาหกรรมอนาคต"],
    companies: [
      { id: "ccap", slug: "charoensin-capital", nameTh: "บริษัท เจริญสิน แคปปิตอล จำกัด", nameEn: "Charoensin Capital Co., Ltd.", shortName: "เจริญสิน แคปปิตอล", logo: "/img/CCAP.jpg", status: "pending" },
      { id: "tws", slug: "thai-wiring-system", nameTh: "บริษัท ไทย ไวร์ริ่ง ซิสเต็ม จำกัด", nameEn: "Thai Wiring System Co., Ltd.", shortName: "ไทย ไวร์ริ่ง ซิสเต็ม", logo: "/img/TWS.jpg", status: "pending" },
      { id: "caltree", slug: "saeng-burapa-plantation", nameTh: "บริษัท แสงบูรพา แพลนเทชั่น จำกัด", nameEn: "Saeng Burapa Plantation Co., Ltd.", shortName: "แสงบูรพา แพลนเทชั่น", logo: "/img/CALTREE.jpg", status: "pending" },
      { id: "premium", slug: "fine-food-factor", nameTh: "บริษัท ไฟน์ ฟู้ด แฟกเตอร์ จำกัด", nameEn: "Fine Food Factor Co., Ltd.", shortName: "ไฟน์ ฟู้ด แฟกเตอร์", logo: "/img/PREMIUM.jpg", status: "pending" },
      { id: "smartsense", slug: "smart-sense-industrial-design", nameTh: "บริษัท สมาร์ท เซนส์ อินดัสเตรียล ดีไซน์ จำกัด", nameEn: "Smart Sense Industrial Design Co., Ltd.", shortName: "สมาร์ท เซนส์", logo: "/img/SMART SENSE.jpg", status: "pending" },
      { id: "endofwaste", slug: "now-end-of-waste", nameTh: "บริษัท นาว เอนด์ออฟเวสท์ จำกัด", nameEn: "Now End of Waste Co., Ltd.", shortName: "นาว เอนด์ออฟเวสท์", logo: "/img/END OF WASTE.jpg", status: "pending" },
      { id: "bbest", slug: "b-best-service", nameTh: "บริษัท รักษาความปลอดภัย บี-เบสท์ เซอร์วิส จำกัด", nameEn: "B-Best Service Security Co., Ltd.", shortName: "บี-เบสท์ เซอร์วิส", logo: "/img/BEST (หรือ B BEST).jpg", status: "pending" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page-level content
// ---------------------------------------------------------------------------

const companyCount = businessGroups.reduce((n, g) => n + g.companies.length, 0);

export const businessHero = {
  eyebrow: "Our Businesses",
  title: "ธุรกิจของเรา",
  subtitle:
    "5 กลุ่มธุรกิจที่เชื่อมโยงกันตลอดห่วงโซ่อุตสาหกรรม ขับเคลื่อนด้วยการส่งมอบคุณค่าและการเติบโตอย่างมั่นคง",
  /** Hero 3D cards — one per business group, in group order 01–05 */
  tiles: [
    { number: "01", group: "อสังหาริมทรัพย์", src: `${IMG}/asset-house.webp`, alt: "โครงการบ้านของเจริญสิน แอสเสท", label: "เจริญสิน แอสเสท", caption: "25 โครงการ กว่า 40,000 ห้อง", groupId: "real-estate" },
    { number: "02", group: "ผลิตหนังและรองเท้า", src: `${IMG}/leather.webp`, alt: "โรงฟอกหนัง ซีพีแอล", label: "ซีพีแอล", caption: "ฟอกหนัง สมุทรปราการ", groupId: "leather-footwear" },
    { number: "03", group: "สิ่งทอ", src: `${IMG}/textile.webp`, alt: "ผ้าใยสังเคราะห์ ทีทีเอ็น", label: "ทีทีเอ็น นันวูเว่น โซลูชั่น", caption: "ผ้าใยสังเคราะห์และผ้าสักหลาด", groupId: "non-woven" },
    { number: "04", group: "เคมีภัณฑ์", src: `${IMG}/chemical.webp`, alt: "เม็ดพลาสติกคอมปาวด์ ADB", label: "แอ็พพลาย ดีบี (ADB)", caption: "เข้าตลาด mai ปี 2560", groupId: "chemical" },
    { number: "05", group: "ธุรกิจอื่นๆ", src: `${IMG}/other.webp`, alt: "ธุรกิจอื่นๆ ของกลุ่มเจริญสิน", label: "เจริญสิน แคปปิตอล และอื่นๆ", caption: "7 บริษัท การลงทุนในอุตสาหกรรมอนาคต", groupId: "other" },
  ],
};

export const businessStats: BusinessStat[] = [
  { value: businessGroups.length, label: "กลุ่มธุรกิจ" },
  { value: companyCount, label: "บริษัทและธุรกิจในเครือ" },
  { value: 40000, suffix: "+", label: "ห้องพักในโครงการ", note: "เจริญสิน แอสเสท" },
  { value: 9000, suffix: "+", label: "ลูกค้าธุรกิจ" },
];

export const businessManifesto = {
  lead: "เจริญสินขับเคลื่อนธุรกิจด้วยการ",
  words: ["ส่งมอบคุณค่า", "สร้างคุณค่า", "เติบโตอย่างมั่นคง"],
  body: "ดำเนินธุรกิจด้วยการยึดหลัก 4 ข้อสำคัญ เพื่อพัฒนาบุคลากรและกระบวนการทำงานทั้งหมด เพื่อสร้างคุณค่าให้กับสังคม",
};

export const businessSynergy = {
  eyebrow: "Integrated Value Chain",
  title: "เติบโตด้วยกัน ตลอดห่วงโซ่อุตสาหกรรม",
  body: "ในโลกที่ธุรกิจเปลี่ยนแปลงอย่างรวดเร็ว ความสามารถในการขับเคลื่อนอย่างบูรณาการคือหัวใจสำคัญ กลุ่มบริษัทเจริญสินจึงเชื่อมโยงจุดแข็งของแต่ละกลุ่มธุรกิจเข้าด้วยกัน เพื่อส่งมอบนวัตกรรม โอกาส และความยั่งยืน ให้แก่ประเทศ ประชาชน และองค์กร",
  image: `${IMG}/building.webp`,
  imageAlt: "อาคารเจริญสิน ทางเข้าหลังคาทองและรูปปั้นช้าง",
  principles: [
    { th: "ความมั่นคง", en: "Strength", description: "บริหารด้วยวินัยทางการเงินและธรรมาภิบาล ให้ทุกธุรกิจในเครือเติบโตบนรากฐานที่แข็งแรง" },
    { th: "การผนึกกำลัง", en: "Synergy", description: "เชื่อมจุดแข็งของแต่ละกลุ่มธุรกิจและพันธมิตร ให้ต่อยอดกันได้ตลอดห่วงโซ่อุตสาหกรรม" },
    { th: "ความต่อเนื่อง", en: "Continuity", description: "พัฒนาบุคลากรและกระบวนการทำงานอย่างต่อเนื่อง เพื่อส่งต่อองค์ความรู้และคุณค่าสู่คนรุ่นถัดไป" },
    { th: "วิสัยทัศน์", en: "Vision", description: "ลงทุนในนวัตกรรมและอุตสาหกรรมแห่งอนาคต ควบคู่กับความรับผิดชอบต่อสังคมและสิ่งแวดล้อม" },
  ] as BusinessPrinciple[],
  milestones: [
    { year: "2533", title: "อีเกิ้ล เคมีคอล อินดัสตรี", description: "ร่วมทุนกับหุ้นส่วนชาวไต้หวัน เริ่มธุรกิจเคมีภัณฑ์สำหรับอุตสาหกรรมฟอกหนังและพิมพ์ผ้า" },
    { year: "2548", title: "แอ็พพลาย ดีบี (ADB)", description: "ควบรวมผู้ผลิตกาวอุตสาหกรรมและผู้ผลิตเม็ดพลาสติกคอมปาวด์" },
    { year: "2560", title: "ADB เข้าตลาด mai", description: "เข้าจดทะเบียนในตลาดหลักทรัพย์ เอ็ม เอ ไอ" },
    { year: "วันนี้", title: `${businessGroups.length} กลุ่มธุรกิจ ${companyCount} บริษัทและธุรกิจในเครือ`, description: "และลูกค้าธุรกิจกว่า 9,000 ราย" },
  ] as BusinessMilestone[],
};

// ---------------------------------------------------------------------------
// Data access (swap these for WordPress REST fetches later)
// ---------------------------------------------------------------------------

export async function getBusinessGroups(): Promise<BusinessGroup[]> {
  return businessGroups;
}

export async function getBusinessPageData() {
  return {
    hero: businessHero,
    stats: businessStats,
    manifesto: businessManifesto,
    groups: businessGroups,
    synergy: businessSynergy,
  };
}

export type BusinessPageData = Awaited<ReturnType<typeof getBusinessPageData>>;
