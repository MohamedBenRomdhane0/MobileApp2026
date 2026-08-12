export type HeroCategory = "head" | "body" | "gear" | "pets" | "skins";

export type HeroRarity = "common" | "rare" | "epic" | "legendary";

export type HeroItem = {
  id: string;
  nameKey: string;
  category: HeroCategory;
  rarity: HeroRarity;
  locked: boolean;
  thumb: number;
  avatar: number;
};

export const CUSTOMIZE_TABS: HeroCategory[] = [
  "head",
  "body",
  "gear",
  "pets",
  "skins",
];

export const DEFAULT_HERO_ITEM_ID = "frog";

export const HERO_ITEMS: HeroItem[] = [
  {
    id: "frog",
    nameKey: "frog_hood",
    category: "head",
    rarity: "epic",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/item-frog-hat.png"),
    avatar: require("../../../../assets/kids/avatars/hero-character.jpg"),
  },
  {
    id: "beanie",
    nameKey: "pom_beanie",
    category: "head",
    rarity: "rare",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/item-beanie.png"),
    avatar: require("../../../../assets/kids/avatars/hero-beanie.jpg"),
  },
  {
    id: "cap",
    nameKey: "sky_cap",
    category: "head",
    rarity: "common",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/item-cap.png"),
    avatar: require("../../../../assets/kids/avatars/hero-cap.jpg"),
  },
  {
    id: "helmet",
    nameKey: "viking_helm",
    category: "head",
    rarity: "legendary",
    locked: true,
    thumb: require("../../../../assets/kids/avatars/item-helmet.png"),
    avatar: require("../../../../assets/kids/avatars/hero-character.jpg"),
  },
  {
    id: "classic",
    nameKey: "classic_look",
    category: "body",
    rarity: "common",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-character.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-character.jpg"),
  },
  {
    id: "winter",
    nameKey: "winter_cozy",
    category: "body",
    rarity: "rare",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-beanie.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-beanie.jpg"),
  },
  {
    id: "sunny",
    nameKey: "sunny_day",
    category: "body",
    rarity: "common",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-cap.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-cap.jpg"),
  },
  {
    id: "pack",
    nameKey: "explorer_pack",
    category: "gear",
    rarity: "rare",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/item-backpack.png"),
    avatar: require("../../../../assets/kids/avatars/hero-pack.jpg"),
  },
  {
    id: "skin_frog",
    nameKey: "frog_skin",
    category: "skins",
    rarity: "epic",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-character.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-character.jpg"),
  },
  {
    id: "skin_beanie",
    nameKey: "beanie_skin",
    category: "skins",
    rarity: "rare",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-beanie.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-beanie.jpg"),
  },
  {
    id: "skin_cap",
    nameKey: "cap_skin",
    category: "skins",
    rarity: "common",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-cap.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-cap.jpg"),
  },
  {
    id: "skin_pack",
    nameKey: "pack_skin",
    category: "skins",
    rarity: "rare",
    locked: false,
    thumb: require("../../../../assets/kids/avatars/hero-pack.jpg"),
    avatar: require("../../../../assets/kids/avatars/hero-pack.jpg"),
  },
];

export const HERO_STORAGE_PREFIX = "customize_avatar_";
