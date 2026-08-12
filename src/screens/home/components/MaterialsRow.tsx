import React, { useEffect, useRef } from "react";
import { View, Text, Image, Pressable, ScrollView, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
 * carries the same tint no matter where it lands in the list. The tint is
 * layered as a two-stop gradient plus a corner bloom — depth without ever
 * leaving the subject's own hue.
 */
function MaterialCard({ material, index, label, isDark, styles, onPress }: MaterialCardProps) {
  const entrance = useHomeCardEntrance(index);
  const press = useHomeCardPress();

  const visual = pickSubjectVisual(material);
  const artwork = pickMaterialArtwork(material);

  // Alpha layering over the subject accent: a strong-to-faint wash on light,
  // a lifted glass wash on dark. The label switches to white on dark because
  // the accent itself no longer clears contrast on the deep canvas.
  const face: [string, string] = isDark
    ? [`${visual.color}30`, `${visual.color}12`]
    : [`${visual.color}24`, `${visual.color}0A`];
  const tileBg = isDark ? `${visual.color}38` : "rgba(255,255,255,0.72)";
  const labelColor = isDark ? "#FFFFFF" : visual.color;

  return (
    <Animated.View
      style={[
        styles.materialCard,
        {
          borderColor: `${visual.color}${isDark ? "3D" : "2E"}`,
          shadowColor: visual.color,
          opacity: entrance.opacity,
          transform: [{ translateY: entrance.translateY }, { scale: press.scale }],
        },
      ]}
    >
      <LinearGradient
        colors={face}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.materialCardFace}
      >
        <View
          style={[
            styles.materialCardBloom,
            { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)" },
          ]}
          pointerEvents="none"
        />

        <Pressable
          onPress={onPress}
          onPressIn={press.onPressIn}
          onPressOut={press.onPressOut}
          style={styles.materialCardPress}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <View
            style={[
              styles.materialCardIconWrap,
              { backgroundColor: tileBg, borderColor: `${visual.color}33` },
            ]}
          >
            <Image source={artwork} style={styles.materialCardImg} />
          </View>

          <Text
            style={[styles.materialCardLabel, { color: labelColor }]}
            numberOfLines={2}
          >
            {label}
          </Text>

          <View style={[styles.materialCardRule, { backgroundColor: visual.color }]} />
        </Pressable>
      </LinearGradient>
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
