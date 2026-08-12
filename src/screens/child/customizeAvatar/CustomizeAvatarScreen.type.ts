import type { HeroItem } from "./CustomizeAvatarScreen.constants";

export type CustomizeAvatarScreenProps = {
  childId?: number | null;
  childName?: string | null;
  levelId?: number | null;
};

export type SelectHeroItem = (item: HeroItem) => void;
