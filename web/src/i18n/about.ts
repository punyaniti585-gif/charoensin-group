import type { LanguageCode } from "@/data/languages";
import {
  aboutHeroData,
  aboutV2Data,
  coreValuesData,
  historyTimelineData,
  leadershipData,
  visionAndMissionData,
} from "@/data/about-data";

/* ==========================================================================
   About page (V.2) dictionary — th / en / zh-CN / zh-TW / ja
   --------------------------------------------------------------------------
   • `th` is built from src/data/about-data.ts, so the Thai copy keeps a
     single source of truth. Every other language overrides it key by key.
   • Lookup order (see useAboutCopy): chosen language → English → Thai.
   • Arrays merge by index (timeline steps, mission 6, values 4, conduct 5,
     board rows). zh / ja omit people's names, so they fall back to the
     English romanisation — Thai names are never given invented Chinese or
     Japanese renderings.
   • Translations and name romanisations are a first draft for review.
     Both Chinese variants use 陳振誠集團 for "Charoensin Group".
   ========================================================================== */

const { vision, mission } = visionAndMissionData;
const { codeOfConduct } = coreValuesData;
const L = leadershipData;
const chair = visionAndMissionData.chairmanMessage;

/** Timeline steps: real "content" rows from 2488 on that have a numeric year */
const timelineRows = historyTimelineData.rows.filter(
  (r) => r.type === "content" && /^\d+$/.test(r.yearNumber ?? "") && Number(r.yearNumber) >= aboutV2Data.timelineFrom,
);

const th = {
  meta: { pageLabel: "เกี่ยวกับเรา" },
  nav: {
    label: "เลือกหมวด",
    views: {
      history: "ประวัติความเป็นมา",
      vision: "วิสัยทัศน์ พันธกิจ และค่านิยม",
      leadership: "ผู้นำของเรา",
    },
    short: { history: "ประวัติ", vision: "วิสัยทัศน์", leadership: "ผู้นำ" },
  },
  hero: {
    kicker: aboutHeroData.historyKicker,
    title: aboutHeroData.historyTitle,
    brand: "Charoensin",
    since: "ตั้งแต่ พ.ศ. 2475",
    intro: aboutHeroData.historyIntro,
    imageAlt: historyTimelineData.banner.imageAlt,
    scroll: "เลื่อนเพื่อชมเส้นทาง",
  },
  timeline: {
    kicker: "เส้นทางแห่งการเติบโต",
    title: "จากโรงงานฟอกหนัง สู่กลุ่มธุรกิจชั้นนำ",
    eraLabel: "พ.ศ.",
    steps: timelineRows.map((r) => ({ title: r.title ?? "", description: r.description ?? "" })),
  },
  vision: {
    number: vision.number,
    kicker: vision.titleEn,
    title: vision.title,
    lead: vision.lead,
    imageAlt: vision.imageCaption,
    eyebrow: "VISION",
    aiBadge: "ภาพ AI",
    scrollCue: "เลื่อนลงสู่พันธกิจ",
  },
  mission: {
    number: mission.number,
    kicker: mission.titleEn,
    title: mission.title,
    hint: "ชี้หรือแตะแต่ละส่วนของวงกลมเพื่อเปิดดูรายละเอียด",
    showAll: "เปิดดูทั้งหมด",
    items: mission.items.map((m) => m.text),
  },
  values: {
    number: coreValuesData.number,
    kicker: coreValuesData.titleEn,
    title: coreValuesData.title,
    subtitle: coreValuesData.subtitle,
    photoCaption: coreValuesData.oldPhotoCaption,
    items: coreValuesData.values.map((v) => ({ title: v.title, titleEn: v.titleEn, description: v.description })),
  },
  conduct: {
    eyebrow: codeOfConduct.eyebrow,
    title: codeOfConduct.title,
    titleEn: codeOfConduct.titleEn,
    description: codeOfConduct.description,
    linkText: codeOfConduct.linkText,
    principlesTitle: "หลักจรรยาบรรณ 5 ประการ",
    principles: aboutV2Data.conductPrinciples.map((p) => ({ title: p.title, text: p.text })),
  },
  chairman: {
    kicker: "Message from the Honorary Chairman",
    title: chair.title,
    name: chair.name,
    role: chair.role,
    paragraphs: chair.paragraphs,
  },
  board: {
    kicker: L.titleEn,
    title: "คณะกรรมการและคณะที่ปรึกษา",
    subtitle: L.subtitle,
    chairmanLabel: "ประธานกลุ่มเจริญสิน",
    boardLabel: "คณะกรรมการบริษัท",
    advisorsLabel: "คณะที่ปรึกษา",
    advisorsDescription: L.advisorsDescription,
    chairman: { name: L.groupChairman.name, role: L.groupChairman.role, bio: L.groupChairman.bio ?? "" },
    vice: L.viceChairmen.map((p) => ({ name: p.name, role: p.role, bio: p.bio ?? "" })),
    directors: L.executiveDirectors.map((p) => ({ name: p.name, role: p.role })),
    advisors: L.advisors.map((p) => ({ name: p.name, role: p.role, desc: p.desc ?? "" })),
  },
};

