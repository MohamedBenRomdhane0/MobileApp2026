import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import type { PlansScreenStyles } from "@screens/plans/PlansScreen.styles";
import type { getPlansPalette } from "@screens/plans/PlansScreen.styles";

interface Props {
  books:        BookListItemUI[];
  matiereLabel: string;
  selectedIds:  number[];
  loading:      boolean;
  onToggle:     (id: number) => void;
  styles:       PlansScreenStyles;
  palette:      ReturnType<typeof getPlansPalette>;
}

export function BookSelectorList({
  books,
  matiereLabel,
  selectedIds,
  loading,
  onToggle,
  styles,
  palette,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.selectorSection}>
      <View>
        <Text style={[styles.selectorTitle, { color: palette.text }]}>
          {t("plan.select_books")}
        </Text>
        <Text style={styles.selectorSubtitle}>{matiereLabel}</Text>
      </View>

      {loading ? (
        <View style={styles.selectorList}>
          {[0, 1, 2].map((key) => (
            <View key={key} style={styles.selectorSkeleton}>
              <View style={styles.selectorSkeletonBook} />
              <View style={styles.selectorSkeletonLines}>
                <View style={[styles.selectorSkeletonLine, { width: "55%" }]} />
                <View style={[styles.selectorSkeletonLine, { width: "30%" }]} />
              </View>
            </View>
          ))}
        </View>
      ) : books.length === 0 ? (
        <View style={styles.selectorEmpty}>
          <Ionicons name="book-outline" size={26} color={palette.muted} />
          <Text style={styles.selectorEmptyText}>
            {t("plan.book_empty")}
          </Text>
        </View>
      ) : (
        <View style={styles.selectorList}>
          {books.map((book) => {
            const selected = selectedIds.includes(book.id);

            return (
              <TouchableOpacity
                key={book.id}
                activeOpacity={0.85}
                onPress={() => onToggle(book.id)}
                style={[
                  styles.selectorCard,
                  {
                    backgroundColor: palette.card,
                    borderColor: selected ? palette.primary : palette.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.selectorCheck,
                    {
                      backgroundColor: selected ? palette.primary : "transparent",
                      borderColor: selected ? palette.primary : palette.border,
                    },
                  ]}
                >
                  {selected ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                </View>

                <View
                  style={[
                    styles.selectorBookCover,
                    { backgroundColor: `${palette.primary}14` },
                  ]}
                >
                  {book.coverUrl ? (
                    <Image source={{ uri: book.coverUrl }} style={styles.selectorBookCoverImage} />
                  ) : (
                    <Text style={styles.selectorAvatarText}>📘</Text>
                  )}
                </View>

                <View style={styles.selectorInfo}>
                  <Text
                    style={[styles.selectorBookTitle, { color: palette.text }]}
                    numberOfLines={1}
                  >
                    {book.title}
                  </Text>

                  <Text style={styles.selectorMetaText} numberOfLines={1}>
                    {t("plan.pages", { pages: book.pagesTotal })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
