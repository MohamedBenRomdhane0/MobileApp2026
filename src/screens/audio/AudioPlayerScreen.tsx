import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
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
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@theme/ThemeProvider";
import { useGetIconVideosQuery } from "@redux/apis/books/bookApi";
import { PATHS } from "@config/constants/paths";
import { formatMillis } from "@utils/helpers/video.helpers";
import { getAccent, getGradient } from "@utils/helpers/bookScreen.helpers";

type AudioRoute = RouteProp<{ Audio: { bookId: number; iconId: number; materialName?: string } }, "Audio">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

export default function AudioPlayerScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<AudioRoute>();
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

  const audios = useMemo(() => {
    const all = videosResp?.data ?? [];
    return all.filter((item) => {
      const mime = String((item as Record<string, unknown>).mime_type ?? "").toLowerCase();
      const url = String((item as Record<string, unknown>).url ?? "").toLowerCase();
      if (mime.startsWith("audio/")) return true;
      if (/\.(mp3|wav|m4a|aac|ogg|opus)(\?|$)/i.test(url)) return true;
      return false;
    });
  }, [videosResp]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const soundRef = useRef<any | null>(null);

  const activeAudio = audios[activeIndex] ?? null;
  const audioUri = activeAudio ? String((activeAudio as Record<string, unknown>).url ?? "") : "";

  const player = useAudioPlayer(audioUri || undefined, {
    updateInterval: 500,
  });

  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    if (playerStatus) {
      setPositionMillis(Math.round(playerStatus.currentTime * 1000));
      setDurationMillis(Math.round(playerStatus.duration * 1000));
      setIsPlaying(playerStatus.playing);
      setIsBuffering(playerStatus.isBuffering);
    }
  }, [playerStatus]);

  const subjectTitle = useMemo(() => {
    return (
      getTranslatedMaterialLabel(t, params.materialName) || t("video.title")
    );
  }, [params.materialName, t]);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  const togglePlayPause = useCallback(async () => {
    if (playerStatus?.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, playerStatus]);

  const seekForward = useCallback(async () => {
    const currentTime = playerStatus?.currentTime ?? 0;
    const duration = playerStatus?.duration ?? 0;
    player.currentTime = Math.min(currentTime + 15, duration);
  }, [player, playerStatus]);

  const seekBackward = useCallback(async () => {
    const currentTime = playerStatus?.currentTime ?? 0;
    player.currentTime = Math.max(currentTime - 15, 0);
  }, [player, playerStatus]);

  const cycleSpeed = useCallback(async () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackSpeed);
    const next = speeds[(idx + 1) % speeds.length];
    player.playbackRate = next;
    setPlaybackSpeed(next);
  }, [player, playbackSpeed]);

  const selectAudio = useCallback((index: number) => {
    if (index < 0 || index >= audios.length) return;
    setActiveIndex(index);
    setPositionMillis(0);
    setDurationMillis(0);
    setIsPlaying(false);
  }, [audios.length]);

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

  const currentTimeText = useMemo(() => formatMillis(positionMillis), [positionMillis]);
  const totalTimeText = useMemo(() => formatMillis(durationMillis), [durationMillis]);
  const progress = durationMillis > 0 ? Math.min(positionMillis / durationMillis, 1) : 0;

  const textColor = colors.text ?? (isDark ? "#F8FAFC" : "#10233E");
  const mutedColor = colors.muted ?? (isDark ? "#9FB1C8" : "#677B96");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#071326" : "#F4F8FE" }}>
      <StatusBar barStyle="light-content" backgroundColor={matGradient[0]} />
      <View style={{ flex: 1 }}>
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
                {activeAudio ? String((activeAudio as Record<string, unknown>).title ?? t("video.audio")) : t("video.tab_audio")}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.18)" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{t("video.tab_audio")}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color={accentColor} />
          ) : audios.length === 0 ? (
            <>
              <Ionicons name="musical-notes-outline" size={64} color={mutedColor} />
              <Text style={{ color: mutedColor, fontSize: 15, fontWeight: "700", marginTop: 16, textAlign: "center" }}>
                {t("video.no_videos")}
              </Text>
            </>
          ) : (
            <>
              <View style={{
                width: 160, height: 160, borderRadius: 80,
                backgroundColor: isDark ? "rgba(255,122,0,0.12)" : "rgba(255,122,0,0.08)",
                alignItems: "center", justifyContent: "center",
                borderWidth: 2, borderColor: isDark ? "rgba(255,122,0,0.24)" : "rgba(255,122,0,0.16)",
              }}>
                <Ionicons name="musical-notes" size={56} color={accentColor} />
              </View>

              <Text style={{ color: textColor, fontSize: 16, fontWeight: "900", marginTop: 24, textAlign: "center" }} numberOfLines={2}>
                {activeAudio ? String((activeAudio as Record<string, unknown>).title ?? t("video.audio")) : ""}
              </Text>

              <View style={{ width: SCREEN_WIDTH - 64, marginTop: 24 }}>
                <View style={{ height: 4, borderRadius: 2, backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)" }}>
                  <View style={{ height: 4, borderRadius: 2, backgroundColor: accentColor, width: `${progress * 100}%` }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                  <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "700", fontVariant: ["tabular-nums"] }}>{currentTimeText}</Text>
                  <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "700", fontVariant: ["tabular-nums"] }}>{totalTimeText}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 20, marginTop: 28 }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { void cycleSpeed(); }}
                  style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)" }}>
                  <Text style={{ color: accentColor, fontSize: 13, fontWeight: "800" }}>{playbackSpeed}x</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={() => { void seekBackward(); }}
                  style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6" }}>
                  <Ionicons name="play-back" size={22} color={textColor} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.85} onPress={() => { void togglePlayPause(); }}
                  style={{
                    width: 64, height: 64, borderRadius: 32,
                    alignItems: "center", justifyContent: "center",
                    backgroundColor: accentColor,
                    shadowColor: accentColor, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 6,
                  }}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#FFFFFF" style={isPlaying ? undefined : { marginLeft: 3 }} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={() => { void seekForward(); }}
                  style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6" }}>
                  <Ionicons name="play-forward" size={22} color={textColor} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={goBack}
                  style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6" }}>
                  <Ionicons name="close" size={20} color={textColor} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {audios.length > 1 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <Text style={{ color: textColor, fontSize: 15, fontWeight: "900", marginBottom: 10, textAlign: isRTL ? "right" : "left" }}>
              {t("video.more")}
            </Text>
            {audios.map((item, index) => {
              const isActive = index === activeIndex;
              const itemTitle = String((item as Record<string, unknown>).title ?? t("video.audio"));
              return (
                <TouchableOpacity
                  key={String((item as Record<string, unknown>).id ?? index)}
                  activeOpacity={0.9}
                  onPress={() => selectAudio(index)}
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center", padding: 12, marginBottom: 8,
                    borderRadius: 14,
                    backgroundColor: isActive
                      ? (isDark ? "rgba(255,122,0,0.14)" : "rgba(255,122,0,0.08)")
                      : (isDark ? "#0D1E36" : "#FFFFFF"),
                    borderWidth: 1,
                    borderColor: isActive ? accentColor : (isDark ? "rgba(148,163,184,0.20)" : "rgba(110,138,178,0.16)"),
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 10,
                    alignItems: "center", justifyContent: "center",
                    backgroundColor: isActive ? accentColor : (isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6"),
                  }}>
                    <Ionicons name={isActive && isPlaying ? "pause" : "play"} size={18} color={isActive ? "#FFFFFF" : mutedColor} />
                  </View>
                  <Text style={{ flex: 1, marginHorizontal: 10, color: textColor, fontSize: 13, fontWeight: "700", textAlign: isRTL ? "right" : "left" }} numberOfLines={1}>
                    {itemTitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
