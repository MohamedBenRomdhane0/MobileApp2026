import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GLOBAL_VARIABLES } from "@config/constants/globalVariables";
import { setLanguageDirection } from "@utils/localStorage/storage";
import ar from "@locales/ar";
import en from "@locales/en";
import fr from "@locales/fr";

const LANG_STORAGE_KEY = "language";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
} as const;

const DEFAULT_LANG = GLOBAL_VARIABLES.LANGUAGES.SHORT.FR;
const SUPPORTED_LANGS = Object.keys(resources);

export function isRTL(lang: string): boolean {
  return lang === GLOBAL_VARIABLES.LANGUAGES.SHORT.AR;
}

function normalizeLang(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_LANG;
  const trimmed = value.trim();
  return SUPPORTED_LANGS.includes(trimmed) ? trimmed : DEFAULT_LANG;
}

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  compatibilityJSON: "v4",
  interpolation: { escapeValue: false },
});

export async function hydrateI18nLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    const lang = normalizeLang(saved);
    if (i18n.language !== lang) {
      await i18n.changeLanguage(lang);
    }
    // Apply the persisted language's text direction. On native, this
    // affects new screens immediately; a full RTL flip requires a
    // restart on iOS/Android (RN limitation) but works live on web.
    setLanguageDirection(lang);
  } catch {
    // ignore (keep default lang)
  }
}

export async function setAppLanguage(lang: string) {
  const safe = normalizeLang(lang);
  const previous = i18n.language;
  await AsyncStorage.setItem(LANG_STORAGE_KEY, safe);
  await i18n.changeLanguage(safe);
  // Flip the text direction (RTL for ar, LTR otherwise). This is what was
  // missing before: switching to/from Arabic did not actually change the
  // layout direction, so the UI stayed LTR even when translations were
  // Arabic. On native, `I18nManager.forceRTL` only takes effect after an
  // app restart — the caller should prompt the user to reload.
  setLanguageDirection(safe);
  return { previous, current: safe, rtlChanged: isRTL(previous) !== isRTL(safe) };
}

export default i18n;
