import { DARK_COLORS } from "@config/colors/colors";
import type { ThemeContextValue } from "./types";
import typography from "./typography/typography";

export const DARK_THEME_TOKENS = {
  colors: {
    bg: DARK_COLORS.background.default ?? "#0B1220",
    card: DARK_COLORS.background.paper ?? "#111A2E",
    text: "#E5E7EB",
    muted: "#9CA3AF",
    border: "#2A3A5E",
    header: "#0B1B33",
    primary: "#22BEC8",
    danger: DARK_COLORS.error.main,
  },
  gradients: {
    profileCard: ["rgba(15,23,42,0.95)", "rgba(2,6,23,0.95)"] as const,
  },
  components: {
    parentProfileCard: {
      borderColor: "rgba(148,163,184,0.22)",
      nameColor: "rgba(226,232,240,0.95)",
      badgeTextColor: "rgba(148,163,184,0.9)",
      decorCircleBg: "rgba(255,255,255,0.06)",
      avatarBg: "rgba(255,255,255,0.08)",
      shadowOpacity: 0.28,
    },
  },
  typography,
} satisfies Pick<ThemeContextValue, "colors" | "gradients" | "components" | "typography">;