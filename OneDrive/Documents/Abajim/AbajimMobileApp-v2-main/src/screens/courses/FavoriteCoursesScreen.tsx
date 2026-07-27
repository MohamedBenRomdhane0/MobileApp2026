import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createCoursesStyles } from "./CoursesScreen.styles";
import { COURSES_UI } from "./CoursesScreen.constants";

import { PATHS } from "@config/constants/paths";
import { useGetFavoriteCoursesQuery, useToggleCourseFavoriteMutation } from "@redux/apis/courses/coursesApi";
import type { CourseListItemUI } from "@redux/apis/courses/coursesApi.type";

const COURSE_PLACEHOLDER = require("../../../assets/images/default_courses.png");

function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function FavoriteCoursesScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = useMemo(() => createCoursesStyles(colors, isDark), [colors, isDark]);

  const { data, isLoading, isFetching, isError, refetch } = useGetFavoriteCoursesQuery({ page: 1, perPage: 50 });
  const items: CourseListItemUI[] = useMemo(() => data?.items ?? [], [data?.items]);

  const [toggleFav, toggleState] = useToggleCourseFavoriteMutation();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const openCourse = useCallback(
    (courseId: number) => {
      const id = toValidId(courseId);
      if (!id) return;
      navigation.navigate(PATHS.APP.COURSE_CHAPTERS, { courseId: id });
    },
    [navigation]
  );

  const headerGradientColors: [string, string, string] = useMemo(
    () => (isDark ? ["#0B1220", colors.header, "#060B14"] : ["#153A6B", colors.header, "#091D36"]),
    [isDark, colors.header]
  );

  const renderItem = useCallback(
    ({ item }: { item: CourseListItemUI }) => {
      const coverSource = item.coverUrl ? { uri: item.coverUrl } : COURSE_PLACEHOLDER;

      const onRemove = () => {
        if (toggleState.isLoading) return;
        toggleFav({ courseId: item.id });
      };

      return (
        <View style={styles.cardWrap}>
          <TouchableOpacity activeOpacity={0.92} onPress={() => openCourse(item.id)} style={styles.card}>
            <Image source={coverSource} style={styles.cover} />

            <View style={styles.details}>
              <View style={styles.titleRow}>
                <Text numberOfLines={2} style={styles.title}>
                  {item.title}
                </Text>

                <TouchableOpacity activeOpacity={0.9} onPress={onRemove} style={styles.favBtn}>
                  <Ionicons name="star" size={20} color="#FACC15" />
                </TouchableOpacity>
              </View>

              {item.teacher ? (
                <View style={styles.metaRow}>
                  {item.teacher.avatarUrl ? (
                    <Image source={{ uri: item.teacher.avatarUrl }} style={styles.teacherAvatar} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={26} color={colors.muted} />
                  )}
                  <Text numberOfLines={1} style={styles.teacherName}>
                    {item.teacher.fullName}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity activeOpacity={0.9} style={styles.cta} onPress={() => openCourse(item.id)}>
                <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                <Text style={styles.ctaText}>{t("courses.go_to_course", { defaultValue: "اذهب إلى الدرس" })}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.muted, openCourse, styles, t, toggleFav, toggleState.isLoading]
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
              {t(COURSES_UI.favorites, { defaultValue: "دروسي الإضافية المفضلة" })}
            </Text>

            <View style={styles.headerRightSlot} />
          </View>
        </LinearGradient>
      </View>

      {isLoading && items.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator />
          <Text style={styles.centerText}>{t("common.loading", { defaultValue: "تحميل..." })}</Text>
        </View>
      ) : isError ? (
        <TouchableOpacity activeOpacity={0.9} onPress={refetch} style={styles.retryBox}>
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.retryText}>{t("common.tap_to_retry", { defaultValue: "اضغط لإعادة المحاولة" })}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="star-outline" size={28} color={colors.primary} />
              <Text style={styles.centerText}>{t("courses.no_favorites", { defaultValue: "لا توجد دروس مفضلة حتى الآن" })}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}