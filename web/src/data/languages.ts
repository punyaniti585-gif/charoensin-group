/**
 * Site languages for the Navbar language switcher.
 * Add a new language by appending an entry — the switcher renders from this list.
 */
export const LANGUAGES = [
  { code: "th", label: "TH", name: "ภาษาไทย" },
  { code: "en", label: "EN", name: "English" },
  { code: "zh", label: "ZH", name: "中文" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "th";

/** localStorage key holding the visitor's chosen language */
export const LANGUAGE_STORAGE_KEY = "csg-lang";

/** Window event fired when the language changes (detail: LanguageCode) */
export const LANGUAGE_EVENT = "csg:language-change";
