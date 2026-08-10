import { StyleSheet, Dimensions } from "react-native";

import { getHomePalette } from "./HomeScreen.constants";
import type { ThemeColors } from "./HomeScreen.type";

const { width: W } = Dimensions.get("window");

/** Book cards sit just under half-screen so the next one peeks in. */
const BOOK_SWIPE_W = Math.min(157, (W - 16 * 2 - 12) / 2.25);
/** Subject cards: ~3.1 per screen, so the 4th invites a swipe. */
const MAT_SWIPE_W = Math.max(88, Math.min(88, (W - 16 * 2 - 10 * 3) / 3.2));
/** Responsive subject card height — 90 on large screens, scales down on small ones. */
const MAT_CARD_H = Math.max(72, Math.min(90, Math.round(W * 0.23)));

/**
 * Elevation scale (see `.claude/skills/frontend-design`):
 * resting cards carry a brand-tinted glow on light, neutral depth in dark.
 */
const restShadow = (isDark: boolean) => ({
  shadowColor: isDark ? "#000000" : "#22BEC8",
  shadowOpacity: isDark ? 0.32 : 0.14,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 5,
});

const neutralShadow = (isDark: boolean) => ({
  shadowColor: isDark ? "#000000" : "#0D2A52",
  shadowOpacity: isDark ? 0.34 : 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
});

const shadowHeader = {
  shadowColor: "#000",
  shadowOpacity: 0.22,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 14 },
  elevation: 10,
};

