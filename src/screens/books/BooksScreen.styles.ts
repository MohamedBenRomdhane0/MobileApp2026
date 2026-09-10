import { Dimensions, I18nManager, StyleSheet } from "react-native";
import { LIQUID } from "@styles/liquidTheme";
import {
  COLOR,
  FONT,
  FONT_WEIGHT,
  RADIUS,
  SCREEN,
  SHADOW,
  SURFACE,
} from "./BooksScreen.tokens";

type ThemeColors =
  | {
      bg?: string;
      text?: string;
      muted?: string;
      border?: string;
      primary?: string;
      primaryDark?: string;
      card?: string;
      danger?: string;
    }
  | undefined;

const { height } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

const H_PADDING = 14;
const GRID_GAP = 12;
const CARD_H = 200;
const CARD_H_VERTICAL = 260;
const COVER_H_TWOCOL = 220;

export const HEADER_GRADIENT_COLORS: [string, string, string] = [
  "#0B2A3A",
  "#0D3347",
  "#0A2535",
];

export function getBooksPalette(colors: ThemeColors, isDark: boolean) {
  const surface = isDark ? SURFACE.dark : SURFACE.light;

  return {
    bg: isDark ? surface.bg : "#EEF2F7",
    card: surface.card,
    text: surface.text,
    muted: surface.muted,
    sub: surface.sub,
    border: surface.border,
    primary: colors?.primary ?? COLOR.teal,
    primaryDark: colors?.primaryDark ?? COLOR.tealDark,
    danger: colors?.danger ?? COLOR.danger,
    white: COLOR.white,
    coverFallback: isDark ? "#10233A" : "#D6E4F0",
    modalSurface: isDark ? "#071427" : COLOR.white,
    modalText: isDark ? COLOR.white : "#0F172A",
    modalMuted: isDark ? "rgba(255,255,255,0.64)" : "#64748B",
    modalCard: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
    modalBorder: isDark ? "rgba(255,255,255,0.08)" : COLOR.border,
    modalCloseBg: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
    modalHandle: isDark ? "rgba(255,255,255,0.24)" : "#CBD5E1",
    modalOverlay: COLOR.overlay,
    teacherAvatarBorder: "rgba(34,197,94,0.22)",
  };
}

