import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { setAppLanguage } from "../../../i18n";

import { createLanguageSwitcherStyles } from "./LanguageSwitcher.styles";

type LangCode = "ar" | "fr" | "en";

type LangOption = {
  code: LangCode;
  labelKey: string;
  short: string;
  nativeName: string;
  flag: string;
};

const LANG_OPTIONS: LangOption[] = [
  { code: "ar", labelKey: "home.language_arabic",  short: "AR", nativeName: "العربية",   flag: "🇹🇳" },
  { code: "fr", labelKey: "home.language_french",  short: "FR", nativeName: "Français",  flag: "🇫🇷" },
  { code: "en", labelKey: "home.language_english", short: "EN", nativeName: "English",   flag: "🇬🇧" },
];

function isSupportedLang(value: string): value is LangCode {
  return value === "ar" || value === "fr" || value === "en";
}

type LanguageSwitcherProps = {
  /** Optional override for the chip's container color (used in dark headers). */
  backgroundColor?: string;
  /** Foreground color for the chip text/icon. Defaults to white. */
  foregroundColor?: string;
};

export default function LanguageSwitcher({
  backgroundColor = "rgba(255,255,255,0.15)",
  foregroundColor = "#FFFFFF",
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rawLang = String(i18n?.language ?? "ar");
  const current: LangCode = isSupportedLang(rawLang) ? rawLang : "ar";

  const isRTL = (i18n?.language ?? "ar") === "ar";
  const styles = useMemo(
    () => createLanguageSwitcherStyles({ open, isRTL }),
    [open, isRTL]
  );

  const onSelect = useCallback(
    async (code: LangCode) => {
      if (code === current) {
        setOpen(false);
        return;
      }
      const result = await setAppLanguage(code);
      setOpen(false);
      // On native, I18nManager.forceRTL only takes effect after an app
      // restart. Surface a friendly note (could be wired to a toast later).
      if (result?.rtlChanged && Platform.OS !== "web") {
        // eslint-disable-next-line no-console
        // Note: on iOS/Android, I18nManager.forceRTL only takes effect after
        // an app restart. The translation strings update immediately; the
        // layout direction needs a reload.
        void t("home.language_changed");
      }
    },
    [current]
  );

  const active = LANG_OPTIONS.find((o) => o.code === current) ?? LANG_OPTIONS[0];

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[styles.chip, { backgroundColor }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={t("home.choose_language")}
        accessibilityHint={t("home.language_arabic") + " / " + t("home.language_french") + " / " + t("home.language_english")}
      >
        <Ionicons name="globe-outline" size={16} color={foregroundColor} />
        <Text style={[styles.chipText, { color: foregroundColor }]} numberOfLines={1}>
          {active.short}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={12}
          color={foregroundColor}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheetWrap} onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {t("home.choose_language")}
                </Text>
                <TouchableOpacity
                  onPress={() => setOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.sheetClose}
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              {LANG_OPTIONS.map((opt) => {
                const isActive = opt.code === current;
                return (
                  <TouchableOpacity
                    key={opt.code}
                    activeOpacity={0.85}
                    onPress={() => onSelect(opt.code)}
                    style={[styles.row, isActive && styles.rowActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                  >
                    <View style={styles.rowLeft}>
                      <Text style={styles.rowFlag}>{opt.flag}</Text>
                      <View>
                        <Text style={styles.rowLabel}>
                          {t(opt.labelKey)}
                        </Text>
                        <Text style={styles.rowNative}>{opt.nativeName}</Text>
                      </View>
                    </View>

                    {isActive ? (
                      <Ionicons name="checkmark-circle" size={22} color="#22BEC8" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
