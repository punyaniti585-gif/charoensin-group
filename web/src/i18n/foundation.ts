import type { LanguageCode } from "@/data/languages";
import {
  foundationAbout,
  foundationContact,
  foundationGallery,
  foundationHero,
  foundationImpact,
} from "@/data/foundation-data";

/* ==========================================================================
   Foundation page dictionary — th / en / zh-CN / zh-TW / ja
   --------------------------------------------------------------------------
   • `th` is built from src/data/foundation-data.ts (single source of truth);
     every other language overrides it key by key.
   • Lookup (useFoundationCopy): chosen language → English → Thai.
   • Arrays match the data by index (badges 2, objectives 4, partners 6,
     stats 4, pillars 4 + their projects, gallery items 4).
   • Names follow src/i18n/phrases.ts: the foundation is
     陳振誠集團公益基金会 / 基金會 / ウォンチャルンシン財団, and the group is
     always 陳振誠集團 in Chinese. First-draft translations — review with
     native speakers.
   ========================================================================== */

const th = {
  hero: {
    eyebrow: foundationHero.eyebrow,
    name: foundationHero.name,
    under: foundationHero.under,
    title: foundationHero.title,
    accent: foundationHero.accent,
    quote: foundationHero.quote,
    cta: foundationHero.cta,
    badges: foundationHero.badges.map((b) => ({ label: b.label })),
    scroll: foundationHero.scroll,
  },
  about: {
    eyebrow: foundationAbout.eyebrow,
    title: foundationAbout.title,
    story: foundationAbout.story,
    foundedLabel: foundationAbout.founded.label,
    foundedValue: foundationAbout.founded.value,
    objectivesLabel: foundationAbout.objectivesLabel,
    objectives: foundationAbout.objectives.map((o) => o.title),
    partnersLabel: foundationAbout.partnersLabel,
    partners: foundationAbout.partners,
  },
  impact: {
    eyebrow: foundationImpact.eyebrow,
    title: foundationImpact.title,
    lead: foundationImpact.lead,
    stats: foundationImpact.stats.map((s) => s.label),
    baht: foundationImpact.baht,
    hint: foundationImpact.hint,
    pillars: foundationImpact.pillars.map((p) => ({
      name: p.name,
      desc: p.desc,
      projects: p.projects.map((x) => x.title),
    })),
  },
  gallery: {
    eyebrow: foundationGallery.eyebrow,
    title: foundationGallery.title,
    hint: foundationGallery.hint,
    close: foundationGallery.close,
    prev: foundationGallery.prev,
    next: foundationGallery.next,
    items: foundationGallery.items.map((i) => ({ caption: i.caption, place: i.place })),
  },
  contact: { ...foundationContact },
};

