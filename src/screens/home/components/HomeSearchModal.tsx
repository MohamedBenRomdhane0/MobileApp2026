import React, { ComponentProps, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  type ImageSourcePropType,
  type ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { pickMaterialArtwork } from "@screens/home/HomeScreen.helpers";
import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import type {
  HomeBlockBaseProps,
  MeetingCard,
} from "@screens/home/HomeScreen.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Tabs on the search modal. Keys map to the localized `home.search_tabs.*`. */
type SearchTab = "materials" | "books" | "live";

type Thumb = ImageSourcePropType | { uri: string };

/** A single searchable result, normalized across the three tabs. */
type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  thumb?: Thumb | null;
  onPress: () => void;
};

type HomeSearchModalProps = HomeBlockBaseProps & {
  isDark: boolean;
  visible: boolean;
  onClose: () => void;
  materials: MaterialUI[];
  labelForMaterial: (m: MaterialUI) => string;
  onSelectMaterial: (m: MaterialUI) => void;
  books: BookListItemUI[];
  unnamedLabel: string;
  onSelectBook: (bookId: number) => void;
  /** Live / cours-en-direct sessions surfaced to the search. */
  liveSessions: MeetingCard[];
  onSelectLive: (session: MeetingCard) => void;
};

const SEARCH_TABS: { key: SearchTab; labelKey: string; icon: IconName }[] = [
  { key: "materials", labelKey: "home.search_tabs.materials", icon: "grid-outline" },
  { key: "books", labelKey: "home.search_tabs.books", icon: "book-outline" },
  { key: "live", labelKey: "home.search_tabs.live", icon: "videocam-outline" },
];

const TAB_ICON: Record<SearchTab, IconName> = {
  materials: "grid-outline",
  books: "book-outline",
  live: "videocam-outline",
};

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export default function HomeSearchModal({
  styles,
  palette,
  isRTL,
  isDark,
  visible,
  onClose,
  materials,
  labelForMaterial,
  onSelectMaterial,
  books,
  unnamedLabel,
  onSelectBook,
  liveSessions,
  onSelectLive,
}: HomeSearchModalProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SearchTab>("materials");
  const [query, setQuery] = useState("");

  const activeColor = isDark ? "#FFFFFF" : palette.ink;
  const hintColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(15,46,87,0.45)";
  const fieldHintColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(18,42,78,0.4)";
  const chevron = isRTL ? ("chevron-back" as const) : ("chevron-forward" as const);

  const bandColors = isDark
    ? HOME_TOKENS.heroGradientDark
    : HOME_TOKENS.heroGradientLight;

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim();

    if (tab === "materials") {
      return materials
        .filter((m) => matches(labelForMaterial(m), q))
        .map((m) => ({
          id: `m_${m.id}`,
          title: labelForMaterial(m),
          thumb: pickMaterialArtwork(m),
          onPress: () => {
            onSelectMaterial(m);
            onClose();
          },
        }));
    }

    if (tab === "books") {
      return books
        .filter((b) => matches(String(b.title ?? ""), q))
        .map((b) => ({
          id: `b_${b.id}`,
          title: String(b.title ?? "").trim() || unnamedLabel,
          subtitle: `${b.videosCount ?? 0} vid • ${b.pagesTotal ?? 0} pgs`,
          thumb: b.coverUrl ? { uri: b.coverUrl } : null,
          onPress: () => {
            onSelectBook(b.id);
            onClose();
          },
        }));
    }

    const live = liveSessions.filter(
      (s) =>
        matches(String(s.teacherName ?? ""), q) ||
        matches(String(s.subjectLabel ?? ""), q)
    );

    return live.map((s) => ({
      id: `l_${s.id}`,
      title: String(s.teacherName ?? ""),
      subtitle: String(s.subjectLabel ?? ""),
      thumb: s.avatar,
      onPress: () => {
        onSelectLive(s);
        onClose();
      },
    }));
  }, [
    tab,
    query,
    materials,
    labelForMaterial,
    books,
    unnamedLabel,
    liveSessions,
    onSelectMaterial,
    onSelectBook,
    onSelectLive,
    onClose,
  ]);

  const renderItem = ({ item }: ListRenderItemInfo<SearchResult>) => (
    <TouchableOpacity
      style={styles.searchResultRow}
      activeOpacity={0.8}
      onPress={item.onPress}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.searchResultThumb,
          { backgroundColor: palette.surfaceAlt },
        ]}
      >
        {item.thumb ? (
          <Image source={item.thumb} style={styles.searchResultImg} />
        ) : (
          <Ionicons name={TAB_ICON[tab]} size={20} color={palette.teal} />
        )}
      </View>

      <View style={styles.searchResultBody}>
        <Text style={[styles.searchResultTitle, { color: palette.ink }]} numberOfLines={1}>
          {item.title}
        </Text>
        {!!item.subtitle && (
          <Text style={[styles.searchResultSub, { color: palette.sub }]} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>

      <Ionicons name={chevron} size={16} color={palette.muted} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.searchModalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.searchBackdrop} onPress={onClose} />

        <View style={styles.searchModalCard}>
          {/* Navy band: eyebrow title + glass search field + close */}
          <LinearGradient
            colors={bandColors}
            start={{ x: 0.08, y: 0.05 }}
            end={{ x: 0.95, y: 1 }}
            style={styles.searchBand}
          >
            <Text style={styles.searchBandTitle}>{t("home.search_title")}</Text>

            <View style={styles.searchFieldRow}>
              <View style={styles.searchField}>
                <Ionicons name="search-outline" size={18} color={palette.teal} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t("common.search_placeholder")}
                  placeholderTextColor={fieldHintColor}
                  style={[styles.searchInput, { color: activeColor }]}
                  textAlign={isRTL ? "right" : "left"}
                  autoFocus
                />
                {query.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setQuery("")}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={t("common.close")}
                  >
                    <Ionicons name="close-circle" size={18} color={hintColor} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.searchCloseBtn}
                onPress={onClose}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={t("common.close")}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Tab chips */}
          <View style={styles.searchTabsRow}>
            {SEARCH_TABS.map((tabItem) => {
              const isActive = tab === tabItem.key;
              return (
                <TouchableOpacity
                  key={tabItem.key}
                  style={[
                    styles.searchTabBtn,
                    isActive && styles.searchTabBtnActive,
                  ]}
                  onPress={() => setTab(tabItem.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={tabItem.icon}
                    size={14}
                    color={isActive ? "#FFFFFF" : palette.sub}
                  />
                  <Text
                    style={[
                      styles.searchTabLabel,
                      isActive && styles.searchTabLabelActive,
                      { color: isActive ? "#FFFFFF" : palette.sub },
                    ]}
                    numberOfLines={1}
                  >
                    {t(tabItem.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Results */}
          <View style={styles.searchResultsList}>
            {results.length === 0 ? (
              <View style={styles.searchEmptyWrap}>
                <View
                  style={[
                    styles.searchEmptyIcon,
                    { backgroundColor: palette.tealSoft },
                  ]}
                >
                  <Ionicons name="search-outline" size={24} color={palette.teal} />
                </View>
                <Text style={[styles.searchEmptyText, { color: palette.sub }]}>
                  {query.trim()
                    ? t("home.search_no_results")
                    : t("home.search_hint")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 12 }}
              />
          )}
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