export type AboutDict = typeof th;

/** Deep-partial override shape for the other languages */
type Over<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Over<U>[]
    : T extends object
      ? { [K in keyof T]?: Over<T[K]> }
      : T;

/* ---------------- English (also the fallback for every other language) ---------------- */
const en: Over<AboutDict> = {
  meta: { pageLabel: "About Us" },
  nav: {
    label: "Choose a section",
    views: { history: "Our History", vision: "Vision, Mission and Values", leadership: "Our Leadership" },
    short: { history: "History", vision: "Vision", leadership: "Leadership" },
  },
  hero: {
    kicker: "Our History",
    since: "Since 1932",
    intro:
      "Charoensin Group began doing business in Thailand in 1932, founded by a Chinese-Thai family with deep expertise in trade. The first generation held to virtue, honesty, perseverance and determination as the foundation on which the business has been built and developed ever since.",
    imageAlt: "Archival black-and-white photo of the original Charoensin factory buildings",
    scroll: "Scroll through our journey",
  },
  timeline: {
    kicker: "A path of growth",
    title: "From a tannery to a leading business group",
    eraLabel: "Year",
    steps: [
      {
        title: "The first tannery",
        description:
          "In 1945 Charoensin founded its first tannery as a family business — a milestone that laid foundations for Thai manufacturing. Under the second generation the business grew steadily and moved into finished footwear with two well-known brands: Manwood, known for durable formal leather shoes, and Pangolin, renowned for high-quality safety footwear. The group went on to expand into related industries such as synthetic fibres, chemicals, rubber and consumer goods, and successfully entered overseas markets.",
      },
      {
        title: "Pangolin Safety",
        description:
          "Pangolin Safety Co., Ltd. was founded to manufacture and distribute a full range of personal protective equipment to international standards.",
      },
      {
        title: "Safety footwear factory",
        description:
          "Production lines and a dedicated safety footwear factory were added to fully meet international industrial safety standards.",
      },
      {
        title: "Apply DB (ADB)",
        description:
          "Apply DB Public Company Limited (ADB) was formed through the merger of D.B. Chemical Industrial Co., Ltd. (Thailand) and Apply Chemical Industry Co., Ltd. (Taiwan), producing adhesives and plastic compounds. It listed on the stock exchange in 2017.",
      },
      {
        title: "Charoensin Asset",
        description:
          "The group entered property development as Charoensin Asset Co., Ltd., building Thailand's first five-storey vertical rental housing. The first project, Sam Huang Condo, offered 1,700 rooms for workers at the Bangpoo Industrial Estate. Today Charoensin Asset runs 25 projects with more than 40,000 rooms across ten provinces: Samut Prakan, Chonburi, Chachoengsao, Prachinburi, Samut Sakhon, Lamphun, Phetchaburi, Rayong, Nakhon Ratchasima and Phuket.",
      },
      {
        title: "CPL Group (Public)",
        description:
          "In 1994 the Charoensin tannery listed on the Stock Exchange of Thailand as CPL Group Public Company Limited — a turning point that reflected its readiness to take the business to an international level.",
      },
      {
        title: "International standards",
        description:
          "Group companies hold internationally recognised standards, including ISO 9001:2015 (quality management), ISO 14001:2004 (environmental management) and ISO/TS 16949 (automotive quality management).",
      },
    ],
  },
  vision: {
    kicker: "Corporate Vision",
    title: "Vision",
    lead: "To be a leading organisation that grows steadily, driven by innovation and modern management, and always ready for a rapidly changing world.",
    imageAlt: "Charoensin Group vision",
    aiBadge: "AI image",
    scrollCue: "Scroll to our mission",
  },
  mission: {
    kicker: "Corporate Mission",
    title: "Mission",
    hint: "Point to or tap each part of the wheel to reveal its details",
    showAll: "Show all",
    items: [
      "Drive innovation and modern technology to strengthen our competitiveness.",
      "Build efficient, transparent and flexible management that supports steady growth.",
      "Stay ready to adapt to a rapidly changing world.",
      "Raise the quality of our products, services and processes to international standards.",
      "Invest with vision in diverse businesses for long-term strength.",
      "Develop our people and culture to grow with change.",
    ],
  },
  values: {
    kicker: "Our Core Values",
    title: "The Charoensin Way of Working",
    subtitle:
      "Four values passed down through generations — the principles that guide our business and have kept us growing steadily for more than 90 years.",
    photoCaption: "Archival photo of the group's early staff and pioneers",
    items: [
      { title: "Integrity", description: "Honesty towards ourselves, our customers, partners and society — the heart of lasting trust." },
      { title: "Humility", description: "Treating everyone with respect, listening, and always being ready to learn and improve." },
      { title: "Perseverance", description: "Never giving up in the face of obstacles and crises, meeting every challenge with effort and wisdom." },
      { title: "Unity", description: "Working together as one towards shared goals, creating the strength behind lasting success." },
    ],
  },
  conduct: {
    eyebrow: "Governance and transparency",
    title: "Code of Business Conduct",
    description:
      "Charoensin Group is committed to doing business responsibly, transparently and fairly in line with international governance principles, treating every stakeholder equally.",
    linkText: "Download the full code of conduct",
    principlesTitle: "Five principles of conduct",
    principles: [
      { title: "Honest and transparent", text: "We do business with integrity and disclose accurate, complete and verifiable information." },
      { title: "Against corruption", text: "We never solicit, accept or offer bribes in any form, and we strictly follow the law." },
      { title: "Fair to partners and customers", text: "We compete freely and fairly, honour our contracts and protect trade secrets." },
      { title: "Respect for people", text: "We treat everyone equally, keep our workplaces safe and help our staff grow." },
      { title: "Responsible to society and the environment", text: "We reduce our environmental impact and create lasting value for communities." },
    ],
  },
  chairman: {
    title: "Message from the Honorary Chairman",
    name: "Dr. Thanong Bidaya",
    role: "Honorary Chairman",
    paragraphs: [
      "Charoensin Group grew from foundations of honesty, diligence and a commitment to creating value for Thai society. Over more than nine decades we have shown that we can adapt and stand firm through economic and social change.",
      "In today's more challenging and complex business world, we hold to the working philosophy handed down to us while embracing innovation, technology and modern management — moving every part of our business forward sustainably, from property, leather and footwear to textiles, chemicals and new investments.",
      "I am confident that through the cooperation of our board, executives and every employee, and the valued support of our partners and customers, Charoensin Group will continue to grow strongly and create shared value for Thai society.",
    ],
  },
  board: {
    kicker: "Leadership Team",
    title: "Board of Directors and Advisors",
    subtitle:
      "The directors and executives of Charoensin Group — people of expertise and experience who together drive the organisation into the future.",
    chairmanLabel: "Chairman of Charoensin Group",
    boardLabel: "Board of Directors",
    advisorsLabel: "Advisory Board",
    advisorsDescription:
      "Distinguished national experts in the environment, security, strategy, law and internal audit, advising us on transparent and effective management.",
    chairman: {
      name: "Dr. Thanong Bidaya",
      role: "Chairman, Charoensin Group",
      bio: "Former Minister of Finance and former Minister of Commerce, a national authority on economics and finance.",
    },
    vice: [
      { name: "Mr. Puchong Wongcharoensin", role: "Vice Chairman", bio: "A senior executive who helped pioneer and lay the foundations for the group's growth across many businesses." },
      { name: "Mr. Somkiat Wongcharoensin", role: "Vice Chairman", bio: "A senior executive with expertise in property development and investment strategy." },
      { name: "Mr. Suwatchai Wongcharoensin", role: "Vice Chairman", bio: "A senior executive with expertise in manufacturing, exports and international standards." },
    ],
    directors: [
      { name: "Mr. Sitthichai Wongcharoensin", role: "Director" },
      { name: "Mr. Chonlathit Wongcharoensin", role: "Director" },
      { name: "Mr. Weerachai Wongcharoensin", role: "Director" },
      { name: "Mr. Piya Wongcharoensin", role: "Director" },
      { name: "Mr. Boonkiat Wongcharoensin", role: "Director" },
      { name: "Mr. Worawat Wongcharoensin", role: "Director" },
      { name: "Mr. Pornwich Wongcharoensin", role: "Director" },
    ],
    advisors: [
      { name: "Dr. Kasemsun Chinnavaso", role: "Advisor", desc: "A national expert in the environment and natural resource management." },
      { name: "Pol. Gen. Damrongsak Kittiprapas", role: "Advisor", desc: "Former Commissioner-General of the Royal Thai Police, expert in security, public administration and governance." },
      { name: "Gen. Asst. Prof. Dr. Ruj Kasiwut", role: "Advisor", desc: "An expert in strategy, planning and organisational innovation." },
      { name: "Sirat Tamsakul", role: "Advisor", desc: "An expert in business law, international trade and corporate governance." },
      { name: "Wijarn Phadungwithi", role: "Advisor", desc: "An expert in finance, accounting and internal audit." },
      { name: "Chalalai Suksathit", role: "Advisor", desc: "An expert in people development, corporate culture and human resource management." },
    ],
  },
};