export type FoundationDict = typeof th;
type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const en: DeepPartial<FoundationDict> = {
  hero: {
    eyebrow: "Wongcharoensin Foundation · Est. 2008",
    name: "Wongcharoensin Foundation",
    under: "Under Charoensin Group",
    title: ["Giving back", "to society"],
    accent: "where it matters most",
    quote: "Every gift begins in the heart and grows into hope.",
    cta: "Explore our work",
    badges: [{ label: "years of giving" }, { label: "baht donated" }],
    scroll: "Scroll",
  },
  about: {
    eyebrow: "About the foundation",
    title: "A mission rooted in education, faith and care",
    story:
      "Wongcharoensin Foundation was formally established in 2008 under the stewardship of the Charoensin Group chairman, to pass kindness on to Thai society in a lasting way.",
    foundedLabel: "Year founded",
    foundedValue: "2008",
    objectivesLabel: "Objectives",
    objectives: [
      "Founded by Charoensin Group",
      "Rooted in a stable organisation",
      "Supporting people with disabilities and sport",
      "Vocational training for people with disabilities",
    ],
    partnersLabel: "Organisations we support",
    partners: [
      "Siriraj Foundation",
      "Duang Prateep Foundation",
      "Poh Teck Tung Foundation",
      "Wat Chak Daeng",
      "Wat Phongphloi Wiriyaram",
      "Thammik Witthaya School",
    ],
  },
  impact: {
    eyebrow: "Four pillars",
    title: "Where we give",
    lead: "Every donation is recorded and verifiable, under the care of Charoensin Group.",
    stats: ["Total donated (baht)", "Students supported", "Medical devices delivered", "Years of giving"],
    baht: "baht",
    hint: "Hover or tap a pillar",
    pillars: [
      { name: "Schools", desc: "School buildings, learning materials and teacher support that widen opportunity for Thai students.", projects: ["New school building"] },
      { name: "Temples", desc: "Restoring and supporting places of worship — the roots of Thai culture and identity.", projects: ["New sermon hall"] },
      {
        name: "Hospitals",
        desc: "Medical equipment and funding that strengthen the public health system.",
        projects: ["Bhumisiri Mangkhalanusorn Building, King Chulalongkorn Memorial Hospital", "Ventilators donated"],
      },
      { name: "Elderly homes and shelters", desc: "Vocational training and daily care for elderly people and children in need across the country.", projects: [] },
    ],
  },
  gallery: {
    eyebrow: "Moments of giving",
    title: "People, places and small ceremonies",
    hint: "Drag to scroll · Tap to view",
    close: "Close",
    prev: "Previous photo",
    next: "Next photo",
    items: [
      { caption: "Bhumisiri Mangkhalanusorn Building", place: "King Chulalongkorn Memorial Hospital" },
      { caption: "Building a sermon hall", place: "Temple" },
      { caption: "Donating ventilators", place: "Public health" },
      { caption: "Supporting children's education", place: "School" },
    ],
  },
  contact: {
    eyebrow: "Be part of it",
    title: "Pass on",
    accent: "kindness",
    lead: "Follow every project — schools, temples, hospitals and care homes — shared as it happens.",
    support: "Support us",
    facebook: "Facebook",
    under: "Under the care of Charoensin Group",
  },
};

const zhCN: DeepPartial<FoundationDict> = {
  hero: {
    eyebrow: "陳振誠集團公益基金会 · 创立于2008年",
    name: "陳振誠集團公益基金会",
    under: "隶属陳振誠集團",
    title: ["回馈", "社会"],
    accent: "在最需要的地方",
    quote: "每一份给予，都始于真心，化为希望。",
    cta: "了解我们的工作",
    badges: [{ label: "年的付出" }, { label: "泰铢捐赠" }],
    scroll: "向下滚动",
  },
  about: {
    eyebrow: "关于基金会",
    title: "根植于教育、信仰与关怀的使命",
    story: "基金会于2008年在陳振誠集團董事长的主持下正式成立，致力于将善意持久地传递给泰国社会。",
    foundedLabel: "创立年份",
    foundedValue: "2008",
    objectivesLabel: "宗旨",
    objectives: ["由陳振誠集團创立", "植根于稳健的企业", "支持残障人士与体育", "为残障人士提供职业培训"],
    partnersLabel: "受资助机构",
    partners: ["诗里拉吉基金会", "端巴提基金会", "报德善堂", "札丹寺", "蓬蓬威里亚兰寺", "探密威他耶学校"],
  },
  impact: {
    eyebrow: "四大支柱",
    title: "我们的付出",
    lead: "每一笔捐赠均有记录、可供查核，由陳振誠集團负责监督。",
    stats: ["捐赠总额（泰铢）", "受资助学生", "捐赠医疗设备", "年的付出"],
    baht: "泰铢",
    hint: "悬停或点击各支柱",
    pillars: [
      { name: "学校", desc: "教学楼、学习资源与教师支持，为泰国学生拓展机会。", projects: ["兴建教学楼"] },
      { name: "寺庙", desc: "修缮并支持宗教场所——泰国文化与认同的根基。", projects: ["兴建讲经堂"] },
      { name: "医院", desc: "医疗设备与资金支持，强化公共卫生体系。", projects: ["朱拉隆功纪念医院 普密希利吉祥纪念大楼", "捐赠呼吸机"] },
      { name: "养老院与福利院", desc: "为全国有需要的长者与儿童提供职业培训与日常照护。", projects: [] },
    ],
  },
  gallery: {
    eyebrow: "付出的时刻",
    title: "人、地方与温暖的仪式",
    hint: "拖动浏览 · 点击查看",
    close: "关闭",
    prev: "上一张",
    next: "下一张",
    items: [
      { caption: "普密希利吉祥纪念大楼", place: "朱拉隆功纪念医院" },
      { caption: "兴建讲经堂", place: "寺庙" },
      { caption: "捐赠呼吸机", place: "公共卫生" },
      { caption: "支持儿童教育", place: "学校" },
    ],
  },
  contact: {
    eyebrow: "成为其中一员",
    title: "传递",
    accent: "善意",
    lead: "关注每一个项目——学校、寺庙、医院与养老院，第一时间分享。",
    support: "支持我们",
    facebook: "Facebook",
    under: "由陳振誠集團监督",
  },
};

