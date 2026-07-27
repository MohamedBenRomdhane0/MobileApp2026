export enum GenderEnum {
  Male = 'male',
  Female = 'female',
}

export enum GenderApiEnum {
  Boy = 'boy',
  Girl = 'girl',
}

export const toApiGender = (g: GenderEnum): GenderApiEnum =>
  g === GenderEnum.Male ? GenderApiEnum.Boy : GenderApiEnum.Girl;
