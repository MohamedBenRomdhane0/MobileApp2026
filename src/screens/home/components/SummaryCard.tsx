import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { SummaryCardProps } from "../HomeScreen.type";

const CARD_INDEX = 7;

export default function SummaryCard({
  title,
  stats,
  styles,
  palette,
  isRTL,
}: SummaryCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const { scale, onPressIn, onPressOut } = useHomeCardPress();

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.summaryArrowBtn}
        >
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {stats.map((stat, i) => (
        <View key={i}>
          <View style={styles.summaryStatRow}>
            <View style={styles.summaryStatLeft}>
              <View style={[styles.summaryStatDot, { backgroundColor: stat.color }]} />
              <Text style={styles.summaryStatLabel}>{stat.label}</Text>
            </View>
            <Text style={styles.summaryStatValue}>{stat.value}</Text>
          </View>
          <View style={[styles.summaryStatUnderline, { backgroundColor: stat.color }]} />
        </View>
      ))}
    </Animated.View>
  );
}