const zhTW: DeepPartial<FoundationDict> = {
  hero: {
    eyebrow: "陳振誠集團公益基金會 · 創立於2008年",
    name: "陳振誠集團公益基金會",
    under: "隸屬陳振誠集團",
    title: ["回饋", "社會"],
    accent: "在最需要的地方",
    quote: "每一份給予，都始於真心，化為希望。",
    cta: "了解我們的工作",
    badges: [{ label: "年的付出" }, { label: "泰銖捐贈" }],
    scroll: "向下捲動",
  },
  about: {
    eyebrow: "關於基金會",
    title: "根植於教育、信仰與關懷的使命",
    story: "基金會於2008年在陳振誠集團董事長的主持下正式成立，致力於將善意長久地傳遞給泰國社會。",
    foundedLabel: "創立年份",
    foundedValue: "2008",
    objectivesLabel: "宗旨",
    objectives: ["由陳振誠集團創立", "植根於穩健的企業", "支持身障人士與體育", "為身障人士提供職業訓練"],
    partnersLabel: "受資助機構",
    partners: ["詩里拉吉基金會", "端巴提基金會", "報德善堂", "札丹寺", "蓬蓬威里亞蘭寺", "探密威他耶學校"],
  },
  impact: {
    eyebrow: "四大支柱",
    title: "我們的付出",
    lead: "每一筆捐贈皆有紀錄、可供查核，由陳振誠集團負責監督。",
    stats: ["捐贈總額（泰銖）", "受資助學生", "捐贈醫療設備", "年的付出"],
    baht: "泰銖",
    hint: "懸停或點擊各支柱",
    pillars: [
      { name: "學校", desc: "教學大樓、學習資源與教師支持，為泰國學生拓展機會。", projects: ["興建教學大樓"] },
      { name: "寺廟", desc: "修繕並支持宗教場所——泰國文化與認同的根基。", projects: ["興建講經堂"] },
      { name: "醫院", desc: "醫療設備與資金支持，強化公共衛生體系。", projects: ["朱拉隆功紀念醫院 普密希利吉祥紀念大樓", "捐贈呼吸器"] },
      { name: "養老院與福利院", desc: "為全國有需要的長者與兒童提供職業訓練與日常照護。", projects: [] },
    ],
  },
  gallery: {
    eyebrow: "付出的時刻",
    title: "人、地方與溫暖的儀式",
    hint: "拖曳瀏覽 · 點擊查看",
    close: "關閉",
    prev: "上一張",
    next: "下一張",
    items: [
      { caption: "普密希利吉祥紀念大樓", place: "朱拉隆功紀念醫院" },
      { caption: "興建講經堂", place: "寺廟" },
      { caption: "捐贈呼吸器", place: "公共衛生" },
      { caption: "支持兒童教育", place: "學校" },
    ],
  },
  contact: {
    eyebrow: "成為其中一員",
    title: "傳遞",
    accent: "善意",
    lead: "關注每一個專案——學校、寺廟、醫院與養老院，第一時間分享。",
    support: "支持我們",
    facebook: "Facebook",
    under: "由陳振誠集團監督",
  },
};

