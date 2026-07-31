export type ThemeMode = "light" | "dark";

export type AppColors = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  header: string;
  primary: string;
  danger: string;
};

export type AppGradients = {
  profileCard: readonly [string, string];
};

export type AppComponents = {
  parentProfileCard: {
    borderColor: string;
    nameColor: string;
    badgeTextColor: string;
    decorCircleBg: string;
    avatarBg: string;
    shadowOpacity: number;
  };
};

export type TypographyStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight?: number;
  fontWeight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
};

export type AppTypography = {
  fontFamily: string;
  fontWeightRegular: TypographyStyle["fontWeight"];
  fontWeightMedium: TypographyStyle["fontWeight"];
  fontWeightBold: TypographyStyle["fontWeight"];
  variants: Record<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "subtitle1" | "subtitle2" | "button",
    TypographyStyle
  >;
};

export type ThemeContextValue = {
  mode: ThemeMode;
  colors: AppColors;
  gradients: AppGradients;
  components: AppComponents;
  typography: AppTypography;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => void;
};