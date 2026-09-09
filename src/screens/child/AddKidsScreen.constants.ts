import type { ImageSourcePropType } from "react-native";
import type { InputConfig } from "types/interfaces/InputConfig";
import type { LevelTypeEnum } from "@redux/apis/levels/levelsApi.type";
import {
  LEVEL_TYPE_PRIMAIRE,
  LEVEL_TYPE_COLLEGE,
  LEVEL_TYPE_LYCEE,
} from "@redux/apis/levels/levelsApi.type";
import type { AddKidsForm } from "./AddKidsScreen.type";

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
    1: require("../../../assets/icons/one.png"),
    2: require("../../../assets/icons/two.png"),
    3: require("../../../assets/icons/three.png"),
    4: require("../../../assets/icons/four.png"),
    5: require("../../../assets/icons/five.png"),
    6: require("../../../assets/icons/six.png"),
  };

export const ADD_KIDS_FIELDS = {
  fullName: {
    name: "fullName",
    label: "child.full_name",
    placeholder: "child.full_name_placeholder",
    type: "text",
    rules: { required: "child.full_name_required" },
  } satisfies InputConfig,
};

export const ADD_KIDS_UI = {
  titleCreate: "child.add_title",
  titleEdit: "child.edit_title",
  addBadge: "child.add_badge",
  addSubtitle: "child.add_subtitle",
  noSignup: "child.no_signup",
  levelsCount: "child.levels_count",
  themeToggleLightLabel: "child.theme_toggle_light_label",
  themeToggleDarkLabel: "child.theme_toggle_dark_label",
  genderLabel: "child.gender",
  genderRequired: "child.gender_required",
  boy: "child.boy",
  girl: "child.girl",
  levelLabel: "child.level",
  levelRequired: "child.level_required",
  levelLockedHint: "child.level_locked_hint",
  levelDisabledHint: "child.level_lycee_disabled",
  submitCreate: "child.add_submit",
  submitEdit: "child.edit_submit",
  genericError: "common.something_went_wrong",
  avatarChange: "common.change_photo",
  avatarHint: "common.tap_to_change",
} as const;

type AddKidsApiErrorField = "full_name" | "gender" | "level_id" | "avatar";

export const ADD_KIDS_ERROR_FIELD_PAIRS: ReadonlyArray<{
  apiField: AddKidsApiErrorField;
  formField: keyof AddKidsForm;
}> = [
  { apiField: "full_name", formField: "fullName" },
  { apiField: "gender", formField: "gender" },
  { apiField: "level_id", formField: "levelId" },
] as const;

export const ADD_KIDS_RUNTIME = {
  defaultMode: "create",
  editMode: "edit",
  formMode: "onChange",
  rootField: "root",
  serverErrorType: "server",
  validationErrorType: "validate",
  submitErrorLog: "[AddKidsScreen] submit failed",

  keyboardPersistTaps: "handled" as const,

  backIconName: "arrow-back" as const,
  backIconSize: 24,
  backIconColor: "#1F3B64",

  sparklesIcon: "sparkles" as const,
  sparklesIconSize: 13,
  schoolIcon: "school-outline" as const,
  schoolIconSize: 20,
  checkIcon: "checkmark" as const,
  checkIconSize: 15,
  checkBadgeAccessibilityLabel: "selected" as const,

  submitLoaderColor: "#fff",
  submitGradientColors: ["#19B6C5", "#0FA6B6"] as const,

  bgGradientColorsLight: ["#DCF3F1", "#b1e4e4", "#FAFCFE"] as const,
  bgGradientColorsDark: ["#132341", "#061428"] as const,

  cameraIconName: "camera-outline" as const,
  cameraIconSize: 18,
  cameraBadgeColor: "#FFFFFF",
} as const;