export const booksStyles = StyleSheet.create({
  container: { flex: 1 },

  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },

  headerGlowA: {
    position: "absolute",
    top: -24,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: "rgba(212,168,67,0.22)",
  },

  headerGlowB: {
    position: "absolute",
    top: 18,
    left: -26,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(34,190,200,0.14)",
  },

  headerGlowC: {
    position: "absolute",
    bottom: 6,
    right: "22%",
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  headerTopRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  headerTitleBlock: {
    flex: 1,
    paddingEnd: 14,
  },

  headerAvatarWrap: {
    borderRadius: 999,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  layoutToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: RADIUS.full,
    padding: 2,
    marginEnd: 8,
  },

  layoutToggleBtn: {
    width: 30,
    height: 26,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },

  layoutToggleBtnActive: {
    backgroundColor: "#F0F5FA",
  },

  headerStatsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  headerStatPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    height: 23,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  headerStatText: {
    fontFamily: FONT.arabic,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLOR.white,
  },

  title: {
    fontFamily: FONT.arabic,
    fontSize: 20,
    lineHeight: 23,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 2,
    fontFamily: FONT.arabic,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.semibold,
    color: "rgba(255,255,255,0.68)",
  },

  content: { flex: 1 },

  filterWrap: {
    paddingTop: 8,
    paddingBottom: 4,
  },

  filterContent: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 4,
    gap: 8,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    overflow: "hidden",
  },

  filterChipText: {
    fontFamily: FONT.arabic,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
  },

  filterChipDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },

  filterChipCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },

  filterChipCountActive: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.26)",
  },

  filterChipCountText: {
    fontFamily: FONT.latin,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.black,
  },

  filterChipGloss: {
    position: "absolute",
    top: 2,
    left: 6,
    right: 6,
    height: 12,
    borderRadius: 8,
  },

  list: { flex: 1 },

  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
  },

  listContentVertical: {
    gap: GRID_GAP,
  },

  cardShadow: {
    flex: 1,
    borderRadius: SCREEN.bookCardRadius,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },

  card: {
    borderRadius: SCREEN.bookCardRadius,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
  },

  cardOneCol: {
    height: CARD_H_VERTICAL,
  },

  cardTwoColVertical: {
    minHeight: CARD_H,
  },

  cardRow: {
    flex: 1,
    alignItems: "stretch",
  },

  cardRowHorizontal: {
    flexDirection: isRTL ? "row-reverse" : "row",
  },

  cardRowVerticalContent: {
    flexDirection: "column",
  },

  coverWrap: {
    overflow: "visible",
  },

  coverWrapHorizontal: {
    width: "52%",
  },

  coverWrapVerticalContent: {
    width: "95%",
    height: COVER_H_TWOCOL,
  },

  coverPad: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  coverStage: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
  },

  coverGroundShadow: {
    position: "absolute",
    left: "16%",
    right: "16%",
    bottom: 18,
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  coverCard: {
    width: "100%",
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  cover: { width: "100%", height: "100%" },

  coverFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  coverFallbackText: {
    marginTop: 8,
    fontFamily: FONT.arabic,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
  },

  coverGloss: {
    position: "absolute",
    top: 6,
    left: 8,
    right: 8,
    height: "42%",
    borderRadius: 8,
  },

  coverSpineStart: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 7,
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  coverSpineEnd: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 7,
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  coverBadge: {
    position: "absolute",
    left: "50%",
    bottom: 10,
    transform: [{ translateX: -30 }],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(6,14,24,0.82)",
    gap: 5,
    zIndex: 4,
  },

  coverBadgeText: {
    fontFamily: FONT.latin,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
  },

  infoWrap: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: isRTL ? "flex-end" : "flex-start",
    position: "relative",
    overflow: "hidden",
  },

  infoGlowOverlay: [
    StyleSheet.absoluteFill,
    {
      pointerEvents: "none",
      zIndex: 0,
    },
  ] as unknown as import("react-native").ViewStyle,

  infoScrim: [
    StyleSheet.absoluteFill,
    {
      pointerEvents: "none",
      zIndex: 1,
    },
  ] as unknown as import("react-native").ViewStyle,

  infoScanlinesOverlay: [
    StyleSheet.absoluteFill,
    {
      pointerEvents: "none",
      zIndex: 2,
    },
  ] as unknown as import("react-native").ViewStyle,

  infoContent: {
    flex: 1,
    zIndex: 3,
    width: "100%",
    justifyContent: "space-between",
    alignItems: isRTL ? "flex-end" : "flex-start",
  },

  titleBlock: {
    width: "100%",
    alignItems: isRTL ? "flex-end" : "flex-start",
  },

  matiereRow: {
    width: "100%",
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },

  matiereDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  matiereText: {
    flexShrink: 1,
    fontFamily: FONT.arabic,
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    color: "rgba(255,255,255,0.92)",
  },

  bookTitle: {
    width: "100%",
    fontFamily: FONT.arabic,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
    letterSpacing: -0.3,
  },

  bookSubtitle: {
    width: "100%",
    marginTop: 2,
    fontFamily: FONT.latin,
    fontSize: 8.5,
    fontWeight: FONT_WEIGHT.bold,
    color: "rgba(255,255,255,0.36)",
    textAlign: isRTL ? "right" : "left",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },

  middleSection: {
    width: "100%",
    alignItems: isRTL ? "flex-end" : "flex-start",
    justifyContent: "flex-start",
    marginTop: 2,
    marginBottom: 2,
  },

  resumeHeaderRow: {
    width: "100%",
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 5,
    gap: 5,
  },

  resumeHeaderText: {
    fontFamily: FONT.arabic,
    fontSize: 9.5,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLOR.white,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },

  resumeTitle: {
    width: "100%",
    fontFamily: FONT.arabic,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHT.bold,
    color: COLOR.white,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },

  resumeTimeRow: {
    width: "100%",
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 3,
    gap: 4,
  },

  resumeTimeText: {
    fontFamily: FONT.arabic,
    fontSize: 9.5,
    fontWeight: FONT_WEIGHT.medium,
    color: "rgba(255,255,255,0.72)",
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },

  bookTitleVertical: {
    fontSize: 19,
    lineHeight: 23,
  },

  resumeHeaderTextVertical: {
    fontSize: 12,
  },

  resumeTitleVertical: {
    fontSize: 15,
    lineHeight: 20,
  },

  resumeTimeTextVertical: {
    fontSize: 11.5,
  },

  resumeProgressPctVertical: {
    fontSize: 12,
  },

  resumeProgressRow: {
    width: "100%",
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 4,
  },

  resumeProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },

  resumeProgressFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },

  resumeProgressPct: {
    fontFamily: FONT.latin,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: COLOR.white,
    minWidth: 30,
    textAlign: isRTL ? "right" : "left",
  },

  pageChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 5,
  },

  pageChipText: {
    fontFamily: FONT.arabic,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.semibold,
    color: "rgba(255,255,255,0.88)",
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },

  bottomSection: {
    width: "100%",
    alignItems: isRTL ? "flex-end" : "flex-start",
    marginTop: 4,
  },

  chipsRow: {
    width: "100%",
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginBottom: 6,
  },

  countChipDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 46,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.30)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 4,
  },

  countChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    gap: 3,
  },

  countChipDisabled: { opacity: 0.38 },

  countChipText: {
    fontFamily: FONT.latin,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
  },

  countChipIcon: {
    marginTop: 0.5,
  },

  openButton: {
    width: "100%",
    height: 30,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  openButtonIcon: { marginTop: 0.5 },

  openButtonText: {
    fontFamily: FONT.arabic,
    fontSize: 11.5,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    textAlign: "center",
    writingDirection: "rtl",
  },

  gridRow: {
    gap: GRID_GAP,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  cardGridFull: {
    flexBasis: "100%",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

  stateCard: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderRadius: SCREEN.modalRadius,
    borderWidth: 1,
    ...SHADOW.card,
  },

  stateIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
    gap: 10,
  },

  emptyTitle: {
    fontFamily: FONT.arabic,
    fontSize: 18,
    fontWeight: FONT_WEIGHT.black,
    textAlign: "center",
  },

  emptySubtitle: {
    fontFamily: FONT.arabic,
    fontSize: 13,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
  },

  retryButton: {
    minWidth: 120,
    height: 42,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 1,
    marginTop: 6,
    shadowColor: COLOR.teal,
    shadowOpacity: 0.26,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  retryButtonText: {
    fontFamily: FONT.arabic,
    fontSize: 14,
    fontWeight: FONT_WEIGHT.extrabold,
    textAlign: "center",
  },

  modalRoot: { flex: 1, justifyContent: "flex-end" },

  modalBackdrop: StyleSheet.absoluteFill,

  modalSheet: {
    minHeight: Math.min(380, height * 0.44),
    maxHeight: height * 0.68,
    borderTopLeftRadius: SCREEN.modalRadius,
    borderTopRightRadius: SCREEN.modalRadius,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderWidth: 1,
    ...SHADOW.modal,
  },

  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: RADIUS.full,
    alignSelf: "center",
    marginBottom: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  modalCloseBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  modalTitleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  modalTitle: {
    fontFamily: FONT.arabic,
    fontSize: 20,
    fontWeight: FONT_WEIGHT.black,
    textAlign: "center",
  },

  modalSubtitle: {
    marginTop: 2,
    fontFamily: FONT.arabic,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
    writingDirection: "rtl",
  },

  modalHeaderSpacer: { width: 42 },

  modalListContent: { paddingBottom: 10 },

  modalEmptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },

  modalEmptyText: {
    marginTop: 8,
    fontFamily: FONT.arabic,
    fontSize: 14,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
  },

  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    minHeight: 88,
    borderWidth: 1,
  },

  teacherRowLeft: {
    width: 46,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
  },

  teacherRowAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    marginLeft: 12,
    flexShrink: 0,
  },

  teacherRowAvatar: { width: "100%", height: "100%" },

  teacherRowAvatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  teacherRowAvatarInitials: {
    fontFamily: FONT.latin,
    fontSize: 20,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
  },

  teacherRowInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    gap: 5,
  },

  teacherRowName: {
    width: "100%",
    fontFamily: FONT.arabic,
    fontSize: 17,
    fontWeight: FONT_WEIGHT.black,
    textAlign: "right",
    writingDirection: "rtl",
  },

  teacherRowMetaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  teacherRowMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  teacherRowMetaText: {
    fontFamily: FONT.arabic,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "right",
    writingDirection: "rtl",
    opacity: 0.86,
  },

  teacherRatingPill: {
    minWidth: 52,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 4,
  },

  teacherRatingText: {
    fontFamily: FONT.latin,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.black,
    color: "#F7C94C",
  },

  teacherRowChevron: {
    opacity: 0.5,
    marginLeft: 4,
  },
});
