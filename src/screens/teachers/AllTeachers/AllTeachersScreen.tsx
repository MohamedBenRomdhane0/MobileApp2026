import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAllTeachersStyles } from "./AllTeachersScreen.styles";
import { ALL_TEACHERS_UI, TEACHER_GRID_COLUMNS, TEACHER_CARD_GAP } from "./AllTeachersScreen.constants";
import { useGetTeachersQuery } from "@redux/apis/teachers/teacherApi";
import type { TeacherUI } from "@redux/apis/teachers/teacherApi.type";
import { PATHS } from "@config/constants/paths";
import { TEACHER_COLORS } from "@screens/home/HomeScreen.constants";
import type { AllTeacherItem } from "./AllTeachersScreen.type";

const TEACHER_RING_COLORS = TEACHER_COLORS;

export default function AllTeachersScreen() {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = (i18n.language ?? "ar") === "ar";
  const styles = useMemo(
    () => createAllTeachersStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
  );

  const {
    data: teachersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetTeachersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const teachers = useMemo<AllTeacherItem[]>(() => {
    const items: TeacherUI[] = Array.isArray(teachersData?.data)
      ? teachersData.data
      : [];
    return items.map((t) => ({
      id: t.id,
      fullName: t.fullName,
      subject: t.materialName ?? t.subjectName ?? "",
      avatarUrl: t.avatarUrl,
      rating: t.ratingAverage,
      followersCount: t.followersCount,
      levels: t.levels,
      materials: t.materials,
    }));
  }, [teachersData]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const openTeacher = useCallback(
    (teacherId: number) => {
      navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: AllTeacherItem; index: number }) => {
      const ringColor = TEACHER_RING_COLORS[index % TEACHER_RING_COLORS.length];
      const avatarSource = item.avatarUrl ? { uri: item.avatarUrl } : null;
      const displayRating =
        typeof item.rating === "number" && item.rating > 0
          ? item.rating.toFixed(1)
          : null;

      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => openTeacher(item.id)}
        >
          <LinearGradient
            colors={[`${ringColor}33`, `${ringColor}11`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarOuter}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatarImg} />
              ) : (
                <View
                  style={[
                    styles.avatarImg,
                    { backgroundColor: `${ringColor}22` },
                  ]}
                />
              )}
            </View>
          </LinearGradient>

          <Text style={styles.name} numberOfLines={1}>
            {item.fullName}
          </Text>
          <Text style={styles.subject} numberOfLines={1}>
            {item.subject}
          </Text>

          {displayRating && (
            <View style={styles.badge}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={styles.badgeText}>{displayRating}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [styles, openTeacher]
  );

  const keyExtractor = useCallback((item: AllTeacherItem) => String(item.id), []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="people-outline"
          size={64}
          color={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>{t(ALL_TEACHERS_UI.emptyTitle)}</Text>
        <Text style={styles.emptySubtitle}>
          {t(ALL_TEACHERS_UI.emptySubtitle)}
        </Text>
      </View>
    ),
    [styles, isDark, t]
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={22}
            color={isDark ? "#F1F5F9" : "#0F172A"}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(ALL_TEACHERS_UI.screenTitle)}</Text>
        {teachers.length > 0 && (
          <Text style={styles.headerCount}>{teachers.length}</Text>
        )}
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator
            size="large"
            color={isDark ? "#38BDF8" : "#0EA5E9"}
          />
        </View>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={TEACHER_GRID_COLUMNS}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          onRefresh={refetch}
          refreshing={isFetching && !isLoading}
        />
      )}
    </View>
  );
}
