import { LIGHT_COLORS } from "@config/colors/colors";
import type { ThemeContextValue } from "./types";
import typography from "./typography/typography";

export const LIGHT_THEME_TOKENS = {
  colors: {
    bg: LIGHT_COLORS.background.default,
    card: LIGHT_COLORS.background.paper,
    text: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    header: "#1D3B65",
    primary: "#22BEC8",
    danger: LIGHT_COLORS.error.main,
  },
  gradients: {
    profileCard: ["rgba(255,255,255,0.95)", "rgba(248,250,252,0.95)"] as const,
  },
  components: {
    parentProfileCard: {
      borderColor: "rgba(15,23,42,0.06)",
      nameColor: "rgba(15,23,42,0.92)",
      badgeTextColor: "rgba(100,116,139,0.95)",
      decorCircleBg: "rgba(248,250,252,0.8)",
      avatarBg: "#E5E7EB",
      shadowOpacity: 0.12,
    },
  },
  typography,
} satisfies Pick<ThemeContextValue, "colors" | "gradients" | "components" | "typography">;