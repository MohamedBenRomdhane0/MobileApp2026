export type LevelApi = {
  id?: number | string | null;
  level_type_id?: number | string | null;
  is_active?: number | string | boolean | null;
  name?: string | null;
  name_ar?: string | null;
  nameAr?: string | null;
};

export type LevelTypeEnum = 1 | 2 | 3;

export type LevelUI = {
  id: number;
  levelTypeId: LevelTypeEnum;
  name: string;
  nameAr: string | null;
  disabled: boolean;
};

export const LEVEL_TYPE_PRIMAIRE: 1 = 1;
export const LEVEL_TYPE_COLLEGE: 2 = 2;
export const LEVEL_TYPE_LYCEE: 3 = 3;

export const LEVEL_TYPES: LevelTypeEnum[] = [
  LEVEL_TYPE_PRIMAIRE,
  LEVEL_TYPE_COLLEGE,
  LEVEL_TYPE_LYCEE,
];

export type GetLevelsApiResponse =
  | LevelApi[]
  | { data: LevelApi[] }
  | { data: { data: LevelApi[] } };

export type LevelTypeApi = {
  id: number | string;
  name: string;
  name_ar?: string | null;
  is_active?: number | string | boolean | null;
};

export type LevelTypeUI = {
  id: number;
  name: string;
  nameAr: string | null;
};

export type GetPublicLevelTypesApiResponse =
  | LevelTypeApi[]
  | { data: LevelTypeApi[] }
  | { data: { data: LevelTypeApi[] } };
