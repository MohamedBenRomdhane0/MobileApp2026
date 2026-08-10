export const LIQUID = {
  // ---- Bar geometry -------------------------------------------------------
  barWidthRatio: 0.92,
  barMaxWidth: 460,
  barHeight: 68,
  bottomSpacing: 8,
  borderRadius: 34,
  hPadding: 10,
  /** Horizontal room reserved in the tabs row for the centered FAB. */
  fabSlot: 86,

  // ---- Glass ---------------------------------------------------------------
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
  shadow: "rgba(12,58,74,0.28)",
  // Cyan accent color
  cyanColor: "#22BEC8",
  cyanDeep: "rgb(21, 47, 87)",
  // Inactive icon/label color - dark navy
  inactiveColor: "rgb(31, 59, 100)",
  inactiveOpacity: 0.7,

  // ---- Motion --------------------------------------------------------------
  activeIconScale: 1.12,
  pressScale: 0.9,
  spring: {
    damping: 18,
    stiffness: 180,
    mass: 0.9,
    overshootClamping: false,
    energyThreshold: 0.01,
  } as const,
  /** Bouncy spring used when the quick-action menu opens. */
  openSpring: {
    damping: 15,
    stiffness: 210,
    mass: 0.85,
    overshootClamping: false,
    energyThreshold: 0.01,
  } as const,
  /** Tighter spring used when it closes, so it snaps shut. */
  closeSpring: {
    damping: 24,
    stiffness: 320,
    mass: 0.8,
    overshootClamping: false,
    energyThreshold: 0.01,
  } as const,
  transitionMs: 380,

  // ---- Sliding indicator ---------------------------------------------------
  indicatorHeight: 52,
  indicatorMaxWidth: 66,

  // ---- Floating action button ---------------------------------------------
  fabSize: 64,
  fabPressScale: 0.92,
  /** How far the FAB rises above the top edge of the bar. */
  fabLift: 26,

  // ---- Quick action menu (the bubble above the FAB) -----------------------
  menuGap: 22,
  menuHeight: 86,
  menuRadius: 30,
  menuMaxWidth: 272,
  menuWidthRatio: 0.74,
  menuTailSize: 20,
  menuTint: "rgba(255,255,255,0.62)",
  menuTintSolid: "rgba(255,255,255,0.80)",
  menuBorder: "rgba(255,255,255,0.70)",
  scrimColor: "rgba(8,32,48,0.28)",

  tabCount: 4,
  tabs: [
    {
      name: "Settings",
      label: "Profil",
      icon: "person-outline",
      iconFocused: "person",
    },
    {
      name: "Home",
      label: "Accueil",
      icon: "home-outline",
      iconFocused: "home",
    },
    {
      name: "Books",
      label: "Livres",
      icon: "book-outline",
      iconFocused: "book",
    },
    {
      name: "LearnCalendar",
      label: "Live",
      icon: "calendar-outline",
      iconFocused: "calendar",
    },
  ] as const,

  /** The three shortcuts revealed by the center button. */
  quickActions: [
    {
      name: "StartLearning",
      label: "Apprendre",
      icon: "play-circle",
    },
    {
      name: "ScanQRCode",
      label: "Scanner QR",
      icon: "scan-outline",
    },
    {
      name: "StudyCraft",
      label: "Ateliers",
      icon: "color-wand",
    },
  ] as const,
} as const;
