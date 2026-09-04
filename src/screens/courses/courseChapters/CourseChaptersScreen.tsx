import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { VideoView, useVideoPlayer } from "expo-video";

import { useAppTheme } from "@theme/ThemeProvider";
import { createCourseChaptersStyles } from "./CourseChaptersScreen.styles";
import {
  type CourseChaptersTab,
  COURSE_CHAPTERS_UI,
} from "./CourseChaptersScreen.constants";

import { useGetCourseByIdQuery } from "@redux/apis/courses/coursesApi";
import type { CourseChapterUI } from "@redux/apis/courses/coursesApi.type";

import type { CourseChaptersRouteProp } from "./CourseChaptersScreen.types";

const COURSE_PLACEHOLDER = require("@assets/images/default_courses.png");

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type EmptyStateProps = {
  icon: IoniconName;
  text: string;
  styles: ReturnType<typeof createCourseChaptersStyles>;
  primaryColor: string;
};

type HeaderProps = {
  styles: ReturnType<typeof createCourseChaptersStyles>;
  title: string;
  courseTitle: string;
  courseCoverUrl: string | null | undefined;
  teacher: {
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
  activeTab: CourseChaptersTab;
  primaryColor: string;
  gradientColors: [string, string, string];
  insetTop: number;
  t: (key: string) => string;
  onBack: () => void;
  onTabChange: (tab: CourseChaptersTab) => void;
};

type ChapterCardProps = {
  item: CourseChapterUI;
  index: number;
  isExpanded: boolean;
  styles: ReturnType<typeof createCourseChaptersStyles>;
  primaryColor: string;
  t: (key: string) => string;
  onToggle: (id: number) => void;
};

function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function getInitials(fullName?: string | null) {
  const value = String(fullName ?? "").trim();
  if (!value) return "؟";

  const parts = value.split(/\s+/).filter(Boolean);
  const initials = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();

  return initials || "؟";
}

function getHeaderGradientColors(
  isDark: boolean,
  headerColor: string
): [string, string, string] {
  return isDark
    ? ["#0B1220", headerColor, "#060B14"]
    : ["#153A6B", headerColor, "#091D36"];
}

function getCoverSource(coverUrl?: string | null) {
  return coverUrl ? { uri: coverUrl } : COURSE_PLACEHOLDER;
}

function EmptyState({ icon, text, styles, primaryColor }: EmptyStateProps) {
  return (
    <View style={styles.centerState}>
      <Ionicons name={icon} size={32} color={primaryColor} />
      <Text style={styles.centerText}>{text}</Text>
    </View>
  );
}

function CourseChaptersHeader({
  styles,
  title,
  courseTitle,
  courseCoverUrl,
  teacher,
  activeTab,
  primaryColor,
  gradientColors,
  insetTop,
  t,
  onBack,
  onTabChange,
}: HeaderProps) {
  const coverSource = getCoverSource(courseCoverUrl);

  return (
    <>
      <View style={styles.headerShell}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.08, y: 0.05 }}
          end={{ x: 0.95, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insetTop, 14) }]}
        >
          <View style={styles.headerGlowA} />
          <View style={styles.headerGlowB} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onBack}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>

            <View style={styles.headerRightSlot} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.summaryWrap}>
        <View style={styles.summaryCard}>
          <Image source={coverSource} style={styles.summaryCover} />

          <View style={styles.summaryRight}>
            <Text numberOfLines={2} style={styles.summaryTitle}>
              {courseTitle || t("common.unnamed")}
            </Text>

            <Text numberOfLines={2} style={styles.summaryHint}>
              {t(COURSE_CHAPTERS_UI.summaryHint)}
            </Text>

            {teacher ? (
              <View style={styles.teacherRow}>
                {teacher.avatarUrl ? (
                  <Image
                    source={{ uri: teacher.avatarUrl }}
                    style={styles.teacherAvatar}
                  />
                ) : (
                  <View style={styles.teacherFallback}>
                    <Text style={styles.teacherFallbackText}>
                      {getInitials(teacher.fullName)}
                    </Text>
                  </View>
                )}

                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherLabel}>
                    {t(COURSE_CHAPTERS_UI.teacherLabel)}
                  </Text>
                  <Text numberOfLines={1} style={styles.teacherName}>
                    {teacher.fullName}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.tabsWrap}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.tabBtn,
              activeTab === "content" ? styles.tabBtnActive : null,
            ]}
            onPress={() => onTabChange("content")}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={activeTab === "content" ? "#FFFFFF" : primaryColor}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "content" ? styles.tabTextActive : null,
              ]}
            >
              {t(COURSE_CHAPTERS_UI.contentTab)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.tabBtn,
              activeTab === "documents" ? styles.tabBtnActive : null,
            ]}
            onPress={() => onTabChange("documents")}
          >
            <Ionicons
              name="document-text-outline"
              size={18}
              color={activeTab === "documents" ? "#FFFFFF" : primaryColor}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "documents" ? styles.tabTextActive : null,
              ]}
            >
              {t(COURSE_CHAPTERS_UI.docsTab)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.tabBtn,
              activeTab === "quiz" ? styles.tabBtnActive : null,
            ]}
            onPress={() => onTabChange("quiz")}
          >
            <Ionicons
              name="game-controller-outline"
              size={18}
              color={activeTab === "quiz" ? "#FFFFFF" : primaryColor}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "quiz" ? styles.tabTextActive : null,
              ]}
            >
              {t(COURSE_CHAPTERS_UI.quizTab)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "content" ? (
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {t(COURSE_CHAPTERS_UI.sectionTitle)}
          </Text>
        </View>
      ) : null}
    </>
  );
}

