import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Linking,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@theme/ThemeProvider";
import { useGetIconVideosQuery } from "@redux/apis/books/bookApi";
import { PATHS } from "@config/constants/paths";
import { getAccent, getGradient } from "@utils/helpers/bookScreen.helpers";

type DocsRoute = RouteProp<{ Docs: { bookId: number; iconId: number; materialName?: string } }, "Docs">;

function normalizeMaterialKey(rawValue?: string | null): string {
  return String(rawValue ?? "")
    .trim()
    .toLowerCase()
    .replace(/^mat[_-\s]*/i, "")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

function getTranslatedMaterialLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  rawValue?: string | null
): string {
  const normalizedKey = normalizeMaterialKey(rawValue);
  if (!normalizedKey) return "";
  const translated = t(`material.${normalizedKey}`, { defaultValue: "" });
  if (translated && translated !== `material.${normalizedKey}`) return translated;
  return String(rawValue ?? "").trim();
}

function getDocIcon(url: string): { name: string; color: string } {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return { name: "document-text", color: "#EF4444" };
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return { name: "document", color: "#2563EB" };
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) return { name: "grid", color: "#22C55E" };
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return { name: "easel", color: "#F59E0B" };
  return { name: "document-attach", color: "#6366F1" };
}

export default function DocsViewerScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<DocsRoute>();
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;

  const params = route.params ?? {};
  const iconId = params.iconId;
  const bookId = params.bookId;

  const materialKey = normalizeMaterialKey(params.materialName);
  const matAccent = getAccent(materialKey, null);
  const matGradient = getGradient(materialKey, null);

  const accentColor = matAccent;

  const { data: videosResp, isLoading } = useGetIconVideosQuery(iconId, {
    skip: iconId <= 0,
  });

  const docs = useMemo(() => {
    const all = videosResp?.data ?? [];
    return all.filter((item) => {
      const url = String((item as Record<string, unknown>).url ?? "").toLowerCase();
      return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)(\?|$)/i.test(url);
    });
  }, [videosResp]);

  const subjectTitle = useMemo(() => {
    return getTranslatedMaterialLabel(t, params.materialName) || t("video.tab_docs");
  }, [params.materialName, t]);

  const goBack = useCallback(() => {
    if (bookId > 0) {
      navigation.navigate(PATHS.APP.BOOKS_FILE, { bookId });
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate(PATHS.APP.TABS);
  }, [bookId, navigation]);

  const openDoc = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // noop
    }
  }, []);

  const textColor = colors.text ?? (isDark ? "#F8FAFC" : "#10233E");
  const mutedColor = colors.muted ?? (isDark ? "#9FB1C8" : "#677B96");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#071326" : "#F4F8FE" }}>
      <StatusBar barStyle="light-content" backgroundColor={matGradient[0]} />

      <LinearGradient
        colors={[matGradient[0], matGradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
      >
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => { void goBack(); }}
            style={{
              width: 38, height: 38, borderRadius: 12,
              alignItems: "center", justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.16)",
            }}
          >
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "900", textAlign: isRTL ? "right" : "left" }} numberOfLines={1}>
              {subjectTitle}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", marginTop: 2, textAlign: isRTL ? "right" : "left" }} numberOfLines={1}>
              {docs.length} {t("video.tab_docs")}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{t("video.tab_docs")}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={accentColor} />
          </View>
        ) : docs.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="document-text-outline" size={64} color={mutedColor} />
            <Text style={{ color: mutedColor, fontSize: 15, fontWeight: "700", marginTop: 16, textAlign: "center" }}>
              {t("video.no_videos")}
            </Text>
          </View>
        ) : (
          docs.map((item, index) => {
            const url = String((item as Record<string, unknown>).url ?? "");
            const title = String((item as Record<string, unknown>).title ?? url.split("/").pop() ?? t("video.tab_docs"));
            const docInfo = getDocIcon(url);

            return (
              <TouchableOpacity
                key={String((item as Record<string, unknown>).id ?? index)}
                activeOpacity={0.9}
                onPress={() => openDoc(url)}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center", padding: 14, marginBottom: 10,
                  borderRadius: 14,
                  backgroundColor: isDark ? "#0D1E36" : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(148,163,184,0.20)" : "rgba(110,138,178,0.16)",
                }}
              >
                <View style={{
                  width: 46, height: 46, borderRadius: 12,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: isDark ? docInfo.color + "20" : docInfo.color + "14",
                }}>
                  <Ionicons name={docInfo.name as any} size={22} color={docInfo.color} />
                </View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={{ color: textColor, fontSize: 14, fontWeight: "800", textAlign: isRTL ? "right" : "left" }} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "600", marginTop: 2, textAlign: isRTL ? "right" : "left" }} numberOfLines={1}>
                    {url.split("/").pop()}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={18} color={mutedColor} />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </SafeAreaView>
  );
}
