/**
 * Global footprint — the 10 countries (HQ + markets) shown on the home map.
 * Names come from asset-map.ts (globalCountries); roles are the descriptions
 * already used on the home page. Shapes and city positions are generated in
 * world-map.ts (scripts/build-world-map.mjs).
 *
 * TODO(content): `groups` (related business groups per country) is inferred
 * from each role description — please confirm with the business owners.
 */
import { globalCountries } from "./asset-map";
import { MARKET_SHAPES, type MarketShape } from "./world-map";

export interface Market extends MarketShape {
  nameTh: string;
  nameEn: string;
  hub: boolean;
  role: string;
  groups: string[];
}

const DETAILS: Record<string, { role: string; groups: string[] }> = {
  TH: {
    role: "ศูนย์กลางยุทธศาสตร์ระดับภูมิภาค & สำนักงานใหญ่ (Regional HQ Hub)",
    groups: ["อสังหาริมทรัพย์", "หนังและรองเท้า", "สิ่งทอ", "เคมีภัณฑ์", "ธุรกิจอื่นๆ"],
  },
  CN: { role: "ตลาดการค้าและพันธมิตรซัพพลายเชนหลัก (Strategic Trade Partner)", groups: ["หนังและรองเท้า", "เคมีภัณฑ์"] },
  KR: { role: "ฐานลูกค้านวัตกรรมสิ่งทอและวัสดุ (High-tech Materials Market)", groups: ["สิ่งทอ"] },
  JP: { role: "มาตรฐานความปลอดภัยและเคมีภัณฑ์ยานยนต์ (Automotive & Quality Hub)", groups: ["เคมีภัณฑ์", "สิ่งทอ"] },
  IN: { role: "ตลาดเคมีภัณฑ์และพอลิเมอร์อุตสาหกรรม (Industrial Polymers Market)", groups: ["เคมีภัณฑ์"] },
  AE: { role: "ศูนย์กระจายสินค้าตะวันออกกลางและแอฟริกา (Middle East & GCC Gateway)", groups: ["หนังและรองเท้า", "เคมีภัณฑ์"] },
  DE: { role: "ฐานวิศวกรรมเทคโนโลยีความปลอดภัยยุโรป (EU Safety & Standards)", groups: ["หนังและรองเท้า"] },
  GB: { role: "ตลาดการค้าระหว่างประเทศและพันธมิตรยุโรป (International Trade Partner)", groups: ["หนังและรองเท้า"] },
  US: { role: "ตลาดส่งออกหนังแท้และอุปกรณ์เซฟตี้สากล (Global Export Destination)", groups: ["หนังและรองเท้า"] },
  AU: { role: "ตลาดผลิตภัณฑ์เพื่อความยั่งยืนและการเกษตร (Oceania Agri-Ventures)", groups: ["ธุรกิจอื่นๆ"] },
};

export const markets: Market[] = globalCountries.map((c) => {
  const shape = MARKET_SHAPES.find((s) => s.code === c.code);
  if (!shape) throw new Error(`no shape for ${c.code}`);
  const d = DETAILS[c.code];
  return { ...shape, nameTh: c.nameTh, nameEn: c.nameEn, hub: !!c.hub, role: d.role, groups: d.groups };
});

export const hubMarket = markets.find((m) => m.hub) ?? markets[0];
