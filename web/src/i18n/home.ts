import type { LanguageCode } from "@/data/languages";
import {
  globalCopy,
  growthMilestones,
  manifesto,
  manifestoStats,
  philosophies,
  philosophyCopy,
  venturesCopy,
} from "@/data/home-data";
import { heroCopy, heroPillars } from "@/components/home/hero-data";

/* ==========================================================================
   Home page dictionary — th / en / zh-CN / zh-TW / ja
   --------------------------------------------------------------------------
   • `th` is built from the existing Thai data files, so the Thai copy has a
     single source of truth. Every other language overrides it key by key.
   • Lookup order (see useHomeCopy): chosen language → English → Thai, so a
     missing line falls back to English and never throws.
   • Arrays are matched by index (stats 4, strengths 3, milestones 3,
     philosophy items 4). Pillars are keyed by business-group id.
   • Translations are a first draft for review by native speakers. Both
     Chinese variants use the group's Chinese name 陳振誠集團 (as on the HQ
     sign) wherever English says "Charoensin" / "Charoensin Group",
     including the giant hero wordmark (hero.display).
   ========================================================================== */

const pillarsTh = Object.fromEntries(heroPillars.map((p) => [p.id, { name: p.nameTh, tagline: p.tagline }]));

const th = {
  hero: {
    script: heroCopy.script,
    /** Giant hero wordmark */
    display: heroCopy.display,
    eyebrow: heroCopy.eyebrow,
    title: heroCopy.title,
    tagline: heroCopy.tagline,
    contact: heroCopy.contactLabel,
    menu: "Menu",
    pillars: pillarsTh as Record<string, { name: string; tagline: string }>,
  },
  manifesto: {
    tag: manifesto.tag,
    title: manifesto.title,
    vision: manifesto.vision,
    story: manifesto.story,
    cta: manifesto.cta.label,
    statsLabel: "สถิติเจริญสิน",
    strengths: [
      { value: "05", label: "เสาหลักอุตสาหกรรม" },
      { value: "10", label: "ประเทศทั่วโลก" },
      { value: "24", label: "บริษัทและแบรนด์ในเครือ" },
    ],
    stats: manifestoStats.map((s) => ({ unit: s.unit, label: s.label, note: s.note })),
  },
  global: {
    eyebrow: globalCopy.eyebrow,
    title: globalCopy.title,
    lead: globalCopy.lead,
    sub: globalCopy.sub,
    growthTitle: globalCopy.growthTitle,
    growthSub: globalCopy.growthSub,
    /** {y} = the milestone year below */
    yearLabel: "ปี พ.ศ. {y}",
    milestones: growthMilestones.map((m) => ({ year: m.year, desc: m.desc })),
    /** Map section (FootprintMap) — country keys are lower-case ISO codes */
    map: {
      label: "แผนที่ฐานธุรกิจและเครือข่าย 10 ประเทศของกลุ่มบริษัทเจริญสิน",
      choose: "เลือกประเทศ",
      zoomIn: "ซูมเข้า",
      zoomOut: "ซูมออก",
      reset: "กลับมุมมองภาพรวม",
      countries: {
        th: { name: "ไทย", desc: "สำนักงานใหญ่และฐานธุรกิจหลักของกลุ่มเจริญสิน" },
        cn: { name: "จีน", desc: "ตลาดการค้าและพันธมิตรซัพพลายเชนหลัก" },
        kr: { name: "เกาหลีใต้", desc: "ฐานลูกค้านวัตกรรมสิ่งทอและวัสดุ" },
        jp: { name: "ญี่ปุ่น", desc: "มาตรฐานความปลอดภัยและเคมีภัณฑ์ยานยนต์" },
        in: { name: "อินเดีย", desc: "ตลาดเคมีภัณฑ์และพอลิเมอร์อุตสาหกรรม" },
        ae: { name: "สหรัฐอาหรับเอมิเรตส์", desc: "ศูนย์กระจายสินค้าตะวันออกกลางและแอฟริกา" },
        de: { name: "เยอรมนี", desc: "ฐานวิศวกรรมเทคโนโลยีความปลอดภัยยุโรป" },
        gb: { name: "สหราชอาณาจักร", desc: "ตลาดการค้าระหว่างประเทศและพันธมิตรยุโรป" },
        us: { name: "สหรัฐอเมริกา", desc: "ตลาดส่งออกหนังแท้และอุปกรณ์เซฟตี้สากล" },
        au: { name: "ออสเตรเลีย", desc: "ตลาดผลิตภัณฑ์เพื่อความยั่งยืนและการเกษตร" },
      } as Record<string, { name: string; desc: string }>,
    },
  },
  philosophy: {
    eyebrow: philosophyCopy.eyebrow,
    title: philosophyCopy.title,
    lead: philosophyCopy.lead,
    items: philosophies.map((p) => ({ title: p.title, desc: p.desc })),
  },
  ventures: {
    eyebrow: venturesCopy.eyebrow,
    title: venturesCopy.title,
    lead: venturesCopy.lead,
    details: "ดูรายละเอียด",
  },
  news: {
    title: "ข่าวสารและกิจกรรม",
    sub: "ติดตามความเคลื่อนไหว ประกาศองค์กร และกิจกรรมเพื่อสังคมล่าสุดจากกลุ่มบริษัทเจริญสิน",
    cta: "ดูข่าวสารและกิจกรรมทั้งหมด",
    prev: "ข่าวก่อนหน้า",
    next: "ข่าวถัดไป",
    seeMore: "ดูเพิ่มเติม",
    like: "ถูกใจ",
    comment: "แสดงความคิดเห็น",
    share: "แชร์",
    openFb: "เปิดโพสต์บน Facebook",
  },
};

