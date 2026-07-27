import { StyleSheet } from "react-native";

type TeacherProfileStyleColors = {
  primary?: string;
  danger?: string;
};

export function createTeacherProfileStyles(
  colors: TeacherProfileStyleColors,
  isDark: boolean
) {
  const pageBg = isDark ? "#04111C" : "#F4F8FC";
  const cardBg = isDark ? "#091523" : "#FFFFFF";
  const modalCardBg = isDark ? "#081523" : "#FFFFFF";
  const border = isDark ? "rgba(56,210,228,0.16)" : "rgba(36,86,124,0.10)";
  const strongBorder = isDark
    ? "rgba(56,210,228,0.30)"
    : "rgba(36,86,124,0.16)";
  const text = isDark ? "#F2FAFF" : "#15314A";
  const muted = isDark ? "#8FA4B7" : "#7B8EA3";
  const accent = colors.primary ?? "#2CC6D0";
  const danger = colors.danger ?? "#EF4444";
  const shadowColor = isDark ? "#000000" : "#6E8AA4";
  const success = "#25C76F";
  const warm = "#F59E0B";

  return StyleSheet.create({
    page: { flex: 1, backgroundColor: pageBg },

    scroll: { flex: 1 },

    scrollContent: {
      paddingHorizontal: 14,
      paddingBottom: 40,
    },

    heroHeader: {
      overflow: "hidden",
      marginHorizontal: -24,
      marginTop: -2,
      paddingHorizontal: 28,
      paddingBottom: 24,
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderWidth: 1,
      borderColor: strongBorder,
      shadowColor,
      shadowOpacity: isDark ? 0.34 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },

    heroGlowLeft: {
      position: "absolute",
      left: -80,
      bottom: -60,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: isDark
        ? "rgba(44,198,208,0.10)"
        : "rgba(44,198,208,0.08)",
    },

    heroGlowRight: {
      position: "absolute",
      right: -30,
      top: -40,
      width: 190,
      height: 190,
      borderRadius: 95,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.28)",
    },

    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.20)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.12)"
        : "rgba(56,95,126,0.12)",
    },

    heroScreenTitle: {
      flex: 1,
      textAlign: "center",
      color: muted,
      fontSize: 15,
      fontWeight: "800",
      paddingHorizontal: 10,
    },

    trailerButton: {
      minWidth: 98,
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(10,102,121,0.36)"
        : "rgba(255,255,255,0.20)",
      borderWidth: 1,
      borderColor: strongBorder,
      gap: 6,
    },

    trailerButtonText: {
      color: accent,
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
    },

    profileRow: {
      marginTop: 28,
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    profileTextWrap: {
      flex: 1,
      alignItems: "flex-end",
      paddingRight: 15,
      paddingLeft: 25,
    },

    teacherName: {
      color: text,
      fontSize: 22,
      fontWeight: "900",
      lineHeight: 30,
      textAlign: "right",
      width: "100%",
    },

    teacherMetaRow: {
      marginTop: 6,
      flexDirection: "row-reverse",
      alignItems: "center",
      flexWrap: "wrap",
      width: "100%",
    },

    teacherMetaText: {
      color: muted,
      fontSize: 13,
      fontWeight: "700",
      textAlign: "right",
    },

    teacherMetaDot: {
      width: 4,
      height: 4,
      borderRadius: 99,
      backgroundColor: muted,
      marginHorizontal: 6,
      opacity: 0.7,
    },

    teacherInfoRow: {
      marginTop: 10,
      flexDirection: "row-reverse",
      alignItems: "center",
      flexWrap: "wrap",
      width: "100%",
    },

    teacherInfoText: {
      color: muted,
      fontSize: 13,
      fontWeight: "700",
    },

    teacherInfoSeparator: {
      color: muted,
      fontSize: 13,
      fontWeight: "900",
      marginHorizontal: 6,
    },

    ratingPill: {
      marginLeft: 8,
      minWidth: 60,
      height: 28,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(247,201,76,0.28)"
        : "rgba(247,201,76,0.32)",
      backgroundColor: isDark
        ? "rgba(247,201,76,0.12)"
        : "rgba(247,201,76,0.14)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },

    ratingPillText: {
      color: text,
      fontSize: 13,
      fontWeight: "900",
    },

    avatarCard: {
      width: 90,
      height: 90,
      borderRadius: 26,
      padding: 4,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(49,207,225,0.35)"
        : "rgba(255,255,255,0.82)",
      backgroundColor: isDark
        ? "rgba(6,40,57,0.82)"
        : "rgba(255,255,255,0.62)",
      shadowColor,
      shadowOpacity: isDark ? 0.28 : 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      flexShrink: 0,
    },

    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 22,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#DCEAF5",
    },

    avatarFallback: {
      alignItems: "center",
      justifyContent: "center",
    },

    avatarInitials: {
      color: text,
      fontSize: 26,
      fontWeight: "900",
    },

    badgesRow: {
      marginTop: 16,
      flexDirection: "row-reverse",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 6,
    },

    badgeChip: {
      height: 32,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: isDark
        ? "rgba(18,40,63,0.86)"
        : "rgba(255,255,255,0.58)",
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
      gap: 4,
    },

    badgeEmoji: {
      fontSize: 12,
    },

    badgeText: {
      color: text,
      fontSize: 11,
      fontWeight: "800",
    },

    headerActionsRow: {
      marginTop: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    followersButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: 999,
      paddingHorizontal: 14,
      backgroundColor: isDark
        ? "rgba(18,40,63,0.86)"
        : "rgba(255,255,255,0.60)",
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    followersButtonText: {
      color: text,
      fontSize: 13,
      fontWeight: "800",
    },

    followStatusPill: {
      minWidth: 126,
      minHeight: 42,
      borderRadius: 999,
      paddingHorizontal: 14,
      backgroundColor: isDark
        ? "rgba(18,40,63,0.86)"
        : "rgba(255,255,255,0.60)",
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    followStatusPillActive: {
      backgroundColor: accent,
      borderColor: accent,
    },

    followStatusText: {
      color: accent,
      fontSize: 13,
      fontWeight: "900",
    },

    followStatusTextActive: {
      color: "#082337",
    },

    freeTrialCard: {
      marginTop: 14,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(233,177,27,0.40)"
        : "rgba(233,177,27,0.30)",
      shadowColor: warm,
      shadowOpacity: isDark ? 0.18 : 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    freeTrialInnerRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    freeTrialIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,220,105,0.12)"
        : "rgba(255,220,105,0.22)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,220,105,0.22)"
        : "rgba(255,220,105,0.30)",
      flexShrink: 0,
    },

    freeTrialContent: {
      flex: 1,
      paddingHorizontal: 12,
    },

    freeTrialTitle: {
      color: text,
      fontSize: 20,
      fontWeight: "900",
      textAlign: "right",
    },

    freeTrialSubtitle: {
      marginTop: 3,
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
    },

    aboutCard: {
      marginTop: 14,
      borderRadius: 26,
      padding: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      shadowColor,
      shadowOpacity: isDark ? 0.22 : 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },

    aboutHeaderRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    aboutMainText: {
      marginTop: 12,
      color: text,
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 26,
      textAlign: "right",
    },

    seeMoreBtn: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      alignSelf: "flex-end",
    },

    seeMoreText: {
      color: accent,
      fontSize: 13,
      fontWeight: "900",
    },

    sectionTitleRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    sectionTitleRowRight: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-start",
      alignSelf: "flex-end",
      marginBottom: 12,
    },

    sectionHeaderEmoji: {
      fontSize: 18,
      marginLeft: 6,
    },

    sectionHeaderText: {
      color: accent,
      fontSize: 18,
      fontWeight: "900",
      textAlign: "right",
    },

    separator: {
      height: 1,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.07)"
        : "rgba(34,82,118,0.08)",
      marginTop: 14,
    },

    infoRow: {
      marginTop: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    infoIconWrap: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: isDark
        ? "rgba(44,198,208,0.10)"
        : "rgba(44,198,208,0.08)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.18)"
        : "rgba(44,198,208,0.12)",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    infoTextWrap: {
      flex: 1,
      paddingRight: 12,
    },

    infoLabel: {
      color: accent,
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
    },

    infoValue: {
      marginTop: 4,
      color: text,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 20,
      textAlign: "right",
    },

    plansSection: {
      marginTop: 18,
    },

    planCard: {
      marginTop: 12,
      borderRadius: 24,
      padding: 14,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      shadowColor,
      shadowOpacity: isDark ? 0.18 : 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    planCardFeatured: {
      backgroundColor: isDark ? "#08252D" : "#F0FEFF",
      borderColor: isDark
        ? "rgba(44,198,208,0.55)"
        : "rgba(44,198,208,0.34)",
      shadowColor: accent,
      shadowOpacity: isDark ? 0.22 : 0.1,
    },

    planCardSelected: {
      borderColor: accent,
    },

    planFeaturedBadge: {
      alignSelf: "center",
      marginBottom: 12,
      height: 30,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: isDark
        ? "rgba(44,198,208,0.22)"
        : "rgba(44,198,208,0.14)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.30)"
        : "rgba(44,198,208,0.20)",
    },

    planFeaturedBadgeText: {
      color: isDark ? "#EFFFFF" : "#0E6A76",
      fontSize: 12,
      fontWeight: "900",
    },

    planTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    planTitleWrap: {
      flex: 1,
      alignItems: "flex-end",
    },

    planTitleText: {
      color: text,
      fontSize: 20,
      fontWeight: "900",
      textAlign: "right",
    },

    planSummaryText: {
      marginTop: 3,
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
    },

    planPriceWrap: {
      minWidth: 90,
      alignItems: "flex-start",
      paddingHorizontal: 10,
    },

    planPriceText: {
      color: text,
      fontSize: 24,
      fontWeight: "900",
    },

    planPriceUnitText: {
      marginTop: 2,
      color: muted,
      fontSize: 11,
      fontWeight: "700",
    },

    planSelectorWrap: {
      width: 36,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    planRadio: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1.5,
      borderColor: muted,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
    },

    planRadioActive: {
      borderColor: accent,
      backgroundColor: isDark
        ? "rgba(44,198,208,0.16)"
        : "rgba(44,198,208,0.10)",
    },

    planSchedulesWrap: {
      marginTop: 12,
    },

    planScheduleCard: {
      marginTop: 10,
      borderRadius: 16,
      padding: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F7FBFF",
      borderWidth: 1,
      borderColor: border,
    },

    planScheduleCardHot: {
      borderColor: "rgba(243,195,75,0.34)",
      backgroundColor: isDark
        ? "rgba(243,195,75,0.06)"
        : "rgba(243,195,75,0.08)",
    },

    planScheduleTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    planScheduleMainInfo: {
      flex: 1,
      alignItems: "flex-end",
      paddingLeft: 8,
    },

    planScheduleSessionsText: {
      color: text,
      fontSize: 13,
      fontWeight: "900",
      textAlign: "right",
      marginBottom: 6,
    },

    planScheduleProgressWrap: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 6,
    },

    planScheduleProgressText: {
      color: success,
      fontSize: 12,
      fontWeight: "900",
    },

    planScheduleProgressTextHot: {
      color: warm,
    },

    planScheduleProgressBar: {
      width: 60,
      height: 4,
      borderRadius: 99,
      overflow: "hidden",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(21,49,74,0.10)",
    },

    planScheduleProgressFill: {
      height: "100%",
      borderRadius: 99,
      backgroundColor: success,
    },

    planScheduleProgressFillHot: {
      backgroundColor: warm,
    },

    planScheduleGroupCode: {
      minWidth: 48,
      height: 26,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(44,198,208,0.14)"
        : "rgba(44,198,208,0.10)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.22)"
        : "rgba(44,198,208,0.18)",
      marginHorizontal: 6,
    },

    planScheduleGroupCodeText: {
      color: accent,
      fontSize: 11,
      fontWeight: "900",
    },

    planScheduleSelectCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.4,
      borderColor: muted,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    planScheduleSelectCircleActive: {
      borderColor: accent,
      backgroundColor: accent,
    },

    planScheduleMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 10,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(21,49,74,0.03)",
    },

    planScheduleDayText: {
      color: text,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "right",
    },

    planScheduleTimeText: {
      color: accent,
      fontSize: 13,
      fontWeight: "900",
    },

    planAutoBookingRow: {
      marginTop: 12,
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 6,
    },

    planAutoBookingText: {
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
    },

    subscribeCta: {
      marginTop: 18,
      height: 54,
      borderRadius: 18,
      backgroundColor: accent,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    subscribeCtaText: {
      color: "#082337",
      fontSize: 16,
      fontWeight: "900",
      textAlign: "center",
    },

    freeTrialCta: {
      marginTop: 12,
      height: 50,
      borderRadius: 18,
      backgroundColor: isDark
        ? "rgba(247,201,76,0.14)"
        : "rgba(247,201,76,0.16)",
      borderWidth: 1.5,
      borderColor: isDark
        ? "rgba(247,201,76,0.40)"
        : "rgba(247,201,76,0.45)",
      alignItems: "center",
      justifyContent: "center",
    },

    freeTrialCtaText: {
      color: isDark ? "#F7C94C" : "#9A7010",
      fontSize: 15,
      fontWeight: "900",
    },

    cancelNoteRow: {
      marginTop: 10,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },

    cancelNoteText: {
      color: muted,
      fontSize: 11,
      fontWeight: "700",
      textAlign: "center",
    },

    meetingsSection: {
      marginTop: 18,
    },

    meetingCard: {
      marginTop: 12,
      borderRadius: 20,
      padding: 14,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row-reverse",
      alignItems: "center",
      shadowColor,
      shadowOpacity: isDark ? 0.16 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    meetingIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(44,198,208,0.10)"
        : "rgba(44,198,208,0.08)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.18)"
        : "rgba(44,198,208,0.12)",
      flexShrink: 0,
    },

    meetingContent: {
      flex: 1,
      paddingHorizontal: 12,
    },

    meetingTitle: {
      color: text,
      fontSize: 15,
      fontWeight: "900",
      textAlign: "right",
    },

    meetingSubtitle: {
      marginTop: 3,
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
    },

    meetingMetaRow: {
      marginTop: 6,
      flexDirection: "row-reverse",
      alignItems: "center",
      flexWrap: "wrap",
    },

    meetingTimeText: {
      color: text,
      fontSize: 12,
      fontWeight: "800",
    },

    meetingMetaSeparator: {
      color: muted,
      fontSize: 12,
      marginHorizontal: 5,
    },

    meetingSeatsText: {
      color: accent,
      fontSize: 12,
      fontWeight: "900",
    },

    meetingStatusPill: {
      minWidth: 68,
      height: 28,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(35,193,107,0.14)"
        : "rgba(35,193,107,0.10)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(35,193,107,0.24)"
        : "rgba(35,193,107,0.16)",
      flexShrink: 0,
    },

    meetingStatusPillSoon: {
      backgroundColor: isDark
        ? "rgba(243,195,75,0.12)"
        : "rgba(243,195,75,0.12)",
      borderColor: isDark
        ? "rgba(243,195,75,0.24)"
        : "rgba(243,195,75,0.18)",
    },

    meetingStatusText: {
      color: text,
      fontSize: 11,
      fontWeight: "900",
    },

    reviewsSection: {
      marginTop: 18,
    },

    reviewsHeaderRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    reviewActionBtn: {
      minHeight: 36,
      borderRadius: 999,
      paddingHorizontal: 14,
      backgroundColor: isDark
        ? "rgba(18,40,63,0.86)"
        : "rgba(255,255,255,0.70)",
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    reviewActionBtnText: {
      color: accent,
      fontSize: 13,
      fontWeight: "900",
    },

    reviewActionIcon: {},

    reviewsEmptyCard: {
      borderRadius: 20,
      padding: 18,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
    },

    reviewsEmptyText: {
      color: muted,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },

    reviewCard: {
      marginTop: 12,
      borderRadius: 20,
      padding: 14,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      shadowColor,
      shadowOpacity: isDark ? 0.16 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    reviewTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    reviewStarsRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    reviewStarIcon: {
      marginRight: 2,
    },

    reviewMetaRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 4,
    },

    reviewMetaText: {
      color: muted,
      fontSize: 12,
      fontWeight: "800",
    },

    reviewMetaSeparator: {
      color: muted,
      fontSize: 12,
      fontWeight: "900",
    },

    reviewCommentText: {
      marginTop: 10,
      color: text,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 22,
      textAlign: "right",
    },

    lessonsSection: {
      marginTop: 18,
    },

    lessonCard: {
      marginTop: 12,
      borderRadius: 20,
      padding: 12,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row-reverse",
      alignItems: "center",
      shadowColor,
      shadowOpacity: isDark ? 0.16 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    lessonIndexBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(21,49,74,0.10)",
      flexShrink: 0,
    },

    lessonIndexBadgeActive: {
      backgroundColor: isDark ? "#F2B90B" : "#FFC21A",
    },

    lessonIndexText: {
      color: text,
      fontSize: 13,
      fontWeight: "900",
    },

    lessonIndexTextActive: {
      color: "#082337",
    },

    lessonContent: {
      flex: 1,
      paddingHorizontal: 12,
    },

    lessonTitle: {
      color: text,
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
    },

    lessonMetaRow: {
      marginTop: 4,
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    lessonMetaText: {
      color: muted,
      fontSize: 12,
      fontWeight: "700",
    },

    lessonPlayBox: {
      width: 72,
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.28)"
        : "rgba(44,198,208,0.18)",
      backgroundColor: isDark
        ? "rgba(44,198,208,0.08)"
        : "rgba(44,198,208,0.06)",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
      flexShrink: 0,
    },

    lessonPlayCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(44,198,208,0.16)"
        : "rgba(44,198,208,0.12)",
    },

    lessonDurationText: {
      marginTop: 4,
      color: text,
      fontSize: 11,
      fontWeight: "900",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(2,8,15,0.72)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
      paddingVertical: 24,
    },

    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },

    followersModalCard: {
      width: "100%",
      maxHeight: "76%",
      borderRadius: 26,
      backgroundColor: modalCardBg,
      borderWidth: 1,
      borderColor: strongBorder,
      padding: 16,
    },

    followersModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },

    followersModalClose: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(56,95,126,0.10)",
      borderWidth: 1,
      borderColor: border,
    },

    followersModalClosePlaceholder: {
      width: 38,
      height: 38,
    },

    followersModalTitle: {
      flex: 1,
      textAlign: "center",
      color: text,
      fontSize: 17,
      fontWeight: "900",
      paddingHorizontal: 10,
    },

    modalCenter: {
      minHeight: 140,
      alignItems: "center",
      justifyContent: "center",
    },

    modalErrorText: {
      color: danger,
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 12,
    },

    modalEmptyText: {
      color: muted,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },

    smallRetryBtn: {
      minHeight: 40,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: accent,
      alignItems: "center",
      justifyContent: "center",
    },

    smallRetryText: {
      color: "#082337",
      fontSize: 13,
      fontWeight: "900",
    },

    followersListContent: {
      paddingTop: 6,
      paddingBottom: 4,
    },

    followerRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },

    followerAvatarWrap: {
      marginLeft: 12,
    },

    followerAvatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#DCEAF5",
    },

    followerAvatarFallback: {
      alignItems: "center",
      justifyContent: "center",
    },

    followerInitials: {
      color: text,
      fontSize: 15,
      fontWeight: "900",
    },

    followerInfo: {
      flex: 1,
    },

    followerName: {
      color: text,
      fontSize: 14,
      fontWeight: "800",
      textAlign: "right",
    },

    trailerModalCard: {
      width: "100%",
      maxHeight: "90%",
      borderRadius: 32,
      borderWidth: 1,
      borderColor: strongBorder,
      overflow: "hidden",
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 16,
      shadowColor,
      shadowOpacity: isDark ? 0.28 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },

    trailerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    trailerHeaderSpacer: {
      width: 44,
      height: 44,
    },

    trailerHeaderCenter: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 10,
    },

    trailerHeaderTitle: {
      color: text,
      fontSize: 17,
      fontWeight: "900",
      textAlign: "center",
    },

    trailerHeaderSubtitle: {
      marginTop: 3,
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "center",
    },

    trailerCloseButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(18,53,74,0.08)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(18,53,74,0.10)",
    },

    trailerVideoShell: {
      width: "100%",
      alignItems: "center",
    },

    trailerVideoContainer: {
      width: "100%",
      aspectRatio: 9 / 16,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: "#000000",
    },

    trailerVideoFull: {
      width: "100%",
      height: "100%",
      backgroundColor: "#000000",
    },

    trailerEmptyState: {
      width: "100%",
      minHeight: 380,
      paddingVertical: 28,
      alignItems: "center",
      justifyContent: "center",
    },

    trailerPlayOuter: {
      width: 100,
      height: 100,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(18,53,74,0.06)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(18,53,74,0.10)",
    },

    trailerPlayInner: {
      width: 70,
      height: 70,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(44,198,208,0.14)"
        : "rgba(44,198,208,0.12)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(44,198,208,0.24)"
        : "rgba(44,198,208,0.20)",
    },

    trailerProgressTrack: {
      width: "70%",
      height: 6,
      marginTop: 22,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(21,49,74,0.10)",
    },

    trailerProgressFill: {
      width: "32%",
      height: "100%",
      borderRadius: 999,
      backgroundColor: accent,
    },

    trailerHintText: {
      marginTop: 12,
      color: muted,
      fontSize: 13,
      fontWeight: "700",
      textAlign: "center",
    },

    reviewModalKeyboardWrap: {
      width: "100%",
      maxHeight: "88%",
      justifyContent: "center",
    },

    reviewModalScrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 8,
    },

    reviewModalCard: {
      width: "100%",
      borderRadius: 26,
      backgroundColor: modalCardBg,
      borderWidth: 1,
      borderColor: strongBorder,
      padding: 16,
    },

    reviewModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    reviewModalClose: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(56,95,126,0.10)",
      borderWidth: 1,
      borderColor: border,
    },

    reviewModalTitle: {
      flex: 1,
      textAlign: "center",
      color: text,
      fontSize: 17,
      fontWeight: "900",
      paddingHorizontal: 10,
    },

    reviewModalLabel: {
      color: accent,
      fontSize: 14,
      fontWeight: "900",
      textAlign: "right",
      marginBottom: 10,
    },

    reviewStarsPicker: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    reviewStarBtn: {
      width: 46,
      height: 46,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.04)"
        : "rgba(34,82,118,0.05)",
      borderWidth: 1,
      borderColor: border,
      marginHorizontal: 4,
    },

    reviewStarBtnActive: {
      backgroundColor: isDark
        ? "rgba(243,195,75,0.12)"
        : "rgba(243,195,75,0.14)",
      borderColor: "rgba(243,195,75,0.30)",
    },

    reviewInput: {
      minHeight: 120,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(34,82,118,0.03)",
      color: text,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "right",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },

    reviewHintText: {
      marginTop: 8,
      color: muted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
    },

    reviewErrorText: {
      marginTop: 12,
      color: danger,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
    },

    reviewSubmitBtn: {
      marginTop: 16,
      minHeight: 52,
      borderRadius: 16,
      backgroundColor: accent,
      alignItems: "center",
      justifyContent: "center",
    },

    reviewSubmitBtnDisabled: {
      opacity: 0.7,
    },

    reviewSubmitBtnText: {
      color: "#082337",
      fontSize: 15,
      fontWeight: "900",
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    errorText: {
      color: danger,
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 12,
    },

    retryBtn: {
      minHeight: 46,
      paddingHorizontal: 18,
      borderRadius: 14,
      backgroundColor: accent,
      alignItems: "center",
      justifyContent: "center",
    },

    retryText: {
      color: "#082337",
      fontSize: 14,
      fontWeight: "900",
    },
  });
}