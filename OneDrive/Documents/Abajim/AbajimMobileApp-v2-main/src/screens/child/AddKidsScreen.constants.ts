import type { ImageSourcePropType } from "react-native";
import type { InputConfig } from "types/interfaces/InputConfig";
import { LevelEnum, ALL_LEVELS } from "@config/enums/Level.enum";
import type { AddKidsForm } from "./AddKidsScreen.type";

export const LEVELS_ROW1: LevelEnum[] = ALL_LEVELS.slice(0, 3);
export const LEVELS_ROW2: LevelEnum[] = ALL_LEVELS.slice(3, 6);

export const levelIcons: Record<LevelEnum, ImageSourcePropType> = {
  [LevelEnum.One]: require("../../../assets/icons/one.png"),
  [LevelEnum.Two]: require("../../../assets/icons/two.png"),
  [LevelEnum.Three]: require("../../../assets/icons/three.png"),
  [LevelEnum.Four]: require("../../../assets/icons/four.png"),
  [LevelEnum.Five]: require("../../../assets/icons/five.png"),
  [LevelEnum.Six]: require("../../../assets/icons/six.png"),
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
  genderLabel: "child.gender",
  genderRequired: "child.gender_required",
  boy: "child.boy",
  girl: "child.girl",
  levelLabel: "child.level",
  levelRequired: "child.level_required",
  levelLockedHint: "child.level_locked_hint",
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

  backgroundImage: require("../../../assets/images/ba1.png"),
  heroImage: require("../../../assets/images/kids.jpg"),
  boyIcon: require("../../../assets/icons/male.png"),
  girlIcon: require("../../../assets/icons/female.png"),

  backgroundResizeMode: "cover" as const,
  heroResizeMode: "contain" as const,
  keyboardPersistTaps: "handled" as const,

  iosPlatform: "ios",
  iosKeyboardOffset: 80,
  defaultKeyboardOffset: 0,

  backIconName: "arrow-back" as const,
  backIconSize: 28,
  backIconColor: "#1F3B64",
  submitLoaderColor: "#fff",

  cameraIconName: "camera-outline" as const,
  cameraIconSize: 18,
  cameraBadgeColor: "#1F3B64",
} as const;