/* ---------------- Simplified Chinese ---------------- */
const zhCN: Over<AboutDict> = {
  meta: { pageLabel: "关于我们" },
  nav: {
    label: "选择栏目",
    views: { history: "发展历程", vision: "愿景、使命与价值观", leadership: "领导团队" },
    short: { history: "历程", vision: "愿景", leadership: "领导" },
  },
  hero: {
    kicker: "发展历程",
    brand: "陳振誠集團",
    since: "始于 1932 年",
    intro:
      "陳振誠集團自 1932 年起在泰国开展业务，源于一个精于经商的华裔家族。第一代家族领导人秉持德行、诚信、勤奋与坚定的信念，以此为根基，持续创建并发展事业。",
    imageAlt: "陳振誠集團早期工厂建筑的黑白历史照片",
    scroll: "向下滚动，回顾我们的历程",
  },
  timeline: {
    kicker: "成长之路",
    title: "从制革厂到领先的企业集团",
    eraLabel: "年份",
    steps: [
      {
        title: "创立制革厂",
        description:
          "1945 年，集团以家族企业形式创办了第一家制革厂，为泰国制造业的发展奠定了重要基础。在第二代的努力下，事业稳步成长，并进入成品鞋领域，拥有两大知名品牌：以耐穿正装皮鞋见长的 Manwood，以及以高品质安全鞋闻名的 Pangolin。此后，集团进一步拓展至合成纤维、化工、橡胶及消费品等相关产业，并成功进入海外市场。",
      },
      { title: "Pangolin 安全用品", description: "成立 Pangolin Safety 有限公司，生产并销售符合国际标准的全系列个人防护装备。" },
      { title: "创建安全鞋工厂", description: "扩充生产线并建立安全鞋工厂，全面满足国际工业安全标准。" },
      {
        title: "Apply DB（ADB）",
        description:
          "Apply DB 大众有限公司（ADB）由泰国 D.B. Chemical Industrial 有限公司与台湾 Apply Chemical Industry 有限公司合并成立，生产胶黏剂与塑料改性粒料，并于 2017 年在证券交易所上市。",
      },
      {
        title: "陳振誠资产",
        description:
          "集团以陳振誠资产有限公司进军房地产开发，建成泰国首座五层楼高的垂直式出租公寓。首个项目 Sam Huang Condo 拥有 1,700 间客房，服务邦浦工业区的员工。如今公司已拥有 25 个项目、逾 40,000 间客房，覆盖北榄、春武里、北柳、巴真、龙仔厝、南奔、碧武里、罗勇、呵叻及普吉十个府。",
      },
      {
        title: "CPL 集团（大众公司）",
        description: "1994 年，集团制革厂以 CPL Group 大众有限公司之名在泰国证券交易所上市，标志着企业迈向国际化的重要转折。",
      },
      {
        title: "国际标准",
        description:
          "集团旗下企业重视国际标准，包括 ISO 9001:2015 质量管理体系、ISO 14001:2004 环境管理体系，以及 ISO/TS 16949 汽车行业质量管理体系。",
      },
    ],
  },
  vision: {
    kicker: "企业愿景",
    title: "愿景",
    lead: "致力于成为稳健成长的领先企业，以创新与现代化管理为驱动，随时应对瞬息万变的世界。",
    imageAlt: "陳振誠集團愿景",
    aiBadge: "AI 生成图像",
    scrollCue: "向下滚动查看使命",
  },
  mission: {
    kicker: "企业使命",
    title: "使命",
    hint: "指向或轻触圆环的各部分以展开详情",
    showAll: "全部展开",
    items: [
      "推动创新与现代科技，提升竞争力。",
      "建立高效、透明、灵活的管理体系，支撑稳健成长。",
      "时刻准备适应快速变化的世界。",
      "将产品、服务与工作流程提升至国际标准。",
      "以远见投资多元业务，打造长期竞争力。",
      "培养人才与企业文化，与变化共同成长。",
    ],
  },
  values: {
    kicker: "核心价值观",
    title: "陳振誠集團的工作理念",
    subtitle: "代代相传的四项价值，是我们的精神支柱与经营准则，支撑集团稳健发展逾 90 年。",
    photoCaption: "集团早期员工与创业先驱的历史照片",
    items: [
      { title: "诚信", description: "对自己、客户、合作伙伴与社会坚守诚信，这是长久信任的核心。" },
      { title: "谦逊", description: "尊重每一个人，善于倾听，始终乐于学习、不断进步。" },
      { title: "坚韧", description: "面对困难与危机绝不退缩，以努力与智慧迎接挑战。" },
      { title: "团结", description: "同心协力，朝共同目标前进，凝聚成功的力量。" },
    ],
  },
  conduct: {
    eyebrow: "公司治理与透明",
    title: "商业道德与合作伙伴准则",
    titleEn: "Code of Conduct & Corporate Governance",
    description: "陳振誠集團致力于按照国际公司治理原则，以负责、透明、公平的方式经营，平等对待所有利益相关方。",
    linkText: "下载完整商业道德准则",
    principlesTitle: "五项道德原则",
    principles: [
      { title: "诚信透明", text: "诚实经营，披露准确、完整、可核查的信息。" },
      { title: "反腐倡廉", text: "不索取、不收受、不提供任何形式的贿赂，严格遵守法律。" },
      { title: "公平对待伙伴与客户", text: "自由公平竞争，信守合约，保护商业机密。" },
      { title: "尊重人权，关爱员工", text: "平等对待每一个人，保障安全，促进员工成长。" },
      { title: "对社会与环境负责", text: "减少环境影响，与社区共创可持续价值。" },
    ],
  },
  chairman: {
    kicker: "Message from the Honorary Chairman",
    title: "名誉主席致辞",
    role: "名誉主席",
    paragraphs: [
      "陳振誠集團植根于诚信、勤勉与为泰国社会创造价值的信念。九十多年来，我们证明了自身在经济与社会变迁中灵活应变、屹立不倒的能力。",
      "在商业环境日益复杂、充满挑战的今天，我们依然坚守代代相传的工作理念，同时拥抱创新、科技与现代管理，推动房地产、皮革与鞋业、纺织、化工及各项新投资等所有业务持续稳健发展。",
      "我坚信，凭借董事会、管理层与全体员工的同心协力，以及合作伙伴与客户的宝贵支持，陳振誠集團必将持续壮大，为泰国社会创造共同价值。",
    ],
  },
  board: {
    kicker: "Leadership Team",
    title: "董事会与顾问团",
    subtitle: "陳振誠集團的董事与高管，凭借专业与经验，携手推动企业迈向未来。",
    chairmanLabel: "陳振誠集團主席",
    boardLabel: "董事会",
    advisorsLabel: "顾问团",
    advisorsDescription: "顾问团由环境、安全、战略、法律及内部审计等领域的国家级专家组成，为透明高效的管理提供建议。",
    chairman: { role: "陳振誠集團董事会主席", bio: "前财政部部长、前商业部部长，国家级经济与金融专家。" },
    vice: [
      { role: "副董事长", bio: "高级管理者，参与开创并奠定集团多元业务的发展基础。" },
      { role: "副董事长", bio: "高级管理者，擅长房地产开发与投资战略。" },
      { role: "副董事长", bio: "高级管理者，擅长制造业、出口与国际标准。" },
    ],
    directors: [{ role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }],
    advisors: [
      { role: "顾问", desc: "国家级环境与自然资源管理专家。" },
      { role: "顾问", desc: "前泰国国家警察总监，安全、公共行政与治理专家。" },
      { role: "顾问", desc: "战略、规划与组织创新专家。" },
      { role: "顾问", desc: "商业法、国际贸易与公司治理专家。" },
      { role: "顾问", desc: "财务、会计与内部审计专家。" },
      { role: "顾问", desc: "人才发展、企业文化与人力资源管理专家。" },
    ],
  },
};

