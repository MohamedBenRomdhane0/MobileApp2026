import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { TEACHER_PROFILE_UI } from "./TeacherProfileScreen.constants";
import type {
  FollowerVM,
  LessonItem,
  MeetingItem,
  Nav,
  PlanItem,
  ReviewItem,
  TeacherProfileRouteMap,
} from "./TeacherProfileScreen.type";
import { createTeacherProfileStyles } from "./TeacherProfileScreen.styles";

import {
  buildStaticMeetingItems,
  buildStaticPlanItems,
  formatRating,
  toValidId,
} from "@utils/helpers/teacherProfile.helpers";
import { buildAvatarUri } from "@utils/helpers/mediaUrl.helper";
import { useTeacherProfileViewModel } from "@hooks/useTeacherProfileViewModel";
import {
  useGetTeacherByIdQuery,
  useSaveTeacherReviewMutation,
} from "@redux/apis/teachers/teacherApi";

function renderStars(
  rating: number,
  color: string,
  iconStyle?: StyleProp<TextStyle>
): React.ReactNode[] {
  return Array.from({ length: 5 }, (_, index) => (
    <Ionicons
      key={`star-${index}`}
      name={index < rating ? "star" : "star-outline"}
      size={14}
      color={color}
      style={iconStyle}
    />
  ));
}

