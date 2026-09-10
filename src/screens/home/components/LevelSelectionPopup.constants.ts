import type { ImageSourcePropType } from "react-native";
import type { LevelTypeEnum } from "@redux/apis/levels/levelsApi.type";
import {
  LEVEL_TYPE_PRIMAIRE,
  LEVEL_TYPE_COLLEGE,
  LEVEL_TYPE_LYCEE,
} from "@redux/apis/levels/levelsApi.type";

export const LEVEL_TYPE_ORDER: readonly LevelTypeEnum[] = [
  LEVEL_TYPE_PRIMAIRE,
  LEVEL_TYPE_COLLEGE,
  LEVEL_TYPE_LYCEE,
];

export const LEVEL_TYPE_LABEL: Record<LevelTypeEnum, string> = {
  [LEVEL_TYPE_PRIMAIRE]: "child.level_primaire",
  [LEVEL_TYPE_COLLEGE]: "child.level_college",
  [LEVEL_TYPE_LYCEE]: "child.level_lycee",
};

export const LEVELS_PER_ROW = 3;

export const LEVEL_BOULE_ICONS: Readonly<Record<number, ImageSourcePropType>> =
  {
    1: require("../../../../assets/icons/one.png"),
    2: require("../../../../assets/icons/two.png"),
    3: require("../../../../assets/icons/three.png"),
    4: require("../../../../assets/icons/four.png"),
    5: require("../../../../assets/icons/five.png"),
    6: require("../../../../assets/icons/six.png"),
  };

export const LEVEL_SELECT_UI = {
  title: "home.level_select_title",
  subtitle: "home.level_select_subtitle",
  confirm: "home.level_select_confirm",
  loading: "home.level_select_loading",
} as const;

export const LEVEL_SELECT_RUNTIME = {
  schoolIcon: "school-outline" as const,
  schoolIconSize: 20,
  submitGradientColors: ["#19B6C5", "#0FA6B6"] as const,
  submitLoaderColor: "#fff",
} as const;
