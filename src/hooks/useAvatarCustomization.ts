import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_HERO_ITEM_ID } from "@screens/child/customizeAvatar/CustomizeAvatarScreen.constants";

const HERO_STORAGE_PREFIX = "customize_avatar_";

const storageKey = (childId: number | null): string | null =>
  childId != null && Number.isFinite(childId) ? `${HERO_STORAGE_PREFIX}${childId}` : null;

/** Loads and saves the equipped hero item id per active child. */
export function useAvatarCustomization(childId: number | null) {
  const [itemId, setItemId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const key = storageKey(childId);
    if (!key) {
      setItemId(DEFAULT_HERO_ITEM_ID);
      return;
    }
    AsyncStorage.getItem(key)
      .then((saved) => {
        if (mounted) setItemId(saved || DEFAULT_HERO_ITEM_ID);
      })
      .catch(() => {
        if (mounted) setItemId(DEFAULT_HERO_ITEM_ID);
      });
    return () => {
      mounted = false;
    };
  }, [childId]);

  const equip = useCallback(
    (next: string) => {
      setItemId(next);
      const key = storageKey(childId);
      if (!key) return;
      AsyncStorage.setItem(key, next).catch(() => {
        /* ignore persistence errors */
      });
    },
    [childId],
  );

  return { itemId, equip };
}
