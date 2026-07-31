export enum LevelEnum {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
}

export const ALL_LEVELS: LevelEnum[] = [
  LevelEnum.One,
  LevelEnum.Two,
  LevelEnum.Three,
  LevelEnum.Four,
  LevelEnum.Five,
  LevelEnum.Six,
];

export const LEVEL_LABEL: Record<LevelEnum, string> = {
  [LevelEnum.One]: 'الأولى ابتدائي',
  [LevelEnum.Two]: 'الثانية ابتدائي',
  [LevelEnum.Three]: 'الثالثة ابتدائي',
  [LevelEnum.Four]: 'الرابعة ابتدائي',
  [LevelEnum.Five]: 'الخامسة ابتدائي',
  [LevelEnum.Six]: 'السادسة ابتدائي',
};

/* Handy numeric map to avoid TS index errors when you have a plain number */
export const LEVEL_LABEL_BY_ID: Record<number, string> = {
  1: LEVEL_LABEL[LevelEnum.One],
  2: LEVEL_LABEL[LevelEnum.Two],
  3: LEVEL_LABEL[LevelEnum.Three],
  4: LEVEL_LABEL[LevelEnum.Four],
  5: LEVEL_LABEL[LevelEnum.Five],
  6: LEVEL_LABEL[LevelEnum.Six],
};
