import type { LanguageCode } from "@/data/languages";
import { businessGroups } from "@/data/businesses-data";

/* ==========================================================================
   /businesses + /businesses/[slug] phrases (merged into phraseDict)
   --------------------------------------------------------------------------
   UI labels, fact labels and gallery captions are translated into every
   language. Long company copy (tagline, description, strengths) is written
   in English only; zh / ja fall back to it through the usual
   chosen → English → Thai chain. Long copy is keyed by company / group id
   and turned into Thai-keyed entries from businesses-data.ts, so the Thai
   source text is never retyped here.
   Brand rules as in ./phrases.ts: zh uses 陳振誠集團, never "Charoensin".
   ========================================================================== */

type Phrases = Record<string, string>;
type Lang = Exclude<LanguageCode, "th">;

/** Thai key → [en, zh-CN, zh-TW, ja] */
const ui: Record<string, [string, string, string, string]> = {
  "ดูรายละเอียด": ["View details", "查看详情", "查看詳情", "詳細を見る"],
  "เยี่ยมชมเว็บไซต์": ["Visit website", "访问网站", "造訪網站", "ウェブサイトへ"],
  "เยี่ยมชมเว็บไซต์บริษัทหลัก": ["Visit the company website", "访问公司官网", "造訪公司官網", "企業公式サイトへ"],
  "(เปิดในแท็บใหม่)": ["(opens in a new tab)", "（在新标签页打开）", "（在新分頁開啟）", "（新しいタブで開きます）"],
  "กลับไปหน้าธุรกิจของเรา": ["Back to Our Businesses", "返回我们的业务", "返回我們的業務", "事業紹介に戻る"],
  "ภาพรวมธุรกิจ": ["Business overview", "业务概览", "業務概覽", "事業概要"],
  "จุดแข็ง": ["Strengths", "核心优势", "核心優勢", "強み"],
  "แกลเลอรีภาพ": ["Gallery", "图片集", "圖片集", "ギャラリー"],
  "บริษัทอื่นในกลุ่ม": ["Other companies in this group", "本板块其他公司", "本板塊其他公司", "同じ事業分野の他の企業"],
  "บริษัทในกลุ่ม": ["Companies in this group", "本板块公司", "本板塊公司", "この事業分野の企業"],
  "รอข้อมูลจากบริษัท": ["Details coming soon", "资料即将更新", "資料即將更新", "詳細は準備中です"],
  "ข้อมูลบริษัทกำลังจัดเตรียม": [
    "Company details are being prepared",
    "公司资料正在准备中",
    "公司資料正在準備中",
    "企業情報は現在準備中です",
  ],
  "ขยายภาพ": ["Enlarge photo", "放大图片", "放大圖片", "写真を拡大"],
  "ดูภาพ": ["View photo", "查看图片", "查看圖片", "写真を見る"],
  "ภาพก่อนหน้า": ["Previous photo", "上一张", "上一張", "前の写真"],
  "ภาพถัดไป": ["Next photo", "下一张", "下一張", "次の写真"],
  // gallery captions
  "บ้านจัดสรร": ["Housing estates", "住宅小区", "住宅社區", "分譲住宅"],
  "ที่ดิน": ["Land", "土地", "土地", "土地"],
  "โกดัง": ["Warehouses", "仓库", "倉庫", "倉庫"],
  "อาคารพาณิชย์": ["Shophouses", "商业楼", "商業樓", "店舗併用住宅"],
  // fact labels
  "โครงการ": ["Projects", "项目", "項目", "プロジェクト"],
  "ห้องพัก": ["Rooms", "客房", "客房", "客室"],
  "ห้องพักและสวีท": ["Rooms and suites", "客房与套房", "客房與套房", "客室・スイート"],
  "ตร.ม. ต่อห้อง": ["sq m per room", "平方米／间", "平方公尺／間", "㎡／室"],
  "ประเทศ สำนักงานตัวแทน": ["Countries with representative offices", "设有代表处的国家", "設有代表處的國家", "駐在事務所のある国"],
  "กม. จากกรุงเทพฯ": ["km from Bangkok", "公里（距曼谷）", "公里（距曼谷）", "km（バンコクから）"],
  "มอก.": ["TIS", "泰国工业标准 TIS", "泰國工業標準 TIS", "TIS（タイ工業規格）"],
  "ปีที่ก่อตั้ง": ["Year founded", "成立年份", "成立年份", "設立年"],
  "จดทะเบียนปี 2560": ["Listed in 2017", "2017 年上市", "2017 年上市", "2017年上場"],
  "เริ่มร่วมทุน": ["Joint venture since", "合资起始年份", "合資起始年份", "合弁開始年"],
  // Buddhist-era years used as fact values
  "2548": ["2005", "2005", "2005", "2005"],
  "2533": ["1990", "1990", "1990", "1990"],
  // short names in the company tabs
  "อีเกิ้ล เคมีคอล": ["Eagle Chemical", "Eagle Chemical", "Eagle Chemical", "Eagle Chemical"],
  "เอชอาร์ที": ["HRT", "HRT", "HRT", "HRT"],
  "แมนวูด": ["Manwood", "Manwood", "Manwood", "Manwood"],
};

