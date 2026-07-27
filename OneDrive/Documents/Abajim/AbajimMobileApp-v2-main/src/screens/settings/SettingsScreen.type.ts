import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";
import type { Ionicons } from "@expo/vector-icons";

export type Nav = NativeStackNavigationProp<RootStackParamList>;

export type SettingsOptionKey =
  | "theme"
  | "profile"
  | "kids"
  | "childActivity"
  | "favoriteCourses"
  | "subscription";

export type SettingsOptionAction = "toggle_theme" | "navigate";

export type ThemeTokens = {
  iconBgs: {
    purpleBg: string;
    blueBg: string;
    tealBg: string;
    headerBg: string;
    yellowBg: string;
    cyanBg: string;
  };

  iconColors: {
    purple: string;
    blue: string;
    teal: string;
    yellow: string;
    cyan: string;
  };

  switchTrackOff: string;
};

export type SettingsOptionConfig = {
  key: SettingsOptionKey;
  title: string;

  subtitle?: {
    enabled: string;
    disabled: string;
  };

  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: keyof ThemeTokens["iconBgs"];
  iconColor: keyof ThemeTokens["iconColors"];

  action: SettingsOptionAction;
  routeName?: keyof RootStackParamList;
};