export type HomeDict = typeof th;

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const en: DeepPartial<HomeDict> = {
  hero: {
    eyebrow: "Our Businesses",
    title: "Charoensin's 5 Core Business Groups",
    tagline: "Creating value, growing with stability",
    contact: "Contact us",
    menu: "Menu",
    pillars: {
      "real-estate": { name: "Real Estate", tagline: "Residential and commercial development" },
      "leather-footwear": { name: "Leather & Footwear", tagline: "Tanned leather and global safety gear" },
      "non-woven": { name: "Textiles", tagline: "Fibres and non-woven textiles" },
      chemical: { name: "Chemicals & Industry", tagline: "Adhesives, sealants and synthetic rubber" },
      other: { name: "Other Businesses", tagline: "Finance, energy and social enterprise" },
    },
  },
  manifesto: {
    tag: "ABOUT CHAROENSIN GROUP",
    title: "About Charoensin Group",
    vision:
      "Charoensin Group is one of Thailand's leading conglomerates, operating with stability and sustainability for more than 80 years since its founding in 1946. Beginning as a family trading business, and built on strong foundations and a vision of continuous development, the Group today spans five industrial pillars.",
    story:
      "With modern machinery and a professional team, we help our customers and partners operate efficiently, reduce waste and grow sustainably.",
    cta: "Learn more about us",
    statsLabel: "Charoensin in numbers",
    strengths: [
      { value: "05", label: "Industrial pillars" },
      { value: "10", label: "Countries worldwide" },
      { value: "24", label: "Companies and brands" },
    ],
    stats: [
      { unit: "years", label: "Established", note: "More than eight decades of stability" },
      { unit: "clients", label: "Our customers", note: "Who trust our products and services" },
      { unit: "people", label: "Our employees", note: "Professionals driving the organisation" },
      { unit: "%", label: "Satisfaction rate", note: "The highest standards of quality and satisfaction" },
    ],
  },
  global: {
    title: "Charoensin Group's Business Base",
    lead: "CSG serves more than 10 million customers in 10 countries",
    sub: "Connecting partners, distributors and production bases across continents to build stability and confidence worldwide.",
    growthTitle: "Growth Across Our Group",
    growthSub: "Steady, sustainable and continuous growth",
    yearLabel: "Year {y}",
    milestones: [
      { year: "2023", desc: "A stable foundation for growth, and restructuring for sustainability" },
      { year: "2024", desc: "Proactive regional market expansion and green innovation" },
      { year: "2025", desc: "A leap toward global growth, driving the circular economy" },
    ],
    map: {
      label: "Map of Charoensin Group's business base and network in 10 countries",
      choose: "Choose a country",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      reset: "Reset view",
      countries: {
        th: { name: "Thailand", desc: "Headquarters and the Group's main business base" },
        cn: { name: "China", desc: "Key trade market and supply-chain partner" },
        kr: { name: "South Korea", desc: "Customer base for textile and materials innovation" },
        jp: { name: "Japan", desc: "Safety standards and automotive chemicals" },
        in: { name: "India", desc: "Industrial chemicals and polymers market" },
        ae: { name: "United Arab Emirates", desc: "Distribution hub for the Middle East and Africa" },
        de: { name: "Germany", desc: "European base for safety engineering and technology" },
        gb: { name: "United Kingdom", desc: "International trade market and European partner" },
        us: { name: "United States", desc: "Export market for genuine leather and safety equipment" },
        au: { name: "Australia", desc: "Market for sustainable and agricultural products" },
      },
    },
  },
  philosophy: {
    title: "Our Philosophy",
    lead: "The beliefs and principles that guide our business — passed down through generations as a compass for lasting stability.",
    items: [
      { title: "Integrity", desc: "We uphold transparency, ethics and our commitments in every aspect of business, building lasting trust with partners, allies and society." },
      { title: "Mutual Benefit", desc: "We create shared value in every relationship — with partners, society, communities and our people — growing together fairly, securely and supportively." },
      { title: "Continuous Improvement", desc: "We learn and grow together through research, innovation and modern industrial technology, raising performance to international standards." },
      { title: "Commitment to Quality", desc: "We care about every detail and process to deliver the best quality and the highest safety standards to consumers and industries worldwide." },
    ],
  },
  ventures: {
    title: "Businesses Driving the Future",
    lead: "Creating value in every dimension through the excellence of our flagship businesses and Charoensin partners.",
    details: "View details",
  },
  news: {
    title: "News & Activities",
    sub: "Follow the latest updates, corporate announcements and social activities from Charoensin Group.",
    cta: "View all news and activities",
    prev: "Previous news",
    next: "Next news",
    seeMore: "See more",
    like: "Like",
    comment: "Comment",
    share: "Share",
    openFb: "Open post on Facebook",
  },
};