/* Affiliate dropdown ("บริษัทในเครือ ▾"): registered English names; zh / ja
   keep English except the Charoensin-named companies (陳振誠 / チャルンシン) */
const reg = (en: string): [string, string, string, string] => [en, en, en, en];
const affiliateNames: Record<string, [string, string, string, string]> = {
  "ภาพรวมกลุ่มธุรกิจ": ["Business group overview", "业务板块概览", "業務板塊概覽", "事業分野の概要"],
  "บมจ. ซีพีแอล กรุ๊ป": reg("CPL Group PCL"),
  "บจก. เจริญสิน แอสเสท": ["Charoensin Asset Co., Ltd.", "陳振誠资产有限公司", "陳振誠資產有限公司", "チャルンシン・アセット株式会社"],
  "บมจ. แอ็พพลาย ดีบี": reg("Applied DB PCL"),
  "บจก. ทีทีเอ็น นันวูเว่น โซลูชั่น": reg("TTN Nonwoven Solution Co., Ltd."),
  "บจก. ซงเม่า นันวูเว่น": reg("Song Mao Nonwoven Co., Ltd."),
  "บจก. อีเกิ้ล เคมีคอล อินดัสตรี": reg("Eagle Chemical Industry Co., Ltd."),
  "บจก. ซีเอส รับเบอร์ อินดัสตรี": reg("CS Rubber Industry Co., Ltd."),
  "บจก. ซีเอส ยูนิเทล เทคโนโลยี": reg("CS Unitel Technology Co., Ltd."),
  "บจก. ซีเอส มิตซูฟูกุ อีลาสโตเมอร์": reg("CS Mitsufuku Elastomer Co., Ltd."),
  "บจก. ซีเอสเจ รับเบอร์ชีท": reg("CSJ Rubber Sheet Co., Ltd."),
  "บจก. แมนวูด อินเตอร์เทรด": reg("Manwood Intertrade Co., Ltd."),
  "บจก. ไทย ไวร์ริ่ง ซิสเต็ม": reg("Thai Wiring System Co., Ltd."),
  "บจก. เจริญสิน แคปปิตอล": ["Charoensin Capital Co., Ltd.", "陳振誠资本有限公司", "陳振誠資本有限公司", "チャルンシン・キャピタル株式会社"],
};

/** Group tagline by group id → [en, zh-CN, zh-TW, ja] */
const groupTagline: Record<string, [string, string, string, string]> = {
  "real-estate": [
    "Commercial and residential property development",
    "商业与住宅地产开发",
    "商業與住宅地產開發",
    "商業・住宅不動産の開発",
  ],
  "leather-footwear": [
    "Tanned leather, safety equipment and quality leather footwear",
    "鞣制皮革、安全防护用品与优质皮鞋",
    "鞣製皮革、安全防護用品與優質皮鞋",
    "なめし革・安全用品・高品質な革靴",
  ],
  "non-woven": ["Integrated textile manufacturing and distribution", "一体化纺织品生产与销售", "一體化紡織品生產與銷售", "繊維製品の一貫生産・販売"],
  chemical: ["Industrial chemicals manufacturing and distribution", "工业化学品生产与销售", "工業化學品生產與銷售", "工業用化学品の製造・販売"],
  other: ["New businesses and investment in future industries", "新兴业务与未来产业投资", "新興業務與未來產業投資", "新規事業と未来産業への投資"],
};

