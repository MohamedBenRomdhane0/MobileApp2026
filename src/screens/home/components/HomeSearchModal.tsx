import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
  type ImageSourcePropType,
  type ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { pickMaterialArtwork } from "@screens/home/HomeScreen.helpers";
import type {
  HomeBlockBaseProps,
  MeetingCard,
} from "@screens/home/HomeScreen.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";

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

const SEARCH_TABS: { key: SearchTab; labelKey: string }[] = [
  { key: "materials", labelKey: "home.search_tabs.materials" },
  { key: "books", labelKey: "home.search_tabs.books" },
  { key: "live", labelKey: "home.search_tabs.live" },
];

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
          <Ionicons
            name={
              tab === "materials"
                ? "cube-outline"
                : tab === "books"
                ? "book-outline"
                : "videocam-outline"
            }
            size={20}
            color={palette.teal}
          />
        )}
      </View>

      <View style={{ flex: 1, minWidth: 0, alignItems: isRTL ? "flex-start" : "flex-end" }}>
        <Text style={[styles.searchResultTitle, { color: palette.ink }]} numberOfLines={1}>
          {item.title}
        </Text>
        {!!item.subtitle && (
          <Text style={[styles.searchResultSub, { color: palette.sub }]} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>
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
      <View style={styles.searchModalRoot}>
        <Pressable style={styles.searchBackdrop} onPress={onClose} />

        <View style={styles.searchModalCard}>
        {/* Search input */}
        <View style={styles.searchModalHeader}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("common.search_placeholder")}
            placeholderTextColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"}
            style={[styles.searchInput, { color: activeColor }]}
            textAlign={isRTL ? "right" : "left"}
            autoFocus
          />
          <Ionicons
            name="search-outline"
            size={18}
            color={isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)"}
          />
          <TouchableOpacity
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          >
            <Ionicons name="close" size={20} color={isDark ? "#FFFFFF" : palette.ink} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
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
                <Text
                  style={[
                    styles.searchTabLabel,
                    isActive && styles.searchTabLabelActive,
                    { color: isActive ? palette.teal : palette.sub },
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
            <Text style={[styles.searchEmptyText, { color: palette.sub }]}>
              {query.trim()
                ? t("home.search_no_results")
                : t("home.search_hint")}
            </Text>
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
      </View>
    </Modal>
  );
}
