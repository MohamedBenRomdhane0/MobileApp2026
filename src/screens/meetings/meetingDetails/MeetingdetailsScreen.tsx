import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";
import { useAppTheme } from "@theme/ThemeProvider";
import { useGetMeetingByIdQuery } from "@redux/apis/meetings/meetingApi";
import { useGetTeacherByIdQuery } from "@redux/apis/teachers/teacherApi";
import { useMeetingDetailData } from "@hooks/useMeetingDetailData";

import {
  getMeetingDetailPalette,
  meetingDetailStyles as styles,
} from "./MeetingdetailsScreen.styles";
import { MEETING_DETAIL_UI } from "./MeetingdetailsScreen.constants";
import type {
  MeetingDetailsMeeting,
  MeetingDetailsRouteParams,
  MeetingDetailsTeacher,
  TeacherBadge,
  TeacherReviewItem,
} from "./MeetingdetailsScreen.type";

type Nav  = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<{ params: MeetingDetailsRouteParams }, "params">;

function toValidId(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function StarRow({ rating, max = 5 }: { rating?: number | null; max?: number }) {
  const safe     = Math.max(0, Math.min(toNumber(rating), max));
  const full     = Math.floor(safe);
  const hasHalf  = safe - full >= 0.5;

  return (
    <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < full ? "star" : hasHalf && i === full ? "star-half" : "star-outline"}
          size={14}
          color="#F5A623"
        />
      ))}
      <Text style={{ fontSize: 12, fontWeight: "900", color: "#0D1225", marginStart: 5 }}>
        {safe.toFixed(1)}
      </Text>
    </View>
  );
}

