import React, { useMemo } from "react";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";
import { useGetMeetingsQuery } from "@redux/apis/meetings/meetingApi";
import { useGetTeacherByIdQuery } from "@redux/apis/teachers/teacherApi";
import { useGetMaterialsByLevelQuery } from "@redux/apis/materials/materialsApi";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import { useAppTheme } from "@theme/ThemeProvider";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useEnsureChildSession } from "@hooks/useEnsureChildSession";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";
import { useMeetingsFilter } from "@hooks/useMeetingFilter";
import { useMeetingSubjectFromName } from "@hooks/useMeetingSubject";

import { MEETINGS_UI } from "./MeetingsScreen.constants";
import {
  getMeetingsPalette,
  meetingsStyles as styles,
} from "./MeetingsScreen.styles";
import type { MeetingsScreenMeetingItem } from "./MeetingsScreen.type";

const EMPTY_MEETINGS: MeetingsScreenMeetingItem[] = [];
const EMPTY_MATERIALS: MaterialUI[] = [];
const HEADER_GRADIENT: readonly [string, string, string] = [
  "#0D2A52",
  "#163867",
  "#1A4A82",
];

const expoExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
const MEDIA_BASE_URL = String(
  expoExtra.EXPO_PUBLIC_MEDIA_BASE_URL ?? ""
).replace(/\/+$/, "");
const S3_BUCKET_URL = String(
  expoExtra.EXPO_PUBLIC_S3_BUCKET_URL ?? ""
).replace(/\/+$/, "");

type JsonObject = Record<string, unknown>;

