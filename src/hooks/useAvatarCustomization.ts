import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_HERO_ITEM_ID } from "@screens/child/customizeAvatar/CustomizeAvatarScreen.constants";
import type { HeroCategory } from "@screens/child/customizeAvatar/CustomizeAvatarScreen.constants";

const HERO_STORAGE_PREFIX = "customize_avatar_v2_";

const storageKey = (childId: number | null): string | null =>
  childId != null && Number.isFinite(childId) ? `${HERO_STORAGE_PREFIX}${childId}` : null;

export type Selections = Record<HeroCategory, string | null>;

const DEFAULT_SELECTIONS: Selections = {
  head: DEFAULT_HERO_ITEM_ID,
  body: null,
  gear: null,
  pets: null,
  skins: null,
};

/** Loads and saves equipped hero items per category per active child. */
export function useAvatarCustomization(childId: number | null) {
  const [selections, setSelections] = useState<Selections>(DEFAULT_SELECTIONS);

  useEffect(() => {
    let mounted = true;
    const key = storageKey(childId);
    if (!key) {
      setSelections(DEFAULT_SELECTIONS);
      return;
    }
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!mounted) return;
        if (!raw) {
          setSelections(DEFAULT_SELECTIONS);
          return;
        }
        try {
          const parsed = JSON.parse(raw) as Partial<Selections>;
          setSelections({ ...DEFAULT_SELECTIONS, ...parsed });
        } catch {
          setSelections(DEFAULT_SELECTIONS);
        }
      })
      .catch(() => {
        if (mounted) setSelections(DEFAULT_SELECTIONS);
      });
    return () => {
      mounted = false;
    };
  }, [childId]);

  const equip = useCallback(
    (category: HeroCategory, itemId: string) => {
      setSelections((prev) => {
        const next = { ...prev, [category]: itemId };
        const key = storageKey(childId);
        if (key) {
          AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
        }
        return next;
      });
    },
    [childId],
  );

  return { selections, equip };
}
