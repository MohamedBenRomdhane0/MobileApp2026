import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createCoursesStyles } from "./CoursesScreen.styles";
import { COURSES_SEARCH, COURSES_UI } from "./CoursesScreen.constants";

import { PATHS } from "@config/constants/paths";
import {
  useGetCoursesQuery,
  useGetFavoriteCoursesQuery,
  useToggleCourseFavoriteMutation,
} from "@redux/apis/courses/coursesApi";
import type { CourseListItemUI } from "@redux/apis/courses/coursesApi.type";
import type { CoursesRouteParams } from "./CoursesScreen.types";

import { toValidId, getCourseMaterialLabel } from "@utils/helpers/courses.helpers";

const COURSE_PLACEHOLDER = require("@assets/images/default_courses.png");

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export default function CoursesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = useMemo(() => createCoursesStyles(colors, isDark), [colors, isDark]);

  const params = (route?.params ?? {}) as CoursesRouteParams;
  const levelId = toValidId(params.levelId);
  const materialId = toValidId(params.materialId);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, COURSES_SEARCH.DEBOUNCE_MS);

  const kwTrim = String(keyword ?? "").trim();
  const debouncedTrim = String(debouncedKeyword ?? "").trim();
  const kwLen = kwTrim.length;

  const canSearch =
    debouncedTrim.length === 0 || debouncedTrim.length >= COURSES_SEARCH.MIN_CHARS;

  const coursesQueryArgs = useMemo(
    () => ({
      levelId: levelId || undefined,
      materialId: materialId || undefined,
      keyword: canSearch ? (debouncedTrim || undefined) : undefined,
      page: 1,
      perPage: 20,
      orderBy: "created_at",
      direction: "desc" as const,
    }),
    [levelId, materialId, canSearch, debouncedTrim]
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetCoursesQuery(coursesQueryArgs);

  const favQ = useGetFavoriteCoursesQuery(
    { page: 1, perPage: 1, keyword: undefined },
    { refetchOnMountOrArgChange: false }
  );
  const favoritesCount = favQ.data?.pagination?.total ?? 0;

  const items: CourseListItemUI[] = useMemo(() => data?.items ?? [], [data?.items]);

  const [toggleFav] = useToggleCourseFavoriteMutation();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const openFavorites = useCallback(
    () => navigation.navigate(PATHS.APP.FAVORITE_COURSES),
    [navigation]
  );

  const openCourse = useCallback(
    (courseId: number) => {
      const id = toValidId(courseId);
      if (!id) return;
      navigation.navigate(PATHS.APP.COURSE_CHAPTERS, { courseId: id });
    },
    [navigation]
  );

  const headerGradientColors: [string, string, string] = useMemo(
    () =>
      isDark
        ? ["#0B1220", colors.header, "#060B14"]
        : ["#153A6B", colors.header, "#091D36"],
    [isDark, colors.header]
  );

  const title = useMemo(() => t(COURSES_UI.title), [t]);

  const emptyText = useMemo(() => {
    if (kwLen > 0 && kwLen < COURSES_SEARCH.MIN_CHARS) {
      return t("courses.min_chars", { count: COURSES_SEARCH.MIN_CHARS });
    }
    if (materialId) return t(COURSES_UI.emptyByMaterial);
    return t(COURSES_UI.empty);
  }, [t, kwLen, materialId]);

  const onToggleFav = useCallback(
    (courseId: number, currentIsFav: boolean) => {
      const id = toValidId(courseId);
      if (!id) return;
    toggleFav({ courseId: id, currentIsFav });    },
    [toggleFav, coursesQueryArgs]
  );

  const renderItem = useCallback(
    ({ item }: { item: CourseListItemUI }) => {
      const coverSource = item.coverUrl ? { uri: item.coverUrl } : COURSE_PLACEHOLDER;
      const isFav = Boolean(item.isFavorite);

      const teacher = item.teacher;
      const teacherAvatar = teacher?.avatarUrl ? { uri: teacher.avatarUrl } : null;

      const materialLabel = getCourseMaterialLabel(t, item);

      return (
        <View style={styles.cardWrap}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => openCourse(item.id)}
            style={styles.card}
          >
            <Image source={coverSource} style={styles.cover} />

            <View style={styles.details}>
              <View style={styles.titleRow}>
                <Text numberOfLines={2} style={styles.title}>
                  {item.title || t(COURSES_UI.unnamed)}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => onToggleFav(item.id, isFav)}
                  style={styles.favBtn}
                >
                  <Ionicons
                    name={isFav ? "star" : "star-outline"}
                    size={20}
                    color={isFav ? "#FACC15" : "#CBD5F5"}
                  />
                </TouchableOpacity>
              </View>

              {materialLabel ? <Text style={styles.materialText}>{materialLabel}</Text> : null}

              {teacher ? (
                <View style={styles.metaRow}>
                  {teacherAvatar ? (
                    <Image source={teacherAvatar} style={styles.teacherAvatar} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={26} color={colors.muted} />
                  )}
                  <Text numberOfLines={1} style={styles.teacherName}>
                    {teacher.fullName}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.cta}
                onPress={() => openCourse(item.id)}
              >
                <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                <Text style={styles.ctaText}>{t(COURSES_UI.startNow)}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.muted, onToggleFav, openCourse, styles, t]
  );

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.headerShell}>
        <LinearGradient
          colors={headerGradientColors}
          start={{ x: 0.08, y: 0.05 }}
          end={{ x: 0.95, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 14) }]}
        >
          <View style={styles.headerGlowA} />
          <View style={styles.headerGlowB} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity activeOpacity={0.9} onPress={goBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>

            <TouchableOpacity activeOpacity={0.9} onPress={openFavorites} style={styles.backBtn}>
              <View>
                <Ionicons name="star-outline" size={18} color="#FFFFFF" />
                {favoritesCount > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: -6,
                      left: -8,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      paddingHorizontal: 5,
                      backgroundColor: "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "900" }}>
                      {favoritesCount > 99 ? "99+" : String(favoritesCount)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder={t(COURSES_UI.searchPlaceholder)}
              placeholderTextColor={colors.muted}
              value={keyword}
              onChangeText={setKeyword}
              textAlign="right"
              returnKeyType="search"
            />
            {kwTrim.length ? (
              <TouchableOpacity activeOpacity={0.9} onPress={() => setKeyword("")}>
                <Ionicons name="close-circle" size={18} color={colors.muted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </LinearGradient>
      </View>

      {isLoading && items.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator />
          <Text style={styles.centerText}>{t("common.loading")}</Text>
        </View>
      ) : isError ? (
        <TouchableOpacity activeOpacity={0.9} onPress={refetch} style={styles.retryBox}>
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.retryText}>{t("common.tap_to_retry")}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={canSearch ? items : []}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="layers-outline" size={28} color={colors.primary} />
              <Text style={styles.centerText}>{emptyText}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}