function ChapterVideo({ uri, styles }: { uri: string; styles: ReturnType<typeof createCourseChaptersStyles> }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="contain"
      nativeControls
    />
  );
}

function ChapterCard({
  item,
  index,
  isExpanded,
  styles,
  primaryColor,
  t,
  onToggle,
}: ChapterCardProps) {
  return (
    <View style={styles.chapterCard}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.chapterHeader}
        onPress={() => onToggle(item.id)}
      >
        <View style={styles.chapterIndexCircle}>
          <Text style={styles.chapterIndexText}>{index + 1}</Text>
        </View>

        <View style={styles.chapterTitleWrap}>
          <Text numberOfLines={2} style={styles.chapterTitle}>
            {item.title || t("common.unnamed")}
          </Text>
        </View>

        <View
          style={[
            styles.chevronCircle,
            isExpanded ? styles.chevronCircleOpen : null,
          ]}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={isExpanded ? "#FFFFFF" : primaryColor}
          />
        </View>
      </TouchableOpacity>

      {isExpanded ? (
        <View style={styles.chapterBody}>
          {item.description ? (
            <Text style={styles.chapterDesc}>{item.description}</Text>
          ) : (
            <Text style={styles.chapterNoDesc}>
              {t(COURSE_CHAPTERS_UI.noDesc)}
            </Text>
          )}

          {(item.videoUrls ?? []).length ? (
            item.videoUrls.map((uri, videoIndex) => (
              <View key={`${item.id}_${videoIndex}`} style={styles.videoWrap}>
                <ChapterVideo uri={uri} styles={styles} />
              </View>
            ))
          ) : (
            <Text style={styles.chapterNoDesc}>
              {t(COURSE_CHAPTERS_UI.noVideos)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

export default function CourseChaptersScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<CourseChaptersRouteProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createCourseChaptersStyles(colors, isDark),
    [colors, isDark]
  );

  const courseId = toValidId(route.params?.courseId);

  const {
    data: course,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCourseByIdQuery({ courseId }, { skip: !courseId });

  const [activeTab, setActiveTab] = useState<CourseChaptersTab>("content");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const chapters = course?.chapters ?? [];
  const teacher = course?.teacher ?? null;
  const headerGradientColors = getHeaderGradientColors(isDark, colors.header);
  const title = t(COURSE_CHAPTERS_UI.headerTitle);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTabChange = useCallback((tab: CourseChaptersTab) => {
    setActiveTab(tab);
  }, []);

  const handleToggleChapter = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderChapter = useCallback(
    ({ item, index }: { item: CourseChapterUI; index: number }) => (
      <ChapterCard
        item={item}
        index={index}
        isExpanded={expandedId === item.id}
        styles={styles}
        primaryColor={colors.primary}
        t={t}
        onToggle={handleToggleChapter}
      />
    ),
    [expandedId, styles, colors.primary, t, handleToggleChapter]
  );

  const dataToRender = activeTab === "content" ? chapters : [];

  const footer =
    activeTab === "documents" ? (
      <EmptyState
        icon="folder-open-outline"
        text={t(COURSE_CHAPTERS_UI.emptyDocs)}
        styles={styles}
        primaryColor={colors.primary}
      />
    ) : activeTab === "quiz" ? (
      <EmptyState
        icon="game-controller-outline"
        text={t(COURSE_CHAPTERS_UI.emptyQuiz)}
        styles={styles}
        primaryColor={colors.primary}
      />
    ) : null;

  const header = (
    <CourseChaptersHeader
      styles={styles}
      title={title}
      courseTitle={course?.title ?? ""}
      courseCoverUrl={course?.coverUrl}
      teacher={teacher}
      activeTab={activeTab}
      primaryColor={colors.primary}
      gradientColors={headerGradientColors}
      insetTop={insets.top}
      t={t}
      onBack={handleGoBack}
      onTabChange={handleTabChange}
    />
  );

  if (isLoading && !course) {
    return (
      <View style={styles.root}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {header}
        <View style={styles.centerState}>
          <ActivityIndicator />
          <Text style={styles.centerText}>
            {t(COURSE_CHAPTERS_UI.loading)}
          </Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.root}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {header}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={refetch}
          style={styles.retryBox}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.retryText}>
            {t(COURSE_CHAPTERS_UI.tapToRetry)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.root}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {header}
        <EmptyState
          icon="alert-circle-outline"
          text={t(COURSE_CHAPTERS_UI.emptyCourse)}
          styles={styles}
          primaryColor={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FlatList
        data={dataToRender}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderChapter}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={
          activeTab === "content" ? (
            <EmptyState
              icon="layers-outline"
              text={t(COURSE_CHAPTERS_UI.emptyContent)}
              styles={styles}
              primaryColor={colors.primary}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={Boolean(isFetching && !isLoading)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}