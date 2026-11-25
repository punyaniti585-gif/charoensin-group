/**
 * Site languages for the Navbar dropdown, the mobile drawer and the
 * full-screen menu. Add a language by appending an entry (plus its strings in
 * src/i18n) — every switcher renders from this list.
 *  - code  : BCP 47 tag, written to <html lang> (drives the font stacks)
 *  - label : short chip text (Navbar)
 *  - name  : native name (dropdown + full-screen menu)
 */
export const LANGUAGES = [
  { code: "th", label: "TH", name: "ไทย" },
  { code: "en", label: "EN", name: "English" },
  { code: "zh-CN", label: "简", name: "简体中文" },
  { code: "zh-TW", label: "繁", name: "繁體中文" },
  { code: "ja", label: "JA", name: "日本語" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "th";

/** Missing strings fall back to this language, then to Thai (the source copy) */
export const FALLBACK_LANGUAGE: LanguageCode = "en";

/** localStorage key holding the visitor's chosen language */
export const LANGUAGE_STORAGE_KEY = "csg-lang";

/** Window event fired when the language changes (detail: LanguageCode) */
export const LANGUAGE_EVENT = "csg:language-change";

/** Older saved values → current codes ("zh" was the single Chinese option) */
const LEGACY: Record<string, LanguageCode> = { zh: "zh-CN" };

export function toLanguageCode(value: string | null | undefined): LanguageCode | null {
  if (!value) return null;
  if (LANGUAGES.some((l) => l.code === value)) return value as LanguageCode;
  return LEGACY[value] ?? null;
}