/** Group highlight chips by group id (same order as the data) */
const groupHighlights: Record<string, [string, string, string, string][]> = {
  "real-estate": [
    ["25 projects", "25 个项目", "25 個項目", "25プロジェクト"],
    ["Over 40,000 rooms", "逾 40,000 间客房", "逾 40,000 間客房", "40,000室以上"],
    ["Over 35 years of experience", "逾 35 年经验", "逾 35 年經驗", "35年以上の実績"],
  ],
  "leather-footwear": [
    ["A world-leading tannery", "世界领先的制革厂", "世界領先的製革廠", "世界有数のなめし工場"],
    ["Offices in 4 countries", "4 个国家设有代表处", "4 個國家設有代表處", "4か国に駐在事務所"],
    ["TIS and ISO certified", "通过 TIS 与 ISO 认证", "通過 TIS 與 ISO 認證", "TIS・ISO認証"],
  ],
  "non-woven": [
    ["Over 35 years in non-woven fabrics", "逾 35 年无纺布生产经验", "逾 35 年不織布生產經驗", "不織布製造35年以上"],
    ["Trusted by global brands", "深受全球品牌信赖", "深受全球品牌信賴", "世界的ブランドが信頼"],
    ["Domestic and export markets", "国内与海外市场", "國內與海外市場", "国内外の市場"],
  ],
  chemical: [
    ["ADB listed on the mai", "ADB 于泰国 mai 上市", "ADB 於泰國 mai 上市", "ADBはmai上場"],
    ["Thai–Taiwanese joint venture since 1990", "1990 年起泰台合资", "1990 年起泰台合資", "1990年からのタイ・台湾合弁"],
    ["Agent for world-class chemical brands", "世界级化工品牌代理", "世界級化工品牌代理", "世界的化学品ブランドの代理店"],
  ],
  other: [
    ["7 group companies", "7 家集团公司", "7 家集團公司", "グループ企業7社"],
    ["Investing in future industries", "投资未来产业", "投資未來產業", "未来産業への投資"],
  ],
};

/** English company copy by company id */
const companyEn: Record<string, { tagline?: string; description?: string; strengths?: string[] }> = {
  csa: {
    tagline: "25 projects, over 40,000 rooms",
    description:
      "For more than 35 years the company has developed property and run rental accommodation. It specialises in managing large communities of affordable rental rooms for industrial-estate workers and tourist destinations across Thailand, in convenient locations within towns, cities and near business centres.",
    strengths: [
      "Over 40,000 rental rooms in 25 projects",
      "More than 35 years managing large communities",
      "Locations near industrial estates and business centres",
    ],
  },
  marni: {
    tagline: "40 rooms and suites in Pattaya",
    description:
      "An elevated stay with a range of room types, from 28 sq m deluxe rooms to 176 sq m luxury suites and private pool villas. All 40 rooms have been redesigned in a contemporary style, each with its own balcony or terrace overlooking the pool or partly the sea of Pattaya.",
    strengths: [
      "40 rooms and suites, redesigned in a contemporary style",
      "A private balcony or terrace in every room",
      "Pool and Pattaya sea views",
    ],
  },
  cpl: {
    tagline: "A tannery in Samut Prakan, near Suvarnabhumi Airport",
    description:
      "One of the world's leading tanneries, located in Samut Prakan about 20 km from Bangkok near Suvarnabhumi Airport, with representative offices in China, the United States, Vietnam and Indonesia for close communication and continuous after-sales service.",
    strengths: [
      "One of the world's leading tanneries",
      "Representative offices in 4 countries",
      "Located near Suvarnabhumi Airport",
    ],
  },
  pangolin: {
    tagline: "Thailand's first TIS-certified safety footwear",
    description:
      "A manufacturer and distributor of safety equipment, especially safety footwear. It was the first company in Thailand certified to the TIS 523-2528 industrial product standard and to ISO 9001:2008 by Bureau Veritas, and is a member of the SATRA Technology Centre.",
    strengths: [
      "Thailand's first safety footwear certified to TIS 523-2528",
      "ISO 9001:2008 quality system by Bureau Veritas",
      "Member of the SATRA Technology Centre",
    ],
  },
  manwood: {
    tagline: "Thai genuine-leather footwear brand",
    description:
      "A leading Thai genuine-leather footwear brand. MANWOOD combines fine craftsmanship with timeless quality — from carefully selected premium leather and meticulous stitching to designs that respect the wearer's anatomy for confidence and comfort in every step.",
    strengths: [
      "MANWOOD, a Thai genuine-leather footwear brand",
      "Premium leather, meticulously stitched",
      "Designed around the wearer's anatomy",
    ],
  },
  ttn: {
    tagline: "Making non-woven fabrics for over 35 years",
    description:
      "A leading Thai maker of non-woven fabrics and felt with more than 35 years of experience, trusted by well-known customers worldwide and continually advancing its techniques for high-quality non-woven materials.",
    strengths: [
      "Over 35 years making non-woven fabrics",
      "Trusted by customers worldwide",
      "Continually advancing non-woven production",
    ],
  },
  smn: {
    tagline: "Established over 25 years ago",
    description:
      "A specialist in manufacturing and distributing quality non-woven fabrics of every kind, with a wide range of fibre products for many industries, recognised by world-famous brands.",
    strengths: [
      "Established over 25 years ago",
      "A wide range of fibre products for many industries",
      "Recognised by world-famous brands",
    ],
  },
  hrt: {
    tagline: "Non-woven textiles and related products",
    description:
      "Operates in weaving and non-woven fabric manufacturing, garments, textiles and related products, including the production and sale of fabrics, clothing, footwear, hats, umbrellas and accessories.",
    strengths: ["Integrated non-woven textile production", "Extending into garments, footwear, hats and umbrellas"],
  },
  adb: {
    tagline: "Founded in 2005, listed on the mai in 2017",
    description:
      "Founded in 2005 through the merger of D.B. Chemical Industrial Co., Ltd., a maker of industrial adhesives, and Applied Chemical Industry Co., Ltd., a maker of plastic compounds. It later became a public company and listed on the Market for Alternative Investment (mai) in 2017.",
    strengths: ["Listed on the Market for Alternative Investment (mai) in 2017", "Maker of industrial adhesives and plastic compounds"],
  },
  eagle: {
    tagline: "A Thai–Taiwanese joint venture since 1990",
    description:
      "A joint venture between Charoensin Group and Taiwanese partners since 1990, supplying chemicals for the leather-tanning and textile-printing industries. Today it is a one-stop service that both manufactures and distributes chemicals from around the world — including Stahl, Lanxess, GSC, Alpa, Pulcra and Bussetti — and develops leather-making techniques together with its customers.",
    strengths: [
      "Thai–Taiwanese joint venture since 1990",
      "One-stop service: own production and distribution",
      "Agent for world-class brands such as Stahl and Lanxess",
    ],
  },
};

