export const COLOR = {
  // Brand
  teal: "#22BEC8",
  tealDark: "#1AA6AF",
  navy: "#0A1225",
  navyDarker: "#060A14",

  // Backgrounds
  bgLight: "#F0F4FF",
  bgDark: "#0D1B2A",

  // Secondary
  rose: "#E8294C",
  emerald: "#27AE60",
  amber: "#F5A623",
  skyBlue: "#3A86D8",
  purple: "#7C5CBF",

  // Text / neutrals
  ink: "#0D1225",
  muted: "#8892B0",
  subText: "#A8B2CC",
  white: "#FFFFFF",
  black: "#000000",

  // Borders
  border: "#E2E8F0",
  borderDark: "rgba(255,255,255,0.10)",

  // Light tints
  tealLight: "#E8F9FA",
  emeraldLight: "#ECFDF5",
  amberLight: "#FFF7ED",
  roseLight: "#FFF1F3",
  purpleLight: "#F3EEFF",
  skyBlueLight: "#EEF6FF",

  // States / overlays
  danger: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  overlay: "rgba(2,6,23,0.70)",
  scrim: "rgba(0,0,0,0.50)",
} as const;

export const SURFACE = {
  light: {
    bg: COLOR.bgLight,
    card: COLOR.white,
    text: COLOR.ink,
    muted: COLOR.muted,
    sub: COLOR.subText,
    border: COLOR.border,
  },
  dark: {
    bg: COLOR.bgDark,
    card: "#0D1726",
    text: "#F8FAFC",
    muted: "rgba(255,255,255,0.55)",
    sub: "rgba(255,255,255,0.35)",
    border: COLOR.borderDark,
  },
} as const;

export const MATERIAL_COLOR: Record<string, string> = {
  mat_arabic: COLOR.rose,
  mat_math: COLOR.teal,
  mat_french: COLOR.skyBlue,
  mat_science: COLOR.emerald,
  mat_social: COLOR.purple,
  mat_english: COLOR.amber,
  default: COLOR.teal,
};

export const MATERIAL_GRADIENT: Record<string, readonly [string, string]> = {
  mat_arabic: ["#5C0E2A", "#FF4D6D"],
  mat_math: ["#053A41", "#2BD9E3"],
  mat_french: ["#0A2E5C", "#5BA3F5"],
  mat_science: ["#0A3B22", "#3DDC84"],
  mat_social: ["#2A1650", "#8E6BE0"],
  mat_english: ["#4A2C06", "#F5A623"],
  default: ["#0D1B2A", "#22BEC8"],
};

export const MATERIAL_TINT: Record<string, string> = {
  mat_arabic: COLOR.roseLight,
  mat_math: COLOR.tealLight,
  mat_french: COLOR.skyBlueLight,
  mat_science: COLOR.emeraldLight,
  mat_social: COLOR.purpleLight,
  mat_english: COLOR.amberLight,
  default: COLOR.tealLight,
};

export const FONT = {
  latin: "Nunito",
  arabic: "Tajawal",
} as const;

export const FONT_SIZE = {
  display: 28,
  h1: 24,
  h2: 20,
  h3: 16,
  body: 13,
  small: 11,
  micro: 9,
} as const;

export const FONT_WEIGHT = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const RADIUS = {
  chip: 8,
  btn: 12,
  card: 16,
  modal: 22,
  full: 999,
} as const;

/**
 * Screen-level radii.
 * Kept separate because your mobile mockup uses larger rounded blocks
 * than the base design-system card radius.
 */
export const SCREEN = {
  headerRadius: 28,
  bookCardRadius: 28,
  modalRadius: 28,
} as const;

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const SHADOW = {
  header: {
    shadowColor: COLOR.black,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  card: {
    shadowColor: COLOR.black,
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  button: {
    shadowColor: COLOR.teal,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modal: {
    shadowColor: COLOR.black,
    shadowOpacity: 0.20,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 14,
  },
} as const;

export const HEADER_GRADIENT = [
  "#173B67",
  "#102B4A",
  COLOR.navy,
] as const;

export const PRIMARY_BUTTON_GRADIENT = [
  COLOR.teal,
  COLOR.tealDark,
] as const;

export const TEACHER_AVATAR_GRADIENT = [
  "#1FA2FF",
  "#12D8FA",
  "#00C853",
] as const;