export function createHomeStyles(
  colors: ThemeColors,
  isDark: boolean,
  isRTL: boolean = false,
) {
  const C = getHomePalette(colors, isDark);

  // ── RTL helpers ───────────────────────────────────────────────────────
  // Every directional token reads from here so the layout truly mirrors
  // between Arabic and EN/FR instead of being hardcoded one way.
  const row = isRTL ? ("row-reverse" as const) : ("row" as const);
  const alignEnd = isRTL ? ("flex-end" as const) : ("flex-start" as const);
  const textEnd = isRTL ? ("right" as const) : ("left" as const);

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.canvas },

    scroll: { flex: 1, backgroundColor: C.canvas },
    scrollContent: { paddingBottom: 120, backgroundColor: C.canvas },

    /* ── Hero ────────────────────────────────────────────────────────── */

    headerShell: {
      backgroundColor: colors.header,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: "hidden",
      ...shadowHeader,
    },

    headerGradient: {
      paddingHorizontal: 16,
      paddingBottom: 14,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: "hidden",
      backgroundColor: colors.header,
    },

    headerGlowA: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 999,
      backgroundColor: "rgba(34,190,200,0.18)",
      top: -110,
      left: isRTL ? undefined : -80,
      right: isRTL ? -80 : undefined,
    },

    headerGlowB: {
      position: "absolute",
      width: 280,
      height: 280,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -160,
      right: isRTL ? undefined : -100,
      left: isRTL ? -100 : undefined,
    },

    /* ── Hero top row: avatar + search + language + notifications ────── */

    heroTopRow: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
    },

    heroTopRight: { flexDirection: row, alignItems: "center", gap: 8 },

    searchBtn: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
    },

    bellBtn: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },

    bellDot: {
      position: "absolute",
      top: 10,
      right: isRTL ? undefined : 11,
      left: isRTL ? 11 : undefined,
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: C.live,
      borderWidth: 1.5,
      borderColor: colors.header,
    },

    /* ── Daily streak pill (metallic gold gradient) ───────────────────── */

    streakPill: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      height: 38,
      borderRadius: 999,
      overflow: "hidden",
      shadowColor: "#F6C445",
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },

    streakShine: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 80,
    },

    streakText: {
      fontSize: 13.5,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: 0.3,
      textShadowColor: "rgba(74,46,0,0.55)",
      textShadowRadius: 3,
    },

    /* ── Greeting + emoji quick actions (one shared line) ─────────────── */

    greetingLine: {
      marginTop: 10,
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    greetingWrap: {
      alignItems: alignEnd,
      flexShrink: 1,
    },

    greetingSub: {
      fontSize: 12,
      fontWeight: "600",
      color: "rgba(255,255,255,0.78)",
      textAlign: textEnd,
    },

    greetingNameRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 6,
      marginTop: 1,
    },

    greetingName: {
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: -0.4,
      color: "#FFFFFF",
      textAlign: textEnd,
      flexShrink: 1,
    },

    levelChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 7,
      height: 18,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
    },

    levelChipText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.2,
      color: "rgba(255,255,255,0.92)",
    },

    emojiRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    emojiBtn: {
      width: 40,
      height: 40,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.12)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      overflow: "hidden",
    },

    emojiBtnActive: {
      borderColor: "rgba(34,190,200,0.95)",
      backgroundColor: "rgba(34,190,200,0.28)",
      shadowColor: "#22BEC8",
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 6,
    },

    emojiText: { fontSize: 18 },

    /* ── Motivational message card ───────────────────────────────────── */

    motivationCard: {
      marginTop: 12,
      flexDirection: row,
      alignItems: "flex-start",
      gap: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(34,190,200,0.4)",
      backgroundColor: "rgba(255,255,255,0.08)",
      padding: 12,
    },

    motivationEmoji: { fontSize: 24 },

    motivationBody: { flex: 1 },

    motivationTitle: {
      color: "#FFFFFF",
      fontSize: 13.5,
      fontWeight: "800",
      marginBottom: 2,
    },

    motivationText: {
      color: "rgba(255,255,255,0.75)",
      fontSize: 12,
      fontWeight: "600",
      lineHeight: 18,
    },

    /* ── Quick actions (floating card over the hero curve) ───────────── */

    quickCard: {
      marginTop: -26,
      marginHorizontal: 16,
      backgroundColor: C.surface,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderWidth: isDark ? 1 : 0,
      borderColor: C.hairline,
      flexDirection: row,
      alignItems: "flex-start",
      ...neutralShadow(isDark),
    },

    quickItem: { flex: 1, alignItems: "center", gap: 7 },

    quickIconTile: {
      width: 46,
      height: 46,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    quickLabel: {
      fontSize: 10.5,
      fontWeight: "800",
      color: C.ink,
      textAlign: "center",
    },

    /* ── Body / sections ─────────────────────────────────────────────── */

    body: { paddingHorizontal: 16 },

    section: { marginTop: 22 },

    /* ── Section header: accent tile + title + "see all" chip ─────────── */

    sectionHeaderRow: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 10,
    },

    sectionTitleWrap: {
      flexDirection: row,
      alignItems: "center",
      gap: 10,
      flex: 1,
      minWidth: 0,
    },

    /** Tinted square carrying the section's own accent hue. */
    sectionIconTile: {
      width: 34,
      height: 34,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },

    sectionTitleBlock: {
      flexShrink: 1,
      minWidth: 0,
      alignItems: alignEnd,
      gap: 4,
    },

    sectionTitleLine: { flexDirection: row, alignItems: "center", gap: 7 },

    sectionTitle: {
      color: C.ink,
      fontSize: 17,
      fontWeight: "900",
      letterSpacing: -0.3,
      textAlign: textEnd,
      flexShrink: 1,
    },

    /** 3px accent underline — a quiet echo of the icon tile hue. */
    sectionTitleRule: {
      width: 26,
      height: 3,
      borderRadius: 999,
    },

    sectionCountPill: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 7,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: C.tealSoft,
    },

    sectionCountText: { color: C.teal, fontSize: 11, fontWeight: "900" },

    sectionSeeAll: {
      flexDirection: row,
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 11,
      height: 30,
      borderRadius: 999,
      borderWidth: 1,
    },

    sectionLink: { color: C.teal, fontSize: 12, fontWeight: "900" },

    /* ── Shared section states ───────────────────────────────────────── */

    stateWrap: {
      paddingVertical: 22,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    stateText: {
      color: C.sub,
      fontSize: 12.5,
      fontWeight: "700",
      textAlign: "center",
    },

    stateRetryBtn: {
      flexDirection: row,
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      height: 34,
      borderRadius: 999,
      backgroundColor: C.tealSoft,
    },

    stateRetryText: { color: C.teal, fontSize: 12.5, fontWeight: "900" },

    skeletonRow: { flexDirection: row, gap: 12 },

    skeletonCard: {
      width: 96,
      height: 96,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "#E3EAF3",
    },

    /* ── Continue learning ───────────────────────────────────────────── */

    continueCard: {
      borderRadius: 22,
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: isDark ? C.hairline : "rgba(34,190,200,0.18)",
      padding: 12,
      ...restShadow(isDark),
    },

    continuePress: { flexDirection: row, alignItems: "center", gap: 12 },

    continueThumb: {
      width: 62,
      height: 78,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#ECE7DF",
      alignItems: "center",
      justifyContent: "center",
    },

    continueThumbImg: { width: "100%", height: "100%", resizeMode: "cover" },

    continueInfo: { flex: 1, minWidth: 0, alignItems: alignEnd },

    continueEyebrow: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.6,
      color: C.teal,
      textAlign: textEnd,
    },

    continueTitle: {
      marginTop: 3,
      fontSize: 13.5,
      fontWeight: "800",
      color: C.ink,
      textAlign: textEnd,
      lineHeight: 18,
    },

    continueBarTrack: {
      marginTop: 10,
      width: "100%",
      height: 6,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "#E6EDF6",
      overflow: "hidden",
      flexDirection: row,
    },

    continueBarFill: { height: 6, borderRadius: 999, backgroundColor: C.teal },

    continueMetaRow: {
      marginTop: 6,
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },

    continueProgressText: { fontSize: 11, fontWeight: "800", color: C.sub },

    continueCta: {
      flexDirection: row,
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 12,
      height: 30,
      borderRadius: 999,
      backgroundColor: C.tealSoft,
    },

    continueCtaText: { fontSize: 11.5, fontWeight: "900", color: C.teal },

    /* ── Subjects carousel ───────────────────────────────────────────── */

    materialsSwiper: { marginHorizontal: -16 },

    materialsSwiperContent: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 10,
    },

    materialCard: {
      width: MAT_SWIPE_W,
      height: MAT_CARD_H,
      borderRadius: 18,
      overflow: "hidden",
      borderWidth: 1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.18,
      elevation: 4,
    },

    /** Tinted gradient face — the subject hue fades top-left to bottom-right. */
    materialCardFace: {
      paddingTop: 8,
      paddingBottom: 6,
      paddingHorizontal: 6,
      alignItems: "center",
    },

    /** Soft light bloom in the upper corner, so the tint never reads flat. */
    materialCardBloom: {
      position: "absolute",
      width: 64,
      height: 64,
      borderRadius: 999,
      top: -32,
      right: isRTL ? undefined : -20,
      left: isRTL ? -20 : undefined,
    },

    materialCardPress: { alignItems: "center", gap: 5, width: "100%" },

    materialCardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 1,
    },

    materialCardImg: { width: 30, height: 30, resizeMode: "contain" },

    materialCardLabel: {
      fontSize: 10.5,
      fontWeight: "900",
      textAlign: "center",
      lineHeight: 13,
      minHeight: 22,
    },

    /** Accent underline anchoring the label to the subject color. */
    materialCardRule: {
      width: 14,
      height: 2,
      borderRadius: 999,
      marginTop: 0,
    },

    /* ── Live session ────────────────────────────────────────────────── */

    liveCard: {
      borderRadius: 24,
      backgroundColor: C.navy,
      borderWidth: 1,
      borderColor: isDark ? C.hairline : "rgba(255,255,255,0.06)",
      paddingHorizontal: 14,
      paddingVertical: 14,
      overflow: "hidden",
      ...neutralShadow(isDark),
    },

    liveGlow: {
      position: "absolute",
      width: 200,
      height: 200,
      borderRadius: 999,
      backgroundColor: "rgba(239,68,68,0.18)",
      top: -100,
      right: isRTL ? undefined : -56,
      left: isRTL ? -56 : undefined,
    },

    /** Red rail on the reading-start edge — the card's "on air" marker. */
    liveRail: {
      position: "absolute",
      top: 14,
      bottom: 14,
      width: 3,
      borderRadius: 999,
      left: isRTL ? undefined : 0,
      right: isRTL ? 0 : undefined,
      backgroundColor: C.live,
    },

    liveTopRow: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    liveInfo: { flex: 1, minWidth: 0, alignItems: alignEnd },

    liveTitle: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "900",
      textAlign: textEnd,
      letterSpacing: -0.2,
    },

    liveMetaRow: {
      marginTop: 6,
      flexDirection: row,
      alignItems: "center",
      gap: 5,
      alignSelf: alignEnd,
    },

    liveMeta: {
      color: "rgba(255,255,255,0.72)",
      fontSize: 11.5,
      fontWeight: "700",
      textAlign: textEnd,
      flexShrink: 1,
    },

    liveBadge: {
      flexDirection: row,
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      height: 30,
      borderRadius: 999,
      backgroundColor: "rgba(239,68,68,0.22)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
    },

    liveBadgeText: {
      color: "#FFFFFF",
      fontSize: 11.5,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: C.live,
    },

    liveBottomRow: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: "rgba(255,255,255,0.14)",
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    liveJoinBtn: {
      flex: 1,
      borderRadius: 15,
      overflow: "hidden",
      shadowColor: "#F43F5E",
      shadowOpacity: 0.45,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },

    liveJoinInner: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 20,
      height: 42,
    },

    liveJoinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

    /* ── Books carousel ──────────────────────────────────────────────── */

    booksSwiper: { marginHorizontal: -16 },

    booksSwiperContent: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 0,
      gap: 10,
      marginBottom: 12,
    },

    bookCardOuter: {
      width: BOOK_SWIPE_W,
      borderRadius: 24,
      backgroundColor: C.surface,
      padding: 8,
      borderWidth: 1,
      borderColor: isDark ? C.hairline : "rgba(34,190,200,0.16)",
      ...restShadow(isDark),
    },

    bookCardPressable: { width: "100%", alignItems: "center" },

    bookCoverShell: {
      position: "relative",
      width: "100%",
      height: 166,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#ECE7DF",
      alignItems: "center",
      justifyContent: "center",
    },

    bookCoverImage: { width: "100%", height: "100%", resizeMode: "cover" },

    bookCoverFallback: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF2F7",
    },

    bookCoverScrim: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 48,
    },

    /** Both cover badges share one row so they never collide on narrow cards. */
    bookBadgeRow: {
      position: "absolute",
      left: 8,
      right: 8,
      bottom: 8,
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6,
    },

    bookBadgeOverlay: {
      flexDirection: row,
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 8,
      height: 23,
      borderRadius: 999,
      backgroundColor: "rgba(9,17,33,0.62)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
    },

    bookVideoBadge: {
      flexDirection: row,
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 8,
      height: 23,
      borderRadius: 999,
      backgroundColor: "rgba(124,92,252,0.82)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.24)",
    },

    bookBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },

    /** "Started" ribbon in the top corner — reads before the progress bar. */
    bookResumeChip: {
      position: "absolute",
      top: 8,
      left: isRTL ? undefined : 8,
      right: isRTL ? 8 : undefined,
      flexDirection: row,
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 7,
      height: 21,
      borderRadius: 999,
      backgroundColor: "rgba(34,190,200,0.92)",
    },

    bookResumeChipText: { color: "#FFFFFF", fontSize: 9.5, fontWeight: "900" },

    bookMetaWrap: {
      width: "100%",
      paddingTop: 9,
      paddingHorizontal: 2,
      gap: 0,
    },

    bookTitle: {
      color: C.ink,
      fontSize: 12.5,
      fontWeight: "800",
      textAlign: "center",
      lineHeight: 16,
      minHeight: 20,
    },

    /** Reserved strip so started and untouched cards keep the same height. */
    bookProgressSlot: {
      width: "100%",
      minHeight: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    bookProgressTrack: {
      flex: 1,
      height: 5,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "#E6EDF6",
      flexDirection: row,
    },

    bookProgressFill: { height: 5, borderRadius: 999, backgroundColor: C.teal },

    bookProgressLabel: { color: C.teal, fontSize: 10, fontWeight: "900" },

    /* ── Teachers ────────────────────────────────────────────────────── */

    teachersSwiper: { marginHorizontal: -16 },

    teachersRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 12,
    },

    teacherCard: {
      width: 112,
      borderRadius: 24,
      paddingVertical: 14,
      paddingHorizontal: 8,
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.hairline,
      alignItems: "center",
      gap: 7,
      overflow: "hidden",
      ...neutralShadow(isDark),
    },

    /** Accent wash behind the avatar, tinted per teacher. */
    teacherCardWash: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 56,
    },

    teacherAvatarRing: {
      width: 66,
      height: 66,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      padding: 2.5,
    },

    teacherAvatar: {
      width: "100%",
      height: "100%",
      borderRadius: 999,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: C.surfaceAlt,
    },

    teacherImg: { width: "100%", height: "100%", resizeMode: "cover" },

    teacherName: {
      fontSize: 11.5,
      fontWeight: "800",
      color: C.ink,
      textAlign: "center",
    },

    teacherSubject: {
      fontSize: 10,
      fontWeight: "700",
      color: C.sub,
      textAlign: "center",
    },

    teacherBadge: {
      marginTop: 2,
      flexDirection: row,
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 8,
      height: 20,
      borderRadius: 999,
      backgroundColor: C.tealSoft,
    },

    teacherBadgeText: { fontSize: 10, fontWeight: "900", color: C.teal },

    /* ── Subscribe CTA ───────────────────────────────────────────────── */

    subscribeOuter: {
      borderRadius: 24,
      overflow: "hidden",
      ...restShadow(isDark),
    },

    subscribeBanner: { borderRadius: 24, overflow: "hidden" },

    /** Two offset blooms give the flat gradient some depth. */
    subscribeBloom: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.12)",
      top: -96,
      left: isRTL ? undefined : -40,
      right: isRTL ? -40 : undefined,
    },

    subscribeBloomAlt: {
      position: "absolute",
      width: 130,
      height: 130,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -80,
      right: isRTL ? undefined : -30,
      left: isRTL ? -30 : undefined,
    },

    subscribeContent: {
      paddingHorizontal: 14,
      paddingVertical: 16,
      gap: 14,
    },

    subscribeTopRow: { flexDirection: row, alignItems: "center", gap: 12 },

    subscribeIconTile: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.28)",
    },

    subscribeTextBlock: { flex: 1, minWidth: 0, alignItems: alignEnd },

    subscribeTitle: {
      color: "#FFFFFF",
      fontSize: 15.5,
      fontWeight: "900",
      textAlign: textEnd,
    },

    subscribeSub: {
      marginTop: 3,
      color: "rgba(255,255,255,0.92)",
      fontSize: 11.5,
      fontWeight: "700",
      textAlign: textEnd,
    },

    subscribeBtn: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.22)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
      paddingHorizontal: 16,
      height: 42,
      borderRadius: 15,
    },

    subscribeBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

    /* ── Search modal ──────────────────────────────────────────────────── */

    /* Bottom sheet: the search owns the screen instead of floating mid-air. */
    searchModalRoot: { flex: 1, justifyContent: "flex-end" },

    searchBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(4,10,22,0.66)",
    },

    searchSheet: {
      height: "90%",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: C.canvas,
      overflow: "hidden",
      ...neutralShadow(isDark),
    },

    /* Navy band mirrors the home hero so the sheet reads as one system. */
    searchBand: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 18,
      gap: 14,
    },

    searchBandGlow: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 999,
      backgroundColor: "rgba(34,190,200,0.18)",
      top: -140,
      right: isRTL ? undefined : -70,
      left: isRTL ? -70 : undefined,
    },

    searchHandle: {
      alignSelf: "center",
      width: 44,
      height: 5,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.28)",
    },

    searchBandTopRow: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    searchBandTitles: { flex: 1, minWidth: 0, alignItems: alignEnd },

    searchBandTitle: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: -0.3,
      color: "#FFFFFF",
      textAlign: textEnd,
    },

    searchBandSub: {
      marginTop: 3,
      fontSize: 11.5,
      fontWeight: "600",
      color: "rgba(255,255,255,0.62)",
      textAlign: textEnd,
    },

    searchCloseBtn: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },

    /* Glass field on the navy band — white text in both themes. */
    searchField: {
      height: 50,
      flexDirection: row,
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.13)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },

    searchFieldFocused: {
      borderColor: "rgba(34,190,200,0.85)",
      backgroundColor: "rgba(34,190,200,0.16)",
    },

    searchInput: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: textEnd,
      paddingVertical: 0,
    },

    searchClearBtn: {
      width: 22,
      height: 22,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.18)",
    },

    searchTabsRow: {
      flexDirection: row,
      gap: 8,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 10,
    },

    searchTabBtn: {
      flex: 1,
      flexDirection: row,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 40,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: C.hairline,
      backgroundColor: C.surface,
    },

    searchTabBtnActive: {
      backgroundColor: C.teal,
      borderColor: C.teal,
      shadowColor: C.teal,
      shadowOpacity: 0.4,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },

    searchTabLabel: {
      fontSize: 11.5,
      fontWeight: "800",
      color: C.sub,
      textAlign: "center",
      flexShrink: 1,
    },

    searchTabLabelActive: { color: "#FFFFFF" },

    searchTabCount: {
      minWidth: 19,
      height: 19,
      paddingHorizontal: 5,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: C.surfaceAlt,
    },

    searchTabCountActive: { backgroundColor: "rgba(255,255,255,0.28)" },

    searchTabCountText: { fontSize: 9.5, fontWeight: "900", color: C.sub },

    searchTabCountTextActive: { color: "#FFFFFF" },

    searchResultsList: { flex: 1, paddingHorizontal: 14 },

    searchResultsContent: { paddingTop: 4, paddingBottom: 28 },

    searchResultRow: {
      flexDirection: row,
      alignItems: "center",
      gap: 12,
      padding: 10,
      marginBottom: 10,
      borderRadius: 20,
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.hairline,
      ...neutralShadow(isDark),
    },

    searchResultBody: { flex: 1, minWidth: 0, gap: 3, alignItems: alignEnd },

    searchResultThumb: {
      width: 52,
      height: 52,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: C.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },

    searchResultImg: { width: "100%", height: "100%", resizeMode: "cover" },

    searchResultTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: C.ink,
      minWidth: 0,
      textAlign: textEnd,
    },

    searchResultSub: {
      fontSize: 11,
      fontWeight: "600",
      color: C.sub,
      textAlign: textEnd,
    },

    searchResultGo: {
      width: 30,
      height: 30,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: C.tealSoft,
    },

    searchEmptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      paddingHorizontal: 24,
      gap: 14,
    },

    searchEmptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },

    searchEmptyText: {
      fontSize: 13,
      fontWeight: "700",
      color: C.sub,
      textAlign: "center",
      lineHeight: 19,
    },

    /* ── Summary + Activities row ─────────────────────────────────────── */

    summaryRow: {
      flexDirection: row,
      gap: 12,
      paddingHorizontal: 16,
    },

    summaryCard: {
      flex: 1,
      borderRadius: 24,
      backgroundColor: C.navy,
      borderWidth: 1,
      borderColor: isDark ? C.hairline : "rgba(255,255,255,0.06)",
      paddingHorizontal: 16,
      paddingVertical: 18,
      overflow: "hidden",
      ...neutralShadow(isDark),
    },

    summaryHeader: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },

    summaryTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    summaryArrowBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },

    summaryStatRow: {
      flexDirection: row,
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    summaryStatLeft: {
      flexDirection: row,
      alignItems: "center",
      gap: 8,
    },

    summaryStatDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },

    summaryStatLabel: {
      color: "rgba(255,255,255,0.80)",
      fontSize: 14,
      fontWeight: "700",
    },

    summaryStatValue: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    summaryStatUnderline: {
      height: 3,
      borderRadius: 999,
      marginTop: 2,
    },

    summaryLiveWrap: {
      flexDirection: row,
      alignItems: "center",
      gap: 10,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: "rgba(255,255,255,0.14)",
    },

    summaryLiveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: "#EF4444",
    },

    summaryLiveInfo: {
      flex: 1,
    },

    summaryLiveSubject: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },

    summaryLiveTeacher: {
      color: "rgba(255,255,255,0.60)",
      fontSize: 11,
      fontWeight: "600",
      marginTop: 1,
    },

    summaryLiveParticipants: {
      color: "rgba(255,255,255,0.45)",
      fontSize: 10,
      fontWeight: "600",
      marginTop: 2,
    },

    summaryJoinBtn: {
      flexDirection: row,
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      height: 28,
      borderRadius: 999,
      backgroundColor: "rgba(239,68,68,0.22)",
      borderWidth: 1,
      borderColor: "rgba(239,68,68,0.35)",
    },

    summaryJoinText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "800",
    },

    /* ── Activities card ──────────────────────────────────────────────── */

    activitiesCard: {
      aspectRatio: 0.65,
      justifyContent: "space-between",
    },

    activitiesHeader: {
      flexDirection: row,
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    activitiesHeaderText: {
      flex: 1,
    },

    activitiesSubtitle: {
      color: "rgba(255,255,255,0.50)",
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 2,
    },

    activitiesTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
    },

    activitiesArrowBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },

    calGrid: {
      gap: 3,
      flex: 1,
      justifyContent: "center",
    },

    calRow: {
      flexDirection: row,
      justifyContent: "space-between",
    },

    calDay: {
      flex: 1,
      aspectRatio: 1,
      maxWidth: 28,
      maxHeight: 28,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },

    calDayText: {
      color: "rgba(255,255,255,0.40)",
      fontSize: 10,
      fontWeight: "700",
    },

    calDayToday: {
      borderWidth: 1.5,
      borderColor: "#22BEC8",
    },

    calDayTodayText: {
      color: "#22BEC8",
    },

    calDayPhoto: {
      width: 18,
      height: 18,
      borderRadius: 999,
    },

    calDayPhotoRing: {
      width: 22,
      height: 22,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
    },

    calLabels: {
      flexDirection: row,
      justifyContent: "space-between",
    },

    calLabel: {
      color: "rgba(255,255,255,0.45)",
      fontSize: 9,
      fontWeight: "700",
      textAlign: "center",
      flex: 1,
    },
  });
}
