import { ConfigEnv } from "@config/configEnv";
import { PATHS } from "@config/constants/paths";
import type { SettingsOptionKey, SettingsOptionConfig } from "./SettingsScreen.type";

export const STORAGE_BASE_URL = String(ConfigEnv.MEDIA_BASE_URL ?? "");

export const PLAN_CARD_IMAGES = {
  cartaba: require("../../../assets/plans/gift-box-hd.png"),
  vip: require("../../../assets/plans/crown-hd.png"),
} as const;

export const SETTINGS_OPTIONS: Record<SettingsOptionKey, SettingsOptionConfig> = {
  theme: {
    key: "theme",
    title: "settings.dark_mode",
    subtitle: {
      enabled: "settings.enabled",
      disabled: "settings.disabled",
    },
    iconName: "moon-outline",
    iconBg: "purpleBg",
    iconColor: "purple",
    action: "toggle_theme",
  },

  profile: {
    key: "profile",
    title: "settings.my_profile",
    iconName: "person-outline",
    iconBg: "blueBg",
    iconColor: "blue",
    action: "navigate",
    routeName: PATHS.APP.PROFILE_PARENT,
  },

  kids: {
    key: "kids",
    title: "settings.my_kids",
    iconName: "people-outline",
    iconBg: "tealBg",
    iconColor: "teal",
    action: "navigate",
    routeName: PATHS.APP.KIDS_LIST,
  },

  childActivity: {
    key: "childActivity",
    title: "settings.child_activity",
    iconName: "bar-chart-outline",
    iconBg: "headerBg",
    iconColor: "blue",
    action: "navigate",
    routeName: PATHS.APP.PARENT_DASHBOARD,
  },

  favoriteCourses: {
    key: "favoriteCourses",
    title: "settings.favorite_courses",
    iconName: "star-outline",
    iconBg: "yellowBg",
    iconColor: "yellow",
    action: "navigate",
    routeName: PATHS.APP.FAVORITE_COURSES,
  },

  subscription: {
    key: "subscription",
    title: "settings.subscription",
    iconName: "card-outline",
    iconBg: "cyanBg",
    iconColor: "cyan",
    action: "navigate",
    routeName: PATHS.APP.BOOKS,
  },
};

export const SETTINGS_OPTIONS_ORDER: Array<SettingsOptionKey> = [
  "theme",
  "profile",
  "kids",
  "childActivity",
  "favoriteCourses",
  "subscription",
];

export const SETTINGS_UI = {
  title: "settings.title",
  switchChildHint: "settings.switch_child_hint",
  roleParent: "settings.parent_account",
  logout: "settings.logout",
} as const;