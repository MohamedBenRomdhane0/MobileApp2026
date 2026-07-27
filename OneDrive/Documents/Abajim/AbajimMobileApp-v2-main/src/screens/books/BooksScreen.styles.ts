import { Dimensions, I18nManager, StyleSheet } from "react-native";
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

const { width, height } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

const H_PADDING = 14;
const CARD_W = width - H_PADDING * 2;
const COVER_W = Math.round(CARD_W * 0.49);
const CARD_H = 250;

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
    paddingHorizontal: 18,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },

  headerTopRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 2,
  },

  headerTitleBlock: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 12,
  },

  title: {
    fontFamily: FONT.arabic,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: -0.5,
  },

  headerLevelPill: {
    marginTop: 8,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  headerLevelIcon: { marginLeft: 6 },

  headerLevelText: {
    fontFamily: FONT.arabic,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.bold,
    color: COLOR.white,
    textAlign: "right",
    writingDirection: "rtl",
  },

  headerSubtitle: {
    marginTop: 6,
    fontFamily: FONT.arabic,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.semibold,
    color: "rgba(255,255,255,0.58)",
    textAlign: "right",
    writingDirection: "rtl",
  },

  content: { flex: 1 },

  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 18,
  },

  cardShadow: {
    marginBottom: 18,
    borderRadius: SCREEN.bookCardRadius,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },

  card: {
    height: CARD_H,
    borderRadius: SCREEN.bookCardRadius,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
  },

  cardRow: {
    flex: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "stretch",
  },

  coverWrap: {
    width: COVER_W,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.18)",
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
  },

coverBadge: {
  position: "absolute",
  left: "50%",
  bottom: 12,
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
},

  coverBadgeText: {
    fontFamily: FONT.latin,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
  },

  infoWrap: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    alignItems: "flex-end",
    position: "relative",
    overflow: "hidden",
  },

  infoGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    zIndex: 0,
  },

  infoScanlinesOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    zIndex: 1,
  },

  infoContent: {
    flex: 1,
    zIndex: 2,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  titleBlock: {
    width: "100%",
    alignItems: "flex-end",
  },

  bookTitle: {
    width: "100%",
    fontFamily: FONT.arabic,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: -0.3,
  },

  bookSubtitle: {
    width: "100%",
    marginTop: 2,
    fontFamily: FONT.latin,
    fontSize: 8.5,
    fontWeight: FONT_WEIGHT.bold,
    color: "rgba(255,255,255,0.36)",
    textAlign: "right",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },

  middleSection: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: 2,
    marginBottom: 2,
  },

  resumeHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 4,
    gap: 4,
  },

  resumeHeaderText: {
    fontFamily: FONT.arabic,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.medium,
    color: "rgba(255,255,255,0.50)",
    textAlign: "right",
    writingDirection: "rtl",
  },

  resumeTitle: {
    width: "100%",
    fontFamily: FONT.arabic,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: FONT_WEIGHT.bold,
    color: COLOR.white,
    textAlign: "right",
    writingDirection: "rtl",
  },

  resumeTimeRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 4,
  },

  resumeTimeText: {
    fontFamily: FONT.arabic,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.medium,
    color: "rgba(255,255,255,0.52)",
    textAlign: "right",
    writingDirection: "rtl",
  },

  pageChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 6,
  },

  pageChipText: {
    fontFamily: FONT.arabic,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.medium,
    color: "rgba(255,255,255,0.84)",
    textAlign: "right",
    writingDirection: "rtl",
  },

  bottomSection: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 6,
  },

  chipsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 10,
  },

  countChipDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    height: 28,
    paddingHorizontal: 11,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.30)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 5,
  },

  countChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    gap: 4,
  },

  countChipDisabled: { opacity: 0.38 },

  countChipText: {
    fontFamily: FONT.latin,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
  },

  countChipEmoji: {
    fontSize: 12,
    lineHeight: 14,
  },

  countChipIcon: {
    marginTop: 0.5,
  },

  openButton: {
    width: "100%",
    height: 42,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.30,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  openButtonIcon: { marginTop: 0.5 },

  openButtonText: {
    fontFamily: FONT.arabic,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.black,
    color: COLOR.white,
    textAlign: "center",
    writingDirection: "rtl",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
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
  },

  retryButtonText: {
    fontFamily: FONT.arabic,
    fontSize: 14,
    fontWeight: FONT_WEIGHT.extrabold,
    textAlign: "center",
  },

  modalRoot: { flex: 1, justifyContent: "flex-end" },

  modalBackdrop: { ...StyleSheet.absoluteFillObject },

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