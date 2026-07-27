import { Dimensions, StyleSheet } from "react-native";

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
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    paddingVertical: 10,
  },

  pageText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  rtlFlip: {
    transform: [{ scaleX: -1 }],
  },
});