/* ---------------- Traditional Chinese ---------------- */
const zhTW: Over<AboutDict> = {
  meta: { pageLabel: "關於我們" },
  nav: {
    label: "選擇欄目",
    views: { history: "發展歷程", vision: "願景、使命與價值觀", leadership: "領導團隊" },
    short: { history: "歷程", vision: "願景", leadership: "領導" },
  },
  hero: {
    kicker: "發展歷程",
    brand: "陳振誠集團",
    since: "始於 1932 年",
    intro:
      "陳振誠集團自 1932 年起在泰國經營事業，源於一個精於經商的華裔家族。第一代家族領導人秉持德行、誠信、勤奮與堅定的信念，以此為根基，持續創建並發展事業。",
    imageAlt: "陳振誠集團早期工廠建築的黑白歷史照片",
    scroll: "向下捲動，回顧我們的歷程",
  },
  timeline: {
    kicker: "成長之路",
    title: "從製革廠到領先的企業集團",
    eraLabel: "年份",
    steps: [
      {
        title: "創立製革廠",
        description:
          "1945 年，集團以家族企業形式創辦第一家製革廠，為泰國製造業的發展奠定重要基礎。在第二代的努力下，事業穩步成長，並進入成品鞋領域，擁有兩大知名品牌：以耐穿正裝皮鞋見長的 Manwood，以及以高品質安全鞋聞名的 Pangolin。此後，集團進一步拓展至合成纖維、化工、橡膠及消費品等相關產業，並成功進入海外市場。",
      },
      { title: "Pangolin 安全用品", description: "成立 Pangolin Safety 有限公司，生產並銷售符合國際標準的全系列個人防護裝備。" },
      { title: "創建安全鞋工廠", description: "擴充生產線並建立安全鞋工廠，全面符合國際工業安全標準。" },
      {
        title: "Apply DB（ADB）",
        description:
          "Apply DB 大眾有限公司（ADB）由泰國 D.B. Chemical Industrial 有限公司與台灣 Apply Chemical Industry 有限公司合併成立，生產膠黏劑與塑膠改質粒料，並於 2017 年在證券交易所上市。",
      },
      {
        title: "陳振誠資產",
        description:
          "集團以陳振誠資產有限公司進軍不動產開發，建成泰國首座五層樓高的垂直式出租公寓。首個專案 Sam Huang Condo 擁有 1,700 間客房，服務邦浦工業區的員工。如今公司已擁有 25 個專案、逾 40,000 間客房，涵蓋北欖、春武里、北柳、巴真、龍仔厝、南奔、碧武里、羅勇、呵叻及普吉十個府。",
      },
      {
        title: "CPL 集團（大眾公司）",
        description: "1994 年，集團製革廠以 CPL Group 大眾有限公司之名在泰國證券交易所上市，標誌著企業邁向國際化的重要轉折。",
      },
      {
        title: "國際標準",
        description:
          "集團旗下企業重視國際標準，包括 ISO 9001:2015 品質管理系統、ISO 14001:2004 環境管理系統，以及 ISO/TS 16949 汽車產業品質管理系統。",
      },
    ],
  },
  vision: {
    kicker: "企業願景",
    title: "願景",
    lead: "致力成為穩健成長的領先企業，以創新與現代化管理為驅動，隨時因應瞬息萬變的世界。",
    imageAlt: "陳振誠集團願景",
    aiBadge: "AI 生成圖像",
    scrollCue: "向下捲動查看使命",
  },
  mission: {
    kicker: "企業使命",
    title: "使命",
    hint: "指向或輕觸圓環的各部分以展開詳情",
    showAll: "全部展開",
    items: [
      "推動創新與現代科技，提升競爭力。",
      "建立高效、透明、靈活的管理體系，支撐穩健成長。",
      "時刻準備適應快速變化的世界。",
      "將產品、服務與工作流程提升至國際標準。",
      "以遠見投資多元事業，打造長期競爭力。",
      "培養人才與企業文化，與變化共同成長。",
    ],
  },
  values: {
    kicker: "核心價值觀",
    title: "陳振誠集團的工作理念",
    subtitle: "代代相傳的四項價值，是我們的精神支柱與經營準則，支撐集團穩健發展逾 90 年。",
    photoCaption: "集團早期員工與創業先驅的歷史照片",
    items: [
      { title: "誠信", description: "對自己、客戶、合作夥伴與社會堅守誠信，這是長久信任的核心。" },
      { title: "謙遜", description: "尊重每一個人，善於傾聽，始終樂於學習、不斷進步。" },
      { title: "堅韌", description: "面對困難與危機絕不退縮，以努力與智慧迎接挑戰。" },
      { title: "團結", description: "同心協力，朝共同目標前進，凝聚成功的力量。" },
    ],
  },
  conduct: {
    eyebrow: "公司治理與透明",
    title: "商業道德與合作夥伴準則",
    titleEn: "Code of Conduct & Corporate Governance",
    description: "陳振誠集團致力依循國際公司治理原則，以負責、透明、公平的方式經營，平等對待所有利害關係人。",
    linkText: "下載完整商業道德準則",
    principlesTitle: "五項道德原則",
    principles: [
      { title: "誠信透明", text: "誠實經營，揭露正確、完整、可查核的資訊。" },
      { title: "反貪腐", text: "不索取、不收受、不提供任何形式的賄賂，嚴格遵守法律。" },
      { title: "公平對待夥伴與客戶", text: "自由公平競爭，信守合約，保護營業秘密。" },
      { title: "尊重人權，關懷員工", text: "平等對待每一個人，保障安全，促進員工成長。" },
      { title: "對社會與環境負責", text: "減少環境衝擊，與社區共創永續價值。" },
    ],
  },
  chairman: {
    kicker: "Message from the Honorary Chairman",
    title: "名譽主席致辭",
    role: "名譽主席",
    paragraphs: [
      "陳振誠集團植根於誠信、勤勉與為泰國社會創造價值的信念。九十多年來，我們證明了自身在經濟與社會變遷中靈活應變、屹立不搖的能力。",
      "在商業環境日益複雜、充滿挑戰的今天，我們依然堅守代代相傳的工作理念，同時擁抱創新、科技與現代管理，推動不動產、皮革與鞋業、紡織、化工及各項新投資等所有事業持續穩健發展。",
      "我堅信，憑藉董事會、管理層與全體員工的同心協力，以及合作夥伴與客戶的寶貴支持，陳振誠集團必將持續壯大，為泰國社會創造共同價值。",
    ],
  },
  board: {
    kicker: "Leadership Team",
    title: "董事會與顧問團",
    subtitle: "陳振誠集團的董事與高階主管，憑藉專業與經驗，攜手推動企業邁向未來。",
    chairmanLabel: "陳振誠集團主席",
    boardLabel: "董事會",
    advisorsLabel: "顧問團",
    advisorsDescription: "顧問團由環境、安全、策略、法律及內部稽核等領域的國家級專家組成，為透明高效的管理提供建議。",
    chairman: { role: "陳振誠集團董事會主席", bio: "前財政部部長、前商業部部長，國家級經濟與金融專家。" },
    vice: [
      { role: "副董事長", bio: "高階主管，參與開創並奠定集團多元事業的發展基礎。" },
      { role: "副董事長", bio: "高階主管，擅長不動產開發與投資策略。" },
      { role: "副董事長", bio: "高階主管，擅長製造業、出口與國際標準。" },
    ],
    directors: [{ role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }, { role: "董事" }],
    advisors: [
      { role: "顧問", desc: "國家級環境與自然資源管理專家。" },
      { role: "顧問", desc: "前泰國國家警察總監，安全、公共行政與治理專家。" },
      { role: "顧問", desc: "策略、規劃與組織創新專家。" },
      { role: "顧問", desc: "商業法、國際貿易與公司治理專家。" },
      { role: "顧問", desc: "財務、會計與內部稽核專家。" },
      { role: "顧問", desc: "人才發展、企業文化與人力資源管理專家。" },
    ],
  },
};

