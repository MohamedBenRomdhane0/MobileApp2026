import { Dimensions, I18nManager, StyleSheet } from "react-native";

type ThemeColors =
  | {
      bg?: string;
      text?: string;
      muted?: string;
      border?: string;
      primary?: string;
      primaryDark?: string;
      header?: string;
      card?: string;
      danger?: string;
    }
  | undefined;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

export function getBookFilePalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg:          colors?.bg          ?? (isDark ? "#07111D" : "#F4F6FA"),
    text:        colors?.text        ?? (isDark ? "#F8FAFC" : "#0F172A"),
    muted:       colors?.muted       ?? (isDark ? "#94A3B8" : "#64748B"),
    border:      colors?.border      ?? (isDark ? "rgba(148,163,184,0.18)" : "#E2E8F0"),
    primary:     colors?.primary     ?? "#27C7D6",
    primaryDark: colors?.primaryDark ?? "#177C98",
    header:      colors?.header      ?? "#103A66",
    card:        colors?.card        ?? (isDark ? "#0D1726" : "#FFFFFF"),
    danger:      colors?.danger      ?? "#EF4444",
    white:       "#FFFFFF",
  };
}

export const bookFileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  headerTopRow: {
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  avatarButton: {
    borderRadius: 999,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  content: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  centerSub: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },

  retryText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  pageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },

  pageInner: {
    flex: 1,
  },

  pageImage: {
    width: "100%",
    height: "100%",
  },

  iconDot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 2,
  },

  footerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  toolBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },

  pageText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  navArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  navArrowDisabled: {
    opacity: 0.30,
  },

  navTextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 40,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  navTextBtnLabel: {
    fontSize: 14,
    fontWeight: "700",
  },

  pageInfoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  pageCurrentNum: {
    fontSize: 20,
    fontWeight: "900",
    minWidth: 30,
    textAlign: "center",
  },

  pageSeparator: {
    fontSize: 14,
    fontWeight: "600",
  },

  pageTotalNum: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "center",
  },

  progressBarWrap: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 4,
    marginHorizontal: 16,
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 999,
  },

  sideArrowWrap: {
    position: "absolute",
    top: "50%",
    zIndex: 60,
    transform: [{ translateY: -28 }],
  },

  sideArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  chapterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  chapterModalContent: {
    maxHeight: "70%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },

  chapterModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },

  chapterModalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  chapterModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  chapterList: {
    paddingHorizontal: 16,
  },

  chapterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },

  chapterThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  chapterIndex: {
    fontSize: 16,
    fontWeight: "800",
  },

  chapterInfo: {
    flex: 1,
  },

  chapterPageNum: {
    fontSize: 15,
    fontWeight: "700",
  },

  chapterIconsCount: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  chapterProgressWrap: {
    alignItems: "flex-end",
    gap: 3,
  },

  chapterProgressBar: {
    width: 56,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },

  chapterProgressFill: {
    height: "100%",
    borderRadius: 2,
  },

  chapterProgressText: {
    fontSize: 11,
    fontWeight: "700",
  },

  chapterActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  chapterEmpty: {
    paddingVertical: 32,
    alignItems: "center",
  },

  chapterEmptyText: {
    fontSize: 14,
    fontWeight: "600",
  },

});
