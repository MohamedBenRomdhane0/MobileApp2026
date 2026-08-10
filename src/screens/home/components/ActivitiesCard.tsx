import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { ActivitiesCardProps } from "../HomeScreen.type";

const CARD_INDEX = 8;

export default function ActivitiesCard({
  title,
  subtitle,
  weekDays,
  grid,
  styles,
  palette,
  isRTL,
}: ActivitiesCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const { scale, onPressIn, onPressOut } = useHomeCardPress();

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={styles.activitiesHeader}>
        <View style={styles.activitiesHeaderText}>
          <Text style={styles.activitiesSubtitle}>{subtitle}</Text>
          <Text style={styles.activitiesTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.activitiesArrowBtn}
        >
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heatmapGrid}>
        {grid.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.heatmapRow}>
            {row.map((dot, colIdx) => (
              <View
                key={colIdx}
                style={[
                  styles.heatmapDot,
                  { width: dot.size, height: dot.size },
                  dot.active && styles.heatmapDotActive,
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.heatmapLabels}>
        {weekDays.map((day, i) => (
          <Text key={i} style={styles.heatmapLabel}>
            {day}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}