const ja: DeepPartial<FoundationDict> = {
  hero: {
    eyebrow: "ウォンチャルンシン財団 · 2008年設立",
    name: "ウォンチャルンシン財団",
    under: "チャルンシン・グループ",
    title: ["社会へ", "還元する"],
    accent: "もっとも必要とされる場所へ",
    quote: "すべての寄付は心から始まり、希望へと育っていく。",
    cta: "活動を見る",
    badges: [{ label: "年の支援" }, { label: "バーツの寄付" }],
    scroll: "スクロール",
  },
  about: {
    eyebrow: "財団について",
    title: "教育・信仰・ケアに根ざした使命",
    story: "ウォンチャルンシン財団は2008年、チャルンシン・グループ会長のもとで正式に設立され、タイ社会へ思いやりを持続的に届けています。",
    foundedLabel: "設立年",
    foundedValue: "2008",
    objectivesLabel: "目的",
    objectives: ["チャルンシン・グループが設立", "堅実な企業に根ざした基盤", "障がい者とスポーツを支援", "障がい者への職業訓練"],
    partnersLabel: "支援先の団体",
    partners: ["シリラート財団", "ドゥアン・プラティープ財団", "報徳善堂", "ワット・チャクデーン", "ワット・ポンプローイ", "タンミックウィッタヤー学校"],
  },
  impact: {
    eyebrow: "4つの柱",
    title: "私たちの支援領域",
    lead: "すべての寄付は記録され、検証可能です。チャルンシン・グループが管理しています。",
    stats: ["寄付総額（バーツ）", "支援した生徒数", "寄贈した医療機器", "年の支援"],
    baht: "バーツ",
    hint: "各柱にカーソルを合わせるかタップ",
    pillars: [
      { name: "学校", desc: "校舎、教材、教員支援を通じて、タイの子どもたちの機会を広げます。", projects: ["校舎の建設"] },
      { name: "寺院", desc: "タイの文化とアイデンティティの礎である宗教施設の修復と支援。", projects: ["説法堂の建設"] },
      { name: "病院", desc: "医療機器と資金で公衆衛生を支えます。", projects: ["チュラロンコン記念病院 プーミシリ・マンカラーヌソン棟", "人工呼吸器の寄贈"] },
      { name: "高齢者施設・児童養護施設", desc: "全国の支援を必要とする高齢者と子どもへの職業訓練と日常のケア。", projects: [] },
    ],
  },
  gallery: {
    eyebrow: "寄付の瞬間",
    title: "人、場所、ささやかな式典",
    hint: "ドラッグでスクロール · タップで拡大",
    close: "閉じる",
    prev: "前の写真",
    next: "次の写真",
    items: [
      { caption: "プーミシリ・マンカラーヌソン棟", place: "チュラロンコン記念病院" },
      { caption: "説法堂の建設", place: "寺院" },
      { caption: "人工呼吸器の寄贈", place: "公衆衛生" },
      { caption: "子どもの教育支援", place: "学校" },
    ],
  },
  contact: {
    eyebrow: "一緒に",
    title: "思いやりを",
    accent: "つなぐ",
    lead: "学校、寺院、病院、福祉施設 — すべてのプロジェクトをいち早くお届けします。",
    support: "支援する",
    facebook: "Facebook",
    under: "チャルンシン・グループが運営",
  },
};

export const foundationDict: { th: FoundationDict } & Partial<Record<LanguageCode, DeepPartial<FoundationDict>>> = {
  th,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
};
