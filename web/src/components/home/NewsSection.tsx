"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Globe, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { NEWS_INDEX_HREF, getLatestNews } from "@/data/news-data";
import { fadeUp, Reveal } from "./motion";
import { useHomeCopy, useT } from "@/i18n";

/** 5 real posts (the 6th item in news-data is still a placeholder) */
const MAX_SLIDES = 5;
const AUTO_S = 6; // seconds per slide
const SLIDE_MS = 1100; // track glide
const FB_PAGE = "https://www.facebook.com/CharoensinGroup/";
/** Facebook "f" mark (lucide 1.x ships no brand icons) */
const FB_PATH =
  "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z";

/**
 * ข่าวสารและกิจกรรม — intro column (4/12) + Facebook-style post carousel (8/12).
 * Intro: title, two-line lead and a gold CTA, vertically centred against the
 * cards. Each slide previews a post from the company page: CS avatar, page
 * name (陳振誠集團 in Chinese), date, the Facebook mark; a clean 16:10 photo
 * with nothing over it; a one-line headline, a two-line summary, "… see more"
 * and a Like / Comment / Share bar (labels only — no invented counts). The
 * whole card opens the post (or the page) on Facebook in a new tab.
 *
 * Carousel: the current post is full strength, the next peeks in dimmed
 * (opacity .45, scale .96); one translate3d glides the track (compositor
 * only, no blur). Auto-advances every 6s via a CSS scaleX progress bar on the
 * active dot; pauses on hover, keyboard focus, off screen and reduced motion.
 * Dots, ← → buttons, arrow keys and swipe drive it manually.
 */
