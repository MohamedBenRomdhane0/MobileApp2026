export enum MaterialIdEnum {
  Arabic = 1,
  Math = 2,
  Science = 3,
  French = 4,
  Social = 5,
  English = 6,
}

export enum MaterialCodeEnum {
  Arabic = "mat_arabic",
  Math = "mat_math",
  Science = "mat_science",
  French = "mat_french",
  Social = "mat_social",
  English = "mat_english",
}

export type MaterialUiKey =
  | "arabic"
  | "math"
  | "science"
  | "french"
  | "social"
  | "english";

export const MATERIAL_UI_KEY_BY_ID: Record<number, MaterialUiKey> = {
  [MaterialIdEnum.Arabic]: "arabic",
  [MaterialIdEnum.Math]: "math",
  [MaterialIdEnum.Science]: "science",
  [MaterialIdEnum.French]: "french",
  [MaterialIdEnum.Social]: "social",
  [MaterialIdEnum.English]: "english",
};

export const MATERIAL_UI_KEY_BY_CODE: Record<string, MaterialUiKey> = {
  [MaterialCodeEnum.Arabic]: "arabic",
  [MaterialCodeEnum.Math]: "math",
  [MaterialCodeEnum.Science]: "science",
  [MaterialCodeEnum.French]: "french",
  [MaterialCodeEnum.Social]: "social",
  [MaterialCodeEnum.English]: "english",

  arabic: "arabic",
  math: "math",
  science: "science",
  french: "french",
  social: "social",
  english: "english",
};