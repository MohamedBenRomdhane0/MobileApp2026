import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import { formatProgress, percentWidth } from "@screens/home/HomeScreen.helpers";
import type { HomeStyles, BooksRowProps } from "@screens/home/HomeScreen.type";
import type { BookListItemUI } from "@redux/apis/books/bookApi.type";

type BookCardProps = {
  book: BookListItemUI;
  index: number;
  title: string;
  unnamedLabel: string;
  styles: HomeStyles;
  onPress: () => void;
};

/**
 * Book card: cover with a legibility scrim, page / video badges and a teal
 * progress bar on the bottom edge, plus the title below.
 */
function BookCard({ book, index, title, unnamedLabel, styles, onPress }: BookCardProps) {
  const entrance = useHomeCardEntrance(index);
  const press = useHomeCardPress();

  const displayTitle = (title && title.trim()) || unnamedLabel;
  const pagesCount = Math.max(0, book.pagesTotal || 0);
  const videosCount = Math.max(0, book.videosCount || 0);
  const progress = formatProgress(book.progress);

  return (
    <Animated.View
      style={[
        styles.bookCardOuter,
        {
          opacity: entrance.opacity,
          transform: [{ translateY: entrance.translateY }, { scale: press.scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={styles.bookCardPressable}
        accessibilityRole="button"
        accessibilityLabel={displayTitle}
      >
        <View style={styles.bookCoverShell}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.bookCoverImage} />
          ) : (
            <View style={styles.bookCoverFallback}>
              <Ionicons name="book-outline" size={38} color="#94A3B8" />
            </View>
          )}

          <LinearGradient
            colors={["rgba(15,23,42,0)", "rgba(15,23,42,0.45)"]}
            style={styles.bookCoverScrim}
            pointerEvents="none"
          />

          {pagesCount > 0 && (
            <View style={styles.bookBadgeOverlay}>
              <Ionicons name="reader-outline" size={12} color="#FFFFFF" />
              <Text style={styles.bookBadgeText}>{pagesCount}</Text>
            </View>
          )}

          {videosCount > 0 && (
            <View style={styles.bookVideoBadge}>
              <Ionicons name="play-circle" size={12} color="#FFFFFF" />
              <Text style={styles.bookBadgeText}>{videosCount}</Text>
            </View>
          )}

          {progress > 0 && (
            <View style={styles.bookProgressTrack}>
              <View style={[styles.bookProgressFill, { width: percentWidth(progress) }]} />
            </View>
          )}
        </View>

        <View style={styles.bookMetaWrap}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {displayTitle}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** Horizontal carousel of the child's school books. */
export default function BooksRow({
  styles,
  books,
  unnamedLabel,
  onPressBook,
  onLayoutReady,
}: BooksRowProps) {
  const scrollRef = useRef<ScrollView>(null);

  if (books.length === 0) return null;

  const handleLayout = useCallback(() => {
    onLayoutReady?.(() => scrollRef.current?.scrollToEnd({ animated: false }));
  }, [onLayoutReady]);

  return (
    <ScrollView
      horizontal
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
      style={styles.booksSwiper}
      contentContainerStyle={styles.booksSwiperContent}
      onLayout={handleLayout}
    >
      {books.map((book, index) => (
        <BookCard
          key={String(book.id)}
          book={book}
          index={index}
          title={String(book.title ?? "")}
          unnamedLabel={unnamedLabel}
          styles={styles}
          onPress={() => onPressBook(book.id)}
        />
      ))}
    </ScrollView>
  );
}
