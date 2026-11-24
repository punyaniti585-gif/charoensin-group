"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { ventures, type Venture, type VentureVideo } from "@/data/ventures-data";

/* ==========================================================================
   ธุรกิจที่ขับเคลื่อนอนาคต — bento explorer (ported from the HTML prototype)
   • Tabs switch the venture: every tile is covered by a block that wipes in
     from a random side, the content swaps, then the block wipes out.
   • The dark panel's colour eases to the venture's theme (CSS variables).
   • "ดูรายละเอียด" opens a full-frame detail view behind a 6-strip wipe.
   • Wipes use the Web Animations API on transform only (compositor-friendly).
   ========================================================================== */

const EASE = {
  expo: "cubic-bezier(0.16,1,0.3,1)",
  cubic: "cubic-bezier(0.65,0,0.35,1)",
};
const SIDES = ["left", "right", "top", "bottom"] as const;
type Side = (typeof SIDES)[number];
const OPP: Record<Side, Side> = { left: "right", right: "left", top: "bottom", bottom: "top" };
const pad = (n: number) => String(n).padStart(2, "0");
const isExternal = (href: string) => /^https?:\/\//.test(href);
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/** Run a WAAPI animation, keep its end state inline, release it */
async function wipe(el: HTMLElement, frames: Keyframe[], opts: KeyframeAnimationOptions) {
  const a = el.animate(frames, { fill: "forwards", ...opts });
  await a.finished;
  try {
    a.commitStyles();
  } catch {
    /* element detached */
  }
  a.cancel();
}
const axis = (s: Side) => (s === "left" || s === "right" ? "X" : "Y");
function coverIn(c: HTMLElement) {
  const side = SIDES[Math.floor(Math.random() * 4)];
  c.style.transformOrigin = side;
  c.dataset.side = side;
  const ax = axis(side);
  return wipe(c, [{ transform: `scale${ax}(0)` }, { transform: `scale${ax}(1)` }], {
    duration: 420,
    delay: Math.random() * 260,
    easing: EASE.cubic,
  });
}
function coverOut(c: HTMLElement) {
  const side = OPP[(c.dataset.side as Side) || "top"];
  c.style.transformOrigin = side;
  const ax = axis(side);
  return wipe(c, [{ transform: `scale${ax}(1)` }, { transform: `scale${ax}(0)` }], {
    duration: 620,
    delay: 60 + Math.random() * 340,
    easing: EASE.expo,
  });
}