export default function MeetingDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const insets     = useSafeAreaInsets();
  const { t }      = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark  = mode === "dark";
  const palette = getMeetingDetailPalette(colors, isDark);

  const meetingId = toValidId(route.params?.meetingId);

  const {
    data:    meetingData,
    isLoading: isMeetingLoading,
    isError:   isMeetingError,
    refetch:   refetchMeeting,
  } = useGetMeetingByIdQuery(meetingId, { skip: !meetingId });

  const meeting = (meetingData?.data ?? null) as MeetingDetailsMeeting | null;

  const teacherId = toValidId(meeting?.teacherId ?? meeting?.teacher_id);

  const {
    data:    teacherData,
    isLoading: isTeacherLoading,
  } = useGetTeacherByIdQuery(teacherId, { skip: !teacherId });

  const teacher = (teacherData?.data ?? null) as MeetingDetailsTeacher | null;

  const [bookmarked, setBookmarked] = useState(false);

  const data = useMeetingDetailData(meeting, teacher);

  const { subject } = data;

  const isLoading = isMeetingLoading || (!!teacherId && isTeacherLoading);

  const handleBook = useCallback(() => {}, []);

  const handleViewProfile = useCallback(() => {
    if (!data.teacherId) return;
    navigation.navigate(PATHS.APP.TEACHER_PROFILE, { teacherId: data.teacherId });
  }, [navigation, data.teacherId]);

  if (isLoading && !meeting) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.stateText, { color: palette.muted }]}>{t(MEETING_DETAIL_UI.loading)}</Text>
      </View>
    );
  }

  if (isMeetingError || !meeting) {
    return (
      <View style={[styles.centerState, { backgroundColor: palette.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#163867" />
        <Ionicons name="cloud-offline-outline" size={44} color={palette.danger} />
        <Text style={[styles.stateTitle, { color: palette.text }]}>{t(MEETING_DETAIL_UI.errorTitle)}</Text>
        <TouchableOpacity activeOpacity={0.9} onPress={refetchMeeting} style={[styles.retryBtn, { backgroundColor: palette.primary }]}>
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.retryBtnText}>{t(MEETING_DETAIL_UI.retry)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
      >
        <LinearGradient
          colors={subject.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 14 }]}
        >
          <View style={styles.heroOrb1} />
          <View style={styles.heroOrb2} />

          <View style={styles.heroTopBar}>
            <TouchableOpacity style={styles.heroBackBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.heroTopRight}>
              <View style={[styles.heroSubjectBadge, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <Text style={styles.heroSubjectBadgeText}>{subject.localizedName}</Text>
              </View>
              <TouchableOpacity
                style={[styles.heroBackBtn, { backgroundColor: bookmarked ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.18)" }]}
                activeOpacity={0.85}
                onPress={() => setBookmarked((p) => !p)}
              >
                <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.heroAvatarWrap}>
              {data.teacherAvatarUrl ? (
                <Image source={{ uri: data.teacherAvatarUrl }} style={styles.heroAvatar} resizeMode="cover" />
              ) : (
                <LinearGradient
                  colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.10)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroAvatar}
                >
                  <Text style={styles.heroAvatarText}>{data.avatarChar}</Text>
                </LinearGradient>
              )}
            </View>

            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroTitle}>
                {meeting.name?.trim() || t(MEETING_DETAIL_UI.defaultTitle)}
              </Text>
              <View style={styles.heroMetaRow}>
                {data.heroSessionCount > 0 && (
                  <>
                    <Text style={styles.heroMetaText}>
                      {data.heroSessionCount} {t(MEETING_DETAIL_UI.sessionsSuffix)}
                    </Text>
                    {data.rating ? <Text style={styles.heroMetaDot}>·</Text> : null}
                  </>
                )}
                {data.rating ? (
                  <View style={styles.heroRatingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.heroRatingText}>{data.rating.toFixed(1)}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.cardsArea, { backgroundColor: palette.bg }]}>
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>
              👨‍🏫 {t(MEETING_DETAIL_UI.teacherLabel)}
            </Text>
            <View style={styles.teacherRow}>
              {data.teacherAvatarUrl ? (
                <Image source={{ uri: data.teacherAvatarUrl }} style={styles.teacherAvatar} resizeMode="cover" />
              ) : (
                <LinearGradient colors={subject.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.teacherAvatar}>
                  <Text style={styles.teacherAvatarText}>{data.avatarChar}</Text>
                </LinearGradient>
              )}
              <View style={styles.teacherInfo}>
                <Text style={[styles.teacherName, { color: palette.text }]}>
                  {data.teacherName || t(MEETING_DETAIL_UI.teacherPrefix)}
                </Text>
                <Text style={[styles.teacherMeta, { color: palette.muted }]}>{data.yearsExperienceLabel}</Text>
                {data.rating ? <StarRow rating={data.rating} /> : null}
              </View>
              <TouchableOpacity
                style={[styles.profileBtn, { backgroundColor: `${palette.primary}14`, borderColor: `${palette.primary}30`, opacity: data.teacherId ? 1 : 0.5 }]}
                activeOpacity={0.85}
                disabled={!data.teacherId}
                onPress={handleViewProfile}
              >
                <Text style={[styles.profileBtnText, { color: palette.primary }]}>{t(MEETING_DETAIL_UI.viewProfile)}</Text>
              </TouchableOpacity>
            </View>

            {teacher?.badges && teacher.badges.length > 0 && (
              <View style={styles.teacherBadgesRow}>
                {teacher.badges.map((badge: TeacherBadge, i: number) => (
                  <View key={i} style={[styles.teacherBadgeChip, { backgroundColor: `${subject.accent}12`, borderColor: `${subject.accent}25` }]}>
                    <Text style={styles.teacherBadgeEmoji}>{badge.emoji}</Text>
                    <Text style={[styles.teacherBadgeText, { color: subject.accent }]} numberOfLines={1}>{badge.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {data.summaryItems.length > 0 && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>
                📌 {t(MEETING_DETAIL_UI.summaryLabel)}
              </Text>
              <View style={styles.chipsGrid}>
                {data.summaryItems.map((item, i) => (
                  <View key={i} style={[styles.chip, { backgroundColor: palette.softSurface, borderColor: palette.border }]}>
                    <Text style={styles.chipIcon}>{item.icon}</Text>
                    <Text style={[styles.chipText, { color: palette.text }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(data.scheduleLines.length > 0 || !!meeting.nextSessionAt) && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>
                📅 {t(MEETING_DETAIL_UI.scheduleLabel)}
              </Text>
              {data.scheduleLines.length > 0 && (
                <View style={styles.scheduleRows}>
                  {data.scheduleLines.map((row, i) => (
                    <View key={`${row.day}-${row.time}-${i}`} style={[styles.scheduleRow, { backgroundColor: palette.softSurface }]}>
                      <View style={[styles.scheduleDot, { backgroundColor: i === 0 ? subject.accent : "#7C5CBF" }]} />
                      <Text style={[styles.scheduleDay, { color: palette.text }]}>{row.day}</Text>
                      <Text style={[styles.scheduleTime, { color: palette.text }]}>{row.time}</Text>
                      {!!row.duration && (
                        <Text style={[styles.scheduleDuration, { color: palette.muted }]}>
                          {row.duration} {t(MEETING_DETAIL_UI.minutesSuffix)}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {!!meeting.nextSessionAt && (
                <View style={styles.nextSessionAlert}>
                  <Text style={styles.nextSessionIcon}>⏰</Text>
                  <Text style={styles.nextSessionText}>
                    {t(MEETING_DETAIL_UI.nextSessionLabel)}: {meeting.nextSessionAt}
                  </Text>
                </View>
              )}
            </View>
          )}

          {!!teacher?.aboutText && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>ℹ️ {t(MEETING_DETAIL_UI.aboutLabel)}</Text>
              <Text style={[styles.descriptionText, { color: palette.text }]}>{teacher.aboutText}</Text>
            </View>
          )}

          {!!meeting.description && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>📝 {t(MEETING_DETAIL_UI.descriptionLabel)}</Text>
              <Text style={[styles.descriptionText, { color: palette.text }]}>{meeting.description}</Text>
            </View>
          )}

          {data.groupsCount > 0 && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={styles.groupsHeader}>
                <Text style={[styles.cardSectionTitle, { color: palette.muted, marginBottom: 0 }]}>
                  📦 {t(MEETING_DETAIL_UI.groupsLabel)}
                </Text>
                <View style={[styles.groupsBadge, { backgroundColor: `${subject.accent}14`, borderColor: `${subject.accent}30` }]}>
                  <Text style={[styles.groupsBadgeText, { color: subject.accent }]}>
                    {data.groupsCount} {t(MEETING_DETAIL_UI.sessionsSuffix)}
                  </Text>
                </View>
              </View>
              {data.upcomingSessionsCount > 0 && (
                <>
                  <View style={{ height: 10 }} />
                  <View style={[styles.upcomingChip, { backgroundColor: palette.softSurface, borderColor: palette.border }]}>
                    <Ionicons name="calendar-outline" size={14} color={subject.accent} />
                    <Text style={[styles.upcomingChipText, { color: palette.text }]}>
                      {data.upcomingSessionsCount} {t(MEETING_DETAIL_UI.upcomingLabel)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {teacher?.reviewItems && teacher.reviewItems.length > 0 && (
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <Text style={[styles.cardSectionTitle, { color: palette.muted }]}>
                💬 {t(MEETING_DETAIL_UI.reviewsLabel)}
              </Text>
              <View style={{ gap: 10 }}>
                {teacher.reviewItems.slice(0, 3).map((review: TeacherReviewItem, i: number) => (
                  <View key={i} style={[styles.reviewChip, { backgroundColor: palette.softSurface, borderColor: palette.border }]}>
                    <View style={styles.reviewChipStars}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Ionicons key={s} name={s < toNumber(review.rating) ? "star" : "star-outline"} size={12} color="#F5A623" />
                      ))}
                    </View>
                    {!!review.authorLabel && (
                      <Text style={[styles.reviewChipAuthor, { color: palette.muted }]}>{review.authorLabel}</Text>
                    )}
                    <Text style={[styles.reviewChipComment, { color: palette.text }]}>{`"${review.comment}"`}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: palette.card, borderTopColor: palette.border, paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.priceCol}>
          <Text style={[styles.priceValue, { color: palette.text }]}>{data.price}</Text>
          <Text style={[styles.priceUnit, { color: palette.muted }]}>
            {t(MEETING_DETAIL_UI.priceCurrency)} / {t(MEETING_DETAIL_UI.priceSuffix)}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.bookBtn, { backgroundColor: palette.primary, shadowColor: palette.primary, opacity: meetingId ? 1 : 0.6 }]}
          disabled={!meetingId}
          onPress={handleBook}
        >
          <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
          <Text style={styles.bookBtnText}>{t(MEETING_DETAIL_UI.bookNow)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
