import React, { useEffect, useRef } from "react";
import { View, Text, Image, Pressable, ScrollView, Animated } from "react-native";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import { pickMaterialArtwork } from "@screens/home/HomeScreen.helpers";
import { pickSubjectVisual } from "@screens/home/subjectIcon";
import type { HomeStyles, MaterialsRowProps } from "@screens/home/HomeScreen.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";

type MaterialCardProps = {
  material: MaterialUI;
  index: number;
  label: string;
  isDark: boolean;
  styles: HomeStyles;
  onPress: () => void;
};

/**
 * Subject card. Colors come from `pickSubjectVisual`, so a subject always
 * carries the same tint no matter where it lands in the list.
 */
function MaterialCard({ material, index, label, isDark, styles, onPress }: MaterialCardProps) {
  const entrance = useHomeCardEntrance(index);
  const press = useHomeCardPress();

  const visual = pickSubjectVisual(material);
  const artwork = pickMaterialArtwork(material);

  // The visual tints are 12% alpha over white; on the dark canvas the card
  // needs the same tint but the label has to switch to the accent itself.
  const cardBg = isDark ? visual.bg : `${visual.color}1A`;
  const tileBg = isDark ? `${visual.color}33` : `${visual.color}26`;

  return (
    <Animated.View
      style={[
        styles.materialCard,
        {
          backgroundColor: cardBg,
          opacity: entrance.opacity,
          transform: [{ translateY: entrance.translateY }, { scale: press.scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={styles.materialCardPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={[styles.materialCardIconWrap, { backgroundColor: tileBg }]}>
          <Image source={artwork} style={styles.materialCardImg} />
        </View>

        <Text
          style={[styles.materialCardLabel, { color: isDark ? "#FFFFFF" : visual.color }]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** Horizontal carousel of the level's subjects. */
export default function MaterialsRow({
  styles,
  isRTL,
  materials,
  isDark,
  getLabel,
  onPressMaterial,
}: MaterialsRowProps) {
  const scrollRef = useRef<ScrollView>(null);

  // In RTL the list is reversed for reading order, so start scrolled to the
  // rightmost (first-item) position.
  useEffect(() => {
    if (!isRTL || materials.length === 0) return;
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [isRTL, materials.length]);

  if (materials.length === 0) return null;

  return (
    <ScrollView
      horizontal
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
      style={styles.materialsSwiper}
      contentContainerStyle={styles.materialsSwiperContent}
    >
      {materials.map((material, index) => (
        <MaterialCard
          key={String(material.id)}
          material={material}
          index={index}
          label={getLabel(material)}
          isDark={isDark}
          styles={styles}
          onPress={() => onPressMaterial(material)}
        />
      ))}
    </ScrollView>
  );
}
