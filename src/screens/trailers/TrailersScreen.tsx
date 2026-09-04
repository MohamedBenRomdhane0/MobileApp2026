import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { VideoView, useVideoPlayer } from "expo-video";

import { useAppTheme } from "@theme/ThemeProvider";
import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import {
  TRAILERS_UI,
  TRAILERS_HEADER_GRADIENT,
} from "./TrailersScreen.constants";
import {
  getTrailersPalette,
  trailersStyles as styles,
} from "./TrailersScreen.styles";
import type { TrailersScreenNav } from "./TrailersScreen.type";
import { useTrailersScreen } from "@hooks/useTrailersScreen";
import { TeacherTrailerCard } from "@components/trailers/TeacherTrailerCard";

const { width: W, height: H } = Dimensions.get("window");

export default function TrailersScreen() {
  const navigation = useNavigation<TrailersScreenNav>();
  const insets     = useSafeAreaInsets();
  const { t }      = useTranslation();
  const { colors, mode } = useAppTheme();
  const palette = getTrailersPalette(colors, mode === "dark");

  const {
    materials,
    filteredItems,
    activeMaterialId,
    selectedTeachers,
    selectedCount,
    setActiveMaterialId,
    toggleTeacher,
    isLoading,
    isError,
    refetch,
  } = useTrailersScreen();

  const [playerUrl,     setPlayerUrl]     = useState<string | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  const player = useVideoPlayer(playerUrl, (p) => {
    p.loop = false;
    p.volume = 1.0;
  });

  const openPlayer = useCallback((url: string) => {
    if (!url) return;
    setPlayerUrl(url);
    setPlayerVisible(true);
  }, []);

  const closePlayer = useCallback(async () => {
    try {
      player.pause();
    } catch {}
    setPlayerVisible(false);
    setPlayerUrl(null);
  }, [player]);

  const openProfile = useCallback(
    (teacherId: number) => {
      if (!teacherId) return;
      navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId });
    },
    [navigation]
  );

  const confirmSelection = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openSchedule = useCallback(() => {
    navigation.navigate(PATHS.TABS.MEETINGS as never);
  }, [navigation]);

  if (isLoading && filteredItems.length === 0) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg, flex: 1 }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.stateText, { color: palette.muted }]}>
          {t(TRAILERS_UI.loading)}
        </Text>
      </View>
    );
  }

  if (isError && filteredItems.length === 0) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg, flex: 1 }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <Ionicons name="cloud-offline-outline" size={44} color={palette.danger} />
        <Text style={[styles.stateText, { color: palette.text }]}>
          {t(TRAILERS_UI.genericError)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={refetch}
          style={[styles.retryBtn, { backgroundColor: palette.primary }]}
        >
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.retryBtnText}>{t(TRAILERS_UI.retry)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ── */}
        <LinearGradient
          colors={TRAILERS_HEADER_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerGlow} />

          {/* TOP ROW: back LEFT, schedule RIGHT */}
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scheduleBtn}
              activeOpacity={0.85}
              onPress={openSchedule}
            >
              <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
              <Text style={styles.scheduleBtnText}>{t(TRAILERS_UI.scheduleBtn)}</Text>
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <View style={styles.titleBlock}>
            <Text style={styles.screenTitle}>{t(TRAILERS_UI.screenTitle)}</Text>
            <Text style={styles.screenSubtitle}>{t(TRAILERS_UI.screenSubtitle)}</Text>
          </View>

          {/* CHOOSE LABEL + CONFIRM */}
          <View style={styles.confirmBar}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.confirmBtn,
                selectedCount === 0 && styles.confirmBtnDisabled,
              ]}
              onPress={confirmSelection}
              disabled={selectedCount === 0}
            >
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              <Text style={styles.confirmBtnText}>{t(TRAILERS_UI.confirmBtn)}</Text>
            </TouchableOpacity>

            <View style={styles.chooseLabelWrap}>
              <Text style={styles.chooseLabel}>
                {t(TRAILERS_UI.chooseTitle)}
              </Text>
              <Text style={styles.chooseSub}>
                {t(TRAILERS_UI.chooseSub)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── MATERIAL FILTER CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: activeMaterialId === 0 ? palette.primary : palette.card,
                borderColor:     activeMaterialId === 0 ? palette.primary : palette.border,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => setActiveMaterialId(0)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: activeMaterialId === 0 ? "#FFFFFF" : palette.muted },
              ]}
            >
              {t(TRAILERS_UI.filterAll)}
            </Text>
          </TouchableOpacity>

          {materials.map((material) => {
            const isActive = activeMaterialId === material.id;
            const emoji    = getMaterialEmoji(material.name ?? "");
            return (
              <TouchableOpacity
                key={material.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? palette.primary : palette.card,
                    borderColor:     isActive ? palette.primary : palette.border,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() => setActiveMaterialId(isActive ? 0 : material.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? "#FFFFFF" : palette.muted },
                  ]}
                >
                  {emoji} {material.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SELECTED COUNT BADGE ── */}
        {selectedCount > 0 && (
          <View style={styles.selectedBanner}>
            <View style={styles.selectedBannerBadge}>
              <Text style={styles.selectedBannerBadgeText}>{selectedCount}</Text>
            </View>
            <Text style={[styles.selectedBannerText, { color: palette.primary }]}>
              {t(TRAILERS_UI.confirmBtn)}
            </Text>
          </View>
        )}

        {/* ── GRID ── */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="videocam-outline" size={40} color={palette.muted} />
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              {t(TRAILERS_UI.emptyTitle)}
            </Text>
            <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
              {t(TRAILERS_UI.emptySubtitle)}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <TeacherTrailerCard
                key={item.meetingId}
                item={item}
                isSelected={!!selectedTeachers[item.meetingId]}
                onToggle={toggleTeacher}
                onOpenProfile={openProfile}
                onPlayTrailer={openPlayer}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── VIDEO PLAYER MODAL ── */}
      <Modal
        visible={playerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closePlayer}
      >
        <View style={styles.playerOverlay}>
          <TouchableOpacity
            style={styles.playerBackdrop}
            activeOpacity={1}
            onPress={closePlayer}
          />

          <View style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <TouchableOpacity
                style={styles.playerCloseBtn}
                activeOpacity={0.85}
                onPress={closePlayer}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {playerUrl ? (
              <VideoView
                player={player}
                style={styles.playerVideo}
                contentFit="contain"
              />
            ) : (
              <View style={styles.playerNoVideo}>
                <Ionicons name="videocam-off-outline" size={36} color="rgba(255,255,255,0.4)" />
                <Text style={styles.playerNoVideoText}>لا يوجد تريلر</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}