import { I18nManager, StyleSheet } from "react-native";

type VideoStyleColors = {
  text?: string;
  muted?: string;
  primary?: string;
};

export function makeVideoStyles(
  colors: VideoStyleColors,
  isDark: boolean,
  accentColor: string,
  gradientColors: readonly [string, string],
  tintColor: string,
) {
  const isRTL = I18nManager.isRTL;

  const accent = accentColor;
  const accentLight = isDark
    ? accentColor.replace(/([0-9A-Fa-f]{2})$/, "28")
    : accentColor + "14";
  const accentBorder = isDark
    ? accentColor.replace(/([0-9A-Fa-f]{2})$/, "44")
    : accentColor + "28";
  const gradientStart = gradientColors[0];
  const gradientEnd = gradientColors[1];
  const tintBg = isDark
    ? tintColor + "24"
    : tintColor;

  const palette = {
    page: isDark ? "#071326" : "#F4F8FE",
    surface: isDark ? "#0D1E36" : "#FFFFFF",
    surfaceSoft: isDark ? "rgba(255,255,255,0.04)" : "#F7FBFF",
    surfaceMute: isDark ? "rgba(255,255,255,0.06)" : "#EEF5FF",
    border: isDark ? "rgba(148,163,184,0.20)" : "rgba(110,138,178,0.16)",
    text: colors.text ?? (isDark ? "#F8FAFC" : "#10233E"),
    textMuted: colors.muted ?? (isDark ? "#9FB1C8" : "#677B96"),
    accent,
    accentLight,
    accentBorder,
    gradientStart,
    gradientEnd,
    tintBg,
    navy: "#0F172A",
    red: "#EF4444",
    cardBg: isDark ? "#0D1E36" : "#FFFFFF",
  };

  const shadowCard = {
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.24 : 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  };

  const shadowSoft = {
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.18 : 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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

    scrollContent: {
      paddingBottom: 34,
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    centerText: {
      color: palette.textMuted,
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
    },

    centerSub: {
      marginTop: 10,
      color: palette.textMuted,
      fontSize: 13,
    },

    retryBtn: {
      marginTop: 14,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
    },

    retryText: {
      color: palette.text,
      fontSize: 13,
      fontWeight: "900",
    },

    bookHeaderWrap: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: "#000000",
      shadowOpacity: 0.10,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },

    bookHeaderTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    bookHeaderCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },

    bookHeaderTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
      textAlign: "center",
    },

    bookHeaderSubtitle: {
      color: "rgba(255,255,255,0.68)",
      fontSize: 12,
      fontWeight: "600",
      marginTop: 2,
      textAlign: "center",
    },

    bookHeaderAvatar: {
      borderRadius: 999,
    },

    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.12)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
    },

    tabBarWrap: {
      marginHorizontal: 16,
      marginBottom: 12,
      flexDirection: isRTL ? "row-reverse" : "row",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
      borderRadius: 14,
      padding: 4,
    },

    tabItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 9,
      borderRadius: 10,
      gap: 5,
    },

    tabItemActive: {
      backgroundColor: palette.cardBg,
      ...shadowSoft,
    },

    tabIcon: {
      color: palette.textMuted,
    },

    tabIconActive: {
      color: palette.accent,
    },

    tabLabel: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "700",
    },

    tabLabelActive: {
      color: palette.accent,
    },

    tabBadge: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      paddingHorizontal: 5,
    },

    tabBadgeActive: {
      backgroundColor: palette.accentLight,
    },

    tabBadgeText: {
      color: palette.textMuted,
      fontSize: 10,
      fontWeight: "800",
    },

    tabBadgeTextActive: {
      color: palette.accent,
    },

    playerCard: {
      marginHorizontal: 16,
      borderRadius: 16,
      backgroundColor: palette.navy,
      overflow: "hidden",
      ...shadowCard,
    },

    playerWrap: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: palette.navy,
    },

    player: {
      width: "100%",
      height: "100%",
      backgroundColor: palette.navy,
    },

    playerOverlay: [StyleSheet.absoluteFill, {
      justifyContent: "space-between",
    }] as unknown as import("react-native").ViewStyle,

    playerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingTop: 8,
    },

    playerQualityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: "rgba(255,255,255,0.12)",
    },

    playerQualityText: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 10,
      fontWeight: "800",
    },

    playerSettingsBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.10)",
    },

    playerCenter: {
      alignItems: "center",
      justifyContent: "center",
    },

    playPauseBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: palette.accent,
    },

    playerBottomRow: {
      paddingHorizontal: 12,
      paddingBottom: 10,
    },

    playerControlsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    playerSideControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },

    playerControlBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },

    playerTimeText: {
      color: "rgba(255,255,255,0.85)",
      fontSize: 11,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    playerSpeedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: "rgba(255,255,255,0.12)",
    },

    playerSpeedText: {
      color: "rgba(255,255,255,0.85)",
      fontSize: 11,
      fontWeight: "800",
    },

    sessionOverlay: [StyleSheet.absoluteFill, {
      alignItems: "center",
      justifyContent: "center",
    }] as unknown as import("react-native").ViewStyle,

    blockedOverlay: [StyleSheet.absoluteFill, {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.60)",
      borderRadius: 16,
    }] as unknown as import("react-native").ViewStyle,

    blockedOverlayText: {
      marginTop: 10,
      color: "#FFFFFF",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "800",
      lineHeight: 20,
      paddingHorizontal: 16,
    },

    bookPreviewCard: {
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      backgroundColor: palette.cardBg,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: "hidden",
      ...shadowSoft,
    },

    bookPreviewHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },

    bookPreviewIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: palette.accentLight,
    },

    bookPreviewLabel: {
      flex: 1,
      color: palette.text,
      fontSize: 14,
      fontWeight: "800",
      marginHorizontal: 10,
      textAlign: isRTL ? "right" : "left",
    },

    bookPreviewThumbsScroll: {
      paddingHorizontal: 14,
      maxHeight: 160,
    },

    bookPreviewThumb: {
      width: 80,
      height: 110,
      borderRadius: 8,
      marginRight: 8,
      backgroundColor: palette.surfaceMute,
    },

    bookPreviewFooter: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },

    bookPreviewNavBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: palette.surfaceMute,
    },

    bookPreviewPageText: {
      flex: 1,
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "700",
      textAlign: "center",
    },

    bookPreviewOpenBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: palette.accent,
    },

    bookPreviewOpenText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },

    teacherCard: {
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      backgroundColor: palette.cardBg,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 14,
      ...shadowSoft,
    },

    teacherCardRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },

    teacherAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: palette.tintBg,
      borderWidth: 2,
      borderColor: isDark ? "rgba(20,184,166,0.30)" : "rgba(20,184,166,0.20)",
      overflow: "hidden",
    },

    teacherAvatarImg: {
      width: "100%",
      height: "100%",
      borderRadius: 25,
    },

    teacherAvatarLetter: {
      color: isDark ? "#5EEAD4" : "#0D9488",
      fontSize: 20,
      fontWeight: "900",
    },

    teacherInfo: {
      flex: 1,
      marginHorizontal: 10,
    },

    teacherNameRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
    },

    teacherName: {
      color: palette.text,
      fontSize: 15,
      fontWeight: "900",
      textAlign: isRTL ? "right" : "left",
    },

    teacherRoleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(239,68,68,0.14)" : "#FEF2F2",
    },

    teacherRoleText: {
      color: palette.red,
      fontSize: 10,
      fontWeight: "800",
    },

    teacherFollowersRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginTop: 3,
      gap: 4,
    },

    teacherFollowersText: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "600",
    },

    teacherActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
    },

    teacherLikeBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 14,
      height: 38,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
      borderWidth: 1,
      borderColor: palette.border,
    },

    teacherLikeText: {
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: "800",
    },

    teacherSubscribeBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 38,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#10233E",
      gap: 4,
    },

    teacherSubscribeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },

    sectionHeader: {
      marginHorizontal: 16,
      marginTop: 18,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      color: palette.text,
      fontSize: 16,
      fontWeight: "900",
      textAlign: isRTL ? "right" : "left",
    },

    sectionBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: palette.surfaceMute,
    },

    sectionBadgeText: {
      color: palette.textMuted,
      fontSize: 11,
      fontWeight: "800",
    },

    videoCardItem: {
      marginHorizontal: 16,
      marginTop: 10,
      flexDirection: isRTL ? "row-reverse" : "row",
      borderRadius: 14,
      backgroundColor: palette.cardBg,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: "hidden",
      ...shadowSoft,
    },

    videoCardItemActive: {
      borderColor: palette.accent,
      backgroundColor: palette.accentLight,
    },

    videoCardThumbWrap: {
      width: 110,
    },

    videoCardThumb: {
      width: 110,
      height: 80,
    },

    videoCardThumbImage: {
      borderRadius: 0,
    },

    videoCardThumbOverlay: StyleSheet.absoluteFill,

    videoCardPlayWrap: [StyleSheet.absoluteFill, {
      alignItems: "center",
      justifyContent: "center",
    }] as unknown as import("react-native").ViewStyle,

    videoCardPlay: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.45)",
    },

    videoCardDurationPill: {
      position: "absolute",
      bottom: 6,
      right: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: "rgba(0,0,0,0.65)",
    },

    videoCardDurationText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "800",
    },

    videoCardBody: {
      flex: 1,
      padding: 10,
      justifyContent: "center",
    },

    videoCardTitle: {
      color: palette.text,
      fontSize: 13,
      fontWeight: "800",
      textAlign: isRTL ? "right" : "left",
    },

    videoCardMetaRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginTop: 6,
      gap: 6,
    },

    videoCardMetaTeacher: {
      color: palette.textMuted,
      fontSize: 11,
      fontWeight: "600",
    },

    videoCardMetaDivider: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: palette.textMuted,
    },

    videoCardMetaViewsWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },

    videoCardMetaIcon: {
      color: palette.accent,
    },

    videoCardMetaViewsText: {
      color: palette.textMuted,
      fontSize: 11,
      fontWeight: "700",
    },
  });
}
