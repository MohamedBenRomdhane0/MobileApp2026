import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {
  DEFAULT_HERO_ITEM_ID,
  HERO_ITEMS,
  type HeroCategory,
} from "@screens/child/customizeAvatar/CustomizeAvatarScreen.constants";

const HERO_STORAGE_PREFIX = "customize_avatar_v3_";

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

  const previewAvatar = useMemo(() => {
    const gear = HERO_ITEMS.find((i) => i.id === selections.gear);
    const head = HERO_ITEMS.find((i) => i.id === selections.head);
    return gear?.avatar ?? head?.avatar ?? HERO_ITEMS[0].avatar;
  }, [selections.head, selections.gear]);

  return { selections, equip, previewAvatar };
}

/**
 * Lightweight hook: returns the saved skin avatar source for a child.
 * Re-reads on every screen focus so changes from customize screen appear instantly.
 */
export function useChildSkinAvatar(childId: number | null): number | null {
  const [avatar, setAvatar] = useState<number | null>(null);

  const readSkin = useCallback(async () => {
    const key = storageKey(childId);
    if (!key) {
      setAvatar(null);
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) {
        setAvatar(null);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<Selections>;
      const gear = HERO_ITEMS.find((i) => i.id === parsed.gear);
      const head = HERO_ITEMS.find((i) => i.id === parsed.head);
      setAvatar(gear?.avatar ?? head?.avatar ?? null);
    } catch {
      setAvatar(null);
    }
  }, [childId]);

  useFocusEffect(
    useCallback(() => {
      readSkin();
    }, [readSkin]),
  );

  return avatar;
}