export default function VenturesBento() {
  const [idx, setIdx] = useState(0); // content shown in the tiles
  const [themeIdx, setThemeIdx] = useState(0); // panel colour (switches first)
  const [detailOpen, setDetailOpen] = useState(false);
  const [video, setVideo] = useState<VentureVideo | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const covers = useRef<HTMLDivElement[]>([]);
  const strips = useRef<HTMLElement[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const discRef = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);
  const pending = useRef<number | null>(null);
  const idxRef = useRef(0);
  const detailRef = useRef(false);
  const reduceRef = useRef(false);

  const titleInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.12 });

  const registerCover = (el: HTMLDivElement | null) => {
    if (el && !covers.current.includes(el)) covers.current.push(el);
  };

  // Reduced motion → no wipes, covers off from the start
  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceRef.current) covers.current.forEach((c) => (c.style.transform = "scale(0)"));
  }, []);

  // First reveal: covers wipe out block by block when the grid enters view
  useEffect(() => {
    if (!gridInView || reduceRef.current) return;
    covers.current.forEach((c) => {
      c.dataset.side = SIDES[Math.floor(Math.random() * 4)];
      coverOut(c);
    });
  }, [gridInView]);

  const stripsTo = useCallback(async (on: boolean) => {
    await Promise.all(
      strips.current.map((s, k) => {
        s.style.transformOrigin = on ? "top" : "bottom";
        return wipe(s, [{ transform: `scaleY(${on ? 0 : 1})` }, { transform: `scaleY(${on ? 1 : 0})` }], {
          duration: on ? 420 : 620,
          delay: k * 55,
          easing: on ? EASE.cubic : EASE.expo,
        });
      })
    );
  }, []);

  const goTo = useCallback(
    async (raw: number) => {
      const i = (raw + ventures.length) % ventures.length;
      if (busy.current) {
        pending.current = i;
        return;
      }
      if (i === idxRef.current) return;
      busy.current = true;
      idxRef.current = i;
      setThemeIdx(i);
      const reduce = reduceRef.current;

      if (detailRef.current) {
        // Swap inside the detail view
        if (!reduce) await stripsTo(true);
        setIdx(i);
        await nextFrame();
        if (!reduce) await stripsTo(false);
      } else if (reduce) {
        setIdx(i);
      } else {
        await Promise.all(covers.current.map(coverIn));
        setIdx(i);
        await nextFrame();
        await Promise.all(covers.current.map(coverOut));
      }

      busy.current = false;
      if (pending.current !== null) {
        const q = pending.current;
        pending.current = null;
        goTo(q);
      }
    },
    [stripsTo]
  );

  const openDetail = useCallback(async () => {
    if (busy.current || detailRef.current) return;
    busy.current = true;
    const reduce = reduceRef.current;
    if (!reduce) await Promise.all(covers.current.map(coverIn));
    strips.current.forEach((s) => (s.style.transform = reduce ? "scaleY(0)" : "scaleY(1)"));
    detailRef.current = true;
    setDetailOpen(true);
    await nextFrame();
    if (!reduce) await stripsTo(false);
    closeRef.current?.focus({ preventScroll: true });
    busy.current = false;
  }, [stripsTo]);

  const closeDetail = useCallback(async () => {
    if (busy.current || !detailRef.current) return;
    busy.current = true;
    const reduce = reduceRef.current;
    if (!reduce) await stripsTo(true);
    detailRef.current = false;
    setDetailOpen(false);
    await nextFrame();
    if (!reduce) await Promise.all(covers.current.map(coverOut));
    discRef.current?.focus({ preventScroll: true });
    busy.current = false;
  }, [stripsTo]);

  const v = ventures[idx];
  const t = ventures[themeIdx].theme;
  const themeVars = {
    "--t-base": t.base,
    "--t-mid": t.mid,
    "--t-acc": t.acc,
    "--t-light": t.light,
  } as React.CSSProperties;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ventures-title"
      className="relative w-full bg-[#F7F1E7] py-10 sm:py-12 lg:py-14"
    >
      <noscript>
        <style>{`.vb-cover{display:none}`}</style>
      </noscript>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          style={themeVars}
          className="relative rounded-[1.75rem] bg-[var(--t-base)] transition-[background-color] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] text-white px-3 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-16 lg:px-10"
        >
          {/* ---------------- Head: title + tabs ---------------- */}
          <div className="flex flex-col gap-7 mb-8 lg:mb-9 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-white/80 font-inter">
                <b className="font-playfair font-normal text-base tracking-normal text-[#E6C786]">05</b>
                <i aria-hidden className="w-8 h-px bg-[#CCA369]" />
                Future-Driving Ventures
              </span>
              <h2 id="ventures-title" aria-label="ธุรกิจที่ขับเคลื่อนอนาคต" className="mt-4 font-kanit font-normal text-white text-[2.2rem] sm:text-5xl leading-[1.12]">
                {["ธุรกิจที่ขับเคลื่อน", "อนาคต"].map((line, i) => (
                  <span key={line} aria-hidden className="block overflow-hidden pt-[0.2em] pb-[0.14em] -mt-[0.2em]">
                    <span
                      className={`block transition-[transform,opacity] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        titleInView ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                      style={{ transitionDelay: `${i * 120}ms` }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>
            </div>

            <div role="tablist" aria-label="ธุรกิจที่ขับเคลื่อนอนาคต" className="flex flex-wrap gap-2">
              {ventures.map((x, i) => {
                const active = i === themeIdx;
                return (
                  <button
                    key={x.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => goTo(i)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-kanit font-light tracking-wide transition-colors duration-300 ${
                      active
                        ? "bg-[var(--t-acc)] border-[var(--t-acc)] text-white"
                        : "border-[color-mix(in_srgb,var(--t-acc)_55%,transparent)] text-white/75 hover:text-white hover:border-[var(--t-acc)]"
                    }`}
                  >
                    <b className={`font-playfair font-normal ${active ? "text-white" : "text-[var(--t-light)]"}`}>{pad(i + 1)}</b>
                    {x.code === "CSR" ? "มูลนิธิ" : x.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---------------- Frame: bento grid + detail ---------------- */}
          <div className="relative rounded-[1.75rem] p-2.5 bg-[color-mix(in_srgb,var(--t-base)_62%,#000)] transition-[background-color] duration-[900ms] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div
              ref={gridRef}
              className="grid gap-2.5 grid-cols-2 lg:grid-cols-[repeat(24,minmax(0,1fr))] lg:grid-rows-[repeat(12,minmax(0,1fr))] lg:auto-rows-auto lg:h-[44rem]"
            >
              {/* a — hero */}
              <Tile cover={registerCover} className="col-span-2 min-h-[17rem] lg:min-h-0 lg:col-[1/13] lg:row-[1/7]">
                <TileImage src={v.heroImage} alt={v.nameTh} priority />
                <Shade />
                <div className="relative z-[2] mt-auto flex items-end justify-between gap-4 p-5 sm:p-6">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/80 font-inter">
                      {pad(idx + 1)} / {pad(ventures.length)}
                    </p>
                    <h3 className="mt-1 font-kanit font-normal text-[2rem] sm:text-[2.6rem] leading-tight">{v.nameTh}</h3>
                    <span className="block mt-1.5 font-playfair italic text-base text-[var(--t-light)]">{v.nameEn}</span>
                  </div>
                  {v.video && <PlayButton label={`เล่นวิดีโอ ${v.nameTh}`} onClick={() => setVideo(v.video)} />}
                </div>
              </Tile>

              {/* g — headline + description */}
              <Tile cover={registerCover} panel={[v.theme.base, v.theme.mid]} className="col-span-2 min-h-[11rem] lg:min-h-0 lg:col-[1/7] lg:row-[7/11]">
                <div className="p-5 sm:p-6 overflow-hidden">
                  <h3 className="font-kanit font-normal text-xl sm:text-2xl leading-snug">{v.tagline}</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-white/85 line-clamp-5 lg:line-clamp-4 font-sarabun">{v.description}</p>
                </div>
              </Tile>

              {/* h — group link */}
              <Tile cover={registerCover} panel={[v.theme.mid, v.theme.acc]} className="min-h-[8.5rem] lg:min-h-0 lg:col-[7/13] lg:row-[7/11]">
                <a
                  href={v.group.href}
                  {...(isExternal(v.group.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group/h flex h-full flex-col justify-between p-5 sm:p-6"
                >
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/80 font-inter">{v.group.label}</p>
                  <div>
                    <p className="font-kanit font-normal text-lg sm:text-xl leading-snug">{v.group.name}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs tracking-wide text-white/85 group-hover/h:text-white">
                      ดูรายละเอียด
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/h:translate-x-1" />
                    </span>
                  </div>
                </a>
              </Tile>

              {/* e — logo */}
              <Tile cover={registerCover} logo className="min-h-[8.5rem] lg:min-h-0 lg:col-[19/25] lg:row-[1/7]">
                <div className="group/logo flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="relative w-[70%] h-[42%] min-h-14">
                    <Image
                      src={v.logo}
                      alt={`โลโก้ ${v.nameTh}`}
                      fill
                      sizes="240px"
                      className="object-contain mix-blend-multiply [filter:grayscale(1)_sepia(.6)_saturate(1.4)_brightness(.62)_contrast(1.15)] transition-[filter] duration-500 group-hover/logo:[filter:none]"
                    />
                  </div>
                  <span className="font-kanit text-[0.95rem] leading-snug text-[#6B5A3A]">{v.nameTh}</span>
                </div>
              </Tile>

              {/* b — key number */}
              <Tile cover={registerCover} panel={[v.theme.mid, v.theme.acc]} className="min-h-[8.5rem] lg:min-h-0 lg:col-[13/19] lg:row-[1/4]">
                <div className="p-5 sm:p-6">
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/80 font-inter">{v.fact.label}</p>
                  <p className="mt-1.5 font-playfair text-5xl leading-none">
                    {v.fact.value}
                    {v.fact.unit && <small className="ml-1.5 font-kanit font-light text-[0.95rem] text-white/85">{v.fact.unit}</small>}
                  </p>
                </div>
              </Tile>

              {/* d — highlight */}
              <Tile cover={registerCover} panel={[v.theme.mid, v.theme.acc]} className="min-h-[8.5rem] lg:min-h-0 lg:col-[13/19] lg:row-[10/13]">
                <div className="mt-auto p-5 sm:p-6">
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/80 font-inter">จุดเด่น</p>
                  <p className="mt-1.5 font-kanit font-normal text-lg sm:text-xl leading-snug">{v.highlight}</p>
                </div>
              </Tile>

              {/* c — media / video */}
              <Tile cover={registerCover} className="col-span-2 min-h-[15rem] lg:min-h-0 lg:col-[13/19] lg:row-[4/10]">
                <TileImage src={v.mediaImage} alt={`${v.nameTh} — ${v.tagline}`} />
                {v.video ? (
                  <button
                    type="button"
                    onClick={() => setVideo(v.video)}
                    aria-label={`เล่นวิดีโอ ${v.nameTh}`}
                    className="group/c absolute inset-0 z-[2] grid place-items-center bg-black/25 hover:bg-black/10 transition-colors"
                  >
                    <span className="grid place-items-center w-16 h-16 rounded-full bg-[var(--t-acc)] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover/c:scale-110">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </span>
                    <span className="absolute bottom-4 left-4 text-[0.68rem] tracking-[0.2em] uppercase text-white/90 font-inter">ชมวิดีโอ</span>
                  </button>
                ) : (
                  <Shade />
                )}
              </Tile>

              {/* f — list */}
              <Tile cover={registerCover} panel={[v.theme.base, v.theme.mid]} className="col-span-2 min-h-[13rem] lg:min-h-0 lg:col-[19/25] lg:row-[7/13]">
                <div className="p-5 sm:p-6">
                  <h3 className="font-kanit font-normal text-lg sm:text-xl">{v.list.title}</h3>
                  <ul className="mt-3 flex flex-col gap-1.5 text-[0.8rem] leading-snug font-sarabun">
                    {v.list.items.slice(0, 5).map((it) => (
                      <li key={it.name} className="relative pl-3.5 before:absolute before:left-0 before:top-[0.62em] before:w-1.5 before:h-px before:bg-current before:opacity-60">
                        {it.name}
                      </li>
                    ))}
                    {v.list.items.length > 5 && (
                      <li className="relative pl-3.5 text-white/70 before:absolute before:left-0 before:top-[0.62em] before:w-1.5 before:h-px before:bg-current before:opacity-60">
                        และอีก {v.list.items.length - 5} บริษัท
                      </li>
                    )}
                  </ul>
                </div>
              </Tile>

              {/* Buttons */}
              <Tile cover={registerCover} className="col-span-2 min-h-[3.75rem] lg:min-h-0 lg:col-[1/7] lg:row-[11/13]">
                <button
                  ref={discRef}
                  type="button"
                  onClick={openDetail}
                  className="flex h-full w-full items-center justify-center text-[0.78rem] font-medium tracking-[0.18em] uppercase bg-[linear-gradient(120deg,var(--t-mid),var(--t-acc))] hover:bg-[var(--t-acc)] transition-colors"
                >
                  ดูรายละเอียด
                </button>
              </Tile>
              <Tile cover={registerCover} className="min-h-[3.75rem] lg:min-h-0 lg:col-[7/10] lg:row-[11/13]">
                <NavButton onClick={() => goTo(idxRef.current - 1)}>ก่อนหน้า</NavButton>
              </Tile>
              <Tile cover={registerCover} className="min-h-[3.75rem] lg:min-h-0 lg:col-[10/13] lg:row-[11/13]">
                <NavButton onClick={() => goTo(idxRef.current + 1)}>ถัดไป</NavButton>
              </Tile>
            </div>

            {/* ---------------- Detail view ---------------- */}
            <div
              role="region"
              aria-label="รายละเอียดธุรกิจ"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  closeDetail();
                }
              }}
              className={`absolute inset-2.5 z-[6] rounded-[0.85rem] overflow-hidden text-white ${detailOpen ? "block" : "hidden"}`}
            >
              <TileImage src={v.heroImage} alt={v.nameTh} />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,20,.9),rgba(20,20,20,.25)_55%,rgba(20,20,20,.45)),linear-gradient(to_right,rgba(20,20,20,.55),rgba(20,20,20,0)_60%)]" />
              <div className="absolute inset-0 flex flex-col justify-end gap-5 p-5 overflow-y-auto lg:flex-row lg:items-end lg:justify-between lg:p-8">
                <div className="max-w-[40rem]">
                  <p className="font-playfair italic text-lg text-[var(--t-light)]">
                    Charoensin Group · {pad(idx + 1)}
                  </p>
                  <h3 className="mt-1 font-kanit font-normal text-[2.4rem] sm:text-[3.4rem] leading-tight">{v.nameTh}</h3>
                  <p className="mt-2 font-sarabun text-sm sm:text-base text-white/85 max-w-xl">{v.tagline}</p>
                  <div className="mt-5 flex gap-2">
                    <DetailCtrl label="ธุรกิจก่อนหน้า" onClick={() => goTo(idxRef.current - 1)}>
                      <ChevronLeft className="w-[1.1rem] h-[1.1rem]" />
                    </DetailCtrl>
                    <DetailCtrl label="ธุรกิจถัดไป" onClick={() => goTo(idxRef.current + 1)}>
                      <ChevronRight className="w-[1.1rem] h-[1.1rem]" />
                    </DetailCtrl>
                    <DetailCtrl label="ปิดรายละเอียด" onClick={closeDetail} accent btnRef={closeRef}>
                      <X className="w-[1.1rem] h-[1.1rem]" />
                    </DetailCtrl>
                    {v.video && (
                      <DetailCtrl label={`เล่นวิดีโอ ${v.nameTh}`} onClick={() => setVideo(v.video)}>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </DetailCtrl>
                    )}
                  </div>
                </div>

                <div className="w-full max-w-[25rem] flex flex-col gap-2">
                  <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/80 font-inter mt-1">{v.list.title}</p>
                  {v.list.items.map((it) => (
                    <div
                      key={it.name}
                      className="px-4 py-2.5 rounded-[0.6rem] bg-[color-mix(in_srgb,var(--t-mid)_70%,#000)] border border-[rgba(217,203,170,0.18)]"
                    >
                      <strong className="block font-kanit font-normal text-[0.92rem] leading-snug">{it.name}</strong>
                      {it.note && <span className="block text-[0.74rem] leading-relaxed text-white/80 font-sarabun">{it.note}</span>}
                    </div>
                  ))}
                  <a
                    href={v.href}
                    {...(isExternal(v.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-1.5 inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide bg-[var(--t-acc)] hover:bg-[var(--t-mid)] transition-colors"
                  >
                    {v.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* 6-strip wipe */}
              <div aria-hidden className="absolute inset-0 z-[8] grid grid-cols-6 pointer-events-none">
                {Array.from({ length: 6 }, (_, k) => (
                  <i
                    key={k}
                    ref={(el) => {
                      if (el) strips.current[k] = el;
                    }}
                    className="bg-[color-mix(in_srgb,var(--t-base)_55%,#000)] origin-top"
                    style={{ transform: "scaleY(0)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal video={video} onClose={() => setVideo(null)} />
    </section>
  );
}

/* ----------------------------- Tiles & bits ----------------------------- */

function Tile({
  children,
  className = "",
  cover,
  panel,
  logo = false,
}: {
  children: React.ReactNode;
  className?: string;
  cover: (el: HTMLDivElement | null) => void;
  /** Gradient panel colours [from, to] */
  panel?: [string, string];
  logo?: boolean;
}) {
  const bg = logo
    ? "bg-[var(--t-light)] text-[#1F1F1F]"
    : panel
      ? ""
      : "bg-[color-mix(in_srgb,var(--t-base)_88%,#fff)]";
  return (
    <article
      className={`relative isolate overflow-hidden rounded-[0.85rem] ${bg} ${className}`}
      style={panel ? { background: `linear-gradient(150deg, ${panel[0]}, ${panel[1]})` } : undefined}
    >
      <div className="absolute inset-0 flex flex-col">{children}</div>
      <div
        ref={cover}
        aria-hidden
        className="vb-cover absolute inset-0 z-[5] pointer-events-none bg-[color-mix(in_srgb,var(--t-base)_55%,#000)]"
        style={{ transform: "scaleY(1)" }}
      />
    </article>
  );
}

function TileImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="absolute inset-0 object-cover"
    />
  );
}

function Shade() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,20,.82),rgba(20,20,20,.15)_55%,rgba(20,20,20,0))]"
    />
  );
}

function PlayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full border border-[#CCA369] text-white hover:bg-[#CCA369] hover:text-[#1F1F1F] transition-colors"
    >
      <Play className="w-5 h-5 fill-current ml-0.5" />
    </button>
  );
}

function NavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full items-center justify-center text-[0.78rem] font-medium tracking-[0.18em] uppercase bg-[color-mix(in_srgb,var(--t-base)_85%,#fff)] text-white/85 hover:bg-[var(--t-mid)] hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

function DetailCtrl({
  children,
  label,
  onClick,
  accent = false,
  btnRef,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  btnRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid place-items-center w-11 h-11 rounded-[0.6rem] border transition-colors ${
        accent
          ? "bg-[var(--t-acc)] border-[var(--t-acc)] text-white"
          : "bg-[rgba(31,31,31,0.7)] border-white/15 hover:bg-[rgba(107,90,58,0.9)]"
      }`}
    >
      {children}
    </button>
  );
}

function VideoModal({ video, onClose }: { video: VentureVideo | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, onClose]);

  // Portal to <body>: the section sits inside a sticky layer with a transform,
  // which would otherwise trap a position:fixed modal inside it.
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/85"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#B39B6B]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1F1F1F]">
              <h4 className="text-sm sm:text-base font-semibold font-kanit text-white">{video.title}</h4>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="p-1.5 rounded-full bg-white/10 hover:bg-[#B39B6B] text-white hover:text-black transition-colors"
                aria-label="ปิดหน้าต่างวิดีโอ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {video.type === "youtube" ? (
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video src={video.url} controls autoPlay playsInline className="w-full h-full object-contain">
                  เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
                </video>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
