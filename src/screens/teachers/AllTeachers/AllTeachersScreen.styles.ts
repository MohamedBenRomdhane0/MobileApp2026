import { StyleSheet } from "react-native";
import type { AppColors } from "@theme/types";

export function createAllTeachersStyles(_colors: AppColors, isDark: boolean, isRTL: boolean) {
  const surface = isDark ? "#111A2E" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textSecondary = isDark ? "#94A3B8" : "#64748B";

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: isDark ? "#0A0F1E" : "#F4F6FA",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
      backgroundColor: isDark ? "#0A0F1E" : "#F4F6FA",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: textPrimary,
      flex: 1,
    },
    headerCount: {
      fontSize: 14,
      fontWeight: "600",
      color: textSecondary,
    },
    list: {
      flex: 1,
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    grid: {
      justifyContent: "space-between",
    },
    card: {
      width: "47%",
      backgroundColor: surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: border,
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    avatarRing: {
      width: 72,
      height: 72,
      borderRadius: 36,
      padding: 3,
      marginBottom: 12,
    },
    avatarOuter: {
      width: "100%",
      height: "100%",
      borderRadius: 36,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
      resizeMode: "cover" as const,
    },
    name: {
      fontSize: 14,
      fontWeight: "700",
      color: textPrimary,
      textAlign: "center",
      marginBottom: 4,
    },
    subject: {
      fontSize: 12,
      fontWeight: "500",
      color: textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#F59E0B",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: textSecondary,
      textAlign: "center",
    },
  });
}
