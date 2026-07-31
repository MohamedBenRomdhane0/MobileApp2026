import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as ScreenOrientation from "expo-screen-orientation";

/**
 * Lock screen orientation based on the current app language.
 *
 * - Arabic (`ar`) → portrait-only. Landscape RTL layouts are rarely
 *   tested in real apps and tend to break or look odd.
 * - Other languages (en, fr) → unlock to allow all orientations
 *   (`DEFAULT` = portrait + landscape, controlled by the OS).
 *
 * This hook is global: call it once near the top of the tree
 * (AppBootstrap, RootNavigator, or the language-aware layout).
 *
 * NOTE: orientation locks are best-effort on iPad (where the OS
 * may ignore portrait-only) and have no effect on web.
 */
export function useLanguageOrientation(): void {
  const { i18n } = useTranslation();
  const lang = String(i18n?.language ?? "ar");

  useEffect(() => {
    let cancelled = false;

    async function apply() {
      try {
        const lock =
          lang === "ar"
            ? ScreenOrientation.OrientationLock.PORTRAIT
            : ScreenOrientation.OrientationLock.DEFAULT;

        if (cancelled) return;
        await ScreenOrientation.lockAsync(lock);
      } catch {
        // Web and some iPad configurations don't honor the lock — ignore.
      }
    }

    void apply();

    return () => {
      cancelled = true;
    };
  }, [lang]);
}