const zhCN: DeepPartial<HomeDict> = {
  hero: {
    eyebrow: "核心业务",
    display: "陳振誠集團",
    title: "陳振誠集團 五大核心业务",
    tagline: "创造价值，稳健成长",
    contact: "联系我们",
    menu: "菜单",
    pillars: {
      "real-estate": { name: "房地产", tagline: "住宅与商业空间开发" },
      "leather-footwear": { name: "皮革与鞋业", tagline: "鞣制皮革与国际安全防护用品" },
      "non-woven": { name: "纺织", tagline: "纤维与无纺布" },
      chemical: { name: "化工与工业", tagline: "胶粘剂、密封胶与合成橡胶" },
      other: { name: "其他业务", tagline: "金融、能源与社会企业" },
    },
  },
  manifesto: {
    tag: "集团简介",
    title: "关于陳振誠集團",
    vision:
      "陳振誠集團是泰国领先的多元化企业集团之一，自1946年创立以来，已稳健、可持续地经营超过80年。集团起步于家族贸易，凭借坚实的根基与持续发展的愿景，如今业务已覆盖五大产业支柱。",
    story: "凭借现代化设备与专业团队，我们帮助客户与合作伙伴高效运营、减少损耗，实现可持续增长。",
    cta: "了解更多",
    statsLabel: "陳振誠集團数据一览",
    strengths: [
      { value: "05", label: "产业支柱" },
      { value: "10", label: "覆盖国家" },
      { value: "24", label: "旗下公司与品牌" },
    ],
    stats: [
      { unit: "年", label: "创立至今", note: "逾八十年的稳健根基" },
      { unit: "位", label: "我们的客户", note: "信赖我们产品与服务的客户" },
      { unit: "人", label: "我们的员工", note: "推动企业发展的专业人才" },
      { unit: "%", label: "满意度", note: "最高的质量与满意度标准" },
    ],
  },
  global: {
    eyebrow: "全球业务网络",
    title: "陳振誠集團业务版图",
    lead: "CSG 为全球10个国家的逾1000万名客户提供服务",
    sub: "连接跨洲的合作伙伴、经销商与生产基地，在国际上建立稳定与信任。",
    growthTitle: "集团业务增长概览",
    growthSub: "稳健、可持续的持续增长",
    yearLabel: "{y}年",
    milestones: [
      { desc: "稳定增长的根基，并为可持续发展调整结构" },
      { desc: "积极拓展区域市场，发展绿色创新" },
      { desc: "迈向国际的跨越式增长目标，推动循环经济" },
    ],
    map: {
      label: "陳振誠集團10国业务与网络地图",
      choose: "选择国家",
      zoomIn: "放大",
      zoomOut: "缩小",
      reset: "重置视图",
      countries: {
        th: { name: "泰国", desc: "集团总部与核心业务基地" },
        cn: { name: "中国", desc: "主要贸易市场与供应链合作伙伴" },
        kr: { name: "韩国", desc: "纺织与材料创新客户基地" },
        jp: { name: "日本", desc: "安全标准与汽车化学品" },
        in: { name: "印度", desc: "工业化学品与聚合物市场" },
        ae: { name: "阿联酋", desc: "中东与非洲物流分销中心" },
        de: { name: "德国", desc: "欧洲安全工程与技术基地" },
        gb: { name: "英国", desc: "国际贸易市场与欧洲合作伙伴" },
        us: { name: "美国", desc: "真皮与安全防护用品出口市场" },
        au: { name: "澳大利亚", desc: "可持续与农业产品市场" },
      },
    },
  },
  philosophy: {
    eyebrow: "经营理念",
    title: "我们的理念",
    lead: "我们经营所秉持的信念与理念，代代相传，是引领企业实现长久稳健的指南针。",
    items: [
      { title: "诚信", desc: "在各个层面坚持透明、道德与信守承诺，与合作伙伴、盟友及社会建立长久信任。" },
      { title: "互利共赢", desc: "在每一段关系中共创价值——与合作伙伴、社会、社区及员工公平、稳健、互助地共同成长。" },
      { title: "持续发展", desc: "通过研发、创新与现代工业技术共同学习与成长，不断将效率提升至国际标准。" },
      { title: "品质至上", desc: "关注每个细节与生产环节，为全球消费者与产业提供最佳品质与最高安全标准。" },
    ],
  },
  ventures: {
    eyebrow: "旗舰业务",
    title: "驱动未来的业务",
    lead: "通过旗舰业务与陳振誠集團合作伙伴的卓越表现，在各个层面共创价值。",
    details: "查看详情",
  },
  news: {
    title: "新闻与活动",
    sub: "关注陳振誠集團的最新动态、企业公告与社会公益活动。",
    cta: "查看全部新闻与活动",
    prev: "上一条",
    next: "下一条",
    seeMore: "查看更多",
    like: "赞",
    comment: "评论",
    share: "分享",
    openFb: "在 Facebook 上查看帖子",
  },
};