/* ---------------- Japanese ---------------- */
const ja: Over<AboutDict> = {
  meta: { pageLabel: "私たちについて" },
  nav: {
    label: "セクションを選択",
    views: { history: "沿革", vision: "ビジョン・ミッション・価値観", leadership: "経営陣" },
    short: { history: "沿革", vision: "ビジョン", leadership: "経営陣" },
  },
  hero: {
    kicker: "沿革",
    since: "1932年創業",
    intro:
      "チャルンシン・グループは1932年、商いに長けた中国系の一族によってタイで事業を始めました。創業世代は徳、誠実さ、勤勉、そして揺るぎない決意を礎とし、事業を築き、発展させてきました。",
    imageAlt: "チャルンシン創業当時の工場建物のモノクロ写真",
    scroll: "スクロールして歩みをたどる",
  },
  timeline: {
    kicker: "成長の歩み",
    title: "なめし革工場から、タイを代表する企業グループへ",
    eraLabel: "年",
    steps: [
      {
        title: "なめし革工場を創業",
        description:
          "1945年、家族経営として最初のなめし革工場を創業し、タイの製造業発展の礎を築きました。第二世代のもとで事業は着実に成長し、完成品の靴へと進出。耐久性の高いフォーマル革靴のManwoodと、高品質な安全靴で知られるPangolinの二大ブランドを擁します。その後、合成繊維、化学品、ゴム、消費財などの関連産業へ事業を広げ、海外市場でも成功を収めました。",
      },
      { title: "パンゴリン・セーフティ", description: "Pangolin Safety Co., Ltd.を設立し、国際規格に適合した個人用保護具を総合的に製造・販売。" },
      { title: "安全靴工場を設立", description: "生産ラインを拡充し、国際的な産業安全基準に完全対応する安全靴工場を設立。" },
      {
        title: "アプライDB（ADB）",
        description:
          "タイのD.B. Chemical Industrial Co., Ltd.と台湾のApply Chemical Industry Co., Ltd.の合併によりApply DB Public Company Limited（ADB）を設立。接着剤とプラスチックコンパウンドを製造し、2017年に証券取引所へ上場。",
      },
      {
        title: "チャルンシン・アセット",
        description:
          "チャルンシン・アセット社として不動産開発に進出し、タイ初となる5階建ての縦型賃貸住宅を建設。第1号プロジェクトのSam Huang Condoはバンプー工業団地の従業員向けに1,700室を提供しました。現在は25プロジェクト、4万室以上を、サムットプラーカーン、チョンブリー、チャチューンサオ、プラーチーンブリー、サムットサーコーン、ランプーン、ペッチャブリー、ラヨーン、ナコーンラーチャシーマー、プーケットの10県で展開しています。",
      },
      {
        title: "CPLグループ（上場）",
        description: "1994年、チャルンシンのなめし革工場がCPL Group Public Company Limitedとしてタイ証券取引所に上場。国際水準への飛躍を示す大きな転機となりました。",
      },
      {
        title: "国際規格",
        description:
          "グループ各社は、ISO 9001:2015（品質マネジメント）、ISO 14001:2004（環境マネジメント）、ISO/TS 16949（自動車産業品質マネジメント）などの国際規格を重視しています。",
      },
    ],
  },
  vision: {
    kicker: "企業ビジョン",
    title: "ビジョン",
    lead: "イノベーションと先進的な経営を原動力に、着実に成長するリーディングカンパニーを目指し、急速に変化する世界に常に備えます。",
    imageAlt: "チャルンシン・グループのビジョン",
    aiBadge: "AI生成画像",
    scrollCue: "ミッションへスクロール",
  },
  mission: {
    kicker: "企業ミッション",
    title: "ミッション",
    hint: "円の各部分にカーソルを合わせるかタップして詳細を開く",
    showAll: "すべて表示",
    items: [
      "イノベーションと最新技術を推進し、競争力を高める。",
      "効率的で透明性が高く柔軟な経営体制を築き、着実な成長を支える。",
      "急速に変化する世界に適応できる体制を整える。",
      "製品・サービス・業務プロセスの品質を国際水準へ高める。",
      "先見性をもって多様な事業に投資し、長期的な強さを築く。",
      "人材と企業文化を育み、変化とともに成長する。",
    ],
  },
  values: {
    kicker: "コアバリュー",
    title: "チャルンシンの仕事の哲学",
    subtitle: "世代を超えて受け継がれてきた4つの価値観。90年以上にわたる着実な成長を支えてきた、心の拠り所であり経営の指針です。",
    photoCaption: "グループ創成期の社員と先駆者たちの歴史写真",
    items: [
      { title: "誠実", description: "自分自身、お客様、取引先、社会に対して誠実であること。それが揺るぎない信頼の核心です。" },
      { title: "謙虚", description: "すべての人を尊重し、耳を傾け、常に学び続ける姿勢を大切にします。" },
      { title: "忍耐", description: "困難や危機に屈せず、努力と知恵で挑戦に立ち向かいます。" },
      { title: "団結", description: "心をひとつにして共通の目標へ進み、成功を生む力を築きます。" },
    ],
  },
  conduct: {
    eyebrow: "ガバナンスと透明性",
    title: "企業行動規範",
    description:
      "チャルンシン・グループは、国際的なガバナンス原則に基づき、責任ある透明で公正な事業運営を行い、すべてのステークホルダーを平等に尊重します。",
    linkText: "企業行動規範（全文）をダウンロード",
    principlesTitle: "5つの行動原則",
    principles: [
      { title: "誠実と透明性", text: "誠実に事業を行い、正確で完全かつ検証可能な情報を開示します。" },
      { title: "腐敗防止", text: "いかなる形の賄賂も要求・受領・供与せず、法令を厳格に遵守します。" },
      { title: "取引先とお客様への公正", text: "自由で公正な競争を行い、契約を守り、営業秘密を保護します。" },
      { title: "人権の尊重と従業員への配慮", text: "すべての人を平等に扱い、安全を守り、従業員の成長を支えます。" },
      { title: "社会と環境への責任", text: "環境への影響を減らし、地域社会とともに持続的な価値を創ります。" },
    ],
  },
  chairman: {
    title: "名誉会長メッセージ",
    role: "名誉会長",
    paragraphs: [
      "チャルンシン・グループは、誠実さと勤勉さ、そしてタイ社会に価値を生み出すという志を礎に成長してきました。90年以上にわたり、経済と社会の変化の中でも柔軟に適応し、揺るがずに歩んできました。",
      "ビジネス環境がますます複雑で厳しさを増す今日も、受け継いできた仕事の哲学を守りながら、イノベーション、テクノロジー、新しい経営手法を積極的に取り入れ、不動産、皮革・靴、繊維、化学品、新規投資のすべての事業を持続的に前進させています。",
      "取締役会、経営陣、全従業員の協力、そしてパートナーとお客様の温かいご支援により、チャルンシン・グループはこれからも力強く成長し、タイ社会とともに価値を創り続けると確信しています。",
    ],
  },
  board: {
    kicker: "Leadership Team",
    title: "取締役会・顧問団",
    subtitle: "豊かな知見と経験をもつチャルンシン・グループの取締役と経営陣が、ともに組織を未来へ導きます。",
    chairmanLabel: "チャルンシン・グループ会長",
    boardLabel: "取締役会",
    advisorsLabel: "顧問団",
    advisorsDescription: "環境、安全保障、戦略、法律、内部監査など各分野の国内有数の有識者が、透明で効果的な経営に向けて助言します。",
    chairman: { role: "チャルンシン・グループ取締役会長", bio: "元財務大臣、元商務大臣。経済・金融分野における国内有数の有識者。" },
    vice: [
      { role: "副会長", bio: "グループの多様な事業の成長を切り開き、その礎を築いた経営幹部。" },
      { role: "副会長", bio: "不動産開発と投資戦略に精通した経営幹部。" },
      { role: "副会長", bio: "製造業、輸出、国際規格に精通した経営幹部。" },
    ],
    directors: [{ role: "取締役" }, { role: "取締役" }, { role: "取締役" }, { role: "取締役" }, { role: "取締役" }, { role: "取締役" }, { role: "取締役" }],
    advisors: [
      { role: "顧問", desc: "環境および天然資源管理の国内有数の専門家。" },
      { role: "顧問", desc: "元タイ国家警察長官。安全保障、行政、ガバナンスの専門家。" },
      { role: "顧問", desc: "戦略、計画立案、組織イノベーションの専門家。" },
      { role: "顧問", desc: "企業法務、国際貿易、コーポレートガバナンスの専門家。" },
      { role: "顧問", desc: "財務、会計、内部監査の専門家。" },
      { role: "顧問", desc: "人材開発、企業文化、人事管理の専門家。" },
    ],
  },
};

export const aboutDict: { th: AboutDict } & Record<Exclude<LanguageCode, "th">, Over<AboutDict>> = {
  th,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
};
