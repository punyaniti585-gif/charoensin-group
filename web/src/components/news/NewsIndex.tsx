"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import {
  NEWS_CATEGORIES,
  formatThaiDate,
  getAllNews,
  getFeaturedNews,
  newsHref,
  type NewsCategory,
} from "@/data/news-data";
import NewsCard from "./NewsCard";

type Filter = "all" | NewsCategory;
const ease = [0.22, 1, 0.36, 1] as const;

/** /news — featured story, category filter (same tabs as the home page), search, 3-column grid. */
export default function NewsIndex() {
  const all = useMemo(() => getAllNews(), []);
  const featured = useMemo(() => getFeaturedNews(), []);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(
      (n) =>
        (filter === "all" || n.category === filter) &&
        (!q || [n.title, n.excerpt, n.category, ...n.content].some((t) => t.toLowerCase().includes(q)))
    );
  }, [all, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const n of all) c[n.category] = (c[n.category] ?? 0) + 1;
    return c;
  }, [all]);

  return (
    <div className="bg-[#FAF8F3]">
      {/* Header + featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14">
        <p className="inline-flex items-center gap-3 font-inter text-[11px] font-medium uppercase tracking-[0.3em] text-[#a28757]">
          <span aria-hidden className="h-px w-8 bg-[#a28757]" />
          News & Activities
        </p>
        <h1 className="mt-4 font-kanit font-normal text-4xl sm:text-5xl text-[#14171F]">ข่าวสารและกิจกรรม</h1>
        <p className="mt-3 max-w-2xl font-sarabun text-base sm:text-lg text-[#14171F]/65">
          ติดตามความเคลื่อนไหว ประกาศองค์กร และกิจกรรมเพื่อสังคมล่าสุดจากกลุ่มบริษัทเจริญสิน
        </p>

        <Link
          href={newsHref(featured)}
          className="group mt-10 grid overflow-hidden rounded-3xl border border-[#a28757]/20 bg-white lg:grid-cols-2 shadow-[0_24px_60px_-34px_rgba(60,45,20,0.5)]"
        >
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] overflow-hidden bg-[#E9DFCC]">
            <Image src={featured.image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute left-4 top-4 rounded-full bg-[#a28757] px-3 py-1 font-inter text-[10px] uppercase tracking-[0.2em] text-white">Featured</span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="font-kanit text-sm text-[#a28757]">
              {featured.category} · <time dateTime={featured.date}>{formatThaiDate(featured.date)}</time>
            </p>
            <h2 className="mt-3 font-kanit font-normal text-2xl sm:text-3xl leading-snug text-[#14171F]">{featured.title}</h2>
            <p className="mt-3 font-sarabun text-base leading-relaxed text-[#14171F]/65">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-kanit text-sm text-[#6B5A3A] group-hover:text-[#a28757]">
              อ่านข่าวนี้
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* Filter + search + grid */}
      <section className="border-t border-[#a28757]/15 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="กรองตามหมวดหมู่" className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(["all", ...NEWS_CATEGORIES] as Filter[]).map((c) => {
                const on = filter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(c)}
                    className={`shrink-0 rounded-full border px-4 py-2 font-kanit text-sm transition-colors ${
                      on ? "border-[#14171F] bg-[#14171F] text-white" : "border-[#a28757]/30 text-[#14171F]/70 hover:border-[#a28757]"
                    }`}
                  >
                    {c === "all" ? "ทั้งหมด" : c}
                    <span className={`ml-1.5 font-inter text-[11px] ${on ? "text-[#cfc29f]" : "text-[#a28757]"}`}>{counts[c] ?? 0}</span>
                  </button>
                );
              })}
            </div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">ค้นหาข่าว</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a28757]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาข่าวสารและกิจกรรม"
                className="w-full rounded-full border border-[#a28757]/30 bg-[#FAF8F3] py-2.5 pl-11 pr-10 font-sarabun text-sm text-[#14171F] placeholder:text-[#14171F]/40 focus:border-[#a28757] focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้นหา" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#14171F]/50 hover:text-[#14171F]">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          <p className="mt-6 font-sarabun text-sm text-[#14171F]/50" aria-live="polite">
            พบ {results.length} รายการ
          </p>

          <motion.ul layout className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence initial={false}>
              {results.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <NewsCard item={n} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {results.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-[#a28757]/30 p-10 text-center font-sarabun text-[#14171F]/55">
              ไม่พบข่าวที่ตรงกับเงื่อนไข ลองเปลี่ยนหมวดหมู่หรือคำค้นหา
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
