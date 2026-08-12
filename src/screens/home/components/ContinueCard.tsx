import React from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import { percentWidth } from "@screens/home/HomeScreen.helpers";
import type { ContinueCardProps } from "@screens/home/HomeScreen.type";

/**
 * Resume card — shown only when the child already started a book, so the
 * fastest path back into learning sits above every browse section.
 */
export default function ContinueCard({
  styles,
  palette,
  isRTL,
  resume,
  title,
  ctaLabel,
  progressLabel,
  onPress,
}: ContinueCardProps) {
  const entrance = useHomeCardEntrance(0);
  const press = useHomeCardPress();

  const coverUrl = resume.book.coverUrl;

  return (
    <Animated.View
      style={[
        styles.continueCard,
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
        style={styles.continuePress}
        accessibilityRole="button"
        accessibilityLabel={`${title} — ${resume.lessonTitle}`}
      >
        <View style={styles.continueThumb}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.continueThumbImg} />
          ) : (
            <Ionicons name="book-outline" size={26} color={palette.muted} />
          )}
        </View>

        <View style={styles.continueInfo}>
          <Text style={styles.continueEyebrow} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.continueTitle} numberOfLines={2}>
            {resume.lessonTitle}
          </Text>

          <View style={styles.continueBarTrack}>
            <View style={[styles.continueBarFill, { width: percentWidth(resume.progress) }]} />
          </View>

          <View style={styles.continueMetaRow}>
            <Text style={styles.continueProgressText}>{progressLabel}</Text>

            <View style={styles.continueCta}>
              <Text style={styles.continueCtaText}>{ctaLabel}</Text>
              <Ionicons
                name={isRTL ? "arrow-back" : "arrow-forward"}
                size={12}
                color={palette.teal}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
