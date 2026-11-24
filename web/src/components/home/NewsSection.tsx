"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FadeUp } from "@/components/ui/MotionWrapper";
import { Newspaper, ArrowRight } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import {
  NEWS_INDEX_HREF,
  formatThaiDate,
  getAllNews,
  getLatestNews,
  getUsedCategories,
  type NewsCategory,
  type NewsItem,
} from "@/data/news-data";

const MAX_CARDS = 6;
const CARD_W = 240; // desktop card width (px) before scaling
const luxEase = [0.22, 1, 0.36, 1] as const;
type Filter = "all" | NewsCategory;

/**
 * ข่าวสารและกิจกรรม — Card Fan-Out deck.
 * Desktop: cards start stacked in the centre and fan out into a gentle arc
 * when the section scrolls into view (centre card largest). Picking a
 * category folds the deck back to the centre and fans the new set out.
 * Mobile: a swipeable horizontal row with snap points.
 * All content comes from data/news-data.ts (single source of truth).
 */
export default function NewsSection() {
  const reduce = useReducedMotion();
  const categories = useMemo(() => getUsedCategories(), []);
  const totalCount = useMemo(() => getAllNews().length, []);

  const [filter, setFilter] = useState<Filter>("all");
  const [shownFilter, setShownFilter] = useState<Filter>("all");
  const [fanned, setFanned] = useState(false);

  const deckRef = useRef<HTMLDivElement>(null);
  const inView = useInView(deckRef, { once: true, amount: 0.35 });

  // First fan-out when the deck scrolls into view
  useEffect(() => {
    if (inView || reduce) setFanned(true);
  }, [inView, reduce]);

  // Category change: fold to the centre → swap the set → fan out again
  useEffect(() => {
    if (filter === shownFilter) return;
    if (reduce) {
      setShownFilter(filter);
      return;
    }
    setFanned(false);
    const t = window.setTimeout(() => {
      setShownFilter(filter);
      setFanned(true);
    }, 380);
    return () => window.clearTimeout(t);
  }, [filter, shownFilter, reduce]);

  const items = useMemo<NewsItem[]>(
    () =>
      shownFilter === "all"
        ? getLatestNews(MAX_CARDS)
        : getAllNews().filter((n) => n.category === shownFilter).slice(0, MAX_CARDS),
    [shownFilter]
  );

  return (
    <section id="news" className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 lg:mb-8">
          <div>
            <FadeUp delay={0.1} distance={20}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B39B6B]/20 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-4">
                <Newspaper className="w-3.5 h-3.5 text-[#B39B6B]" />
                <span>NEWS & ACTIVITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
                ข่าวสารและกิจกรรม
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#1F1F1F]/75 font-sarabun max-w-2xl">
                ติดตามความเคลื่อนไหว ประกาศองค์กร และกิจกรรมเพื่อสังคมล่าสุดจากกลุ่มบริษัทเจริญสิน
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.2} distance={20}>
            <Link
              href={NEWS_INDEX_HREF}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#6B5A3A] hover:bg-[#B39B6B] text-white font-semibold font-kanit text-sm transition-colors duration-300 shadow-md group/cta"
            >
              <span>ดูข่าวสารและกิจกรรมทั้งหมด</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-inter">{totalCount}</span>
              <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>

        {/* Category filter */}
        <div
          role="group"
          aria-label="กรองตามหมวดหมู่"
          className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {(["all", ...categories] as Filter[]).map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={`shrink-0 px-4 py-1.5 rounded-full border text-sm font-kanit transition-colors ${
                  active
                    ? "bg-[#6B5A3A] border-[#6B5A3A] text-white"
                    : "bg-white/70 border-[#B39B6B]/40 text-[#6B5A3A] hover:border-[#B39B6B]"
                }`}
              >
                {c === "all" ? "ทั้งหมด" : c}
              </button>
            );
          })}
        </div>

        {/* Desktop: fan-out deck */}
        <div ref={deckRef} className="hidden lg:block">
          <FanDeck items={items} fanned={fanned} reduce={!!reduce} />
        </div>

        {/* Mobile / tablet: swipeable row */}
        <div className="lg:hidden mt-4 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div key={item.id} className="snap-center shrink-0 w-[78vw] max-w-[300px]">
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Horizontal fan of absolutely-positioned cards (transform + opacity only) */
function FanDeck({ items, fanned, reduce }: { items: NewsItem[]; fanned: boolean; reduce: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const n = items.length;
  const center = (n - 1) / 2;
  // Spread so the whole fan fits the container, with slight overlap at most
  const spacing = n > 1 ? Math.min(CARD_W * 0.98, (width - CARD_W * 1.12) / (n - 1)) : 0;

  return (
    <div ref={boxRef} className="relative mt-6 h-[470px]">
      {items.map((item, i) => {
        const d = i - center;
        const dist = Math.abs(d);
        const fan = {
          x: d * spacing,
          y: dist * 12,
          rotate: d * 2.2,
          scale: 1.1 - dist * 0.06,
          opacity: 1,
        };
        const stack = {
          x: d * 8,
          y: 18,
          rotate: d * -3.5,
          scale: 0.9,
          opacity: dist > 2 ? 0 : 1,
        };
        const z = hovered === item.id ? 100 : 50 - Math.round(dist * 10);
        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={fanned ? fan : stack}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.6, ease: luxEase, delay: fanned ? dist * 0.07 : 0 }
            }
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(item.id)}
            onBlur={() => setHovered(null)}
            style={{ zIndex: z, width: CARD_W, marginLeft: -CARD_W / 2 }}
            className="absolute left-1/2 top-0 will-change-transform"
          >
            <div className="transition-transform duration-300 ease-out hover:-translate-y-2">
              <NewsCard item={item} emphasis={dist < 1} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