function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getObject(value: unknown): JsonObject | null {
  return isObject(value) ? value : null;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function pickStringFromKeys(source: unknown, keys: string[]): string | null {
  const obj = getObject(source);
  if (!obj) return null;

  for (const key of keys) {
    const value = getString(obj[key]);
    if (value) return value;
  }

  return null;
}

function resolveMediaUrl(value: unknown): string | null {
  const raw = getString(value);
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const clean = raw
    .replace(/^\/+/, "")
    .replace(/^storage\/+/i, "")
    .replace(/^public\/+/i, "");

  if (!clean) return null;

  if (S3_BUCKET_URL) {
    return `${S3_BUCKET_URL}/${clean}`;
  }

  if (MEDIA_BASE_URL) {
    return `${MEDIA_BASE_URL}/${clean}`;
  }

  return null;
}

function extractAvatarFromMediaList(mediaList: unknown): string | null {
  const list = getArray(mediaList);

  if (list.length === 0) return null;

  const avatarMedia =
    list.find((entry) => {
      const obj = getObject(entry);
      const tag = String(obj?.tag ?? "").toUpperCase();
      return tag === "AVATAR";
    }) ??
    list.find((entry) => {
      const obj = getObject(entry);
      const tag = String(obj?.tag ?? "").toLowerCase();
      return tag.includes("avatar");
    }) ??
    list[0];

  const mediaObj = getObject(avatarMedia);
  if (!mediaObj) return null;

  return (
    resolveMediaUrl(mediaObj.url) ??
    resolveMediaUrl(mediaObj.original_url) ??
    resolveMediaUrl(mediaObj.originalUrl) ??
    resolveMediaUrl(mediaObj.preview_url) ??
    resolveMediaUrl(mediaObj.previewUrl) ??
    resolveMediaUrl(mediaObj.file_path) ??
    resolveMediaUrl(mediaObj.filePath) ??
    resolveMediaUrl(mediaObj.path)
  );
}

function extractAvatarFromObject(source: unknown): string | null {
  const obj = getObject(source);
  if (!obj) return null;

  return (
    resolveMediaUrl(
      pickStringFromKeys(obj, [
        "teacherAvatarUrl",
        "teacher_avatar_url",
        "teacherAvatar",
        "teacher_avatar",
        "avatarUrl",
        "avatar_url",
        "avatar",
        "profile_image",
        "profileImage",
        "photo",
        "image",
        "file_path",
        "filePath",
      ])
    ) ?? extractAvatarFromMediaList(obj.media)
  );
}

function getTeacherIdFromMeeting(item: MeetingsScreenMeetingItem): number {
  const obj = item as unknown as JsonObject;

  return toValidId(
    obj.teacherId ??
      obj.teacher_id ??
      getObject(obj.teacher)?.id ??
      getObject(obj.user)?.id
  );
}

function getInlineTeacherAvatar(item: MeetingsScreenMeetingItem): string | null {
  const obj = item as unknown as JsonObject;

  return (
    extractAvatarFromObject(obj) ??
    extractAvatarFromObject(obj.teacher) ??
    extractAvatarFromObject(obj.user) ??
    extractAvatarFromMediaList(obj.media) ??
    extractAvatarFromMediaList(getObject(obj.teacher)?.media) ??
    extractAvatarFromMediaList(getObject(obj.user)?.media)
  );
}

function getTeacherAvatarFromTeacherResponse(response: unknown): string | null {
  const root = getObject(response);
  const teacher = getObject(root?.data) ?? root;

  if (!teacher) return null;

  return (
    extractAvatarFromObject(teacher) ??
    extractAvatarFromObject(teacher.teacher_profile) ??
    extractAvatarFromObject(teacher.teacherProfile) ??
    extractAvatarFromObject(teacher.user) ??
    extractAvatarFromMediaList(teacher.media) ??
    extractAvatarFromMediaList(getObject(teacher.teacher_profile)?.media) ??
    extractAvatarFromMediaList(getObject(teacher.teacherProfile)?.media) ??
    extractAvatarFromMediaList(getObject(teacher.user)?.media)
  );
}

const getMeetingPrice = (item: MeetingsScreenMeetingItem) =>
  item.finalPrice > 0 ? item.finalPrice : item.price;

const formatPrice = (value: number) =>
  Number.isFinite(value) ? value.toFixed(3) : "0.000";

const getTeacherDisplayName = (
  item: MeetingsScreenMeetingItem,
  prefix: string
) => (item.teacherName?.trim() ? `${prefix} ${item.teacherName}`.trim() : prefix);

const getMeetingSecondaryLabel = (item: MeetingsScreenMeetingItem) =>
  item.name?.trim() || item.levelName?.trim() || "";

const getAvatarText = (name?: string | null) =>
  String(name ?? "").trim().charAt(0) || "أ";

function TeacherAvatar({
  item,
  variant,
}: {
  item: MeetingsScreenMeetingItem;
  variant: "featured" | "card";
}) {
  const [hasError, setHasError] = React.useState(false);

  const inlineAvatarUri = useMemo(() => getInlineTeacherAvatar(item), [item]);
  const teacherId = useMemo(() => getTeacherIdFromMeeting(item), [item]);

  const { data: teacherResponse } = useGetTeacherByIdQuery(teacherId, {
    skip: Boolean(inlineAvatarUri) || !teacherId,
  });

  const fetchedAvatarUri = useMemo(
    () => getTeacherAvatarFromTeacherResponse(teacherResponse),
    [teacherResponse]
  );

  const avatarUri = inlineAvatarUri ?? fetchedAvatarUri;

  React.useEffect(() => {
    setHasError(false);
  }, [avatarUri]);

  const wrapperStyle =
    variant === "featured" ? styles.featuredAvatarCircle : styles.cardAvatarSquare;

  const imageStyle =
    variant === "featured" ? styles.featuredAvatarImage : styles.cardAvatarImage;

  const textStyle =
    variant === "featured" ? styles.featuredAvatarText : styles.cardAvatarSquareText;

  if (avatarUri && !hasError) {
    return (
      <View style={wrapperStyle}>
        <Image
          source={{ uri: avatarUri }}
          style={imageStyle}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      </View>
    );
  }

  return (
    <View style={wrapperStyle}>
      <Text style={textStyle}>{getAvatarText(item.teacherName)}</Text>
    </View>
  );
}

function FeaturedMeetingCard({
  item,
  onPress,
  palette,
}: {
  item: MeetingsScreenMeetingItem;
  onPress: () => void;
  palette: ReturnType<typeof getMeetingsPalette>;
}) {
  const { t } = useTranslation();
  const subject = useMeetingSubjectFromName(item.materialName);

  return (
    <TouchableOpacity
      activeOpacity={0.94}
      style={styles.featuredCardShadow}
      onPress={onPress}
    >
      <LinearGradient
        colors={subject.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredCard}
      >
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredSubjectBadge}>
            <Text style={styles.featuredSubjectBadgeText}>
              {subject.localizedName}
            </Text>
          </View>
        </View>

        <View style={styles.featuredCenter}>
          <TeacherAvatar item={item} variant="featured" />
        </View>

        <View style={styles.featuredBottom}>
          <Text numberOfLines={1} style={styles.featuredMeetingLabel}>
            {getMeetingSecondaryLabel(item)}
          </Text>

          <Text numberOfLines={2} style={styles.featuredTeacherName}>
            {getTeacherDisplayName(item, t(MEETINGS_UI.teacherPrefix))}
          </Text>

          <View style={styles.featuredMetaRow}>
            <View style={styles.featuredMetaChip}>
              <Ionicons
                name="layers-outline"
                size={12}
                color="#fff"
                style={styles.featuredMetaIcon}
              />
              <Text style={styles.featuredMetaText}>
                {item.groupsCount} {t(MEETINGS_UI.sessionsSuffix)}
              </Text>
            </View>

            <View style={styles.featuredMetaChip}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color="#fff"
                style={styles.featuredMetaIcon}
              />
              <Text style={styles.featuredMetaText}>
                {item.upcomingSessionsCount} {t(MEETINGS_UI.sessionsSuffix)}
              </Text>
            </View>
          </View>

          <View style={styles.featuredActionRow}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={onPress}
              style={styles.featuredOpenButton}
            >
              <Text style={styles.featuredOpenButtonText}>
                {t(MEETINGS_UI.detailsButton)}
              </Text>
              <Ionicons name="arrow-back" size={14} color={palette.buttonTextDark} />
            </TouchableOpacity>

            <Text style={styles.featuredPrice}>
              {formatPrice(getMeetingPrice(item))} {t(MEETINGS_UI.priceCurrency)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function MeetingCard({
  item,
  onPress,
  palette,
  isDark,
}: {
  item: MeetingsScreenMeetingItem;
  onPress: () => void;
  palette: ReturnType<typeof getMeetingsPalette>;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  const subject = useMeetingSubjectFromName(item.materialName);
  const accent = subject.accent;
  const daysLabel = (item as { days?: string | null }).days ?? "";
  const countLabel = item.groupsCount
    ? `${item.groupsCount} ${t(MEETINGS_UI.sessionsSuffix)}`
    : "";
  const levelLabel = item.levelName?.trim() ?? "";
  const times: string[] =
    (item as { scheduleLines?: string[] | null }).scheduleLines ?? [];

  return (
    <TouchableOpacity
      activeOpacity={0.93}
      style={[
        styles.cardShadow,
        { shadowColor: accent, shadowOpacity: isDark ? 0.2 : 0.08 },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <LinearGradient
          colors={subject.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardHeader}
        >
          <View style={styles.cardHeaderLeft}>
            <TeacherAvatar item={item} variant="card" />

            <View style={styles.cardHeaderNameCol}>
              <Text numberOfLines={1} style={styles.cardTeacherNameHeader}>
                {getTeacherDisplayName(item, t(MEETINGS_UI.teacherPrefix))}
              </Text>
              <Text style={styles.cardVerifiedBadge}>
                {t(MEETINGS_UI.verifiedTeacher)} ✓
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cardBookmark} activeOpacity={0.85}>
            <Ionicons name="bookmark-outline" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.cardBody}>
          <View style={styles.cardSubjectPillRow}>
            <View
              style={[
                styles.cardSubjectPill,
                {
                  backgroundColor: `${accent}12`,
                  borderColor: `${accent}30`,
                },
              ]}
            >
              <Text style={[styles.cardSubjectPillText, { color: accent }]}>
                {subject.localizedName}
              </Text>
            </View>
          </View>

          <View style={styles.cardInfoRows}>
            {!!daysLabel && (
              <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoIcon}>📅</Text>
                <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>
                  {t(MEETINGS_UI.daysLabel)}:
                </Text>
                <Text style={[styles.cardInfoValue, { color: palette.text }]}>
                  {daysLabel}
                </Text>
              </View>
            )}

            {!!countLabel && (
              <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoIcon}>📦</Text>
                <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>
                  {t(MEETINGS_UI.sessionsCountLabel)}:
                </Text>
                <Text style={[styles.cardInfoValue, { color: palette.text }]}>
                  {countLabel}
                </Text>
              </View>
            )}

            {!!levelLabel && (
              <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoIcon}>🎓</Text>
                <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>
                  {t(MEETINGS_UI.levelLabel)}:
                </Text>
                <Text style={[styles.cardInfoValue, { color: palette.text }]}>
                  {levelLabel}
                </Text>
              </View>
            )}

            {times.length > 0 && (
              <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoIcon}>⏰</Text>
                <View style={styles.cardTimeRows}>
                  {times.map((line, index) => (
                    <Text
                      key={`${line}-${index}`}
                      style={[
                        styles.cardTimeRow,
                        {
                          color: palette.text,
                          fontWeight: index === 0 ? "800" : "700",
                        },
                      ]}
                    >
                      {line}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {!daysLabel && !countLabel && !levelLabel && (
              <View style={styles.cardInfoRow}>
                <Text
                  numberOfLines={2}
                  style={[styles.cardInfoValue, { color: palette.muted }]}
                >
                  {getMeetingSecondaryLabel(item)}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.cardBottomRow, { borderTopColor: palette.border }]}>
            <View style={styles.cardPriceCol}>
              <Text style={[styles.cardPrice, { color: palette.text }]}>
                {formatPrice(getMeetingPrice(item))}
              </Text>
              <Text style={[styles.cardPriceUnit, { color: palette.muted }]}>
                {t(MEETINGS_UI.priceCurrency)} / {t(MEETINGS_UI.monthSuffix)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.bookBtn,
                { backgroundColor: accent, shadowColor: accent },
              ]}
              onPress={onPress}
            >
              <Ionicons name="cart-outline" size={14} color="#fff" />
              <Text style={styles.bookBtnText}>{t(MEETINGS_UI.bookNow)}</Text>
            </TouchableOpacity>
          </View>

          {!!item.nextSessionAt && (
            <View style={styles.cardFooter}>
              <Ionicons name="calendar-outline" size={11} color={palette.muted} />
              <Text style={[styles.cardFooterText, { color: palette.muted }]}>
                {t(MEETINGS_UI.nextSession)}: {item.nextSessionAt}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MeetingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const palette = getMeetingsPalette(colors, isDark);

  const { isChildReady } = useEnsureChildSession();
  const headerData = useActiveChildHeaderData();

  const levelId = useMemo(
    () => toValidId(pickLevelIdFromChild(headerData?.child)),
    [headerData?.child]
  );

  const {
    data: materialsData,
    isLoading: isMaterialsLoading,
    isFetching: isMaterialsFetching,
    isError: isMaterialsError,
    refetch: refetchMaterials,
  } = useGetMaterialsByLevelQuery({ levelId }, { skip: !levelId });

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetMeetingsQuery(
    {
      page: 1,
      perPage: 50,
      pagination: true,
      orderBy: "created_at",
      direction: "desc",
    },
    { skip: !isChildReady, refetchOnMountOrArgChange: true }
  );

  const meetings = useMemo(() => {
    const raw = data?.data?.items ?? data?.data ?? [];
    return Array.isArray(raw) ? (raw as MeetingsScreenMeetingItem[]) : EMPTY_MEETINGS;
  }, [data]);

  const materials = useMemo<MaterialUI[]>(
    () => (Array.isArray(materialsData) ? materialsData : EMPTY_MATERIALS),
    [materialsData]
  );

  const {
    searchValue,
    setSearchValue,
    activeMaterialId,
    setActiveMaterialId,
    materialFilters,
    filteredMeetings,
    featuredMeetings,
  } = useMeetingsFilter(meetings, materials);

  const featuredMeetingsRtl = useMemo(
    () => [...featuredMeetings].reverse(),
    [featuredMeetings]
  );

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchMaterials()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const openMeetingDetails = (item: MeetingsScreenMeetingItem) => {
    navigation.navigate(PATHS.APP.MEETING_DETAILS, { meetingId: item.id });
  };

  const openParentProfile = () => {
    navigation.navigate(PATHS.APP.PROFILE_PARENT as never);
  };

  function renderFeaturedMeeting({
    item,
  }: ListRenderItemInfo<MeetingsScreenMeetingItem>) {
    return (
      <FeaturedMeetingCard
        item={item}
        palette={palette}
        onPress={() => openMeetingDetails(item)}
      />
    );
  }

  function renderMeetingItem({
    item,
  }: ListRenderItemInfo<MeetingsScreenMeetingItem>) {
    return (
      <MeetingCard
        item={item}
        palette={palette}
        isDark={isDark}
        onPress={() => openMeetingDetails(item)}
      />
    );
  }

  const listHeader = (
    <>
      <LinearGradient
        colors={HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={[styles.headerWrap, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerGlowLeft} />
        <View style={styles.headerGlowRight} />
        <View style={styles.headerBubble} />

        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.9}>
            <Ionicons name="notifications-outline" size={20} color="#FFD76A" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: palette.white }]}>
              {t(MEETINGS_UI.heroTitle)}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t(MEETINGS_UI.heroSubtitle)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.avatarButton}
            onPress={openParentProfile}
          >
            <ActiveChildHeaderAvatar />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder={t(MEETINGS_UI.searchPlaceholder)}
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.searchInput}
            textAlign="right"
          />
          <Ionicons
            name="search-outline"
            size={18}
            color="rgba(255,255,255,0.65)"
            style={styles.searchIcon}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View
          style={[
            styles.filtersCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: activeMaterialId === 0 ? palette.primary : palette.softSurface,
                  borderColor: activeMaterialId === 0 ? palette.primary : palette.softBorder,
                },
              ]}
              onPress={() => setActiveMaterialId(0)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: activeMaterialId === 0 ? palette.white : palette.text },
                ]}
              >
                {t("meetings.category_all")}
              </Text>
            </TouchableOpacity>

            {materialFilters.map((material) => {
              const isActive = activeMaterialId === material.id;

              return (
                <TouchableOpacity
                  key={material.id}
                  activeOpacity={0.92}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive ? palette.primary : palette.softSurface,
                      borderColor: isActive ? palette.primary : palette.softBorder,
                    },
                  ]}
                  onPress={() => setActiveMaterialId(material.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isActive ? palette.white : palette.text },
                    ]}
                  >
                    {material.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {isMaterialsLoading || isMaterialsFetching ? (
            <View style={styles.materialsStateWrap}>
              <ActivityIndicator size="small" color={palette.primary} />
            </View>
          ) : isMaterialsError ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={refetchMaterials}
              style={styles.materialsStateWrap}
            >
              <Text style={[styles.materialsRetryText, { color: palette.primary }]}>
                {t(MEETINGS_UI.retry)}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.subjectsGrid}>
              {materialFilters.map((material) => {
                const isActive = activeMaterialId === material.id;

                return (
                  <TouchableOpacity
                    key={material.id}
                    activeOpacity={0.92}
                    style={[
                      styles.subjectCard,
                      {
                        backgroundColor: isActive ? `${palette.primary}12` : palette.card,
                        borderColor: isActive ? palette.primary : palette.border,
                      },
                    ]}
                    onPress={() => setActiveMaterialId(material.id)}
                  >
                    <View
                      style={[
                        styles.subjectIconWrap,
                        {
                          backgroundColor: isActive
                            ? `${palette.primary}20`
                            : palette.softSurface,
                        },
                      ]}
                    >
                      {material.iconUrl ? (
                        <Image
                          source={{ uri: material.iconUrl }}
                          style={styles.materialIcon}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={material.fallbackIcon}
                          style={styles.materialIcon}
                          resizeMode="contain"
                        />
                      )}
                    </View>

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.subjectTitle,
                        { color: isActive ? palette.primary : palette.muted },
                      ]}
                    >
                      {material.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View
          style={[
            styles.priceRangeCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <View style={styles.priceRangeHeader}>
            <Text style={[styles.priceRangeTitle, { color: palette.text }]}>
              💰 {t(MEETINGS_UI.priceFilterLabel)}
            </Text>
            <Text style={[styles.priceRangeValue, { color: palette.muted }]}>
              30 {t(MEETINGS_UI.priceCurrency)} — 100 {t(MEETINGS_UI.priceCurrency)}
            </Text>
          </View>

          <View style={styles.priceRangeRow}>
            <Text style={[styles.priceRangeNum, { color: palette.muted }]}>30</Text>
            <View style={[styles.priceTrack, { backgroundColor: palette.softSurface }]}>
              <View
                style={[styles.priceTrackFill, { backgroundColor: palette.primary }]}
              />
              <View style={styles.priceThumbLeft} />
              <View style={styles.priceThumbRight} />
            </View>
            <Text style={[styles.priceRangeNum, { color: palette.muted }]}>100</Text>
          </View>
        </View>

        {featuredMeetings.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionCount, { color: palette.primary }]}>
                {featuredMeetings.length} {t(MEETINGS_UI.sessionsSuffix)}
              </Text>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>
                {t(MEETINGS_UI.featuredTitle)}
              </Text>
            </View>

            <FlatList
              horizontal
              inverted
              data={featuredMeetingsRtl}
              keyExtractor={(item, index) => `f-${item.id}-${index}`}
              renderItem={renderFeaturedMeeting}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScrollContent}
              style={styles.featuredList}
              ItemSeparatorComponent={() => <View style={styles.featuredSeparator} />}
              nestedScrollEnabled
              removeClippedSubviews={false}
            />
          </>
        )}

        <View style={styles.sectionHeaderLarge}>
          <Text style={[styles.sectionCount, { color: palette.primary }]}>
            {filteredMeetings.length} {t(MEETINGS_UI.teachersSuffix)}
          </Text>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            {t(MEETINGS_UI.allMeetingsTitle)}
          </Text>
        </View>
      </View>
    </>
  );

  if (isLoading && meetings.length === 0) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
          {t(MEETINGS_UI.loading)}
        </Text>
      </View>
    );
  }

  if (isError && meetings.length === 0) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <Ionicons name="cloud-offline-outline" size={40} color={palette.danger} />
        <Text style={[styles.emptyTitle, { color: palette.text }]}>
          {t(MEETINGS_UI.genericError)}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleRefresh}
          style={[styles.retryButton, { backgroundColor: palette.primary }]}
        >
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={[styles.retryButtonText, { color: "#fff" }]}>
            {t(MEETINGS_UI.retry)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D2A52" />

      <FlatList
        data={filteredMeetings}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMeetingItem}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={palette.primary}
            colors={[palette.primary]}
            progressBackgroundColor={palette.card}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyWrap}>
              <View
                style={[
                  styles.emptyIconWrap,
                  { backgroundColor: palette.softSurface },
                ]}
              >
                <Ionicons name="videocam-outline" size={32} color={palette.primary} />
              </View>

              <Text style={[styles.emptyTitle, { color: palette.text }]}>
                {t(MEETINGS_UI.emptyTitle)}
              </Text>

              <Text style={[styles.emptySubtitle, { color: palette.muted }]}>
                {t(MEETINGS_UI.emptySubtitle)}
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleRefresh}
                style={[styles.retryButton, { backgroundColor: palette.primary }]}
              >
                <Ionicons name="refresh-outline" size={16} color="#fff" />
                <Text style={[styles.retryButtonText, { color: "#fff" }]}>
                  {t(MEETINGS_UI.retry)}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}