export default function TeacherProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<TeacherProfileRouteMap, "TeacherProfile">>();
  const insets = useSafeAreaInsets();

  const teacherId = toValidId(route.params?.teacherId);

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = createTeacherProfileStyles(colors, isDark);

  const [isTrailerVisible, setTrailerVisible] = useState(false);
  const [isFollowersVisible, setFollowersVisible] = useState(false);
  const [isReviewVisible, setReviewVisible] = useState(false);
  const [isAboutExpanded, setAboutExpanded] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("advanced");

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);

  const openTrailer = useCallback(() => setTrailerVisible(true), []);
  const closeTrailer = useCallback(() => setTrailerVisible(false), []);
  const openFollowers = useCallback(() => setFollowersVisible(true), []);
  const closeFollowers = useCallback(() => setFollowersVisible(false), []);

  const openReview = useCallback(() => {
    setReviewError(null);
    setReviewRating(0);
    setReviewComment("");
    setReviewVisible(true);
  }, []);

  const closeReview = useCallback(() => {
    Keyboard.dismiss();
    setReviewVisible(false);
    setReviewError(null);
  }, []);

  const onGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const {
    teacher,
    followers,
    isTeacherLoading,
    isTeacherError,
    refetchTeacher,
    isFollowersLoading,
    isFollowersError,
    refetchFollowers,
    isFollowing,
    onToggleFollow,
  } = useTeacherProfileViewModel(teacherId, isFollowersVisible);

  const { data: teacherResponse } = useGetTeacherByIdQuery(teacherId ?? 0, {
    skip: !teacherId,
  });

  const teacherDetails = teacherResponse?.data;

  const teacherDetailsRecord =
    teacherDetails && typeof teacherDetails === "object"
      ? (teacherDetails as Record<string, unknown>)
      : null;

  const teacherAvatarUrl = buildAvatarUri({
    avatarPath:
      (teacherDetailsRecord?.["avatarUrl"] as string | null | undefined) ??
      (teacherDetailsRecord?.["avatar_url"] as string | null | undefined) ??
      null,
    avatar:
      (teacherDetailsRecord?.["avatar"] as string | null | undefined) ?? null,
    media:
      (teacherDetailsRecord?.["media"] as
        | Array<{
            tag?: string;
            file_path?: string | null;
            thumbnail?: string | null;
            full_url?: string | null;
            fullUrl?: string | null;
            url?: string | null;
          }>
        | null
        | undefined) ?? null,
  });

  const trailerUrl = teacherDetails?.trailerUrl ?? null;
  const trailerThumbnail = teacherDetails?.trailerThumbnail ?? null;
  const hasTrailer = !!(typeof trailerUrl === "string" && trailerUrl.trim());

  const trailerPlayer = useVideoPlayer(hasTrailer ? trailerUrl : null, (p) => {
    p.loop = false;
    p.muted = false;
    p.volume = 1.0;
  });

  const [saveTeacherReview, { isLoading: isSavingReview }] =
    useSaveTeacherReviewMutation();

  const heroColors = isDark
    ? (["#06263E", "#071A2D", "#040D18"] as const)
    : (["#E8F8FF", "#F1FBFF", "#EEF4FA"] as const);

  const trailerModalColors = isDark
    ? (["#081B31", "#071729", "#050F1E"] as const)
    : (["#F2FBFF", "#F7FBFF", "#EDF4FA"] as const);

  const freeTrialColors = isDark
    ? (["#2A2106", "#1C1605", "#120F03"] as const)
    : (["#FFF4C9", "#FFF8DD", "#FFFCEF"] as const);

  const accentColor = colors.primary ?? "#2CC6D0";
  const heroTextColor = isDark ? "#ECF7FF" : "#122B45";
  const reviewStarColor = "#F7C94C";

  const planItems: PlanItem[] = buildStaticPlanItems(t);
  const meetingItems: MeetingItem[] = buildStaticMeetingItems(t);

  const handleToggleFollow = useCallback(() => {
    void onToggleFollow();
  }, [onToggleFollow]);

  const handleSubmitReview = useCallback(async () => {
    if (!teacherId || isSavingReview) return;

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError(t(TEACHER_PROFILE_UI.reviewSelectRatingError));
      return;
    }

    setReviewError(null);

    try {
      await saveTeacherReview({
        teacherId,
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      }).unwrap();

      await refetchTeacher();
      closeReview();
    } catch {
      setReviewError(t(TEACHER_PROFILE_UI.reviewSaveFailed));
    }
  }, [
    closeReview,
    isSavingReview,
    refetchTeacher,
    reviewComment,
    reviewRating,
    saveTeacherReview,
    t,
    teacherId,
  ]);

  if (!teacherId) {
    return (
      <View style={[styles.page, styles.center]}>
        <Text style={styles.errorText}>
          {t(TEACHER_PROFILE_UI.invalidTeacher)}
        </Text>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.retryBtn}
          activeOpacity={0.92}
        >
          <Text style={styles.retryText}>{t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isTeacherLoading && !teacher) {
    return (
      <View style={[styles.page, styles.center]}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  if (isTeacherError || !teacher) {
    return (
      <View style={[styles.page, styles.center]}>
        <Text style={styles.errorText}>
          {t(TEACHER_PROFILE_UI.loadFailed)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            void refetchTeacher();
          }}
          style={styles.retryBtn}
          activeOpacity={0.92}
        >
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      >
        <LinearGradient
          colors={heroColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroHeader, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.heroGlowLeft} />
          <View style={styles.heroGlowRight} />

          <View style={styles.heroTopRow}>
            <TouchableOpacity
              onPress={onGoBack}
              style={styles.backButton}
              activeOpacity={0.92}
            >
              <Ionicons name="arrow-back" size={22} color={heroTextColor} />
            </TouchableOpacity>

            <Text style={styles.heroScreenTitle} numberOfLines={1}>
              {t(TEACHER_PROFILE_UI.title)}
            </Text>

            <TouchableOpacity
              style={[styles.trailerButton, !hasTrailer && { opacity: 0.55 }]}
              activeOpacity={0.92}
              onPress={() => {
                if (hasTrailer) openTrailer();
              }}
              disabled={!hasTrailer}
            >
              <Ionicons name="play" size={14} color={accentColor} />
              <Text style={styles.trailerButtonText}>
                {t(TEACHER_PROFILE_UI.trailer)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarCard}>
              {teacherAvatarUrl ? (
                <Image source={{ uri: teacherAvatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitials}>{teacher.initials}</Text>
                </View>
              )}
            </View>

            <View style={styles.profileTextWrap}>
              <Text style={styles.teacherName} numberOfLines={2}>
                {teacher.fullName}
              </Text>

              <View style={styles.teacherMetaRow}>
                <Ionicons
                  name="book-outline"
                  size={13}
                  color={isDark ? "#8FA4B7" : "#7B8EA3"}
                  style={{ marginLeft: 4 }}
                />
                <Text style={styles.teacherMetaText}>{teacher.subject}</Text>
                <View style={styles.teacherMetaDot} />
                <Text style={styles.teacherMetaText}>
                  {teacher.yearsExperience
                    ? t(TEACHER_PROFILE_UI.yearsExperienceLabel, {
                        count: teacher.yearsExperience,
                      })
                    : t(TEACHER_PROFILE_UI.experienceFallback)}
                </Text>
              </View>

              <View style={styles.teacherInfoRow}>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={13} color={reviewStarColor} />
                  <Text style={styles.ratingPillText}>
                    {formatRating(teacher.ratingAverage)}
                  </Text>
                </View>
                <Text style={styles.teacherInfoText}>
                  {teacher.reviewsCount} {t(TEACHER_PROFILE_UI.reviews)}
                </Text>
                <Text style={styles.teacherInfoSeparator}>•</Text>
                <Text style={styles.teacherInfoText}>
                  {teacher.studentsCount} {t(TEACHER_PROFILE_UI.students)}
                </Text>
              </View>
            </View>
          </View>

          {teacher.badges.length > 0 && (
            <View style={styles.badgesRow}>
              {teacher.badges.map((badge, index) => (
                <View key={`${badge.label}-${index}`} style={styles.badgeChip}>
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {badge.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={handleToggleFollow}
              style={[
                styles.followStatusPill,
                teacher.isFollowed && styles.followStatusPillActive,
              ]}
              disabled={isFollowing}
            >
              <Ionicons
                name={
                  teacher.isFollowed
                    ? "checkmark-circle"
                    : "person-add-outline"
                }
                size={16}
                color={teacher.isFollowed ? "#082337" : accentColor}
              />
              <Text
                style={[
                  styles.followStatusText,
                  teacher.isFollowed && styles.followStatusTextActive,
                ]}
              >
                {isFollowing
                  ? t("common.loading")
                  : teacher.isFollowed
                  ? t(TEACHER_PROFILE_UI.followed)
                  : t(TEACHER_PROFILE_UI.follow)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.92}
              onPress={openFollowers}
              style={styles.followersButton}
            >
              <Ionicons name="people-outline" size={16} color={accentColor} />
              <Text style={styles.followersButtonText}>
                {teacher.followersCount} {t(TEACHER_PROFILE_UI.followers)}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={freeTrialColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.freeTrialCard}
        >
          <View style={styles.freeTrialInnerRow}>
            <Ionicons name="chevron-back" size={18} color="#E7B01A" />
            <View style={styles.freeTrialContent}>
              <Text style={styles.freeTrialTitle}>
                {t(TEACHER_PROFILE_UI.freeTrialTitle)}
              </Text>
              <Text style={styles.freeTrialSubtitle}>
                {t(TEACHER_PROFILE_UI.freeTrialSubtitle)}
              </Text>
            </View>
            <View style={styles.freeTrialIconWrap}>
              <Ionicons name="gift" size={24} color="#E7B01A" />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <View style={styles.sectionTitleRowRight}>
              <Text style={styles.sectionHeaderEmoji}>ℹ️</Text>
              <Text style={styles.sectionHeaderText}>
                {t(TEACHER_PROFILE_UI.noteTitle)}
              </Text>
            </View>
          </View>

          <Text style={styles.aboutMainText}>{teacher.aboutText}</Text>

          {isAboutExpanded && (
            <>
              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={accentColor}
                  />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>
                    {t(TEACHER_PROFILE_UI.bioTitle)}
                  </Text>
                  <Text style={styles.infoValue}>{teacher.bioText}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="school-outline" size={22} color={accentColor} />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>
                    {t(TEACHER_PROFILE_UI.educationTitle)}
                  </Text>
                  <Text style={styles.infoValue}>{teacher.educationText}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons
                    name="briefcase-outline"
                    size={22}
                    color={accentColor}
                  />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>
                    {t(TEACHER_PROFILE_UI.experienceTitle)}
                  </Text>
                  <Text style={styles.infoValue}>{teacher.experienceText}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="layers-outline" size={22} color={accentColor} />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>
                    {t(TEACHER_PROFILE_UI.levelsTaught)}
                  </Text>
                  <Text style={styles.infoValue}>{teacher.levelsText}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons
                    name="play-circle-outline"
                    size={22}
                    color={accentColor}
                  />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>
                    {t(TEACHER_PROFILE_UI.publishedLessons)}
                  </Text>
                  <Text style={styles.infoValue}>
                    {teacher.publishedLessonsCount}
                  </Text>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setAboutExpanded((prev) => !prev)}
            style={styles.seeMoreBtn}
          >
            <Text style={styles.seeMoreText}>
              {isAboutExpanded
                ? t(TEACHER_PROFILE_UI.seeLess)
                : t(TEACHER_PROFILE_UI.seeMore)}
            </Text>
            <Ionicons
              name={isAboutExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={accentColor}
              style={{ marginRight: 4 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.plansSection}>
          <View style={styles.sectionTitleRowRight}>
            <Text style={styles.sectionHeaderEmoji}>💎</Text>
            <Text style={styles.sectionHeaderText}>
              {t(TEACHER_PROFILE_UI.plansSectionTitle)}
            </Text>
          </View>

          {planItems.map((plan: PlanItem) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.94}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[
                  styles.planCard,
                  plan.isFeatured && styles.planCardFeatured,
                  isSelected && styles.planCardSelected,
                ]}
              >
                {plan.isFeatured && (
                  <View style={styles.planFeaturedBadge}>
                    <Text style={styles.planFeaturedBadgeText}>
                      ⭐ {t(TEACHER_PROFILE_UI.planFeaturedBadge)}
                    </Text>
                  </View>
                )}

                <View style={styles.planTopRow}>
                  <View style={styles.planSelectorWrap}>
                    <View
                      style={[
                        styles.planRadio,
                        isSelected && styles.planRadioActive,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color={accentColor} />
                      )}
                    </View>
                  </View>

                  <View style={styles.planPriceWrap}>
                    <Text style={styles.planPriceText}>{plan.priceText}</Text>
                    <Text style={styles.planPriceUnitText}>
                      {plan.unitPriceText}
                    </Text>
                  </View>

                  <View style={styles.planTitleWrap}>
                    <Text style={styles.planTitleText}>{plan.title}</Text>
                    <Text style={styles.planSummaryText}>
                      {plan.summaryText}
                    </Text>
                  </View>
                </View>

                {plan.scheduleGroups.length > 0 && (
                  <View style={styles.planSchedulesWrap}>
                    {plan.scheduleGroups.map((group) => (
                      <View
                        key={group.id}
                        style={[
                          styles.planScheduleCard,
                          group.isHighlighted && styles.planScheduleCardHot,
                        ]}
                      >
                        <View style={styles.planScheduleTopRow}>
                          <View
                            style={[
                              styles.planScheduleSelectCircle,
                              group.isSelected &&
                                styles.planScheduleSelectCircleActive,
                            ]}
                          >
                            {group.isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={12}
                                color="#FFFFFF"
                              />
                            )}
                          </View>

                          <View style={styles.planScheduleGroupCode}>
                            <Text style={styles.planScheduleGroupCodeText}>
                              {group.groupCode}
                            </Text>
                          </View>

                          <View style={styles.planScheduleMainInfo}>
                            <Text style={styles.planScheduleSessionsText}>
                              {group.summaryText}
                            </Text>
                            <View style={styles.planScheduleProgressWrap}>
                              <View style={styles.planScheduleProgressBar}>
                                <View
                                  style={[
                                    styles.planScheduleProgressFill,
                                    group.isHighlighted &&
                                      styles.planScheduleProgressFillHot,
                                    {
                                      width: `${Math.max(
                                        0,
                                        Math.min(
                                          100,
                                          group.occupancyProgress * 100
                                        )
                                      )}%`,
                                    },
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.planScheduleProgressText,
                                  group.isHighlighted &&
                                    styles.planScheduleProgressTextHot,
                                ]}
                              >
                                {group.occupancyText}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {group.times.map((time) => (
                          <View
                            key={time.id}
                            style={styles.planScheduleMetaRow}
                          >
                            <Text style={styles.planScheduleTimeText}>
                              {time.timeText}
                            </Text>
                            <Text style={styles.planScheduleDayText}>
                              {time.dayLabel}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.planAutoBookingRow}>
                  <Ionicons
                    name="infinite-outline"
                    size={15}
                    color={accentColor}
                  />
                  <Text style={styles.planAutoBookingText}>
                    {plan.autoBookingText}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity activeOpacity={0.9} style={styles.subscribeCta}>
            <Ionicons
              name="arrow-back"
              size={18}
              color="#082337"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.subscribeCtaText}>
              {t(
                TEACHER_PROFILE_UI.subscribeCta ?? "اشترك الآن – DT 80/شهر"
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.freeTrialCta}>
            <Text style={styles.freeTrialCtaText}>
              🎁 {t(
                TEACHER_PROFILE_UI.freeTrialAction ?? "حصة تجريبية مجانية"
              )}
            </Text>
          </TouchableOpacity>

          <View style={styles.cancelNoteRow}>
            <Ionicons
              name="lock-closed-outline"
              size={13}
              color={isDark ? "#8FA4B7" : "#7B8EA3"}
              style={{ marginLeft: 4 }}
            />
            <Text style={styles.cancelNoteText}>
              {t(
                TEACHER_PROFILE_UI.cancelNote ??
                  "إلغاء في أي وقت · حصص مسجّلة · ضمان 7 أيام"
              )}
            </Text>
            <Ionicons
              name="infinite-outline"
              size={13}
              color={isDark ? "#8FA4B7" : "#7B8EA3"}
              style={{ marginRight: 4 }}
            />
          </View>
        </View>

        <View style={styles.meetingsSection}>
          <View style={styles.sectionTitleRowRight}>
            <Text style={styles.sectionHeaderEmoji}>📅</Text>
            <Text style={styles.sectionHeaderText}>
              {t(TEACHER_PROFILE_UI.meetingsSectionTitle)}
            </Text>
          </View>

          {meetingItems.map((meeting: MeetingItem) => (
            <View key={meeting.id} style={styles.meetingCard}>
              <View style={styles.meetingIconWrap}>
                <Ionicons
                  name="videocam-outline"
                  size={22}
                  color={accentColor}
                />
              </View>
              <View style={styles.meetingContent}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                <Text style={styles.meetingSubtitle}>{meeting.subtitle}</Text>
                <View style={styles.meetingMetaRow}>
                  <Text style={styles.meetingTimeText}>
                    {meeting.dayLabel} • {meeting.timeText}
                  </Text>
                  <Text style={styles.meetingMetaSeparator}>•</Text>
                  <Text style={styles.meetingSeatsText}>{meeting.seatsText}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.meetingStatusPill,
                  meeting.isSoon && styles.meetingStatusPillSoon,
                ]}
              >
                <Text style={styles.meetingStatusText}>
                  {meeting.statusText}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeaderRow}>
            <View style={styles.sectionTitleRowRight}>
              <Text style={styles.sectionHeaderEmoji}>💬</Text>
              <Text style={styles.sectionHeaderText}>
                {t(TEACHER_PROFILE_UI.reviewsSectionTitle)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.92}
              onPress={openReview}
              style={styles.reviewActionBtn}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={accentColor}
                style={styles.reviewActionIcon}
              />
              <Text style={styles.reviewActionBtnText}>
                {t(TEACHER_PROFILE_UI.reviewAction)}
              </Text>
            </TouchableOpacity>
          </View>

          {teacher.reviewItems.length === 0 ? (
            <View style={styles.reviewsEmptyCard}>
              <Text style={styles.reviewsEmptyText}>
                {t(TEACHER_PROFILE_UI.noReviews)}
              </Text>
            </View>
          ) : (
            teacher.reviewItems.map((review: ReviewItem) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewStarsRow}>
                    {renderStars(
                      review.rating,
                      reviewStarColor,
                      styles.reviewStarIcon
                    )}
                  </View>

                  {(review.authorLabel || review.levelLabel) && (
                    <View style={styles.reviewMetaRow}>
                      {review.levelLabel && (
                        <Text style={styles.reviewMetaText}>
                          {review.levelLabel}
                        </Text>
                      )}
                      {review.authorLabel && review.levelLabel && (
                        <Text style={styles.reviewMetaSeparator}>•</Text>
                      )}
                      {review.authorLabel && (
                        <Text style={styles.reviewMetaText}>
                          {review.authorLabel}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                <Text style={styles.reviewCommentText}>
                  {`"${review.comment}"`}
                </Text>
              </View>
            ))
          )}
        </View>

        {teacher.lessonItems.length > 0 && (
          <View style={styles.lessonsSection}>
            <View style={styles.sectionTitleRowRight}>
              <Text style={styles.sectionHeaderEmoji}>▶️</Text>
              <Text style={styles.sectionHeaderText}>
                {t(TEACHER_PROFILE_UI.lessonSamplesTitle)}
              </Text>
            </View>

            {teacher.lessonItems.map((lesson: LessonItem) => (
              <View key={lesson.id} style={styles.lessonCard}>
                <View
                  style={[
                    styles.lessonIndexBadge,
                    lesson.index === 1 && styles.lessonIndexBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.lessonIndexText,
                      lesson.index === 1 && styles.lessonIndexTextActive,
                    ]}
                  >
                    {lesson.index}
                  </Text>
                </View>

                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                  {lesson.viewsText && (
                    <View style={styles.lessonMetaRow}>
                      <Text style={styles.lessonMetaText}>
                        {lesson.viewsText}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.lessonPlayBox}>
                  <View style={styles.lessonPlayCircle}>
                    <Ionicons name="play" size={16} color={accentColor} />
                  </View>
                  {lesson.durationText && (
                    <Text style={styles.lessonDurationText}>
                      {lesson.durationText}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isFollowersVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeFollowers}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.followersModalCard}>
            <View style={styles.followersModalHeader}>
              <TouchableOpacity
                onPress={closeFollowers}
                style={styles.followersModalClose}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDark ? "#ECF7FF" : "#122B45"}
                />
              </TouchableOpacity>
              <Text style={styles.followersModalTitle}>
                {t(TEACHER_PROFILE_UI.followersTitle)}
              </Text>
              <View style={styles.followersModalClosePlaceholder} />
            </View>

            {isFollowersLoading ? (
              <View style={styles.modalCenter}>
                <ActivityIndicator size="small" color={accentColor} />
              </View>
            ) : isFollowersError ? (
              <View style={styles.modalCenter}>
                <Text style={styles.modalErrorText}>
                  {t(TEACHER_PROFILE_UI.followersLoadFailed)}
                </Text>
                <TouchableOpacity
                  style={styles.smallRetryBtn}
                  onPress={() => {
                    void refetchFollowers();
                  }}
                  activeOpacity={0.92}
                >
                  <Text style={styles.smallRetryText}>{t("common.retry")}</Text>
                </TouchableOpacity>
              </View>
            ) : followers.length === 0 ? (
              <View style={styles.modalCenter}>
                <Text style={styles.modalEmptyText}>
                  {t(TEACHER_PROFILE_UI.noFollowers)}
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.followersListContent}
              >
                {followers.map((follower: FollowerVM) => (
                  <View key={String(follower.id)} style={styles.followerRow}>
                    <View style={styles.followerAvatarWrap}>
                      {follower.avatarUrl ? (
                        <Image
                          source={{ uri: follower.avatarUrl }}
                          style={styles.followerAvatar}
                        />
                      ) : (
                        <View
                          style={[
                            styles.followerAvatar,
                            styles.followerAvatarFallback,
                          ]}
                        >
                          <Text style={styles.followerInitials}>
                            {follower.initials}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.followerInfo}>
                      <Text style={styles.followerName} numberOfLines={1}>
                        {follower.fullName}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isTrailerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeTrailer}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeTrailer} />
          <LinearGradient
            colors={trailerModalColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trailerModalCard}
          >
            <View style={styles.trailerHeader}>
              <View style={styles.trailerHeaderSpacer} />
              <View style={styles.trailerHeaderCenter}>
                <Text style={styles.trailerHeaderTitle}>
                  {t(TEACHER_PROFILE_UI.trailer)}
                </Text>
                <Text
                  style={styles.trailerHeaderSubtitle}
                  numberOfLines={1}
                >
                  {teacher.fullName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trailerCloseButton}
                onPress={closeTrailer}
                activeOpacity={0.9}
              >
                <Ionicons name="close" size={20} color={heroTextColor} />
              </TouchableOpacity>
            </View>

            {hasTrailer ? (
              <View style={styles.trailerVideoShell}>
                <View style={styles.trailerVideoContainer}>
                  <VideoView
                    player={trailerPlayer}
                    style={styles.trailerVideoFull}
                    contentFit="cover"
                    nativeControls
                  />
                </View>
              </View>
            ) : (
              <View style={styles.trailerEmptyState}>
                <TouchableOpacity
                  style={styles.trailerPlayOuter}
                  activeOpacity={0.92}
                  disabled
                >
                  <View style={styles.trailerPlayInner}>
                    <Ionicons
                      name="play"
                      size={34}
                      color={isDark ? "#EAF8FF" : "#12354A"}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.trailerProgressTrack}>
                  <View style={styles.trailerProgressFill} />
                </View>
                <Text style={styles.trailerHintText}>
                  {t(TEACHER_PROFILE_UI.tapToPlay)}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </Modal>

      <Modal
        visible={isReviewVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeReview}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={Keyboard.dismiss} />
          <KeyboardAvoidingView
            style={styles.reviewModalKeyboardWrap}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
              contentContainerStyle={styles.reviewModalScrollContent}
            >
              <View style={styles.reviewModalCard}>
                <View style={styles.reviewModalHeader}>
                  <TouchableOpacity
                    onPress={closeReview}
                    style={styles.reviewModalClose}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={isDark ? "#ECF7FF" : "#122B45"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.reviewModalTitle}>
                    {t(TEACHER_PROFILE_UI.reviewModalTitle)}
                  </Text>
                  <View style={styles.followersModalClosePlaceholder} />
                </View>

                <Text style={styles.reviewModalLabel}>
                  {t(TEACHER_PROFILE_UI.reviewRatingLabel)}
                </Text>

                <View style={styles.reviewStarsPicker}>
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    const isActive = reviewRating >= starValue;

                    return (
                      <TouchableOpacity
                        key={`picker-star-${starValue}`}
                        activeOpacity={0.9}
                        onPress={() => {
                          setReviewError(null);
                          setReviewRating(starValue);
                          Keyboard.dismiss();
                        }}
                        style={[
                          styles.reviewStarBtn,
                          isActive && styles.reviewStarBtnActive,
                        ]}
                      >
                        <Ionicons
                          name={isActive ? "star" : "star-outline"}
                          size={28}
                          color={reviewStarColor}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.reviewModalLabel}>
                  {t(TEACHER_PROFILE_UI.reviewCommentLabel)}
                </Text>

                <TextInput
                  value={reviewComment}
                  onChangeText={(text) => {
                    setReviewError(null);
                    setReviewComment(text);
                  }}
                  multiline
                  textAlignVertical="top"
                  placeholder={t(
                    TEACHER_PROFILE_UI.reviewCommentPlaceholder
                  )}
                  placeholderTextColor={isDark ? "#6F879C" : "#95A5B4"}
                  style={styles.reviewInput}
                />

                <Text style={styles.reviewHintText}>
                  {t(TEACHER_PROFILE_UI.reviewCommentHint)}
                </Text>

                {reviewError && (
                  <Text style={styles.reviewErrorText}>{reviewError}</Text>
                )}

                <TouchableOpacity
                  activeOpacity={0.94}
                  onPress={handleSubmitReview}
                  disabled={isSavingReview}
                  style={[
                    styles.reviewSubmitBtn,
                    isSavingReview && styles.reviewSubmitBtnDisabled,
                  ]}
                >
                  <Text style={styles.reviewSubmitBtnText}>
                    {isSavingReview
                      ? t(TEACHER_PROFILE_UI.reviewSaving)
                      : t(TEACHER_PROFILE_UI.reviewSubmit)}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}