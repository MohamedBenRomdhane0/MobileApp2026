import { Dimensions, StyleSheet } from "react-native";

const { width: W } = Dimensions.get("window");

type ThemeColors = {
  bg?: string;
  text?: string;
  muted?: string;
  border?: string;
  primary?: string;
  card?: string;
  danger?: string;
} | undefined;

export function getPlansPalette(colors: ThemeColors, isDark: boolean) {
  return {
    bg: colors?.bg ?? (isDark ? "#07111D" : "#F3F7FF"),
    text: colors?.text ?? (isDark ? "#F8FAFC" : "#10213A"),
    muted: colors?.muted ?? (isDark ? "#94A3B8" : "#6E7A96"),
    border: colors?.border ?? (isDark ? "rgba(148,163,184,0.18)" : "#E5ECF6"),
    primary: colors?.primary ?? "#22BEC8",
    card: colors?.card ?? (isDark ? "#0D1726" : "#FFFFFF"),
    danger: colors?.danger ?? "#EF4444",
    white: "#FFFFFF",
    gold: "#F5A623",
    success: "#16A34A",
    surface: isDark ? "#0B1422" : "#F8FBFF",
    surfaceAlt: isDark ? "#0F1B2D" : "#EEF6FF",
  };
}

const sh = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 5,
};

export const plansStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    overflow: "hidden",
  },
  headerGlowLeft: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 999,
    top: -70,
    left: -60,
    backgroundColor: "rgba(34,190,200,0.16)",
  },
  headerGlowRight: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 999,
    bottom: -45,
    right: -40,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { flexDirection: "row", alignItems: "baseline" },
  logoA: { fontSize: 20, fontWeight: "900", color: "#22BEC8" },
  logoB: { fontSize: 20, fontWeight: "900", color: "#FFFFFF" },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22BEC8",
    marginLeft: 3,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    writingDirection: "rtl",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    writingDirection: "rtl",
  },

  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
  },
  retryBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    minWidth: 130,
    justifyContent: "center",
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    writingDirection: "rtl",
  },

  emptyCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
    ...sh,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 22,
  },

  planCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    ...sh,
  },
  planHeaderRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  planHeaderTexts: {
    flex: 1,
    alignItems: "flex-end",
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
  planDescription: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 22,
  },

  planBadges: {
    alignItems: "flex-start",
    gap: 8,
  },
  popularBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F5A623",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  popularBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    writingDirection: "rtl",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    writingDirection: "rtl",
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 10,
  },

  featuresBlock: {
    marginTop: 18,
  },
  featureRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  featureIconWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 1,
  },
  featureTexts: {
    flex: 1,
    alignItems: "flex-end",
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  featureDescription: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 18,
  },

  pricingsBlock: {
    marginTop: 18,
    gap: 10,
  },
  pricingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  pricingTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pricingMonths: {
    fontSize: 15,
    fontWeight: "900",
    writingDirection: "rtl",
  },
  pricingTypeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pricingTypeBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    writingDirection: "rtl",
  },

  priceLine: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  priceLineLabel: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  priceLineRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  oldPrice: {
    fontSize: 11,
    fontWeight: "700",
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontSize: 15,
    fontWeight: "900",
  },
  noDiscountPrice: {
    fontSize: 15,
    fontWeight: "900",
  },
  discountBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(34,190,200,0.12)",
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#22BEC8",
  },
  priceHint: {
    marginTop: 8,
    fontSize: 11.5,
    fontWeight: "700",
    textAlign: "left",
  },

  accessibleWrap: {
    marginTop: 18,
  },
  accessibleChipsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  accessibleChip: {
    maxWidth: W - 80,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  accessibleChipText: {
    fontSize: 11,
    fontWeight: "800",
    writingDirection: "rtl",
    textAlign: "right",
  },
});