export default function NewsSection() {
  const t = useHomeCopy().news;
  // News items (title, excerpt, date) follow the chosen language
  const { t: tr, tf, date, lang } = useT();
  const pageName = lang === "zh-CN" || lang === "zh-TW" ? "陳振誠集團" : "Charoensin Group";
  const reduce = useReducedMotion();
  const items = useMemo(() => getLatestNews(MAX_SLIDES), []);
  const n = items.length;

  const [cur, setCur] = useState(0);
  const [round, setRound] = useState(0); // restarts the progress bar
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [offset, setOffset] = useState(0);

  const boxRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(boxRef, { amount: 0.35 });
  const paused = hovering || focused || !inView || !!reduce;

  const wrap = useCallback((i: number) => ((i % n) + n) % n, [n]);
  const go = useCallback(
    (i: number) => {
      setCur(wrap(i));
      setRound((r) => r + 1);
    },
    [wrap]
  );
  // Relative moves use functional updates so rapid clicks never read a stale index
  const step = useCallback(
    (d: number) => {
      setCur((c) => wrap(c + d));
      setRound((r) => r + 1);
    },
    [wrap]
  );
  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  // Track position: bring the current slide to the left edge
  const place = useCallback(() => {
    const first = slideRefs.current[0];
    const active = slideRefs.current[cur];
    if (first && active) setOffset(first.offsetLeft - active.offsetLeft);
  }, [cur]);

  useLayoutEffect(place, [place]);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [place]);

  // Swipe (touch / pen): horizontal flick of 40px+ moves one slide
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? next : prev)();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <section id="news" aria-labelledby="news-title" className="relative isolate w-full overflow-clip bg-white py-16 sm:py-20 lg:py-24">
      {/* Ghost word (static) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 right-4 -z-10 select-none font-playfair text-[22vw] leading-none text-[#a28757]/[0.06] sm:text-[16vw]"
      >
        News
      </span>

      <div className="home-shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---------------- Intro (4/12, centred against the cards) ---------------- */}
          <Reveal className="lg:col-span-4 lg:flex lg:flex-col lg:justify-center lg:pb-16">
            <motion.h2 id="news-title" variants={fadeUp} className="font-kanit font-normal text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] text-[#14171F]">
              {t.title}
            </motion.h2>
            <motion.span variants={fadeUp} aria-hidden className="mt-5 block h-px w-16 bg-gradient-to-r from-[#a28757] to-transparent" />
            <motion.p variants={fadeUp} className="mt-5 max-w-[26rem] font-sarabun text-base leading-relaxed text-[#6B5A3A]">
              {t.sub}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href={NEWS_INDEX_HREF}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#7c6538] to-[#b59a63] px-7 py-3.5 font-kanit text-[15px] text-white shadow-md transition-[box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] focus-visible:ring-offset-2"
              >
                {t.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </Reveal>

          {/* ---------------- Facebook-style post carousel (8/12) ---------------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="min-w-0 lg:col-span-8"
          >
            <div
              ref={boxRef}
              role="region"
              aria-roledescription="carousel"
              aria-label={tr("ข่าวล่าสุด (ใช้ปุ่มลูกศรซ้าย/ขวาเพื่อเลื่อน)")}
              tabIndex={0}
              onKeyDown={onKeyDown}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onFocus={() => setFocused(true)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipe.current = null)}
              className="relative min-w-0 rounded-[1.75rem] outline-none [container-type:inline-size] [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-[#a28757] focus-visible:ring-offset-4"
            >
              {/* Viewport: bleeds right so the next post peeks to the card edge */}
              <div className="-my-6 -ml-6 -mr-5 overflow-hidden py-6 pl-6 sm:-mr-10">
                <div
                  className="flex gap-[clamp(1rem,3cqw,2rem)]"
                  style={{
                    transform: `translate3d(${offset}px,0,0)`,
                    transition: reduce ? "none" : `transform ${SLIDE_MS}ms cubic-bezier(0.65,0,0.35,1)`,
                  }}
                >
                  {items.map((item, i) => {
                    const on = i === cur;
                    const href = item.externalUrl.includes("facebook.com") ? item.externalUrl : FB_PAGE;
                    return (
                      <article
                        key={item.id}
                        ref={(el) => {
                          slideRefs.current[i] = el;
                        }}
                        aria-roledescription="slide"
                        aria-label={`${tf("{i} จาก {n}", { i: i + 1, n })}: ${tr(item.title)}`}
                        aria-hidden={!on}
                        className={`relative w-[min(25rem,84cqw)] min-[700px]:w-[min(25rem,56cqw)] shrink-0 overflow-hidden rounded-2xl border border-[#E4E6EB] bg-white transition-[opacity,scale,box-shadow] duration-700 ${
                          on
                            ? "opacity-100 scale-100 shadow-[0_24px_50px_-28px_rgba(20,15,5,0.45)]"
                            : "opacity-45 scale-[0.96] hover:opacity-65"
                        }`}
                      >
                        {/* The whole post opens on Facebook; a peeking post is brought forward first */}
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={on ? 0 : -1}
                          aria-label={`${t.openFb}: ${tr(item.title)}`}
                          onClick={(e) => {
                            if (!on) {
                              e.preventDefault();
                              go(i);
                            }
                          }}
                          className="group/post block focus-visible:outline-none"
                        >
                          {/* Header: CS avatar · page name · date · Facebook mark */}
                          <div className="flex items-center gap-3 px-4 pb-3 pt-4">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#C8A96A]/50 bg-[#FAF8F3]">
                              <span
                                aria-hidden
                                className="block h-[62%] w-[62%]"
                                style={{
                                  background: "linear-gradient(135deg,#C8A96A 0%,#8a6d3b 60%,#C8A96A 100%)",
                                  WebkitMask: "url(/img/csg-emblem.png) center / contain no-repeat",
                                  mask: "url(/img/csg-emblem.png) center / contain no-repeat",
                                }}
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-kanit text-[15px] leading-tight text-[#050505]">{pageName}</span>
                              <span className="mt-0.5 flex items-center gap-1 font-sarabun text-xs text-[#65676B]">
                                <time dateTime={item.date}>{date(item.date)}</time>
                                <span aria-hidden>·</span>
                                <Globe aria-hidden className="h-3 w-3" />
                              </span>
                            </span>
                            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-[#1877F2]">
                              <path d={FB_PATH} />
                            </svg>
                          </div>

                          {/* Clean photo — nothing printed over it */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-[#E9DFCC]">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              sizes="(max-width: 700px) 84vw, 400px"
                              className="object-cover transition-transform duration-700 ease-out group-hover/post:scale-[1.03]"
                            />
                          </div>

                          {/* Short copy: 1-line headline + 2-line summary + "… see more" */}
                          <div className="px-4 pt-3">
                            <h3 className="font-kanit text-base leading-snug text-[#050505] line-clamp-1">{tr(item.title)}</h3>
                            <p className="mt-1 font-sarabun text-sm leading-relaxed text-[#050505]/75 line-clamp-2">{tr(item.excerpt)}</p>
                            <span className="mt-0.5 block font-sarabun text-sm text-[#65676B] group-hover/post:underline">… {t.seeMore}</span>
                          </div>

                          {/* Like · Comment · Share */}
                          <div className="mx-4 mt-3 grid grid-cols-3 border-t border-[#E4E6EB] py-1.5">
                            {[
                              { Icon: ThumbsUp, label: t.like },
                              { Icon: MessageCircle, label: t.comment },
                              { Icon: Share2, label: t.share },
                            ].map(({ Icon, label }) => (
                              <span key={label} className="flex min-w-0 items-center justify-center gap-1.5 rounded-md py-1.5 font-sarabun text-[13px] text-[#65676B]">
                                <Icon aria-hidden className="h-4 w-4 shrink-0" />
                                <span className="truncate">{label}</span>
                              </span>
                            ))}
                          </div>
                        </a>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Controls: progress dots (left) · counter + arrows (right) */}
              <div className="mt-5 flex w-[min(25rem,84cqw)] min-[700px]:w-[min(25rem,56cqw)] items-center justify-between gap-4">
                <div className="flex items-center" aria-label={tr("เลือกข่าว")}>
                  {items.map((item, i) => {
                    const on = i === cur;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`${tf("ข่าว {i}", { i: i + 1 })}: ${tr(item.title)}`}
                        aria-current={on || undefined}
                        className="group grid h-8 place-items-center px-1 focus-visible:outline-none"
                      >
                        <span
                          className={`relative block h-[0.45rem] overflow-hidden rounded-full transition-[width,background-color] duration-700 group-focus-visible:ring-2 group-focus-visible:ring-[#a28757] ${
                            on ? "w-14 bg-[#a28757]/30" : "w-[0.45rem] bg-[#a28757]/35 group-hover:bg-[#a28757]/60"
                          }`}
                        >
                          {on && (
                            <span
                              key={`${cur}-${round}`}
                              className={`absolute inset-0 origin-left bg-[#6B5A3A] ${reduce ? "" : "hero-dock-progress"}`}
                              style={{ animationDuration: `${AUTO_S}s`, animationPlayState: paused ? "paused" : "running" }}
                              onAnimationEnd={next}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-1 hidden font-inter text-xs tabular-nums text-[#8a7146] sm:inline" aria-live="polite">
                    {String(cur + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                  {[
                    { label: t.prev, Icon: ArrowLeft, fn: prev },
                    { label: t.next, Icon: ArrowRight, fn: next },
                  ].map(({ label, Icon, fn }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={fn}
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#a28757]/35 bg-white text-[#6B5A3A] transition-colors duration-300 hover:border-[#14171F] hover:bg-[#14171F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757]"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
