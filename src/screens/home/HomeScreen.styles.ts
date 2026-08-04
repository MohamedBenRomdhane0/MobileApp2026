import { StyleSheet, Dimensions } from "react-native";

import { getHomePalette } from "./HomeScreen.constants";
import type { ThemeColors } from "./HomeScreen.type";

const { width: W } = Dimensions.get("window");

/** Book cards sit just under half-screen so the next one peeks in. */
const BOOK_SWIPE_W = Math.min(168, (W - 16 * 2 - 12) / 2.35);
/** Subject cards: ~3.6 per screen, so the 4th invites a swipe. */
const MAT_SWIPE_W = Math.max(92, Math.min(108, (W - 16 * 2 - 12 * 3) / 3.6));

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
    isRTL: boolean = false
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

        headerShell: { backgroundColor: colors.header },

        headerGradient: {
            paddingHorizontal: 16,
            paddingBottom: 18,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
            backgroundColor: colors.header,
            ...shadowHeader,
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
            width: 42,
            height: 42,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
            alignItems: "center",
            justifyContent: "center",
        },

        bellBtn: {
            width: 42,
            height: 42,
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

        /* ── Daily streak pill (yellow/orange gradient) ──────────────────── */

        streakWrap: {
            marginTop: 6,
            alignItems: alignEnd,
        },

        streakPill: {
            flexDirection: row,
            alignItems: "center",
            paddingHorizontal: 14,
            height: 34,
            borderRadius: 999,
            shadowColor: "#F97316",
            shadowOpacity: 0.35,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 5,
        },

        streakText: {
            fontSize: 13,
            fontWeight: "900",
            color: "#FFFFFF",
            letterSpacing: 0.3,
        },

        /* ── Greeting section (right-aligned, RTL-aware) ─────────────────── */

        greetingWrap: {
            marginTop: 10,
            alignItems: alignEnd,
        },

        greetingSub: {
            fontSize: 13.5,
            fontWeight: "600",
            color: "rgba(255,255,255,0.78)",
            textAlign: textEnd,
        },

        greetingName: {
            marginTop: 2,
            fontSize: 26,
            fontWeight: "900",
            letterSpacing: -0.4,
            color: "#FFFFFF",
            textAlign: textEnd,
        },

        levelChip: {
            marginTop: 6,
            flexDirection: row,
            alignItems: "center",
            gap: 4,
            alignSelf: alignEnd,
            paddingHorizontal: 8,
            height: 20,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.14)",
        },

        levelChipText: {
            fontSize: 10.5,
            fontWeight: "800",
            letterSpacing: 0.2,
            color: "rgba(255,255,255,0.92)",
        },

        /* ── Emoji quick actions (glass row) ─────────────────────────────── */

        emojiGlass: {
            marginTop: 12,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.16)",
            backgroundColor: "rgba(255,255,255,0.07)",
            overflow: "hidden",
        },

        emojiBtn: {
            width: 50,
            height: 50,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            overflow: "hidden",
        },

        emojiText: { fontSize: 22 },

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

        body: { paddingHorizontal: 16, paddingTop: 24 },

        section: { marginTop: 24 },

        sectionHeaderRow: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 8,
        },

        sectionTitleWrap: {
            flexDirection: row,
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
        },

        sectionTitle: {
            color: C.ink,
            fontSize: 18,
            fontWeight: "900",
            letterSpacing: -0.3,
            textAlign: textEnd,
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

        sectionSeeAll: { flexDirection: row, alignItems: "center", gap: 2 },

        sectionLink: { color: C.teal, fontSize: 13, fontWeight: "900" },

        /* ── Shared section states ───────────────────────────────────────── */

        stateWrap: {
            paddingVertical: 22,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
        },

        stateText: { color: C.sub, fontSize: 12.5, fontWeight: "700", textAlign: "center" },

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
            gap: 12,
        },

        materialCard: {
            width: MAT_SWIPE_W,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 8,
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.25 : 0.07,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
        },

        materialCardPress: { alignItems: "center", gap: 8, width: "100%" },

        materialCardIconWrap: {
            width: 52,
            height: 52,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },

        materialCardImg: { width: 42, height: 42, resizeMode: "contain" },

        materialCardLabel: {
            fontSize: 11.5,
            fontWeight: "900",
            textAlign: "center",
            lineHeight: 15,
        },

        /* ── Live session ────────────────────────────────────────────────── */

        liveCard: {
            borderRadius: 22,
            backgroundColor: C.navy,
            borderWidth: isDark ? 1 : 0,
            borderColor: C.hairline,
            paddingHorizontal: 14,
            paddingVertical: 14,
            overflow: "hidden",
            ...neutralShadow(isDark),
        },

        liveGlow: {
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: "rgba(239,68,68,0.16)",
            top: -90,
            right: isRTL ? undefined : -50,
            left: isRTL ? -50 : undefined,
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
            fontSize: 15.5,
            fontWeight: "900",
            textAlign: textEnd,
        },

        liveMeta: {
            marginTop: 4,
            color: "rgba(255,255,255,0.75)",
            fontSize: 11.5,
            fontWeight: "700",
            textAlign: textEnd,
        },

        liveBadge: {
            flexDirection: row,
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            height: 30,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.14)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)",
        },

        liveBadgeText: {
            color: "#FFFFFF",
            fontSize: 11.5,
            fontWeight: "900",
            letterSpacing: 0.7,
        },

        liveDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: C.live },

        liveBottomRow: {
            marginTop: 14,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
        },

        liveJoinBtn: {
            flexDirection: row,
            alignItems: "center",
            gap: 6,
            backgroundColor: "#F43F5E",
            paddingHorizontal: 20,
            height: 38,
            borderRadius: 14,
        },

        liveJoinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

        /* ── Books carousel ──────────────────────────────────────────────── */

        booksSwiper: { marginHorizontal: -16 },

        booksSwiperContent: {
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 4,
            gap: 12,
        },

        bookCardOuter: {
            width: BOOK_SWIPE_W,
            borderRadius: 20,
            backgroundColor: C.surface,
            padding: 8,
            borderWidth: 1,
            borderColor: isDark ? C.hairline : "rgba(34,190,200,0.14)",
            ...restShadow(isDark),
        },

        bookCardPressable: { width: "100%", alignItems: "center" },

        bookCoverShell: {
            position: "relative",
            width: "100%",
            height: 164,
            borderRadius: 14,
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
            height: 72,
        },

        bookBadgeOverlay: {
            position: "absolute",
            right: isRTL ? undefined : 8,
            left: isRTL ? 8 : undefined,
            bottom: 8,
            flexDirection: row,
            alignItems: "center",
            gap: 3,
            paddingHorizontal: 8,
            height: 22,
            borderRadius: 999,
            backgroundColor: "rgba(15,23,42,0.55)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.20)",
        },

        bookVideoBadge: {
            position: "absolute",
            left: isRTL ? undefined : 8,
            right: isRTL ? 8 : undefined,
            bottom: 8,
            flexDirection: row,
            alignItems: "center",
            gap: 3,
            paddingHorizontal: 8,
            height: 22,
            borderRadius: 999,
            backgroundColor: "rgba(124,92,252,0.75)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.20)",
        },

        bookBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },

        bookProgressTrack: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 4,
            backgroundColor: "rgba(15,23,42,0.35)",
            flexDirection: row,
        },

        bookProgressFill: { height: 4, backgroundColor: C.teal },

        bookMetaWrap: { width: "100%", paddingTop: 8, alignItems: "center" },

        bookTitle: {
            color: C.ink,
            fontSize: 12.5,
            fontWeight: "800",
            textAlign: "center",
            lineHeight: 16,
            minHeight: 32,
        },

        /* ── Teachers ────────────────────────────────────────────────────── */

        teachersSwiper: { marginHorizontal: -16 },

        teachersRow: {
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 4,
            gap: 12,
        },

        teacherCard: {
            width: 104,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 8,
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: C.hairline,
            alignItems: "center",
            gap: 6,
            ...neutralShadow(isDark),
        },

        teacherAvatarRing: {
            width: 64,
            height: 64,
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

        subscribeOuter: { borderRadius: 22, overflow: "hidden", ...restShadow(isDark) },

        subscribeBanner: { borderRadius: 22, overflow: "hidden" },

        subscribeContent: {
            paddingHorizontal: 14,
            paddingVertical: 16,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
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
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.18)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
            paddingHorizontal: 16,
            height: 38,
            borderRadius: 14,
        },

        subscribeBtnText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "900" },

        /* ── Search modal ──────────────────────────────────────────────────── */

        searchBackdrop: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.54)",
            justifyContent: "center",
            alignItems: "center",
        },

        searchModalCard: {
            width: "100%",
            maxHeight: "66%",
            borderRadius: 22,
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: C.hairline,
            ...neutralShadow(isDark),
            overflow: "hidden",
        },

        searchModalHeader: {
            flexDirection: row,
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: C.hairline,
        },

        searchInput: {
            flex: 1,
            fontSize: 15,
            fontWeight: "700",
            color: C.ink,
            textAlign: textEnd,
        },

        searchTabToggle: {
            flexDirection: row,
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: C.tealSoft,
        },

        searchTabsRow: {
            flexDirection: row,
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: C.hairline,
        },

        searchTabBtn: {
            flex: 1,
            paddingVertical: 8,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: C.surfaceAlt,
        },

        searchTabBtnActive: {
            backgroundColor: C.tealSoft,
        },

        searchTabLabel: {
            fontSize: 11.5,
            fontWeight: "800",
            color: C.sub,
            textAlign: "center",
        },

        searchTabLabelActive: {
            color: C.teal,
        },

        searchResultsList: { flex: 1, paddingHorizontal: 8 },

        searchResultRow: {
            flexDirection: row,
            alignItems: "center",
            gap: 10,
            paddingVertical: 9,
            paddingHorizontal: 6,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: C.hairline,
        },

        searchResultThumb: {
            width: 36,
            height: 36,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: C.surfaceAlt,
            alignItems: "center",
            justifyContent: "center",
        },

        searchResultImg: { width: "100%", height: "100%", resizeMode: "cover" },

        searchResultEmoji: { fontSize: 20 },

        searchResultTitle: {
            flex: 1,
            fontSize: 13.5,
            fontWeight: "800",
            color: C.ink,
            textAlign: textEnd,
            minWidth: 0,
        },

        searchResultSub: {
            fontSize: 10.5,
            fontWeight: "700",
            color: C.sub,
            textAlign: "right",
        },

        searchEmptyText: {
            padding: 22,
            fontSize: 12.5,
            fontWeight: "700",
            color: C.sub,
            textAlign: "center",
        },
    });
}
