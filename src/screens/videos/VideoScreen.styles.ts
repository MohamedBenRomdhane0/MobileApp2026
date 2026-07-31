import { I18nManager, StyleSheet } from "react-native";
import { VIDEO_PLAYER } from "./VideoScreen.constants";

type VideoStyleColors = {
  text?: string;
  muted?: string;
  primary?: string;
};

export function makeVideoStyles(colors: VideoStyleColors, isDark: boolean) {
  const isRTL = I18nManager.isRTL;

  const palette = {
    page: isDark ? "#071326" : "#F4F8FE",
    surface: isDark ? "#0D1E36" : "#FFFFFF",
    surfaceSoft: isDark ? "rgba(255,255,255,0.04)" : "#F7FBFF",
    surfaceMute: isDark ? "rgba(255,255,255,0.06)" : "#EEF5FF",
    border: isDark ? "rgba(148,163,184,0.20)" : "rgba(110,138,178,0.16)",
    text: colors.text ?? (isDark ? "#F8FAFC" : "#10233E"),
    textMuted: colors.muted ?? (isDark ? "#9FB1C8" : "#677B96"),
    accent: colors.primary ?? "#22BEC8",
    trialBadgeText: isDark ? "#E9FCFF" : "#0F766E",
    trialBadgeIcon: isDark ? "#8BE9F0" : "#0EA5A4",
    trialBadgeBg: isDark ? "rgba(34,190,200,0.16)" : "rgba(34,190,200,0.14)",
    trialBadgeBorder: isDark ? "rgba(34,190,200,0.30)" : "rgba(34,190,200,0.20)",
  };

  const shadowCard = {
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.24 : 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  };

  const shadowSoft = {
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.18 : 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  };

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: palette.page,
    },

    contentWrap: {
      flex: 1,
      backgroundColor: palette.page,
    },

    listContent: {
      paddingBottom: 34,
    },

    hero: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 18,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: "hidden",
    },

    topBar: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.92)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(110,138,178,0.12)",
      ...shadowSoft,
    },

    backIcon: {
      color: palette.text,
    },

    topUtilities: {
      flexDirection: "row",
      alignItems: "center",
    },

    topUtilityIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.86)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(110,138,178,0.12)",
      ...shadowSoft,
    },

    topUtilityIconColor: {
      color: isDark ? "rgba(255,255,255,0.72)" : "rgba(16,35,62,0.60)",
    },

    heroBadgesRow: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    heroBadgesRowRtl: {
      flexDirection: "row-reverse",
    },

    subjectBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 12,
      minHeight: 30,
      borderRadius: 999,
      backgroundColor: isDark
        ? "rgba(4,20,38,0.70)"
        : "rgba(255,255,255,0.92)",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(34,190,200,0.20)"
        : "rgba(110,138,178,0.12)",
      ...shadowSoft,
    },

    trialBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 12,
      minHeight: 30,
      borderRadius: 999,
      backgroundColor: palette.trialBadgeBg,
      borderWidth: 1,
      borderColor: palette.trialBadgeBorder,
      ...shadowSoft,
    },

    badgePlaceholder: {
      width: 1,
      height: 30,
    },

    subjectBadgeText: {
      color: palette.text,
      fontSize: 11.5,
      fontWeight: "900",
      maxWidth: 160,
      textAlign: isRTL ? "right" : "left",
    },

    trialBadgeText: {
      color: palette.trialBadgeText,
      fontSize: 11.5,
      fontWeight: "800",
      textAlign: isRTL ? "right" : "left",
    },

    trialBadgeIcon: {
      color: palette.trialBadgeIcon,
    },

    subjectIcon: {
      color: "#FACC15",
    },

    subjectIconSpacing: {
      marginHorizontal: 6,
    },

    subjectDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: palette.accent,
    },

    videoCard: {
      marginTop: 16,
      borderRadius: 28,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: "hidden",
      ...shadowCard,
    },

    playerWrap: {
      width: "100%",
      aspectRatio: VIDEO_PLAYER.aspectRatio,
      backgroundColor: "#000000",
    },

    player: {
      width: "100%",
      height: "100%",
      backgroundColor: "#000000",
    },

    body: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    title: {
      color: palette.text,
      fontSize: 21,
      fontWeight: "900",
      lineHeight: 29,
      textAlign: isRTL ? "right" : "left",
    },

    chipsRow: {
      marginTop: 14,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },

    infoChip: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 14,
      height: 38,
      borderRadius: 999,
      backgroundColor: palette.surfaceSoft,
      borderWidth: 1,
      borderColor: palette.border,
      marginHorizontal: 4,
      marginBottom: 8,
    },

    chipIcon: {
      marginHorizontal: 6,
    },

    infoChipText: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "900",
      textAlign: isRTL ? "right" : "left",
    },

    bufferingLoaderWrap: {
      marginTop: 8,
      alignItems: "center",
      justifyContent: "center",
    },

    sessionOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },

    blockedOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.55)",
      borderRadius: 24,
      paddingHorizontal: 20,
    },

    blockedOverlayText: {
      marginTop: 10,
      color: "#FFFFFF",
      textAlign: "center",
      fontSize: 15,
      fontWeight: "900",
      lineHeight: 22,
    },

    playerTimeWrap: {
      marginTop: 8,
      alignItems: "center",
    },

    playerTimeText: {
      color: "rgba(255,255,255,0.92)",
      fontSize: 11.5,
      fontWeight: "900",
    },

    teacherSection: {
      marginTop: 12,
    },

    teacherHeroRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    followTouchable: {
      width: 122,
      marginEnd: 10,
    },

    followGradient: {
      height: 46,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      ...shadowSoft,
    },

    followText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    followFilledNeutral: {
      height: 46,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: palette.surfaceSoft,
      borderWidth: 1,
      borderColor: palette.border,
    },

    followFilledNeutralText: {
      color: palette.text,
      fontSize: 13,
      fontWeight: "900",
    },

    followDisabled: {
      opacity: 0.65,
    },

    teacherInfoBlock: {
      flex: 1,
      paddingHorizontal: 10,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    teacherName: {
      width: "100%",
      color: palette.text,
      fontSize: 15,
      fontWeight: "900",
      textAlign: "right",
    },

    teacherMetaRow: {
      width: "100%",
      marginTop: 4,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    teacherMetaText: {
      color: palette.textMuted,
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "right",
    },

    teacherMetaStrong: {
      color: palette.text,
      fontSize: 12.5,
      fontWeight: "900",
      marginHorizontal: 6,
    },

    teacherStarIcon: {
      marginStart: 4,
    },

    teacherAvatarCard: {
      width: 58,
      height: 58,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(9,32,58,0.92)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(34,190,200,0.36)"
        : "rgba(34,190,200,0.22)",
      ...shadowSoft,
    },

    teacherAvatarWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: palette.surfaceMute,
    },

    teacherAvatarImg: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    },

    teacherOnlineDot: {
      position: "absolute",
      right: 4,
      bottom: 4,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: palette.accent,
      borderWidth: 2,
      borderColor: palette.surface,
    },

    teacherActionsRow: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    actionSmallCard: {
      width: 56,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: palette.border,
      ...shadowSoft,
    },

    actionWideCard: {
      flex: 1,
      marginHorizontal: 10,
      height: 48,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: palette.border,
      ...shadowSoft,
    },

    actionWideText: {
      marginStart: 8,
      color: palette.text,
      fontSize: 13,
      fontWeight: "900",
    },

    actionLikesCard: {
      width: 110,
      height: 48,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: palette.border,
      ...shadowSoft,
    },

    actionLikesCardActive: {
      backgroundColor: isDark ? "rgba(239,68,68,0.12)" : "#FFF2F2",
      borderColor: isDark
        ? "rgba(239,68,68,0.24)"
        : "rgba(239,68,68,0.18)",
    },

    actionLikesText: {
      marginEnd: 8,
      color: palette.text,
      fontSize: 13,
      fontWeight: "900",
    },

    actionIcon: {
      color: palette.textMuted,
    },

    sectionHeader: {
      marginTop: 18,
      marginBottom: 14,
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionBadge: {
      height: 34,
      borderRadius: 999,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(34,190,200,0.16)"
        : "rgba(34,190,200,0.12)",
      borderWidth: 1,
      borderColor: "rgba(34,190,200,0.20)",
    },

    sectionBadgeText: {
      color: palette.accent,
      fontSize: 12,
      fontWeight: "900",
    },

    sectionTitle: {
      flex: 1,
      color: palette.text,
      fontSize: 18,
      fontWeight: "900",
      textAlign: "right",
      paddingLeft: 12,
    },

    videoCardItem: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 28,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: "hidden",
      ...shadowSoft,
    },

    videoCardItemActive: {
      borderColor: "rgba(34,190,200,0.34)",
      backgroundColor: isDark ? "#102540" : "#FFFFFF",
    },

    videoCardThumbWrap: {
      width: "100%",
      height: 190,
      backgroundColor: "#071326",
    },

    videoCardThumb: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    videoCardThumbImage: {
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },

    videoCardThumbOverlay: {
      ...StyleSheet.absoluteFillObject,
    },

    videoCardPlayWrap: {
      alignItems: "center",
      justifyContent: "center",
    },

    videoCardPlay: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(34,190,200,0.26)",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.24)",
    },

    videoCardDurationPill: {
      position: "absolute",
      left: 12,
      bottom: 12,
      minWidth: 44,
      height: 24,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: "rgba(4,10,20,0.88)",
      alignItems: "center",
      justifyContent: "center",
    },

    videoCardDurationText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "900",
    },

    videoCardBody: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 14,
      alignItems: "flex-end",
    },

    videoCardTitle: {
      width: "100%",
      color: palette.text,
      fontSize: 15.5,
      fontWeight: "900",
      lineHeight: 24,
      textAlign: "right",
    },

    videoCardMetaRow: {
      marginTop: 10,
      width: "100%",
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    videoCardMetaTeacher: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "right",
      maxWidth: "55%",
    },

    videoCardMetaDivider: {
      width: 1,
      height: 12,
      backgroundColor: palette.border,
      marginHorizontal: 8,
    },

    videoCardMetaViewsWrap: {
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    videoCardMetaIcon: {
      marginLeft: 4,
    },

    videoCardMetaViewsText: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "800",
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: palette.page,
    },

    centerText: {
      color: palette.text,
      fontWeight: "900",
      textAlign: "center",
      fontSize: 15,
      lineHeight: 22,
    },

    centerSub: {
      marginTop: 10,
      color: palette.textMuted,
      fontWeight: "800",
      textAlign: "center",
      fontSize: 12,
    },

    retryBtn: {
      marginTop: 14,
      paddingVertical: 11,
      paddingHorizontal: 18,
      borderRadius: 999,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
    },

    retryText: {
      color: palette.text,
      fontWeight: "900",
      fontSize: 12,
    },
  });
}