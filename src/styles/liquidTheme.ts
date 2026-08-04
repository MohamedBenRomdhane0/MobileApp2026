export const LIQUID = {
  barWidthRatio: 0.9,
  barHeight: 68,
  bottomSpacing: 8,
  borderRadius: 36,
  backdropBlur: 40,
  // Abajim blue (cyan) with very low opacity for the glass base
  bg: "rgba(34,190,200,0.08)",
  // White-based glass layers
  glassBase: "rgba(255,255,255,0.12)",
  glassHighlight: "rgba(255,255,255,0.20)",
  glassEdge: "rgba(255,255,255,0.35)",
  // Cyan accent layers
  cyanBase: "rgba(34,190,200,0.06)",
  cyanGlow: "rgba(34,190,200,0.15)",
  // Border & shadow
  border: "rgba(34,190,200,0.25)",
  shadow: "rgba(34,190,200,0.12)",
  // Cyan accent color
  cyanColor: "#22BEC8",
  // Inactive icon/label color - dark navy
  inactiveColor: "rgba(9,17,33,0.62)",
  inactiveOpacity: 0.7,
  activeIconScale: 1.15,
  pressScale: 0.95,
  spring: { damping: 18, stiffness: 180, mass: 0.9, overshootClamping: false, energyThreshold: 0.01 } as const,
  transitionMs: 380,
  tabCount: 4,
  tabs: [
    { name: "Settings", label: "Profil", icon: "person-outline", iconFocused: "person" },
    { name: "Home", label: "Accueil", icon: "home-outline", iconFocused: "home" },
    { name: "Books", label: "Livres", icon: "book-outline", iconFocused: "book" },
    { name: "LearnCalendar", label: "Écoles", icon: "school-outline", iconFocused: "school" },
  ] as const,
} as const;
