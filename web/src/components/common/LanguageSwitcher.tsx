"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_EVENT,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  type LanguageCode,
} from "@/data/languages";

/** Chosen language, persisted in localStorage and shared across instances */
export function useLanguage() {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved as LanguageCode);
    const onChange = (e: Event) => setLangState((e as CustomEvent<LanguageCode>).detail);
    window.addEventListener(LANGUAGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_EVENT, onChange);
  }, []);

  const setLang = useCallback((code: LanguageCode) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    setLangState(code);
    window.dispatchEvent(new CustomEvent<LanguageCode>(LANGUAGE_EVENT, { detail: code }));
  }, []);

  return [lang, setLang] as const;
}

/**
 * Language switcher.
 *  - variant "dropdown": "TH ▾" button; opens on hover or click (desktop top bar)
 *  - variant "inline"  : TH / EN / ZH segmented buttons (mobile drawer)
 */
export default function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: {
  variant?: "dropdown" | "inline";
  className?: string;
}) {
  const [lang, setLang] = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div role="radiogroup" aria-label="เลือกภาษา" className={`inline-flex rounded-full border border-[#B39B6B]/40 bg-white/70 p-0.5 ${className}`}>
        {LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={active}
              title={l.name}
              onClick={() => setLang(l.code)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold font-inter transition-colors ${
                active ? "bg-[#6B5A3A] text-white" : "text-[#6B5A3A] hover:bg-[#B39B6B]/15"
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`ภาษา: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 py-1 font-inter font-semibold text-[#1F1F1F]/80 hover:text-[#6B5A3A] transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-[#B39B6B]" aria-hidden />
        <span>{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="เลือกภาษา"
          className="absolute right-0 top-full z-[60] pt-1.5 w-40"
        >
          <div className="rounded-xl bg-white shadow-xl border border-[#B39B6B]/25 py-1.5">
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-xs text-left transition-colors ${
                    active ? "text-[#6B5A3A] bg-[#F2EFE9]" : "text-[#1F1F1F]/85 hover:bg-[#F2EFE9] hover:text-[#6B5A3A]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-inter font-semibold w-6">{l.label}</span>
                    <span>{l.name}</span>
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-[#B39B6B]" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