/* Descriptions whose English text names "Charoensin Group": translated so
   zh never falls back to "Charoensin" (brand rule) — [zh-CN, zh-TW, ja] */
const brandedDescription: Record<string, [string, string, string]> = {
  eagle: [
    "自 1990 年起由陳振誠集團与台湾合作伙伴合资成立，为制革与印染行业提供化学品。如今提供一站式服务，既自主生产，也代理销售来自全球的化学品，包括 Stahl、Lanxess、GSC、Alpa、Pulcra 和 Bussetti，并与客户共同开发制革技术。",
    "自 1990 年起由陳振誠集團與台灣合作夥伴合資成立，為製革與印染產業提供化學品。如今提供一站式服務，既自主生產，也代理銷售來自全球的化學品，包括 Stahl、Lanxess、GSC、Alpa、Pulcra 和 Bussetti，並與客戶共同開發製革技術。",
    "1990年にチャルンシン・グループと台湾のパートナーが設立した合弁会社で、皮革なめし・捺染業界向けの化学品を手がけています。現在は自社製造と、Stahl、Lanxess、GSC、Alpa、Pulcra、Bussettiなど世界各国の化学品の販売を担うワンストップサービスを提供し、顧客とともに皮革製造技術の開発にも取り組んでいます。",
  ],
};

const LANGS: Lang[] = ["en", "zh-CN", "zh-TW", "ja"];

function build(): Record<Lang, Phrases> {
  const out: Record<Lang, Phrases> = { en: {}, "zh-CN": {}, "zh-TW": {}, ja: {} };
  const put = (thai: string | undefined, values: [string, string, string, string]) => {
    if (!thai) return;
    LANGS.forEach((l, i) => (out[l][thai] = values[i]));
  };
  for (const [thai, v] of Object.entries({ ...ui, ...affiliateNames })) put(thai, v);
  for (const g of businessGroups) {
    if (groupTagline[g.id]) put(g.tagline, groupTagline[g.id]);
    g.highlights.forEach((h, i) => groupHighlights[g.id]?.[i] && put(h, groupHighlights[g.id][i]));
    for (const c of g.companies) {
      const en = companyEn[c.id];
      if (!en) continue;
      if (c.tagline && en.tagline) out.en[c.tagline] = en.tagline;
      if (c.description && en.description) out.en[c.description] = en.description;
      const branded = brandedDescription[c.id];
      if (c.description && branded) {
        out["zh-CN"][c.description] = branded[0];
        out["zh-TW"][c.description] = branded[1];
        out.ja[c.description] = branded[2];
      }
      c.strengths?.forEach((s, i) => en.strengths?.[i] && (out.en[s] = en.strengths[i]));
    }
  }
  return out;
}

export const businessPhrases = build();
