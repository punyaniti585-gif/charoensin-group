"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { footerAffiliateLogos } from "@/data/asset-map";
import { useT } from "@/i18n";

/* ==========================================================================
   /about — บริษัทและแบรนด์ในเครือกลุ่มเจริญสิน (static 2-row logo grid)
   --------------------------------------------------------------------------
   Replaces the Footer's running marquee on this page with the V.3 logo strip
   (_reference/Home-Modern.html, .f-logos-grid): logos only — no boxes — in
   3:2 cells. Desktop: 12 per row → 2 rows (12 + 11, last row centred);
   tablet 6 per row; phones 4 per row.

   • Optical balance: every logo gets the same visual AREA (width ∝ √aspect,
     capped by the cell), so an 8:1 wordmark and a portrait crest weigh the
     same. Sizes are the PNGs' real pixel dimensions.
   • Hover / keyboard focus: the other logos dim (CSS :has, opacity), the
     logo lifts and scales slightly, and its full name rises beneath it.
     transform + opacity only.
   ========================================================================== */

/** Real PNG sizes (public/img/affiliate-*.png) */
const SIZE: Record<string, [number, number]> = {
  csa: [528, 350], cpl: [600, 296], pangolin: [600, 157], adb: [600, 332], ccap: [600, 171],
  csj: [600, 228], "csg-logo": [600, 139], marni: [344, 350], csr: [600, 237], luigi: [600, 152],
  smn: [600, 232], tws: [600, 223], ply: [336, 350], galavela: [600, 74], smartsense: [309, 350],
  premium: [600, 210], caltree: [442, 350], chub: [600, 159], unitel: [600, 290], ft: [410, 350],
  bbest: [600, 272], ttn: [600, 167], mitsufuku: [600, 150],
};

/** Cell is 3:2 → height = ⅔ width. Target area = 42% of the cell. */
const AREA = 0.42 * (2 / 3);
const MAX_W = 0.96;
const MAX_H = 0.9 * (2 / 3);
const widthPct = ([w, h]: [number, number]) => {
  const r = w / h;
  return Math.min(Math.sqrt(AREA * r), MAX_W, MAX_H * r) * 100;
};

const listV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.025 } } };
const itemV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutAffiliates() {
  const reduce = useReducedMotion();
  const { t, name } = useT();

  return (
    <section aria-labelledby="about-affiliates-title" className="relative bg-[#FCFBF9] py-14 sm:py-16 lg:py-20">
      <div className="home-shell">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="block font-inter text-xs font-semibold uppercase tracking-widest text-[#6B5A3A]">
              AFFILIATE COMPANIES &amp; BRANDS
            </span>
            <h2 id="about-affiliates-title" className="mt-1 font-kanit font-normal text-2xl md:text-3xl text-[#1F1F1F]">
              {t("บริษัทและแบรนด์ในเครือกลุ่มเจริญสิน")}
            </h2>
          </div>
          <span className="hidden font-sarabun text-xs text-[#6B5A3A] sm:inline-block">{t("ชี้เมาส์ที่โลโก้เพื่อดูชื่อบริษัท")}</span>
        </div>

        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="aff-grid mt-8 flex flex-wrap justify-center gap-x-4 gap-y-8 [--cols:4] sm:[--cols:6] lg:mt-12 lg:gap-y-10 lg:[--cols:12]"
        >
          {footerAffiliateLogos.map((b) => {
            const size = SIZE[b.id] ?? [600, 300];
            const label = name(b.name);
            return (
              <motion.li key={b.id} variants={itemV} className="basis-[calc((100%-(var(--cols)-1)*1rem)/var(--cols))]">
                <div
                  tabIndex={0}
                  aria-label={label}
                  className="aff-logo group relative flex aspect-[3/2] items-center justify-center rounded-md outline-none transition-opacity duration-300 focus-visible:ring-1 focus-visible:ring-[#a28757]/60"
                >
                  <Image
                    src={b.logo}
                    alt={label}
                    width={size[0]}
                    height={size[1]}
                    sizes="(max-width: 640px) 22vw, (max-width: 1024px) 14vw, 120px"
                    className="h-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[3px] group-hover:scale-[1.08] group-focus-visible:-translate-y-[3px] group-focus-visible:scale-[1.08]"
                    style={{ width: `${widthPct(size)}%` }}
                  />
                  {/* Full company name — rises in under the logo */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[calc(100%+2px)] w-max max-w-[calc(100%+1.5rem)] -translate-x-1/2 translate-y-1 text-center font-sarabun text-[11px] leading-snug text-[#8a7146] opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:text-xs"
                  >
                    {label}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