const zhTW: DeepPartial<HomeDict> = {
  hero: {
    eyebrow: "核心事業",
    display: "陳振誠集團",
    title: "陳振誠集團 五大核心事業",
    tagline: "創造價值，穩健成長",
    contact: "聯絡我們",
    menu: "選單",
    pillars: {
      "real-estate": { name: "不動產", tagline: "住宅與商業空間開發" },
      "leather-footwear": { name: "皮革與鞋業", tagline: "鞣製皮革與國際安全防護用品" },
      "non-woven": { name: "紡織", tagline: "纖維與不織布" },
      chemical: { name: "化工與工業", tagline: "黏著劑、密封膠與合成橡膠" },
      other: { name: "其他事業", tagline: "金融、能源與社會企業" },
    },
  },
  manifesto: {
    tag: "集團簡介",
    title: "關於陳振誠集團",
    vision:
      "陳振誠集團是泰國領先的多元化企業集團之一，自1946年創立以來，已穩健、永續地經營超過80年。集團起步於家族貿易，憑藉堅實的根基與持續發展的願景，如今事業已涵蓋五大產業支柱。",
    story: "憑藉現代化設備與專業團隊，我們協助客戶與合作夥伴高效營運、減少損耗，實現永續成長。",
    cta: "了解更多",
    statsLabel: "陳振誠集團數據一覽",
    strengths: [
      { value: "05", label: "產業支柱" },
      { value: "10", label: "涵蓋國家" },
      { value: "24", label: "旗下公司與品牌" },
    ],
    stats: [
      { unit: "年", label: "創立至今", note: "逾八十年的穩健根基" },
      { unit: "位", label: "我們的客戶", note: "信賴我們產品與服務的客戶" },
      { unit: "人", label: "我們的員工", note: "推動企業發展的專業人才" },
      { unit: "%", label: "滿意度", note: "最高的品質與滿意度標準" },
    ],
  },
  global: {
    eyebrow: "全球事業網絡",
    title: "陳振誠集團事業版圖",
    lead: "CSG 為全球10個國家逾1000萬名客戶提供服務",
    sub: "連結跨洲的合作夥伴、經銷商與生產基地，在國際間建立穩定與信任。",
    growthTitle: "集團事業成長概覽",
    growthSub: "穩健、永續的持續成長",
    yearLabel: "{y}年",
    milestones: [
      { desc: "穩定成長的根基，並為永續發展調整結構" },
      { desc: "積極拓展區域市場，發展綠色創新" },
      { desc: "邁向國際的跨越式成長目標，推動循環經濟" },
    ],
    map: {
      label: "陳振誠集團10國事業與網絡地圖",
      choose: "選擇國家",
      zoomIn: "放大",
      zoomOut: "縮小",
      reset: "重設檢視",
      countries: {
        th: { name: "泰國", desc: "集團總部與核心事業基地" },
        cn: { name: "中國", desc: "主要貿易市場與供應鏈合作夥伴" },
        kr: { name: "南韓", desc: "紡織與材料創新客戶基地" },
        jp: { name: "日本", desc: "安全標準與汽車化學品" },
        in: { name: "印度", desc: "工業化學品與聚合物市場" },
        ae: { name: "阿聯酋", desc: "中東與非洲物流配銷中心" },
        de: { name: "德國", desc: "歐洲安全工程與技術基地" },
        gb: { name: "英國", desc: "國際貿易市場與歐洲合作夥伴" },
        us: { name: "美國", desc: "真皮與安全防護用品出口市場" },
        au: { name: "澳洲", desc: "永續與農業產品市場" },
      },
    },
  },
  philosophy: {
    eyebrow: "經營理念",
    title: "我們的理念",
    lead: "我們經營所秉持的信念與理念，代代相傳，是引領企業實現長久穩健的指南針。",
    items: [
      { title: "誠信", desc: "在各個層面堅持透明、道德與信守承諾，與合作夥伴、盟友及社會建立長久信任。" },
      { title: "互利共贏", desc: "在每一段關係中共創價值——與合作夥伴、社會、社區及員工公平、穩健、互助地共同成長。" },
      { title: "持續精進", desc: "透過研發、創新與現代工業技術共同學習與成長，不斷將效率提升至國際標準。" },
      { title: "品質至上", desc: "關注每個細節與生產環節，為全球消費者與產業提供最佳品質與最高安全標準。" },
    ],
  },
  ventures: {
    eyebrow: "旗艦事業",
    title: "驅動未來的事業",
    lead: "透過旗艦事業與陳振誠集團合作夥伴的卓越表現，在各個層面共創價值。",
    details: "查看詳情",
  },
  news: {
    title: "新聞與活動",
    sub: "關注陳振誠集團的最新動態、企業公告與社會公益活動。",
    cta: "查看全部新聞與活動",
    prev: "上一則",
    next: "下一則",
    seeMore: "查看更多",
    like: "讚",
    comment: "留言",
    share: "分享",
    openFb: "在 Facebook 上查看貼文",
  },
};

