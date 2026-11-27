"use client";

import { useCallback, useMemo } from "react";
import { useLanguage } from "@/components/common/LanguageSwitcher";
import { FALLBACK_LANGUAGE, type LanguageCode } from "@/data/languages";
import { homeDict, type HomeDict } from "./home";
import { translateMenuLabel } from "./menu";
import { aboutDict, type AboutDict } from "./about";

/* Translation hooks. The page is exported as static Thai HTML; on mount each
   hook reads the saved language and re-renders in it, and every instance
   follows later switches through the shared language event. */

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null;

/** Deep merge; arrays merge by index, so a partial array keeps the rest */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    return base.map((b, i) => merge(b, over[i])) as T;
  }
  if (isPlain(base) && isPlain(over) && !Array.isArray(base)) {
    const out: Plain = { ...base };
    for (const k of Object.keys(over)) out[k] = merge((base as Plain)[k], over[k]);
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

const cache = new Map<LanguageCode, HomeDict>();

/** Home copy for a language: chosen → English → Thai (never throws) */
export function getHomeCopy(lang: LanguageCode): HomeDict {
  let hit = cache.get(lang);
  if (!hit) {
    hit = lang === "th" ? homeDict.th : merge(merge(homeDict.th, homeDict[FALLBACK_LANGUAGE]), homeDict[lang]);
    cache.set(lang, hit);
  }
  return hit;
}

/** Home page strings in the visitor's language */
export function useHomeCopy() {
  const [lang] = useLanguage();
  return useMemo(() => getHomeCopy(lang), [lang]);
}

const aboutCache = new Map<LanguageCode, AboutDict>();

/** About page (V.2) copy for a language: chosen → English → Thai */
export function getAboutCopy(lang: LanguageCode): AboutDict {
  let hit = aboutCache.get(lang);
  if (!hit) {
    hit =
      lang === "th"
        ? aboutDict.th
        : merge(merge(aboutDict.th, aboutDict[FALLBACK_LANGUAGE as Exclude<LanguageCode, "th">]), aboutDict[lang]);
    aboutCache.set(lang, hit);
  }
  return hit;
}

/** About page strings in the visitor's language */
export function useAboutCopy() {
  const [lang] = useLanguage();
  return { lang, copy: useMemo(() => getAboutCopy(lang), [lang]) };
}

/** Main-menu label translator: tm("เกี่ยวกับเรา") → "About Us" / "关于我们" … */
export function useMenuT() {
  const [lang] = useLanguage();
  return useCallback((label: string) => translateMenuLabel(label, lang), [lang]);
}

/** "{y}"-style placeholders */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));

/* ---------------- Shared phrase translator ----------------
   t(thai)            → translated text (chosen → English → Thai)
   tf(thai, {n: 3})   → same, with {placeholders} filled
   date(iso)          → localised date (th: Buddhist era; others: Gregorian)
   name(thai, en)     → company / brand name: th = Thai; zh / ja = the phrase
                         table if present, else the registered English name */
const DATE_LOCALE: Record<LanguageCode, string> = {
  th: "th-TH-u-ca-buddhist",
  en: "en-GB",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  ja: "ja-JP",
};

export function useT() {
  const [lang] = useLanguage();
  return useMemo(() => {
    const t = (s: string) => translateMenuLabel(s, lang);
    return {
      lang,
      t,
      tf: (s: string, values: Record<string, string | number>) => fill(t(s), values),
      date: (iso: string) =>
        new Date(`${iso}T00:00:00`).toLocaleDateString(DATE_LOCALE[lang], { day: "numeric", month: "short", year: "numeric" }),
      name: (thai: string, en?: string) => {
        if (lang === "th") return thai;
        const hit = translateMenuLabel(thai, lang);
        return hit !== thai ? hit : en ?? thai;
      },
    };
  }, [lang]);
}
