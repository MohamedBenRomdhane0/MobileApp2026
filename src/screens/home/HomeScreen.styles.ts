import { StyleSheet, Dimensions } from "react-native";

const { width: W } = Dimensions.get("window");
// Swiper cards are slightly narrower than half-screen so the next card peeks in.
const BOOK_SWIPE_W = Math.min(168, (W - 16 * 2 - 12) / 2.35);
// Material swiper: show ~4 cards per screen (16px side padding + 12px gaps),
// nudged a touch narrower so the 5th card peeks in and invites scrolling.
const MAT_SWIPE_W = (W - 16 * 2 - 12 * 3) / 4.25;

const shadowCard = {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
};

const shadowHeader = {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
};

export function createHomeStyles(colors: any, isDark: boolean, isRTL: boolean = false) {
    const TITLE_BLUE = "#1D3B65";

    const titleColor = isDark ? colors.text : TITLE_BLUE;

    const cardBg = colors.card;
    const bg = isDark ? colors.bg : "#F8F9FF";
    const muted = colors.muted;

    const softBorder = isDark
        ? "rgba(148,163,184,0.22)"
        : "rgba(148,163,184,0.20)";
    const categoryCardBg = isDark ? "rgba(255,255,255,0.04)" : "#EEF4FF";

    // ── RTL helpers ───────────────────────────────────────────────────────
    // Centralize the conditional direction tokens so every style stays in
    // sync when isRTL flips. The codebase used to hardcode `row-reverse` /
    // `textAlign: "right"` everywhere, which made the layout look identical
    // in EN/FR and AR. Now everything reads from these helpers.
    const row = isRTL ? "row-reverse" : "row";
    const alignEnd = isRTL ? "flex-end" : "flex-start";
    const alignStart = isRTL ? "flex-start" : "flex-end";
    const textEnd = isRTL ? "right" : "left";
    const textStart = isRTL ? "left" : "right";

    return StyleSheet.create({
        root: { flex: 1, backgroundColor: bg },

        headerShell: { paddingHorizontal: 0, backgroundColor: colors.header },

        headerGradient: {
            paddingHorizontal: 16,
            paddingBottom: 12,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            minHeight: 80,
            overflow: "hidden",
            backgroundColor: colors.header,
            ...shadowHeader,
        },

        headerGlowA: {
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: "rgba(34,190,200,0.18)",
            top: -110,
            left: isRTL ? undefined : -80,
            right: isRTL ? -80 : undefined,
        },

        headerGlowB: {
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: 140,
            backgroundColor: "rgba(255,255,255,0.08)",
            bottom: -140,
            right: isRTL ? undefined : -100,
            left: isRTL ? -100 : undefined,
        },

        header: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },
        headerLeft: {
            flexDirection: row,
            alignItems: "center",
            gap: 10,
        },
        headerRight: {
            flexDirection: row,
            alignItems: "center",
            gap: 8,
        },
        hello: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
        levelUp: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 1 },
        bellBtn: {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
        },

        scroll: { flex: 1, backgroundColor: bg },
        scrollContent: {
            paddingBottom: 120,
            backgroundColor: bg,
            borderRadius: 140,
        },

        teachersSection: { paddingHorizontal: 16, paddingTop: 24 },
        teachersHeader: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
        },
        teachersSectionTitle: {
            fontSize: 16,
            fontWeight: "800",
            color: isDark ? colors.text : "#1F2937",
        },
        teachersSeeAll: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.primary,
        },
        teachersRow: { flexDirection: row, gap: 14, marginBottom: 24 },
        teacherCol: { alignItems: "center", gap: 4 },
        teacherAvatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        teacherImg: { width: 56, height: 56, borderRadius: 28 },
        teacherName: {
            fontSize: 11,
            fontWeight: "700",
            color: isDark ? colors.text : "#1F2937",
            maxWidth: 64,
            textAlign: "center",
        },
        teacherBadge: {
            backgroundColor: "#1F2937",
            paddingHorizontal: 6,
            height: 16,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
        },
        teacherBadgeText: { fontSize: 9, fontWeight: "700", color: "#FFFFFF" },

        body: {
            paddingHorizontal: 16,
            paddingTop: 24,
            marginTop: -22,
        },

        categoriesCard: {
            backgroundColor: categoryCardBg,
            borderRadius: 22,
            paddingHorizontal: 12,
            paddingTop: 14,
            paddingBottom: 12,
            borderWidth: 1,
            borderColor: softBorder,
            ...shadowCard,
        },

        materialsStateWrap: {
            width: "100%",
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
        },

        categoriesRow: {
            alignItems: "flex-start",
            flexWrap: "nowrap",
        },

        catHeaderRow: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 6,
        },

        catWeekPill: {
            paddingHorizontal: 14,
            height: 28,
            borderRadius: 999,
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F0F4FF",
            alignItems: "center",
            justifyContent: "center",
        },

        catWeekText: {
            fontSize: 12,
            fontWeight: "800",
            color: isDark ? colors.text : "#1D3B65",
        },

        catLevelPill: {
            flexDirection: row,
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 10,
            height: 28,
            borderRadius: 999,
            backgroundColor: isDark
                ? "rgba(34,190,200,0.12)"
                : "rgba(34,190,200,0.10)",
        },

        catLevelText: {
            fontSize: 11.5,
            fontWeight: "800",
            color: colors.primary,
        },

        catCountPill: {
            flexDirection: row,
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 10,
            height: 28,
            borderRadius: 999,
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#FFF0F5",
        },

        catCountDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#F472B6",
        },

        catCountText: {
            fontSize: 11.5,
            fontWeight: "800",
            color: isDark ? colors.text : "#BE185D",
        },

        categoryBlock: {
            alignItems: "center",
        },

        categoryItem: {
            width: 80,
            height: 80,
            borderRadius: 22,
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: isDark
                ? "rgba(148,163,184,0.22)"
                : "rgba(148,163,184,0.18)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
        },

        categoryImg: { width: 48, height: 48, resizeMode: "contain" },

        categoryLabel: {
            marginTop: 8,
            fontSize: 11,
            color: isDark ? colors.text : "#1D3B65",
            fontWeight: "800",
            textAlign: "center",
        },

        categoryHours: {
            marginTop: 2,
            fontSize: 10,
            color: muted,
            fontWeight: "700",
            textAlign: "center",
        },

        // ── Materials grid (colored cards) ───────────────────────────────
        materialsHeaderRow: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
        },
        materialsGrid: {
            flexDirection: row,
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 12,
        },
        // Horizontal materials carousel (swiper). Cards bleed to the screen
        // edges. Direction follows language: in Arabic the first card sits
        // on the right (natural reading start), in LTR it sits on the left.
        materialsSwiper: {
            marginTop: 6,
            marginHorizontal: -16,
        },
        materialsSwiperContent: {
            flexDirection: "row",
            paddingHorizontal: 16,
            gap: 12,
        },
        materialCard: {
            width: 120,
            minHeight: 64,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 14,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.25 : 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
        },
        materialCardPress: {
            flex: 1,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },
        materialCardTextWrap: {
            flex: 1,
            minWidth: 0,
            alignItems: alignEnd,
            paddingLeft: isRTL ? 0 : 8,
            paddingRight: isRTL ? 8 : 0,
        },
        materialCardLabel: {
            fontSize: 12.5,
            fontWeight: "900",
            textAlign: textEnd,
        },
        materialCardSub: {
            marginTop: 3,
            fontSize: 10.5,
            fontWeight: "700",
            textAlign: textEnd,
        },
        materialCardIconWrap: {
            width: 35,
            height: 35,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        materialCardImg: {
            width: 40,
            height: 40,
            resizeMode: "contain",
        },

        subscribeBanner: {
            marginTop: 12,
            borderRadius: 22,
            overflow: "hidden",
            ...shadowCard,
        },

        subscribeContent: {
            paddingHorizontal: 14,
            paddingVertical: 14,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },

        subscribeTextBlock: {
            alignItems: alignEnd,
            flex: 1,
            paddingLeft: isRTL ? 0 : 12,
            paddingRight: isRTL ? 12 : 0,
        },

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
            fontWeight: "800",
            textAlign: textEnd,
        },

        subscribeBtn: {
            backgroundColor: "rgba(255,255,255,0.18)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.22)",
            paddingHorizontal: 18,
            height: 38,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
        },

        subscribeBtnText: {
            color: "#FFFFFF",
            fontSize: 12.5,
            fontWeight: "900",
        },

        sectionHeaderRow: {
            marginTop: 16,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },

        sectionTitle: {
            color: titleColor,
            fontSize: 18,
            fontWeight: "900",
            textAlign: textEnd,
        },

        sectionLink: {
            color: colors.primary,
            fontSize: 13,
            fontWeight: "900",
        },

        // ── Books section header ─────────────────────────────────────────
        booksHeaderRow: {
            marginTop: 18,
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },
        booksHeaderTitleWrap: {
            flexDirection: row,
            alignItems: "center",
            gap: 8,
        },
        booksCountPill: {
            minWidth: 22,
            height: 22,
            paddingHorizontal: 7,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark
                ? "rgba(34,190,200,0.18)"
                : "rgba(34,190,200,0.14)",
        },
        booksCountText: {
            color: colors.primary,
            fontSize: 11,
            fontWeight: "900",
        },
        booksSeeAll: {
            flexDirection: row,
            alignItems: "center",
            gap: 2,
        },

        // ── Books swiper ─────────────────────────────────────────────────
        booksSwiper: {
            marginTop: 14,
            marginHorizontal: -16, // let cards bleed to the screen edges
        },
        booksSwiperContent: {
            flexDirection: "row",
            paddingHorizontal: 16,
            gap: 12,
        },

        booksStateWrap: {
            width: "100%",
            paddingVertical: 24,
            alignItems: "center",
            justifyContent: "center",
        },

        bookCardOuter: {
            width: BOOK_SWIPE_W,
            borderRadius: 20,
            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
            padding: 8,
            borderWidth: 1,
            borderColor: isDark
                ? "rgba(148,163,184,0.16)"
                : "rgba(34,190,200,0.14)",
            // brand-tinted glow at rest (glow-brand), neutral in dark
            shadowColor: isDark ? "#000000" : "#22BEC8",
            shadowOpacity: isDark ? 0.35 : 0.18,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 12 },
            elevation: 6,
        },

        bookCardPressable: {
            width: "100%",
            alignItems: "center",
        },

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

        bookCoverImage: {
            width: "100%",
            height: "100%",
            resizeMode: "cover",
        },

        bookCoverFallback: {
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF2F7",
        },

        // bottom scrim so the page-count pill stays legible over any cover
        bookCoverScrim: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 72,
        },

        bookBadgeOverlay: {
            position: "absolute",
            // Pages badge sits on the right in LTR, on the left in RTL
            // (matches the natural reading start of each language).
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
            // Videos badge sits on the left in LTR, on the right in RTL.
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

        bookBadgeText: {
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: "900",
        },

        bookMetaWrap: {
            width: "100%",
            paddingTop: 8,
            alignItems: "center",
        },

        bookSubject: {
            color: "#14B8A6",
            fontSize: 12,
            fontWeight: "900",
            textAlign: "center",
        },

        bookTitle: {
            marginTop: 2,
            color: isDark ? colors.text : "#120350",
            fontSize: 12.5,
            fontWeight: "800",
            textAlign: "center",
            lineHeight: 16,
            minHeight: 32,
        },

        bookOpenBtn: {
            marginTop: 0,
            width: "100%",
            height: 34,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: row,
            gap: 5,
            overflow: "hidden",
        },

        bookOpenText: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "900",
        },

        liveCard: {
            marginTop: 12,
            borderRadius: 22,
            backgroundColor: isDark ? "rgba(29,59,101,0.25)" : "#0F2E57",
            borderWidth: 1,
            borderColor: isDark ? "rgba(148,163,184,0.22)" : "transparent",
            paddingHorizontal: 14,
            paddingVertical: 14,
            ...shadowCard,
        },

        liveTopRow: {
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
        },

        liveInfo: {
            flex: 1,
            alignItems: alignEnd,
            paddingLeft: isRTL ? 0 : 12,
            paddingRight: isRTL ? 12 : 0,
        },

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
            fontWeight: "800",
            textAlign: textEnd,
        },

        liveBadge: {
            flexDirection: row,
            alignItems: "center",
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

        liveDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#EF4444",
        },

        liveJoinBtn: {
            alignSelf: alignEnd,
            marginTop: 12,
            backgroundColor: "#F43F5E",
            paddingHorizontal: 20,
            height: 38,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
        },

        liveJoinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
    });
}
