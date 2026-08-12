import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import {
  CUSTOMIZE_TABS,
  DEFAULT_HERO_ITEM_ID,
  HERO_ITEMS,
  type HeroCategory,
  type HeroItem,
} from "./CustomizeAvatarScreen.constants";
import { customizeAvatarStyles as s } from "./CustomizeAvatarScreen.styles";
import { useAvatarCustomization } from "@hooks/useAvatarCustomization";
import { useActiveChild } from "@hooks/useActiveChild";

const RARITY_COLOR: Record<HeroItem["rarity"], TextStyle> = {
  epic: s.rarityEpic,
  rare: s.rarityRare,
  common: s.rarityCommon,
  legendary: s.rarityLegendary,
};

/** Preload all hero + thumb images into the RN image cache on mount. */
function usePreloadAssets() {
  useEffect(() => {
    const seen = new Set<string>();
    for (const item of HERO_ITEMS) {
      const avatarUri = Image.resolveAssetSource(item.avatar)?.uri;
      if (avatarUri && !seen.has(avatarUri)) {
        Image.prefetch(avatarUri);
        seen.add(avatarUri);
      }
      const thumbUri = Image.resolveAssetSource(item.thumb)?.uri;
      if (thumbUri && !seen.has(thumbUri)) {
        Image.prefetch(thumbUri);
        seen.add(thumbUri);
      }
    }
  }, []);
}

/** Preload images for a specific tab so they're ready when scrolled into view. */
function usePreloadTab(tab: HeroCategory) {
  useEffect(() => {
    for (const item of HERO_ITEMS) {
      if (item.category !== tab) continue;
      const avatarUri = Image.resolveAssetSource(item.avatar)?.uri;
      if (avatarUri) Image.prefetch(avatarUri);
      const thumbUri = Image.resolveAssetSource(item.thumb)?.uri;
      if (thumbUri) Image.prefetch(thumbUri);
    }
  }, [tab]);
}

export default function CustomizeAvatarScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const child = useActiveChild();
  const childId = child?.id ?? null;

  const { selections, equip, previewAvatar } = useAvatarCustomization(childId);

  usePreloadAssets();

  const [tab, setTab] = useState<HeroCategory>("head");
  const [editingName, setEditingName] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState<string | null>(null);

  usePreloadTab(tab);

  const currentSelection = selections[tab];

  const visibleItems = useMemo(
    () => HERO_ITEMS.filter((item) => item.category === tab),
    [tab],
  );

  const selectItem = useCallback(
    (item: HeroItem) => {
      if (item.locked) return;
      equip(tab, item.id);
      setSaved(false);
    },
    [equip],
  );

  const save = useCallback(() => {
    setEditingName(false);
    setSaved(true);
  }, []);

  const displayName =
    name?.trim() || child?.fullName || child?.full_name || t("customize.default_name");

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t("customize.title")}</Text>
        <TouchableOpacity
          style={[s.headerBtn, s.headerBtnSave]}
          onPress={save}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t("customize.save")}
        >
          <Ionicons name="checkmark" size={20} color="#0B1B33" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View style={s.nameRow}>
        {editingName ? (
          <TextInput
            style={s.nameInput}
            value={name ?? child?.fullName ?? child?.full_name ?? ""}
            onChangeText={(next) => setName(next)}
            placeholder={t("customize.default_name")}
            placeholderTextColor="rgba(241,245,249,0.45)"
            autoFocus
            onBlur={() => setEditingName(false)}
            accessibilityLabel={t("customize.edit_name")}
          />
        ) : (
          <Text style={s.nameText} numberOfLines={1}>
            {displayName}
          </Text>
        )}
        <TouchableOpacity
          style={s.nameEditBtn}
          onPress={() => setEditingName((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t("customize.edit_name")}
        >
          <Ionicons name="pencil" size={18} color="rgba(241,245,249,0.55)" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero preview */}
        <View style={s.heroPreview}>
          <ExpoImage
            source={previewAvatar}
            style={s.heroImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory"
          />
          <View style={s.heroOverlay}>
            <View style={s.heroLevelLine}>
              <Text style={s.heroLevel}>{t("customize.level", { level: child?.levelIdNormalized ?? 12 })}</Text>
              <Text style={s.heroItemName} numberOfLines={1}>
                {t(`customize.items.${HERO_ITEMS.find((i) => i.id === currentSelection)?.nameKey ?? "frog_hood"}`)}
              </Text>
            </View>
            <View style={s.pointsBadge}>
              <Ionicons name="sparkles" size={14} color="#F6C445" />
              <Text style={s.pointsText}>
                {String((child?.levelIdNormalized ?? 12) * 100 + 80).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.tabsRow}
          contentContainerStyle={{ gap: 8 }}
        >
          {CUSTOMIZE_TABS.map((category) => {
            const active = tab === category;
            const hasSelection = Boolean(selections[category]);
            return (
              <TouchableOpacity
                key={category}
                style={[s.tabPill, active && s.tabPillActive]}
                onPress={() => setTab(category)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[s.tabPillText, active && s.tabPillTextActive]}>
                  {t(`customize.tabs.${category}`)}
                  {hasSelection && !active ? " ●" : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Items grid */}
        {visibleItems.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="paw-outline" size={32} color="rgba(241,245,249,0.3)" />
            <Text style={s.emptyStateText}>{t("customize.no_items")}</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {visibleItems.map((item) => {
              const isSelected = item.id === currentSelection;
              const rarityStyle = item.locked ? s.rarityLocked : RARITY_COLOR[item.rarity];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    s.gridItem,
                    isSelected && s.gridItemSelected,
                    item.locked && s.gridItemLocked,
                  ]}
                  onPress={() => selectItem(item)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <ExpoImage source={item.thumb} style={s.gridThumb} contentFit="contain" cachePolicy="memory" />
                  <Text style={s.gridName} numberOfLines={1}>
                    {t(`customize.items.${item.nameKey}`)}
                  </Text>
                  <Text style={[s.gridRarity, rarityStyle]} numberOfLines={1}>
                    {item.locked ? t("customize.locked") : t(`customize.rarity.${item.rarity}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Save button */}
        <TouchableOpacity
          onPress={save}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={t("customize.equip_save")}
        >
          <LinearGradient
            colors={["#22BEC8", "#17A2B0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.saveBtn}
          >
            <Text style={s.saveBtnText}>
              {saved ? t("customize.saved") : t("customize.equip_save")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