const ja: DeepPartial<HomeDict> = {
  hero: {
    eyebrow: "事業紹介",
    title: "チャルンシン・グループの5つの中核事業",
    tagline: "価値を創造し、着実に成長する",
    contact: "お問い合わせ",
    menu: "メニュー",
    pillars: {
      "real-estate": { name: "不動産", tagline: "住宅・商業施設の開発" },
      "leather-footwear": { name: "皮革・履物", tagline: "なめし革と国際基準の安全用品" },
      "non-woven": { name: "繊維", tagline: "繊維と不織布" },
      chemical: { name: "化学・工業", tagline: "接着剤・シーリング材・合成ゴム" },
      other: { name: "その他の事業", tagline: "金融・エネルギー・社会貢献事業" },
    },
  },
  manifesto: {
    tag: "企業情報",
    title: "チャルンシン・グループについて",
    vision:
      "チャルンシン・グループは、タイを代表するコングロマリットの一つです。1946年の創業以来80年以上にわたり、安定的かつ持続的に事業を展開してきました。家族経営の商いから始まり、強固な基盤と継続的な発展へのビジョンのもと、現在では5つの産業分野へと事業を広げています。",
    story: "最新の設備とプロフェッショナルなチームにより、お客様とパートナーの効率的な事業運営、ロスの削減、そして持続的な成長を支援します。",
    cta: "詳しく見る",
    statsLabel: "数字で見るチャルンシン",
    strengths: [
      { value: "05", label: "産業分野" },
      { value: "10", label: "展開国" },
      { value: "24", label: "グループ企業・ブランド" },
    ],
    stats: [
      { unit: "年", label: "創業から", note: "80年以上にわたる安定の基盤" },
      { unit: "社", label: "お客様", note: "製品とサービスを信頼いただいているお客様" },
      { unit: "名", label: "従業員", note: "組織を支えるプロフェッショナル" },
      { unit: "%", label: "顧客満足度", note: "最高水準の品質と満足度" },
    ],
  },
  global: {
    eyebrow: "グローバルネットワーク",
    title: "チャルンシン・グループの事業拠点",
    lead: "CSGは世界10か国で1,000万人以上のお客様にサービスを提供しています",
    sub: "大陸を越えてパートナー、販売代理店、生産拠点を結び、国際的な安定と信頼を築いています。",
    growthTitle: "グループ事業の成長",
    growthSub: "着実で持続的な成長",
    yearLabel: "{y}年",
    milestones: [
      { desc: "安定した成長基盤の確立と、持続可能性に向けた構造改革" },
      { desc: "地域市場への積極的な展開とグリーンイノベーションの推進" },
      { desc: "グローバルへの飛躍的成長と循環型経済の推進" },
    ],
    map: {
      label: "チャルンシン・グループの10か国の事業拠点とネットワーク",
      choose: "国を選択",
      zoomIn: "拡大",
      zoomOut: "縮小",
      reset: "表示をリセット",
      countries: {
        th: { name: "タイ", desc: "本社およびグループの中核事業拠点" },
        cn: { name: "中国", desc: "主要な貿易市場とサプライチェーンのパートナー" },
        kr: { name: "韓国", desc: "繊維・素材イノベーションの顧客基盤" },
        jp: { name: "日本", desc: "安全基準と自動車用化学品" },
        in: { name: "インド", desc: "工業用化学品・ポリマー市場" },
        ae: { name: "アラブ首長国連邦", desc: "中東・アフリカ向け物流拠点" },
        de: { name: "ドイツ", desc: "欧州の安全工学・技術拠点" },
        gb: { name: "イギリス", desc: "国際貿易市場と欧州のパートナー" },
        us: { name: "アメリカ", desc: "本革・安全用品の輸出市場" },
        au: { name: "オーストラリア", desc: "持続可能な製品・農業製品の市場" },
      },
    },
  },
  philosophy: {
    eyebrow: "経営理念",
    title: "私たちの理念",
    lead: "事業の根幹となる信念と考え方。世代を超えて受け継がれ、揺るぎない安定へと導く羅針盤です。",
    items: [
      { title: "誠実", desc: "あらゆる場面で透明性、倫理、約束を守ることを大切にし、パートナーや社会との長期的な信頼を築きます。" },
      { title: "共存共栄", desc: "パートナー、社会、地域、従業員とのあらゆる関係において価値を共創し、公正かつ着実に共に成長します。" },
      { title: "継続的な発展", desc: "研究開発、イノベーション、最新の産業技術を通じて共に学び成長し、国際水準の効率を追求し続けます。" },
      { title: "品質へのこだわり", desc: "細部や工程の一つひとつにこだわり、世界中の消費者と産業に最高の品質と安全基準をお届けします。" },
    ],
  },
  ventures: {
    eyebrow: "フラッグシップ事業",
    title: "未来を動かす事業",
    lead: "旗艦事業とチャルンシンのパートナー企業の卓越性を通じて、あらゆる面で価値を共創します。",
    details: "詳細を見る",
  },
  news: {
    title: "ニュース・活動",
    sub: "チャルンシン・グループの最新情報、企業からのお知らせ、社会貢献活動をご覧ください。",
    cta: "すべてのニュース・活動を見る",
    prev: "前へ",
    next: "次へ",
    seeMore: "もっと見る",
    like: "いいね！",
    comment: "コメント",
    share: "シェア",
    openFb: "Facebookで投稿を見る",
  },
};

export const homeDict: { th: HomeDict } & Partial<Record<LanguageCode, DeepPartial<HomeDict>>> = {
  th,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
};
